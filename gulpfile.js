var path = require('path')

var gulp = require('gulp')
  , concat = require('gulp-concat')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , watch = require('gulp-watch')

var bowerComponents = './bower_components'
  , dist = './assets'
  , src  = './src'

gulp.task('default', ['less', 'js', 'vendor'])

gulp.task('less', function () {
  return compileLess()
})

gulp.task('js', function () {
  return compileJs()
})

gulp.task('vendor', ['vendor-css', 'vendor-js', 'vendor-assets'])

gulp.task('vendor-css', ['vendor-less'], function () {
  var prettify = path.join(bowerComponents, 'google-code-prettify', 'styles', 'desert.css')
  var vendorLess = path.join('tmp', 'vendor-less.css')

  return gulp.src([prettify, vendorLess])
    .pipe(concat('vendor.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(path.join(dist, 'vendor')))
})

gulp.task('vendor-less', function () {
  var fontawesome = path.join(bowerComponents, 'fontawesome', 'less')

  return gulp.src(path.join('vendor-less', 'fontawesome.less'))
    .pipe(less({paths: [fontawesome]}))
    .pipe(rename({basename: 'vendor-less'}))
    .pipe(gulp.dest('tmp'))
})

gulp.task('vendor-js', function () {
  var prettify = path.join(bowerComponents, 'google-code-prettify', 'bin', 'prettify.min.js')
  return gulp.src([prettify])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(dist, 'vendor')))
})

gulp.task('vendor-assets', function () {
  var fontawesome = path.join(bowerComponents, 'fontawesome')

  return gulp.src(path.join(fontawesome, 'fonts/*.*'), {base: fontawesome})
    .pipe(gulp.dest(path.join(dist, 'vendor')))
})

gulp.task('watch', function () {
  watch(path.join(src, 'less/*.less'), compileLess)
  watch(path.join(src, 'js/*.js'), compileJs)
})

function compileJs() {
  gutil.log('Compiling js files.')
  return gulp.src(path.join(src, 'js/*.js'))
    .pipe(uglify())
    .pipe(rename({basename: 'all', suffix:'.min'}))
    .pipe(gulp.dest(path.join(dist, 'js')))
}

function compileLess() {
  gutil.log('Compiling less files.')
  return gulp.src(path.join(src, 'less/app.less'))
    .pipe(less({
      paths: [path.join(src, 'less')]
    }))
    .pipe(cssmin())
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest(path.join(dist, 'css')))
}