const gulp = require("gulp");
const cleanDir = require('gulp-clean-dir');
const styleLint = require('gulp-stylelint');
const autoPrefixer = require('gulp-autoprefixer');

gulp.task('delete-all-files', function () {
    return gulp
        .src('./package.json')
        .pipe(cleanDir('./work/0_input', { ext: ['.txt'] }))
        .pipe(cleanDir('./work/1_clean'))
        .pipe(cleanDir('./work/2_lint'))
        .pipe(cleanDir('./work/3_prefix'))
        .pipe(cleanDir('./work/4_pretty'))
        .pipe(cleanDir('./work/5_dist'))
        .pipe(cleanDir('./work/quick'));
});

gulp.task('pre-lint-css', function () {
    return gulp
        .src('./work/0_input/*.css')
        .pipe(cleanDir('./work/0_input', { ext: ['.txt'] }))
        .pipe(
            styleLint({
                failAfterError: false,
                reportOutputDir: './work/0_input',
                reporters: [
                    {
                        formatter: 'verbose',
                        save: 'prelint.txt',
                        console: false
                    }
                ],
                debug: false
            })
        );
});

gulp.task('clean-css', function () {
    return gulp
        .src('./work/0_input/*.css')
        .pipe(cleanDir('./work/1_clean'))
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ["> 100%"],
                cascade: false
            })
        )
        .pipe(gulp.dest('./work/1_clean'));
});

gulp.task('lint-css', function () {
    return gulp
        .src('./work/1_clean/*.css')
        .pipe(cleanDir('./work/2_lint'))
        .pipe(
            styleLint({
                fix: true,
                defaultSeverity: "warning",
                failAfterError: false,
                reportOutputDir: './work/2_lint',
                reporters: [
                    {
                        formatter: 'verbose',
                        save: 'postlint.txt',
                        console: false
                    }
                ],
                debug: false
            })
        )
        .pipe(gulp.dest("./work/2_lint"));;
});

gulp.task('prefix-css', function () {
    return gulp
        .src('./work/2_lint/*.css')
        .pipe(cleanDir('./work/3_prefix'))
        .pipe(
            autoPrefixer({
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
            })
        )
        .pipe(gulp.dest('./work/3_prefix'));
});

gulp.task('prettify-css', function () {
    const prettier = require('gulp-prettier');
    const rtlcss = require('gulp-rtlcss');
    const rename = require('gulp-rename');
    return gulp
        .src('./work/3_prefix/*.css')
        .pipe(cleanDir('./work/4_pretty'))
        .pipe(
            prettier({
                singleQuote: true,
                parser: 'css',
                endOfLine: 'crlf',
                proseWrap: 'never'
            })
        )
        .pipe(gulp.dest('./work/4_pretty'))
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./work/4_pretty'))
});

gulp.task('minify-css', function () {
    const cleanCSS = require('gulp-clean-css');
    const dest = require("gulp-dest");
    return gulp
        .src('./work/4_pretty/*.css')
        .pipe(cleanDir('./work/5_dist'))
        .pipe(
            cleanCSS({
                format: {
                    breakWith: '\n',
                },
                level: 1
            })
        )
        .pipe(
            dest("./", { ext: ".min.css" })
        )
        .pipe(gulp.dest('./work/5_dist'));
});

/**************************************************/
gulp.task('quick-build', function () {
    const prettier = require('gulp-prettier');
    //const rtlcss = require('gulp-rtlcss');
    //const rename = require('gulp-rename');
    const cleanCSS = require('gulp-clean-css');
    const dest = require("gulp-dest");

    return gulp
        .src('./work/0_input/*.css')
        .pipe(cleanDir('./work/0_input', { ext: ['.txt'] }))
        .pipe(cleanDir('./work/quick'))
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ["> 100%"],
                cascade: false
            })
        )
        .pipe(
            styleLint({
                fix: true,
                defaultSeverity: "warning",
                failAfterError: false,
                reportOutputDir: './work/quick',
                reporters: [
                    {
                        formatter: 'verbose',
                        save: 'lint.txt',
                        console: false
                    }
                ],
                debug: false
            })
        )
        .pipe(
            autoPrefixer({
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
            })
        )
        .pipe(
            prettier({
                singleQuote: true,
                parser: 'css',
                endOfLine: 'crlf',
                proseWrap: 'never'
            })
        )
        .pipe(gulp.dest('./work/quick'))
        //.pipe(rtlcss())
        //.pipe(rename({ suffix: '-rtl' }))
        //.pipe(gulp.dest('./work/quick'))
        .pipe(
            cleanCSS({
                format: {
                    breakWith: '\n',
                },
                level: 1
            })
        )
        .pipe(dest("./", { ext: ".min.css" }))
        .pipe(gulp.dest('./work/quick'));
});