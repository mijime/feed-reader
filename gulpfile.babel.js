import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import pngquant from 'imagemin-pngquant';
import del from 'del';
import browserify from 'browserify';
import browserifyHmr from 'browserify-hmr';
import cssnextify from 'cssnextify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import packager from 'electron-packager';
import config from './package';
import notifier from 'node-notifier';
import os from 'os';
import map from 'lodash/collection/map';

const $ = gulpLoadPlugins();
let enabledWatchify = false;
const platforms = ['win32', 'linux'];
const archList = ['ia32', 'x64'];
const {name, version, dependencies} = config;

function consoleNotify (message) {
  $.util.log(message);
  return notifier.notify({message});
}

function errorHandler ({message, plugin}) {
  $.util.log(`${plugin}:`, message);
  return notifier.notify({message, title: plugin});
}

gulp.task('default', [
  'package.json',
  'js',
  'browserify',
  'html',
  'png',
]);

gulp.task('watch', ['watchify', 'default'], function () {
  gulp.watch(['src/**/*.js'], ['eslint', 'js']);
  gulp.watch(['src/**/*.jade'], ['html']);
  gulp.watch(['src/**/*.yml'], ['json']);
  gulp.watch(['src/**/*.png'], ['png']);
});

gulp.task('js', ['eslint'], function () {
  return gulp.src(['src/**/*.js', '!src/renderer/*.js'])
  .pipe($.changed('app'))
  .pipe($.plumber({errorHandler}))
  .pipe($.babel())
  .pipe(gulp.dest('app'));
});

gulp.task('json', function () {
  return gulp.src('src/**/*.yml')
  .pipe($.changed('app'))
  .pipe($.plumber({errorHandler}))
  .pipe($.yaml({space: 2}))
  .pipe(gulp.dest('app'));
});

gulp.task('eslint', function () {
  return gulp.src(['gulpfile.babel.js', 'src/**/*.js'])
  .pipe($.changed('app'))
  .pipe($.plumber({errorHandler}))
  .pipe($.eslint())
  .pipe($.eslint.format());
});

gulp.task('html', function () {
  return gulp.src(['src/**/*.jade'])
  .pipe($.changed('app'))
  .pipe($.plumber({errorHandler}))
  .pipe($.jade({pretty: true}))
  .pipe(gulp.dest('app'));
});

gulp.task('png', function () {
  return gulp.src(['src/**/*.png', '!src/app.iconset/*.png'])
  .pipe($.changed('app'))
  .pipe($.plumber({errorHandler}))
  .pipe($.imagemin({
    use: [pngquant({quality: '60-80', speed: 1})],
  }))
  .pipe(gulp.dest('app'));
});

gulp.task('modules', function () {
  return gulp.src(map(dependencies,
    (_, name) => `node_modules/${name}/**/*`),
    {base: 'node_modules'})
  .pipe($.changed('app/node_modules'))
  .pipe(gulp.dest('app/node_modules'));
});

gulp.task('package.json', function () {
  return gulp.src(['package.json'])
  .pipe($.changed('app'))
  .pipe(gulp.dest('app'));
});

gulp.task('watchify', function () {
  enabledWatchify = true;
});

gulp.task('browserify', ['eslint'], function () {
  const b = browserify(['src/renderer/index.js'], {
    debug: true,
    verbose: true,
  })
  .exclude('remote')
  .exclude('ipc')
  .transform(babelify)
  .transform(cssnextify);

  const w = enabledWatchify ? watchify(b) : b;
  const bundle = () => {
    return w.bundle()
      .on('error', function ({message, codeFrame}) {
        consoleNotify(message);

        if (codeFrame)
          console.log(codeFrame);
      })
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.uglify())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('app/renderer'));
  }
  const h = enabledWatchify ? w.plugin(browserifyHmr) : w;
  h.on('error', consoleNotify);
  if (enabledWatchify) {
    h.on('update', bundle);
    h.on('log', consoleNotify);
  }
  return bundle();
});

gulp.task('package', ['modules', 'default'], function (done) {
  const osDeps = os.type().toString().match('Windows') !== null ?
    {
      icon: 'src/app.ico',
      platform: 'all',
    } : {
      icon: 'src/icon.incs',
      platform: ['darwin', 'linux'],
    }

  return packager({
    ...osDeps,
    dir: 'app',
    name,
    'app-version': version,
    version: '0.32.3',
    out: `app-packages/${version}`,
    arch: archList,
    prune: true,
    asar: true,
    overwrite: true,
  }, done);
});

platforms.map((platform) => {
  archList.map((arch) => {
    gulp.task(`zip:${platform}:${arch}`, function () {
      const appName = `${name}-${platform}-${arch}`;
      return gulp.src(`app-packages/${version}/${appName}/**/*`)
        .pipe($.zip(`${appName}.zip`))
        .pipe(gulp.dest(`app-releases/${version}`));
    });
  });
  gulp.task(`zip:${platform}`,
    archList.map((arch) => (`zip:${platform}:${arch}`)));
});
gulp.task('zip', platforms.map((platform) => (`zip:${platform}`)));

gulp.task('clean', function () {
  return del(['app*']);
});
