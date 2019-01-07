/*!
 * Demos (v1.0.0): .babelrc.js
 * Copyright (c) 2019 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ============================================================================
 */

const presets = [
  ['@babel/env', {
    modules: false,
    loose: true
  }]
];
const plugins = [
  // your plugin fere
];
const env = {
  // test: {
  //   plugins: [ 'istanbul' ]
  // }
};

module.exports = {
  presets, plugins, env
};
