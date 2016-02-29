'use strict';

let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');
let rhizome = require('rhizome-server');

// constructors
let Manager = rhizome.connections.ConnectionManager;
let WebSocketServer = rhizome.websockets.Server;
let OSCServer = rhizome.osc.Server;

// export function to add in some basic configuration
module.exports = function configure (config) {
  if (!config.wssPort) throw new Error('[rhizome-repack] must specify websocket server port');
  if (!config.oscPort) throw new Error('[rhizome-repack] must specify osc server port');
  if (!config.outputDir) throw new Error('[rhizom-repack] must specify rhizome output directory path');

  let WSS_PORT = config.wssPort;
  let OSC_PORT = config.oscPort;
  let OUTPUT_DIR = config.outputDir;

  return {
    rhizome: rhizome,

    // create new instances of both osc and wss
    start: function start (done) {
      let p = path.resolve(OUTPUT_DIR);

      if (!fs.existsSync(p)) mkdirp.sync(p);

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
