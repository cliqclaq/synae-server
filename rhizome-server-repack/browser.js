'use strict';

// test must be first
require('browsernizr/test/websockets/binary');

// needed for rhizome in the next require
window.Modernizr = require('browsernizr');
window._Modernizr = window.Modernizr;

// gets the actual client instance of rhizome
require('rhizome-server/lib/websockets/browser-main');

// in case there is a future version that doesn't make rhizome
// a global
export default window.rhizome;
