var del = require('del')
  , metadata = require('./package')
  , path = require('path')

var gulp = require('gulp')
  , concat = require('gulp-concat')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , gzip = require('gulp-gzip')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , tar = require('gulp-tar')
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
  var highlight = path.join(bowerComponents, 'highlightjs', 'styles', 'rainbow.css')
  var vendorLess = path.join('tmp', 'vendor-less.css')

  return gulp.src([highlight, vendorLess])
    .pipe(concat('vendor.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(path.join(dist, 'vendor')))
})

gulp.task('vendor-less', function () {
  var fontawesome = path.join(bowerComponents, 'fontawesome', 'less')

  return gulp.src(path.join(src, 'vendor-less', 'fontawesome.less'))
    .pipe(less({paths: [fontawesome]}))
    .pipe(rename({basename: 'vendor-less'}))
    .pipe(gulp.dest('tmp'))
})

gulp.task('vendor-js', function () {
  var highlight = path.join(bowerComponents, 'highlightjs', 'highlight.pack.js')
  return gulp.src([highlight])
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

gulp.task('clean', function (cb) {
  del([path.join(dist, 'vendor'), path.join(dist, 'css'), path.join(dist, 'js'), 'tmp', release + '.tar.gz'], cb)
})

gulp.task('package', ['default'], function () {
  var packageName = metadata.name + '-' + metadata.version
  return gulp.src([path.join(dist, '**/*.*'), 'partials/*.*', '*.hbs', 'package.json'], {base: '.'})
    .pipe(tar(packageName + '.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.'))
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