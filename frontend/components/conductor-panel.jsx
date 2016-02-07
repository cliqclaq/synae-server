import React from 'react';
import debug from 'debug';
import { Promise } from 'es6-promise';
import binaryXHR from 'binary-xhr';
import waakick from '../waakick';
import xfader from '../xfader';

let dbg = debug('synae-server:client');
let dbgm = debug('synae-server:messages');

let debounce = (fn, wait) => {
  let ref = null;
  return (...args) => {
    if (ref) clearTimeout(ref);
    ref = setTimeout(() => fn(...args), wait);
  };
};

export default class ConductorPanel extends React.Component {

  static propTypes = {
    rsend: React.PropTypes.func.isRequired,
    rrecv: React.PropTypes.func.isRequired,
    rconnected: React.PropTypes.func.isRequired,
  };

  actx = waakick();
  gain = null;
  xfader = null;

  state = {
    performance: this.props.perfConfig,
    world: {
      activeSection: 0,
      activeSequence: 0,
    },
    buffers: [],
    timingHasStarted: false,
    sectionTimer: null,
  };

  constructor (props) {
    super(props);

    // Prevent overloading the network.
    this.broadcastWorldState = debounce(this.broadcastWorldState, 20);
    this.broadcastPerformanceConfig = debounce(this.broadcastPerformanceConfig, 20);
    // This is such a super HACK to prevent race conditions with storing
    // the sequence state individually but mutating as a whole.
    this.setupTimings = debounce(this.setupTimings, 20);

    // Shortcuts to rhizome callbacks
    let { rsend, rrecv, rconnected } = this.props;
    Object.assign(this, { rsend, rrecv, rconnected });

    this.rconnected(() => {
      // Immediately send world state to resync in the event of a crash
      this.broadcastPerformanceConfig();
      this.broadcastWorldState();
      this.rsend('/sys/subscribe', ['/kinect-events']);
      this.rsend('/sys/subscribe', ['/performer-events']);
    });

    this.rrecv((address, args) => {
      if (address === '/broadcast/open/websockets') {
        return;
      }

      if (address === '/performer-events') {
        if (!this.state.buffers.length) return;

        if (args[0] === 'next-section') {
          this.nextSection();
        }

        if (args[0] === 'next-sequence') {
          this.nextSequence();
        }
      }
    });
  };

  componentDidMount () {
    let { actx } = this;
    this.gain = actx.createGain();
    this.gain.connect(actx.destination);
    this.gain.value = 1;

    let pbuffer = (bpath) => {
      return new Promise((resolve, reject) => {
        binaryXHR(bpath, (err, data) => {
          if (err) return reject(err);
          actx.decodeAudioData(data, b => resolve(b));
        });
      });
    };

    let blanker = () => {
      return new Promise((resolve, reject) => {
        // Gross. Make a blank audio buffer to prevent premature audio changes.
        let duration = this.state.performance.groups[0].sections[0].timings[0];
        let { sampleRate } = actx;
        let buffer = actx.createBuffer(1, duration, sampleRate);
        resolve(buffer);
      });
    };

    let catcher = e => {
      console.error(e);
    };

    Promise.all([
      blanker(),
      pbuffer('audio/mp3/section_1.mp3'),
      pbuffer('audio/mp3/section_2.mp3'),
      pbuffer('audio/mp3/section_3.mp3'),
      blanker(),
    ])
    .catch(catcher)
    .then(args => {
      this.xfader = xfader(args, actx, this.gain, 2);
      this.setState({ buffers: args });
    })
    .catch(catcher);
  };

  startPerformance = () => {
    let { state } = this;

    state.world.activeSection = 0;
    state.world.activeSequence = 0;

    state.timingHasStarted = true;

    // start audio.
    this.xfader.fadeTo(0);

    this.setState(state);
    this.setupTimings();
  };

  mutePerformance = () => {
    let param = this.gain.gain;
    let now = this.actx.currentTime;
    param.cancelScheduledValues(now);
    param.linearRampToValueAtTime(0, now + 0.1);
  };

  setupTimings = () => {
    let { state, state: { performance: { groups }, world } } = this;
    let { activeSection, activeSequence } = world;

    if (state.sectionTimer !== null) {
      dbg('clearing timeout', state.sectionTimer);
      clearTimeout(state.sectionTimer);
      state.sectionTimer = null;
    }

    let duration = groups[0].sections[activeSection].timings[activeSequence];

    if (!duration) return;

    dbg('setting timeout, section %d, duration %d', activeSection, duration);
    state.sectionTimer = setTimeout(() => {
      dbg('firing timeout', activeSection, duration);
      if (activeSection === 0) {
        dbg('special case: welcome');
        this.nextSection();
      } else {
        this.nextSequence();
      }
    }, duration);
    dbg('set timeout, ref %d', state.sectionTimer);

    this.setState(state);
  };

  nextSequence = () => {
    let { state } = this;
    let { activeSection, activeSequence } = state.world;

    let group0 = this.state.performance.groups[0];
    let maxSequenceIndex = group0.sections[activeSection].sequences.length - 1;

    dbg('sequence change', activeSequence);

    activeSequence += 1;

    if (activeSequence > maxSequenceIndex) {
      this.nextSection();
      return;
    }

    state.world.activeSection = activeSection;
    state.world.activeSequence = activeSequence;

    this.setState(state);
    this.setupTimings();
  };

  nextSection = () => {
    let { activeSection, activeSequence } = this.state.world;
    let maxSectionIndex = this.state.performance.groups[0].sections.length - 1;

    activeSection += 1;
    activeSequence = 0;

    if (activeSection > maxSectionIndex) {
      activeSection = 0;
    }

    this.xfader.fadeTo(activeSection);
    this.setState({ world: { activeSection, activeSequence } });
    this.setupTimings();
  };

  prevSection = () => {
    let { activeSection, activeSequence } = this.state.world;

    activeSection -= 1;
    activeSequence = 0;

    if (activeSection < 0) {
      activeSection = 0;
    }

    this.xfader.fadeTo(activeSection);
    this.setState({ world: { activeSection, activeSequence } });
    this.setupTimings();
  };

  componentWillUpdate () {
    // This might be a horrible idea.
    this.broadcastWorldState();
  };

  broadcastWorldState = () => {
    const payload = this.state.world;
    dbg('broadcast:world-state', payload);
    this.rsend('/world-state', [JSON.stringify(payload)]);
  };

  broadcastPerformanceConfig = () => {
    const payload = this.state.performance;
    dbg('broadcast:performance-config', payload);
    this.rsend('/performance-config', [JSON.stringify(payload)]);
  };

  render () {
    let self = this;
    let loading = !this.state.buffers.length;
    return (
      <div className="conductor">
        <h1 className="px2">Conductor</h1>

        <div>
          <button
            disabled={loading || this.state.timingHasStarted}
            className='button button-big'
            onClick={this.startPerformance}
          >Start Performance</button>
          <button
            disabled={loading}
            className='button button-big bg-red'
            onClick={this.mutePerformance}
          >MASTER MUTE</button>
            {loading && <span>Loading...</span>}
        </div>
        <div>
          <button
            disabled={loading}
            className='button button-big'
            onClick={this.prevSection}
          >Previous Section</button>
          <button
            disabled={loading}
            className='button button-big'
            onClick={this.nextSection}
          >Next Section</button>
        </div>
        <div>
          <button
            disabled={loading}
            className='button button-big'
            onClick={this.nextSequence}
          >Next Sequence</button>
        </div>

        <div className="group-list">
          {this.state.performance.groups.map((g, i) => {
            let { activeSection, activeSequence } = this.state.world;
            let section = g.sections[activeSection];
            let gesture = section.sequences[activeSequence].gesture;
            return (
              <div key={i} className="group-info">
                <h2>
                  Group {g.name}:
                  {gesture} (Section {activeSection}, Sequence {activeSequence})
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

}
