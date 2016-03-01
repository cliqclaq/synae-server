'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rhizome = require('rhizome-server');

// constructors
const Manager = rhizome.connections.ConnectionManager;
const WebSocketServer = rhizome.websockets.Server;
const OSCServer = rhizome.osc.Server;

// export function to add in some basic configuration
module.exports = function configure (config) {
  if (!config.wssPort) {
    throw new Error('[rhizome-repack] must specify websocket server port');
  }
  if (!config.oscPort) {
    throw new Error('[rhizome-repack] must specify osc server port');
  }
  if (!config.outputDir) {
    throw new Error('[rhizom-repack] must specify rhizome output directory path');
  }

  return {
    rhizome: rhizome,

    // create new instances of both osc and wss
    start: function start (done) {
      mkdirp.sync(config.outputDir);

      const man = new Manager({ store: config.outputDir });
      const wss = new WebSocketServer({ port: config.wssPort });
      const osc = new OSCServer({ port: config.oscPort });

      rhizome.starter(man, [wss, osc], err => {
        if (done) {
          done(err, { wss: config.wssPort, osc: config.oscPort });
          return;
        }

        if (err) throw err;
      });
    },
  };
};
