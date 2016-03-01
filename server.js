'use strict';

require('localenv');

const osc = require('node-osc');
const createRhizome = require('./rhizome-server-repack');
const RhizomeWSClient = require('rhizome-server').websockets.Client;
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
const servers = createRhizome({
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

  // TODO: not really sure it's worth having rhizome-server-repack/index
  // when most of the config is neede out here too.
  servers.start((err, serverConfig) => {
    if (err) throw err;

    sl(`${process.pid}: server ports: wss ${serverConfig.wss}, osc ${serverConfig.osc}`);

    const fiberlamp = new osc.Client(
      process.env.FIBERLAMP_ADDRESS,
      parseInt(process.env.FIBERLAMP_PORT, 10)
    );

    const client = new RhizomeWSClient({
      hostname: '127.0.0.1', // TODO: make this configurable?
      port: Number(process.env.WSS_PORT),
    });

    client.start(() => sl('fiberlamp proxy client connected'));

    client.on('connected', () => {
      client.send('/sys/subscribe', ['/fiberlamp']);
    });

    client.on('message', (address, args) => {
      if (address !== '/fiberlamp') return;
      const msg = new osc.Message(...[address, ...args]);
      sl('sending %o', msg);
      fiberlamp.send(msg);
    });
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
