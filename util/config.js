/*!
 * Demos (v1.0.0): config.js
 * Copyright (c) 2018 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
 * ============================================================================
 */
/* eslint semi: 2 */

const vars = {
  plugins: 'plugins',
  styles: 'styles',
  scripts: 'scripts',
  main: 'main'
};

const dirs = {
  root: './',
  src: './src',
  dist: './dist',
  tmp: './tmp',
  logs: './logs'
};

const paths = {
  styles: {
    src: {
      scss: `${dirs.src}/scss/**/*.scss`,
      plugins: [
        './node_modules/normalize.css/normalize.css',
        './node_modules/animate.css/animate.css'
      ]
    },
    tmp: {
      dir: `${dirs.tmp}/css/`,
      css: [
        `${dirs.tmp}/css/${vars.plugins}.css`, // => from `node_modules`
        `${dirs.tmp}/css/${vars.styles}.css`   // => from `scss`
      ]
    },
    dest: `${dirs.dist}/css/`
  },
  scripts: {
    src: {
      js: `${dirs.src}/es6/**/*.js`,
      plugins: [
        'node_modules/wowjs/dist/wow.js'
      ]
    },
    tmp: {
      dir: `${dirs.tmp}/js/`,
      js: [
        `${dirs.tmp}/js/${vars.plugins}.js`, // => from `node_modules`
        `${dirs.tmp}/js/${vars.scripts}.js`  // => from `es6`
      ]
    },
    dest: `${dirs.dist}/js/`
  },
  views: {
    src: [`${dirs.src}/views/**/*.pug`, `!${dirs.src}/views/**/_*.pug`],
    all: `${dirs.src}/views/**/*.pug`,
    tmp: {
      dir: `${dirs.tmp}/`,
      files: `${dirs.tmp}/*.html`
    },
    dest: {
      dir: `${dirs.dist}/`,
      files: `${dirs.dist}/*.html`
    }
  }
};

module.exports = { vars, dirs, paths };
