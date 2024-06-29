// #region Global Needs

import { task, src, dest, series } from "gulp";
import gulpCleanDir                from 'gulp-clean-dir';
import gulpStyleLint               from 'gulp-stylelint';
import gulpStripComments           from 'gulp-strip-comments';
import gulpAutoPrefixer            from 'gulp-autoprefixer';
import gulpPrettier                from 'gulp-prettier';
import gulpRtlCss                  from 'gulp-rtlcss';
import gulpRename                  from 'gulp-rename';
import gulpCleanCss                from 'gulp-clean-css';
import gulpDest                    from 'gulp-dest';

// #endregion Global Needs

// #region Options

const FOLDERS = {
    input:  './work/0_input',
    clean:  './work/1_clean',
    lint:   './work/2_lint',
    prefix: './work/3_prefix',
    pretty: './work/4_pretty',
    dist:   './work/5_dist',
    quick:  './work/quick',
    less:   './work/less'
};

const SLASH_START_DOT_CSS = '/*.css';

const OPTIONS_EXT_DOT_TXT = { ext: ['.txt'] };

const OPTIONS_EXT_DOT_TXT_AND_DOT_CSS = { ext: ['.txt', '.css'] };

const OPTIONS_STRIP_COMMENTS = {
    ignore: /url\([\w\s:\/=\-\+;,]*\)/g,
    trim: true
};

const OPTIONS_CLEAN_PREFIXES = {
    overrideBrowserslist: ["> 100%"],
    cascade: false
};

const OPTIONS_LIKE_BOOTSTRAP_PREFIXES = {
    overrideBrowserslist: [
        ">= 0.5%",
        "last 2 major versions",
        "not dead",
        "Chrome >= 60",
        "Firefox >= 60",
        "Firefox ESR",
        "iOS >= 12",
        "Safari >= 12",
        "not Explorer <= 11"
    ],
    cascade: false
};

const OPTIONS_PRETTIER = {
    singleQuote: true,
    parser:    'css',
    endOfLine: 'crlf',
    proseWrap: 'never'
};

const OPTIONS_CLEAN_CSS = {
    format: { breakWith: '\n' },
    level: 1
};

const OPTIONS_EXT_DOT_MIN_DOT_CSS = { ext: ".min.css" };

// #endregion Options

// #region Utilities

const getOptionsStyleLint = function (doFix, outputPath, fileName) {
    return {
        fix: doFix,
        defaultSeverity: "warning",
        failAfterError: false,
        reportOutputDir: outputPath,
        reporters: [
            {
                formatter: 'string',
                save: fileName,
                console: false
            }
        ],
        debug: false
    }
};

// #endregion Utilities


// #region Tasks

task('clean-up-files', () => 
     src('./package.json')
    .pipe(gulpCleanDir(FOLDERS.less, { ext: ['.less'] }))
    .pipe(gulpCleanDir(FOLDERS.input, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.clean, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.lint, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.prefix, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.pretty, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.dist, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanDir(FOLDERS.quick, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
);

task('pre-lint-css', () => 
     src(FOLDERS.input + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.input, OPTIONS_EXT_DOT_TXT))
    .pipe(gulpStyleLint(getOptionsStyleLint(false, FOLDERS.input, 'prelint.txt')))
);

task('clean-css', () => 
     src(FOLDERS.input + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.clean, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpStripComments.text(OPTIONS_STRIP_COMMENTS))
    .pipe(gulpAutoPrefixer(OPTIONS_CLEAN_PREFIXES))
    .pipe(dest(FOLDERS.clean))
);

task('lint-css', () => 
     src(FOLDERS.clean + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.lint, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpStyleLint(getOptionsStyleLint(true, FOLDERS.lint, 'postlint.txt')))
    .pipe(dest(FOLDERS.lint))
);

task('prefix-css', () => 
     src(FOLDERS.lint + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.prefix, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpAutoPrefixer(OPTIONS_LIKE_BOOTSTRAP_PREFIXES))
    .pipe(dest(FOLDERS.prefix))
);

task('prettify-css', () => 
     src(FOLDERS.prefix + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.pretty, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpPrettier(OPTIONS_PRETTIER))
    .pipe(dest(FOLDERS.pretty))
    .pipe(gulpRtlCss())
    .pipe(gulpRename({ suffix: '-rtl' }))
    .pipe(dest(FOLDERS.pretty))
);

task('minify-css', () => 
     src(FOLDERS.pretty + SLASH_START_DOT_CSS)
    .pipe(gulpCleanDir(FOLDERS.dist, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))
    .pipe(gulpCleanCss(OPTIONS_CLEAN_CSS))
    .pipe(gulpDest("./", OPTIONS_EXT_DOT_MIN_DOT_CSS))
    .pipe(dest(FOLDERS.dist))
);

task('build-css', series('pre-lint-css', 'clean-css', 'lint-css', 'prefix-css', 'prettify-css', 'minify-css'));

task('quick-build-css', () => 
     src(FOLDERS.input + SLASH_START_DOT_CSS)                                  // Get all `.css` files in `input` folder
    .pipe(gulpCleanDir(FOLDERS.input, OPTIONS_EXT_DOT_TXT))                    // Delete all `.txt` files in `input` folder
    .pipe(gulpCleanDir(FOLDERS.quick, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))        // Delete all `.css` & `.txt` files in `quick` folder
    .pipe(gulpStripComments.text(OPTIONS_STRIP_COMMENTS))                      // Remove all comments inside `.css` files
    .pipe(gulpAutoPrefixer(OPTIONS_CLEAN_PREFIXES))                            // Clean all prefixed styles
    .pipe(gulpStyleLint(getOptionsStyleLint(true, FOLDERS.quick, 'lint.txt'))) // Lint all styles
    .pipe(gulpAutoPrefixer(OPTIONS_LIKE_BOOTSTRAP_PREFIXES))                   // Add prefixed styles
    .pipe(gulpPrettier(OPTIONS_PRETTIER))                                      // Format styles
    .pipe(dest(FOLDERS.quick))                                                 // Save as `.css` file to `quick` folder
    .pipe(gulpCleanCss(OPTIONS_CLEAN_CSS))                                     // Minify all `.css` files
    .pipe(gulpDest("./", OPTIONS_EXT_DOT_MIN_DOT_CSS))                         // Set minified file names
    .pipe(dest(FOLDERS.quick))                                                 // Save as `.min.css` file to `quick` folder
);

task('quick-build-less', () => 
     src(FOLDERS.less + '/*.less')                                             // Get all `.less` files in `less` folder
    .pipe(gulpCleanDir(FOLDERS.quick, OPTIONS_EXT_DOT_TXT_AND_DOT_CSS))        // Delete all `.css` & `.txt` files in `quick` folder
    .pipe(less())                                                              // Transpile LESS styles to CSS styles
    .pipe(gulpStripComments.text(OPTIONS_STRIP_COMMENTS))                      // Remove all comments inside CSS styles
    .pipe(gulpAutoPrefixer(OPTIONS_CLEAN_PREFIXES))                            // Clean all prefixed styles
    .pipe(gulpStyleLint(getOptionsStyleLint(true, FOLDERS.quick, 'lint.txt'))) // Lint all styles
    .pipe(gulpAutoPrefixer(OPTIONS_LIKE_BOOTSTRAP_PREFIXES))                   // Add prefixed styles
    .pipe(gulpPrettier(OPTIONS_PRETTIER))                                      // Format styles
    .pipe(dest(FOLDERS.quick))                                                 // Save as `.css` file to `quick` folder
    .pipe(gulpCleanCss(OPTIONS_CLEAN_CSS))                                     // Minify all `.css` files
    .pipe(gulpDest("./", OPTIONS_EXT_DOT_MIN_DOT_CSS))                         // Set minified file names
    .pipe(dest(FOLDERS.quick))                                                 // Save as `.min.css` file to `quick` folder
);

// #endregion Tasks