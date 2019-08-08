/** Global Needs **/
const gulp = require("gulp");
const cleanDir = require('gulp-clean-dir');
let styleLint;
let autoPrefixer;

/** Options **/
const folders = {
    input: './work/0_input',
    clean: './work/1_clean',
    lint: './work/2_lint',
    prefix: './work/3_prefix',
    pretty: './work/4_pretty',
    dist: './work/5_dist',
    quick: './work/quick',
    less: './work/less'
};
const slashStartDotCss = '/*.css';

const optionsExtDotTxt = { ext: ['.txt'] };
const optionsExtDotTxtAndDotCss = { ext: ['.txt', '.css'] };
const otionsStripComments = {
    ignore: /url\([\w\s:\/=\-\+;,]*\)/g,
    trim: true
};
const optionsCleanPrefixes = {
    overrideBrowserslist: ["> 100%"],
    cascade: false
};
const optionsLikeBootstrapPrefixes = {
    overrideBrowserslist: [
        ">= 1%",
        "last 1 major version",
        "not dead",
        "Chrome >= 45",
        "Firefox >= 38",
        "Edge >= 12",
        "Explorer >= 10",
        "iOS >= 9",
        "Safari >= 9",
        "Android >= 4.4",
        "Opera >= 30"
    ],
    cascade: false
};
const optionsPrettier = {
    singleQuote: true,
    parser: 'css',
    endOfLine: 'crlf',
    proseWrap: 'never'
};
const optionsCleanCss = {
    format: { breakWith: '\n' },
    level: 1
};
const optionsExtDotMinDotCss = { ext: ".min.css" };

const getOptionsStyleLint = function (doFix, outputPath, fileName) {
    return {
        fix: doFix,
        defaultSeverity: "warning",
        failAfterError: false,
        reportOutputDir: outputPath,
        reporters: [
            {
                formatter: 'verbose',
                save: fileName,
                console: false
            }
        ],
        debug: false
    }
};

/** Tasks **/
gulp.task('clean-up-files', function () {
    return gulp
        .src('./package.json')
        .pipe(cleanDir(folders.less, { ext: ['.less'] }))
        .pipe(cleanDir(folders.input, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.clean, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.lint, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.prefix, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.pretty, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.dist, optionsExtDotTxtAndDotCss))
        .pipe(cleanDir(folders.quick, optionsExtDotTxtAndDotCss));
});

gulp.task('pre-lint-css', function () {
    styleLint = styleLint || require('gulp-stylelint');

    return gulp
        .src(folders.input + slashStartDotCss)
        .pipe(cleanDir(folders.input, optionsExtDotTxt))
        .pipe(styleLint(getOptionsStyleLint(false, folders.input, 'prelint.txt')));
});

gulp.task('clean-css', function () {
    const strip = require('gulp-strip-comments');
    autoPrefixer = autoPrefixer || require('gulp-autoprefixer');

    return gulp
        .src(folders.input + slashStartDotCss)
        .pipe(cleanDir(folders.clean, optionsExtDotTxtAndDotCss))
        .pipe(strip.text(otionsStripComments))
        .pipe(autoPrefixer(optionsCleanPrefixes))
        .pipe(gulp.dest(folders.clean));
});

gulp.task('lint-css', function () {
    styleLint = styleLint || require('gulp-stylelint');

    return gulp
        .src(folders.clean + slashStartDotCss)
        .pipe(cleanDir(folders.lint, optionsExtDotTxtAndDotCss))
        .pipe(styleLint(getOptionsStyleLint(true, folders.lint, 'postlint.txt')))
        .pipe(gulp.dest(folders.lint));;
});

gulp.task('prefix-css', function () {
    autoPrefixer = autoPrefixer || require('gulp-autoprefixer');

    return gulp
        .src(folders.lint + slashStartDotCss)
        .pipe(cleanDir(folders.prefix, optionsExtDotTxtAndDotCss))
        .pipe(autoPrefixer(optionsLikeBootstrapPrefixes))
        .pipe(gulp.dest(folders.prefix));
});

gulp.task('prettify-css', function () {
    const prettier = require('gulp-prettier');
    const rtlcss = require('gulp-rtlcss');
    const rename = require('gulp-rename');

    return gulp
        .src(folders.prefix + slashStartDotCss)
        .pipe(cleanDir(folders.pretty, optionsExtDotTxtAndDotCss))
        .pipe(prettier(optionsPrettier))
        .pipe(gulp.dest(folders.pretty))
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest(folders.pretty))
});

gulp.task('minify-css', function () {
    const cleanCSS = require('gulp-clean-css');
    const dest = require("gulp-dest");

    return gulp
        .src(folders.pretty + slashStartDotCss)
        .pipe(cleanDir(folders.dist, optionsExtDotTxtAndDotCss))
        .pipe(cleanCSS(optionsCleanCss))
        .pipe(dest("./", optionsExtDotMinDotCss))
        .pipe(gulp.dest(folders.dist));
});

gulp.task('build-css', gulp.series('pre-lint-css', 'clean-css', 'lint-css', 'prefix-css', 'prettify-css', 'minify-css'));

gulp.task('quick-build-css', function () {
    styleLint = styleLint || require('gulp-stylelint');
    autoPrefixer = autoPrefixer || require('gulp-autoprefixer');

    const strip = require('gulp-strip-comments');
    const prettier = require('gulp-prettier');
    const cleanCSS = require('gulp-clean-css');
    const dest = require("gulp-dest");

    return gulp
        .src(folders.input + slashStartDotCss)
        .pipe(cleanDir(folders.input, optionsExtDotTxt))
        .pipe(cleanDir(folders.quick, optionsExtDotTxtAndDotCss))
        .pipe(strip.text(otionsStripComments))
        .pipe(autoPrefixer(optionsCleanPrefixes))
        .pipe(styleLint(getOptionsStyleLint(true, folders.quick, 'lint.txt')))
        .pipe(autoPrefixer(optionsLikeBootstrapPrefixes))
        .pipe(prettier(optionsPrettier))
        .pipe(gulp.dest(folders.quick))
        .pipe(cleanCSS(optionsCleanCss))
        .pipe(dest("./", optionsExtDotMinDotCss))
        .pipe(gulp.dest(folders.quick));
});

gulp.task('quick-build-less', function () {
    const less = require('gulp-less');
    const strip = require('gulp-strip-comments');

    autoPrefixer = autoPrefixer || require('gulp-autoprefixer');
    styleLint = styleLint || require('gulp-stylelint');

    const prettier = require('gulp-prettier');
    const cleanCSS = require('gulp-clean-css');
    const dest = require("gulp-dest");

    return gulp
        .src(folders.less + '/*.less')
        .pipe(cleanDir(folders.quick, optionsExtDotTxtAndDotCss))
        .pipe(less())
        //.pipe(gulp.dest(folders.input));
        .pipe(strip.text(otionsStripComments))
        .pipe(autoPrefixer(optionsCleanPrefixes))
        .pipe(styleLint(getOptionsStyleLint(true, folders.quick, 'lint.txt')))
        .pipe(autoPrefixer(optionsLikeBootstrapPrefixes))
        .pipe(prettier(optionsPrettier))
        .pipe(gulp.dest(folders.quick))
        .pipe(cleanCSS(optionsCleanCss))
        .pipe(dest("./", optionsExtDotMinDotCss))
        .pipe(gulp.dest(folders.quick));
});