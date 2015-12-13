var del = require('del')
  , metadata = require('./package')
  , path = require('path')
  , nconf = require('nconf')

var gulp = require('gulp')
  , concat = require('gulp-concat')
  , cssmin = require('gulp-cssmin')
  , gutil = require('gulp-util')
  , gzip = require('gulp-gzip')
  , handlebars = require('gulp-compile-handlebars')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , tar = require('gulp-tar')
  , uglify = require('gulp-uglify')
  , watch = require('gulp-watch')

var bowerComponents = './bower_components'
  , dist = './assets'
  , src  = './src'
  , packageName = metadata.name + '-' + metadata.version

nconf.file('./config.json')

gulp.task('default', ['less', 'js', 'hbs', 'assets', 'vendor'])

gulp.task('less', function () {
  gutil.log('Compiling less files.')
  return gulp.src(path.join(src, 'less/app.less'))
    .pipe(less({
      paths: [path.join(src, 'less')]
    }))
    .pipe(cssmin())
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest(path.join(dist, 'css')))
})

gulp.task('js', function () {
  gutil.log('Compiling js files.')
  return gulp.src(path.join(src, 'js/*.js'))
    .pipe(uglify())
    .pipe(rename({basename: 'all', suffix:'.min'}))
    .pipe(gulp.dest(path.join(dist, 'js')))
})

gulp.task('hbs', function () {
  var context = nconf.get()

  return gulp.src(path.join(src, 'hbs/*.hbs'))
    .pipe(handlebars(context))
    .pipe(gulp.dest('./partials'))
})

gulp.task('assets', function () {
  var blogCover = path.join(src, 'img', 'the-wheat-field.jpg')

  return gulp.src(blogCover)
    .pipe(gulp.dest(path.join(dist, 'img')))
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
  gulp.watch(path.join(src, 'less/*.less'), ['less'])
  //watch(path.join(src, 'js/*.js'), compileJs)
})

gulp.task('clean', function (cb) {
  del( [ path.join(dist, 'vendor')
       , path.join(dist, 'css')
       , path.join(dist, 'js')
       , path.join('./partials/{disqus,google-analytics}.hbs')
       , 'tmp'
       , packageName + '.tar.gz'
       ]
     , cb
     )
})

gulp.task('package', ['default'], function () {

  return gulp.src([path.join(dist, '**/*.*'), 'partials/*.*', '*.hbs', 'package.json'], {base: '.'})
    .pipe(tar(packageName + '.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.'))
})
