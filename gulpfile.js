var path = require('path')

var gulp = require('gulp')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , watch = require('gulp-watch')

gulp.task('default', function () {
  gutil.log('Doing nothing yet.')
})

gulp.task('less', function () {
  return compileLess()
})

gulp.task('js', function () {
  return compileJs()
})

gulp.task('watch', function () {
  watch('less/*.less', compileLess)
  watch('js/*.js', compileJs)
})

function compileJs() {
  gutil.log('Compiling js files.')
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(rename({basename: 'all', suffix:'.min'}))
    .pipe(gulp.dest('assets/js'))
}

function compileLess() {
  gutil.log('Compiling less files.')
  return gulp.src('less/app.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less')]
    }))
    .pipe(cssmin())
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest('assets/css'))
}