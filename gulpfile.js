
const project_folder = "dist"
const source_folder = "src"

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + '/assets/img/'
    
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/scripts.js",
    img: source_folder + '/assets/img/**/*.{jpg, svg, gif, ico, webp}'
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + '/assets/img/**/*.{jpg, svg, gif, ico, webp}'
  },
  clean: "./" + project_folder + "/"
}

const {src, dest} = require('gulp'),
      gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      group_media = require('gulp-group-css-media-queries'),
      clean_css = require('gulp-clean-css'),
      gulp_rename = require('gulp-rename'),
      uglify = require('gulp-uglify-es').default,
      imagemin = require('gulp-imagemin'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      browserify = require('browserify'),
      babelify = require('babelify')

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

function clean() {
  return del(path.clean);
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [
          {
              removeViewBox: true
          }
      ]
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function js() {
  const b = browserify({
    entries: path.src.js,
    debug: true,
    transform: [babelify]
  }).bundle()
  return b
    .pipe(source('scripts.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(
      gulp_rename({
        outputStyle: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
    }))
    .pipe(group_media())
    .pipe(
      autoprefixer({
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      gulp_rename({
        extname: ".min.css"
      }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function watchFiles() {
  gulp.watch([path.watch.html], html),
  gulp.watch([path.watch.css], css),
  gulp.watch([path.watch.js], js),
  gulp.watch([path.watch.img], images)
}

const build = gulp.series(clean, gulp.parallel(css, html, js, images))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.images = images
exports.js = js
exports.css = css
exports.build = build
exports.html = html
exports.watch = watch
exports.default = watch
