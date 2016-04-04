// required for rhizome

import './vendor/AudioContextMonkeyPatch';
import objectAssign from 'object-assign';

import querystring from 'querystring';
import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import waakick from './waakick';
import ConductorPanel from './components/conductor-panel.jsx';
import AudiencePanel from './components/audience-panel.jsx';
import GestureRecordPanel from './components/gesturerecord-panel.jsx';
import SensorDumperPanel from './components/sensordumper-panel.jsx';
import PerformerPanel from './components/performer-panel.jsx';

import perfConfig from './performance-config';
import perfValidator from './performance-validator';
import rhizome from '../rhizome-server-repack/browser';

// Ensure perf is valid.
perfValidator(perfConfig);

// polyfill
Object.assign = Object.assign || objectAssign;

let dbg = debug('synae-server:client');
let dbgm = debug('synae-server:messages');

try {
  window.navigator.oscpu = window.navigator.oscpu || window.navigator.platform;
} catch (e) {}

// rhizome is a global provided by the server, unfortunately.
// It could be replaced with:
// var rhizome = require('rhizome-server/lib/websockets/browser-main');
// but that file still exposes rhizome as a global.
// currently, rhizome is still a global and the repack returns
// window.rhizome.
rhizome._config.port = Number(process.env.WSS_PORT);

var qs = querystring.parse(window.location.search.slice(1));

// TODO: check for gyrometer support within devicemotion

try {
  // This is simply to test for support, not to actually kick.
  dbg('waa', waakick());
} catch (e) {
  alert('Failed to initialize Web Audio' + e.message);
  throw e;
}

// Test for older iOS, since rhizome.isSupported is failing for iOS 7.
const reIOS = /iPhone OS (\d)_(\d) like/;
const match = reIOS.exec(window.navigator.userAgent);
if (match && match.length === 3) {
  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);
  if (major < 8) {
    const e = new Error('Sorry, but iOS devices before iOS 8 are not supported.');
    alert(e.message);
    throw e;
  }
}

if (!rhizome.isSupported()) {
  let e = new Error('Sorry, but your device is not supported.');
  alert(e.message);
  throw e;
}

// TODO: probably need to do an audio format check here as well...

rhizome.start((err) => {
  dbg(err);
  dbg('started', rhizome.id);

  // Phone home to be able to troubleshoot afterwards.
  const xhr = new XMLHttpRequest();
  const url = window.location.origin + '/rhizome-identify?id=' + rhizome.id;
  xhr.open('GET', url, true);
  xhr.send(null);

  initialize();
});

function initialize () {

  let commonProps = {
    perfConfig,
    rsend: rhizome.send.bind(rhizome),
    rrecv,
    rconnected,
  };

  let root = document.querySelector('.react-root');

  if ('conductor' in qs) {
    ReactDOM.render(<ConductorPanel {...commonProps} />, root);
  } else if ('gesturedebug' in qs) {
    ReactDOM.render(<GestureRecordPanel />, root);
  } else if ('sensordump' in qs) {
    ReactDOM.render(<SensorDumperPanel />, root);
  } else if ('performer' in qs) {
    ReactDOM.render(<PerformerPanel {...commonProps} />, root);
  } else {
    ReactDOM.render(<AudiencePanel
        {...commonProps}
        getAudioCtx={waakick}
        rid={rhizome.id}
      />, root);
  }

  // TODO: this listener might be in a race condition since it's added
  // after `start`
  rhizome.on('queued', () => {
    dbg('server is full...');
  });

  rhizome.on('connection lost', () => {
    dbg('reconnecting...');
  });

  function rrecv (cb) {
    rhizome.on('message', (...args) => {
      dbgm(...args);
      cb(...args);
    });
  }

  function rconnected (cb) {
    rhizome.on('connected', (...args) => {
      dbg('connected');
      cb(...args);
    });
  }
}
