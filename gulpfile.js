/*!
 * Demos (v1.0.0): gulpfile.js
 * Copyright (c) 2019 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ============================================================================
 */
'use strict';

// Gulp and other modules
const { src, dest, series, lastRun, watch } = require('gulp');
const { green, magenta, red, bgRed, bgBlue } = require('ansi-colors');
const bs = require('browser-sync').create();
const http2 = require('http2');
const fs = require('fs');
const del = require('del');

// Config and options
const { dirs, paths, vars } = require('./tools/config');
const opts = require('./tools/options');

// Template for banner to add to file headers
const banner = require('./tools/banner');

// Load all plugins in "devDependencies" into the variable $
const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies'],
  // postRequireTransforms: {
  //   print: function(print) { return print.default; }
  // },
  rename: {
    'gulp-stylelint': 'gStylelint',
    'gulp-eslint': 'gEslint',
    'gulp-pug-linter': 'pugLinter',
    'gulp-gh-pages': 'ghPages'
  }
});

// For debugging usage: .pipe($.debug({ title: 'unicorn:' }))

/**
 * ----------------------------------------------------------------------------
 * Clean - clean all files from `dist` and `tmp` folder
 * ----------------------------------------------------------------------------
 */
function clean() {
  $.fancyLog(`${green('-> Clean up')} ${magenta(dirs.dist)} and ${magenta(dirs.tmp)} folders`);
  return del([dirs.dist, dirs.tmp]);
}
clean.displayName = 'clean:all';
clean.description = 'Clean up ALL prod and tmp folders';

/**
 * ----------------------------------------------------------------------------
 * Styles - processes styles files
 * ----------------------------------------------------------------------------
 */
function cleanCss() {
  $.fancyLog(
    `${green('-> Clean up')} ${magenta(paths.styles.dest)} and ${magenta(paths.styles.tmp.dir)} folders`
  );
  return del([paths.styles.dest, paths.styles.tmp.dir]);
}
cleanCss.displayName = 'clean:styles';
cleanCss.description = 'Clean up styles folders';

function pluginsCss() {
  $.fancyLog(`${green('-> Creating CSS Plugins...')}`);
  return src(paths.styles.src.plugins, { since: lastRun(pluginsCss) })
    .pipe($.concat(`${vars.plugins}.css`))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.tmp.dir));
}
pluginsCss.displayName = 'plugins:css';
pluginsCss.description = 'Create CSS Plugins';

function lintScss() {
  $.fancyLog(`${green('-> Linting SCSS files...')}`);
  return src(paths.styles.src.scss, { since: lastRun(lintScss) })
    .pipe($.gStylelint(opts.styles));
}
lintScss.displayName = 'lint:scss';
lintScss.description = 'Lint SCSS files';

function compileScss() {
  $.fancyLog(`${green('-> Compiling SCSS...')}`);
  return src(paths.styles.src.scss, { sourcemaps: true })
    .pipe($.sass(opts.sass).on('error', $.sass.logError))
    .pipe($.cached('sass_compile'))
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe($.concat(`${vars.styles}.css`))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.tmp.dir, { sourcemaps: './maps' }));
}
compileScss.displayName = 'compile:scss';
compileScss.description = 'Compile SCSS files';

function optimizeCss() {
  $.fancyLog(`${green('-> Optimizing CSS...')}`);
  return src(paths.styles.tmp.css, { allowEmpty: true })
    .pipe($.concat(`${vars.main}.css`))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.tmp.dir))

    .pipe($.csso(opts.csso))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.dest))
    .pipe(bs.stream({ match: '**/*.min.css' }));
}
optimizeCss.displayName = 'optimize:css';
optimizeCss.description = 'Optimize CSS for production';

const styles = series(pluginsCss, lintScss, compileScss, optimizeCss);
styles.description = 'Processes styles files';

const buildStyles = series(cleanCss, styles);
buildStyles.description = 'Build only styles files';

/**
 * ----------------------------------------------------------------------------
 * Scripts - processes scripts files
 * ----------------------------------------------------------------------------
 */
function cleanJs() {
  $.fancyLog(
    `${green('-> Clean up')} ${magenta(paths.scripts.dest)} and ${magenta(paths.scripts.tmp.dir)} folders`
  );
  return del([paths.scripts.dest, paths.scripts.tmp.dir]);
}
cleanJs.displayName = 'clean:scripts';
cleanJs.description = 'Clean up scripts folders';

function pluginsJs() {
  $.fancyLog(`${green('-> Building JS plugins...')}`);
  return src(paths.scripts.src.plugins)
    .pipe($.concat(`${vars.plugins}.js`))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.tmp.dir));
}
pluginsJs.displayName = 'plugins:js';
pluginsJs.description = 'Build JS plugins';

function lintJs() {
  $.fancyLog(`${green('-> Linting ES files...')}`);

  const outputDir = paths.logs.gulp;
  fs.mkdirSync(`${outputDir}`, { recursive: true });
  const output = fs.createWriteStream( `${outputDir}/scripts.txt` );

  return src(paths.scripts.src.js, { since: lastRun(lintJs) })
    .pipe($.gEslint())
    .pipe($.gEslint.format())
    .pipe($.gEslint.format('stylish', output))
    .pipe($.gEslint.failAfterError());
}
lintJs.displayName = 'lint:js';
lintJs.description = 'Lint ES files';

function transpileJs() {
  $.fancyLog(`${green('-> Transpiling JS via Babel...')}`);
  return src(paths.scripts.src.js, {
    sourcemaps: true,
    since: lastRun(transpileJs)
  })
    .pipe($.concat(`${vars.scripts}.js`))
    .pipe($.babel(opts.babel))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.tmp.dir, { sourcemaps: './maps' }));
}
transpileJs.displayName = 'transpile:mjs';
transpileJs.description = 'Transpile JS via Babel';

function optimizeJs() {
  $.fancyLog(`${green('-> Optimizing JS...')}`);
  return src(paths.scripts.tmp.js, { allowEmpty: true })
    .pipe($.concat(`${vars.main}.js`))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.tmp.dir))

    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.dest))
    .pipe(bs.stream({ match: '**/*.min.js' }));
}
optimizeJs.displayName = 'optimize:js';
optimizeJs.description = 'Optimize JS for production';

const scripts = series(pluginsJs, lintJs, transpileJs, optimizeJs);
scripts.description = 'Processes scripts files';

const buildScripts = series(cleanJs, scripts);
buildScripts.description = 'Build only scripts files';

/**
 * ----------------------------------------------------------------------------
 * Templates - processes templates files
 * ----------------------------------------------------------------------------
 */
function cleanPages() {
  $.fancyLog(
    `${green('Clean up')} ${magenta(paths.views.dest.files)}, ${magenta(paths.views.tmp.files)} files`
  );
  return del([paths.views.dest.files, paths.views.tmp.files]);
}
cleanPages.displayName = 'clean:pages';
cleanPages.description = 'Clean up html files';

function lintPages() {
  $.fancyLog(`${green('-> Linting templates...')}`);
  return src(paths.views.all, { since: lastRun(lintPages) })
    .pipe($.pugLinter({ reporter: 'default' }))
    .pipe($.pugLinter({ failAfterError: true }));
}
lintPages.displayName = 'lint:pages';
lintPages.description = 'Lint pug (views) files';

function compilePages() {
  $.fancyLog(`${green('-> Compiling HTML via Pug...')}`);
  return src(paths.views.src)
    .pipe($.pug(opts.pug))
    .pipe($.cached('pug_compile'))
    .pipe($.size(opts.size))
    .pipe(dest(paths.views.tmp.dir));
}
compilePages.displayName = 'create:pages';
compilePages.description = 'Compile  HTML via Pug';

function optimizePages() {
  $.fancyLog(`${green('-> Optimizing pages...')}`);
  return src(paths.views.tmp.files, { since: lastRun(optimizePages) })
    .pipe($.htmlmin(opts.htmlmin))
    .pipe($.size(opts.size))
    .pipe(dest(paths.views.dest.dir))
    .pipe(bs.stream({ match: '**/*.html' }));
}
optimizePages.displayName = 'optimize:pages';
optimizePages.description = 'Optimize Pages for production';

const pages = series(lintPages, compilePages, optimizePages);
pages.description = 'Processes templates files';

const buildPages = series(cleanPages, pages);
buildPages.description = 'Build only html files';

/**
 * ----------------------------------------------------------------------------
 * Deploy to GitHub Pages
 * ----------------------------------------------------------------------------
 */
function cleanDeploy() {
  $.fancyLog(
    `${green('Clean up')} ${magenta(dirs.deploy)} folder`
  );
  return del(dirs.deploy);
}
cleanDeploy.displayName = 'clean:deploy';
cleanDeploy.description = 'Clean up GitHub Pages';

function deployPages() {
  $.fancyLog(`${green('-> Deploy to GitHub Pages...')}`);
  return src(`${dirs.dist}/**/*`)
    .pipe($.ghPages(opts.deploy));
}
deployPages.displayName = 'deploy:pages';
deployPages.description = 'Deploy to GitHub Pages';

const buildDeploy = series(cleanDeploy, deployPages);
buildDeploy.description = 'Build GitHub Pages';

/**
 * ----------------------------------------------------------------------------
 * Watch and Serve - watch files for changes and reload
 * Starts a BrowerSync instance
 * Watch files for changes
 * ----------------------------------------------------------------------------
 */
function serve(done) {
  $.fancyLog(`${green('-> Serve and Live reload...')}`);
  bs.init({
    server: {
      baseDir: dirs.dist
    },
    port: 7879,
    logPrefix: 'Demos',
    ui: false,
    httpModule: http2
  });
  done();
}
serve.displayName = 'serve:live:reload';
serve.description = 'Serve and Live reload';

function watcher() {
  $.fancyLog(`${green('-> Watching files for changes...')}`);

  function watchEvent(path, event, task) {
    $.fancyLog(
      `File ${magenta(path)} was ${green(event)} running ${red(task)}`
    );
  }

  const watchers = [
    {
      name: 'Plugins CSS',
      paths: paths.styles.src.plugins,
      tasks: [pluginsCss],
      names: [pluginsCss.name]
    },
    {
      name: 'Compile Scss',
      paths: paths.styles.src.scss,
      tasks: [lintScss, compileScss],
      names: [lintScss.name, compileScss.name]
    },
    {
      name: 'Optimize CSS',
      paths: paths.styles.tmp.css,
      tasks: [optimizeCss],
      names: [optimizeCss.name]
    },
    {
      name: 'Plugins Js',
      paths: paths.scripts.src.plugins,
      tasks: [pluginsJs],
      names: [pluginsJs.name]
    },
    {
      name: 'Transpile Js',
      paths: paths.scripts.src.js,
      tasks: [lintJs, transpileJs],
      names: [lintJs.name, transpileJs.name]
    },
    {
      name: 'Optimize Js',
      paths: paths.scripts.tmp.js,
      tasks: [optimizeJs],
      names: [optimizeJs.name]
    },
    {
      name: 'Pages',
      paths: paths.views.all,
      tasks: [lintPages, compilePages],
      names: [lintPages.name, compilePages.name]
    },
    {
      name: 'Optimize Pages',
      paths: paths.views.tmp.files,
      tasks: [optimizePages],
      names: [optimizePages.name]
    }
  ];

  for (let watcher of watchers) {
    $.fancyLog(bgRed(`Watching ${watcher.name}`));

    for (let p of [watcher.paths]) {
      $.fancyLog(`${bgBlue('Source:')} ${magenta(p)}`);
    }

    watch(
      watcher.paths, opts.watch, series(watcher.tasks)
    )
      .on('all', (event, path) => {
        watchEvent(path, event, watcher.names);
      });
  }
}
watcher.displayName = 'watch:for:changes';
watcher.description = 'Watch files for changes';

/**
 * ----------------------------------------------------------------------------
 * Define ALL tasks that can be called by running them from cli
 * ----------------------------------------------------------------------------
 */
// Clean and build separately for each type of task
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.buildPages = buildPages;

// Part of automation build, for production
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;

// Production build
const build = series(
  clean, styles, scripts, pages
);
build.description = 'Production build';
exports.build = build;

// Serve and Watch, for development
exports.serve = serve;
exports.watcher = watcher;

// Deploy to GitHub Pages
exports.deploy = buildDeploy;

/**
 * ----------------------------------------------------------------------------
 * Define default task that can be called by just running `gulp` from cli
 * ----------------------------------------------------------------------------
 */
exports.default = series(
  build, serve, watcher
);
