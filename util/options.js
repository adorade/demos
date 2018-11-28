/*!
 * Demos (v1.0.0): options.js
 * Copyright (c) 2018 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
 * ============================================================================
 */
/* eslint semi: 2 */

const cfg = require('./config');

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

module.exports = {
  styles, sass, autoprefixer, csso,
  eslint, babel,
  pug, htmlmin,
  size
};
