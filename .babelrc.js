/*!
 * Demos (v1.0.0): .babelrc.js
 * Copyright (c) 2018 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
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
}

module.exports = {
  presets, plugins, env
};
