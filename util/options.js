/*!
 * Demos (v1.0.0): options.js
 * Copyright (c) 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
 * ============================================================================
 */

const cfg = require('./config');

const dates = new Date(
  process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).toDateString();

const styles = {
  failAfterError: false,
  reportOutputDir: cfg.dirs.logs,
  reporters: [
    { formatter: 'string', console: true, save: 'styles.txt' }
  ],
  syntax: 'scss'
};
const sass = {
  outputStyle: 'expanded',
  precision: 6
};
const autoprefixer = {
  // browsers: [], // see .browserslistrc
  cascade: false
};
const csso = {
  restructure: false,
  comments: false
};
const eslint = {
  // see .eslintrc.json
};
const babel = {
  // see .babelrc.js
  comments: false
};
const pug = {
  doctype: 'html',
  pretty: true
};
const htmlmin = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeEmptyElements: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
};
const size = {
  gzip: true,
  showFiles: true
};
const deploy = {
  // remoteUrl: '',
  // branch: 'gh-pages',
  // cacheDir: '.publish',
  // push: true,
  // force: false,
  message: `Update ${dates}`
};
const watch = {
  delay: 2000
};

module.exports = {
  styles, sass, autoprefixer, csso,
  eslint, babel,
  pug, htmlmin,
  size,
  watch, deploy
};
