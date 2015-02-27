var path = require('path')

var gulp = require('gulp')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')

gulp.task('default', function () {
  gutil.log('Doing nothing yet.')
})

gulp.task('less', function () {
  gutil.log('Compiling less files.')
  return gulp.src('less/app.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less')]
    }))
    .pipe(cssmin())
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest('assets/css'))
})