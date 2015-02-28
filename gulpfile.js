var path = require('path')

var gulp = require('gulp')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , watch = require('gulp-watch')

var bowerComponents = './bower_components'

gulp.task('default', ['less', 'js', 'vendor-css', 'vendor-js'])

gulp.task('less', function () {
  return compileLess()
})

gulp.task('js', function () {
  return compileJs()
})

gulp.task('vendor-css', ['vendor-less'], function () {
  var prettify = path.join(bowerComponents, 'google-code-prettify', 'styles', 'desert.css')
  var vendorLess = path.join('tmp', 'vendor-less.css')

  return gulp.src([prettify, vendorLess])
    .pipe(cssmin())
    .pipe(rename({basename: 'vendor'}))
    .pipe(gulp.dest('assets/vendor'))
})

gulp.task('vendor-less', function () {
  var fontawesome = path.join(bowerComponents, 'fontawesome', 'less')

  return gulp.src(path.join(fontawesome, 'font-awesome.less'))
    .pipe(less({paths: [fontawesome]}))
    .pipe(rename({basename: 'vendor-less'}))
    .pipe(gulp.dest('tmp'))
})

gulp.task('vendor-js', function () {
  var prettify = path.join(bowerComponents, 'google-code-prettify', 'bin', '*prettify.min.js')
  return gulp.src([prettify])
    .pipe(uglify())
    .pipe(rename({basename: 'vendor'}))
    .pipe(gulp.dest('assets/vendor'))
})

gulp.task('vendor-assets', function () {
  var fontawesome = path.join(bowerComponents, 'fontawesome')

  return gulp.src(path.join(fontawesome, 'fonts/*.*'), {base: fontawesome})
    .pipe(gulp.dest('assets/vendor'))
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