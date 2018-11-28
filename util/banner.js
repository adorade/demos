/*!
 * Demos (v1.0.0): banner.js
 * Copyright (c) 2018 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
 * ============================================================================
 */
/* eslint no-console: 0, semi: 2 */

const pkg = require('../package.json');

const year = new Date(
  process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).getFullYear();

function banner() {
  let result = '';

  try {
    result = [
      '/*!',
      ` * ${pkg.title} (v${pkg.version}): <%= file.relative %>`,
      ` * ${pkg.description}`,
      ` * Copyright (c) ${year} ${pkg.author.name} (${pkg.homepage})`,
      ` * License under ${pkg.license} (${pkg.repository}/blob/master/LICENSE)`,
      ' * ============================================================================',
      ' */',
      '' // new line
    ].join('\n');
  } catch (err) {
    console.error(err);
  }

  return result;
}

module.exports = banner;
