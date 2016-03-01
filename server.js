'use strict';

require('localenv');

const createRhizome = require('./rhizome-server-repack');
const cluster = require('cluster');
const numCpus = require('os').cpus().length;
const debug = require('debug');

const wl = debug('worker');
const sl = debug('server');

const HTTP_PORT = Number(process.env.HTTP_PORT);

///////////////////////////////////////////////////////////////////////////////
//
// configure the ports for websocket/osc servers and the output directory.
// returns a simple object to start the rhizome servers
//
///////////////////////////////////////////////////////////////////////////////
const rhizome = createRhizome({
  wssPort: Number(process.env.WSS_PORT), // should be different than http port
  oscPort: Number(process.env.OSC_PORT),
  outputDir: __dirname + '/tmp',
});

///////////////////////////////////////////////////////////////////////////////
//
// master spools up a single osc/websocket server and multiple http servers
//
///////////////////////////////////////////////////////////////////////////////
if (cluster.isMaster) {
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
      sl(`worker ${worker.process.pid} exited: ${code}`);
    });
  }

  rhizome.start((err, serverConfig) => {
    if (err) throw err;

    sl(`${process.pid}: server ports: wss ${serverConfig.wss}, osc ${serverConfig.osc}`);
  });
}

///////////////////////////////////////////////////////////////////////////////
//
// worker processes spool up http servers via static express apps
//
///////////////////////////////////////////////////////////////////////////////
else {
  const express = require('express');
  const app = express();

  // logging middleware
  app.all('*/', (req, res, next) => {
    wl(`${process.pid}: ${req.method} => ${req.originalUrl}`);
    next();
  });

  app.use(express.static(__dirname + '/public'));
  app.listen(HTTP_PORT, () => wl(`${process.pid}: http server up ${HTTP_PORT}`));
}
