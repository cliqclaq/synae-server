'use strict';

let Rhizome = require('./rhizome-server-repack');
let cluster = require('cluster');
let numCpus = require('os').cpus().length;
let debug = require('debug');

const wl = debug('worker');
const sl = debug('server');

const HTTP_PORT = 9966;

///////////////////////////////////////////////////////////////////////////////
//
// configure the ports for websocket/osc servers and the output directory.
// returns a simple object to start the rhizome servers
//
///////////////////////////////////////////////////////////////////////////////
let rhizome = Rhizome({
  wssPort: 9967, // should be different than http port
  oscPort: 9000,
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
  let express = require('express');
  let app = express();

  // logging middleware
  app.all('*/', (req, res, next) => {
    wl(`${process.pid}: ${req.method} => ${req.originalUrl}`);
    next();
  });

  app.use(express.static(__dirname + '/public'));
  app.listen(HTTP_PORT, () => wl(`${process.pid}: http server up ${HTTP_PORT}`));
}
