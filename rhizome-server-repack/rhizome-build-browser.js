'use strict';

///////////////////////////////////////////////////////////////////////////////
//
// This file builds the required rhizome libs for the browser. Rhizome has some
// weird setup with modernizr so we must include that as well when bundling
// rhizome; It appears that modernizr is required otherwise Rhizome will think
// that websockets are not supported in the browser.
//
// see:
//   - https://github.com/sebpiq/rhizome/blob/master/lib/websockets/Client.js#L163
//   - https://github.com/sebpiq/rhizome/blob/master/lib/websockets/browser-main.js
//   - https://github.com/sebpiq/rhizome/blob/master/lib/websockets/index.js
//
// Also, the only part we actually need to bundle is the browser-main file,
// which lightly wraps the websockets/Client class.
//
///////////////////////////////////////////////////////////////////////////////

let modernizr = require('modernizr');
let browserify = require('browserify');
let fs = require('fs');
let path = require('path');

const rhizomeEntry = './node_modules/rhizome-server/lib/websockets/browser-main';
const basePath = path.resolve(__dirname, '../public');
const modernizrPath = path.resolve(basePath, 'rhizome-modernizr.js');
const rhizomePath = path.resolve(basePath, 'rhizome-browser.js');

// build modernizr
modernizr.build({ 'feature-detects': ['websockets/binary'] }, result => {
  result = `window._Modernizr = window.Modernizr;${result}`;
  fs.writeFileSync(modernizrPath, result);

  // and bundle rhizome with the tmp modernizr build
  var bundle = browserify({ entries: [modernizrPath, rhizomeEntry] })
    .bundle();

  // save the configured modernizr build temporarily so it can be bundled.
  // delete tmp modernizr file after bundling.
  bundle.on('end', () => {
    fs.unlink(modernizrPath, err => {
      if (err) throw err;
    });
  });

  bundle
    .pipe(fs.createWriteStream(rhizomePath));
});
