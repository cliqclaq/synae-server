'use strict';

let fs = require('fs');
let path = require('path');
let rhizome = require('rhizome-server');

// constructors
let Manager = rhizome.connections.ConnectionManager;
let WebSocketServer = rhizome.websockets.Server;
let OSCServer = rhizome.osc.Server;

// default configuration
let WSS_PORT = 9967;  // must be changed browser-side too
let OSC_PORT = 9000;
let OUTPUT_DIR = './tmp';

// export function to add in some basic configuration
module.exports = function configure (config) {
  WSS_PORT = config.wssPort || WSS_PORT;
  OSC_PORT = config.oscPort || OSC_PORT;
  OUTPUT_DIR = config.outputDir || OUTPUT_DIR;

  return {
    instance: rhizome,

    // create new instances of both osc and wss
    start: function start (done) {
      let p = path.resolve(OUTPUT_DIR);

      if (!fs.existsSync(p)) fs.mkdirSync(p);

      let man = new Manager({ store: p });
      let wss = new WebSocketServer({ port: WSS_PORT });
      let osc = new OSCServer({ port: OSC_PORT });

      rhizome.starter(man, [wss, osc], err => {
        if (done) {
          done(err, { wss: WSS_PORT, osc: OSC_PORT });
          return;
        }

        if (err) throw err;
      });
    },
  };
};
