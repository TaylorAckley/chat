/**
 * @author  Jozef Butko
 * @url		  www.jozefbutko.com/resume
 * @date    March 2015
 * @license MIT
 *
 * AngularJS Boilerplate: Build, watch and other useful tasks
 *
 * The build process consists of following steps:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    jshint          = require('gulp-jshint'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    rename          = require('gulp-rename'),
    $               = require('gulp-load-plugins')(),
    del             = require('del'),
    runSequence     = require('run-sequence');

    gulp.task('default', ['watch', 'browser-sync']);

    gulp.task('jshint', function() {
      return gulp.src(['public/app/**/*.js', 'backend/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
    });

    gulp.task('build-css', function() {
      return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('/map'))
        .pipe(plumber())
        .pipe(gulp.dest('public/styles'))
        .pipe(browserSync.reload({
          stream: true
        }));
    });
    gulp.task('minify-js', function() {
      return gulp.src('public/app/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('/map'))
      .pipe(gulp.dest('public/app'))
      .pipe(browserSync.reload({
        stream: true
      }));
    });
    gulp.task('minify-js-vendor', function() {
      return gulp.src('public/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('/map'))
      .pipe(gulp.dest('public/js'))
      .pipe(browserSync.reload({
        stream: true
      }));
    });

    gulp.task('browser-sync', function() {
      browserSync.init({
       server: {
           baseDir: "./"
       }
   });
    });

    gulp.task('watch', function() {

      gulp.watch('public/app/**/*.js', ['jshint']);
      gulp.watch('src/scss/**/*.scss', ['build-css']);
    });
