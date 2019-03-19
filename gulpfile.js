var gulp = require('gulp'),
    amdOptimize = require("amd-optimize"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    // cssmin = require('gulp-cssmin'),
    cssmin = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    include = require('gulp-include'),
    sass = require('gulp-sass'),
    fileinclude = require('gulp-file-include');

var sourcemaps = require('gulp-sourcemaps');

var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');

var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var pathBuild = './dist'

var path = {
    build: {
        css: pathBuild+'/assets/css/',
        js: './build',
        html:pathBuild
    },
    src: {
        style: pathBuild+'/assets/scss/app.scss',
        js:  [
            pathBuild+"/assets/js/common.js"
        ]
    },
    watch: {
        style: [pathBuild+'/assets/scss/**/*.scss', pathBuild+'/assets/scss/*.scss'],
        html: ['*.html', './dev/pages/*.html', './dev/components/*.html'],
        js: [pathBuild+'/assets/js/*.js',pathBuild+'/assets/js/**/*.js'],
        svg: [pathBuild+'/assets/images/svg/*.svg']
    }
};

gulp.task('fileinclude', function() {
    gulp.src(['./dev/pages/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(pathBuild));
});

gulp.task('svgstore', function () {
    return gulp
        .src(pathBuild+'/assets/images/svg/*.svg')
        .pipe(svgmin(function (file) {
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(pathBuild+'/assets/images/svg'));
});
gulp.task('sass', function () {
    gulp.src(path.src.style)
    // .pipe(sourcemaps.init())
        .pipe(sass(
            {includePaths: [pathBuild+'/assets/scss/components/variables.scss',pathBuild+'/assets/scss/components/mixins.scss'],style: 'expanded',errLogToConsole: true}
        ).on('error',function(error){console.error(error)}))
        .pipe(prefixer())
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmin())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('serve', ['sass','svgstore', 'fileinclude'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback({})]
        }
    });


    gulp.watch(path.watch.style, ['sass']);
    gulp.watch(path.watch.html).on('change', function (e) {
        gulp.src([e.path])
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest(pathBuild));
        return browserSync.reload();
    });
    gulp.watch(path.watch.js).on('change', browserSync.reload);
    gulp.watch(path.watch.svg,['svgstore']).on('change', browserSync.reload);

});

gulp.task('default', ['serve']);
gulp.task('scripts', function() {
    return gulp.src(path.src.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.js));
});
