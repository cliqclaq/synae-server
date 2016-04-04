import React from 'react';
import debug from 'debug';
import GroupChooser from './group-chooser.jsx';

import AudienceIntent from './audience-intent.jsx';
import WelcomeInstrument from './welcome-instrument.jsx';
import SilentInstrument from './silent-instrument.jsx';
import FlutterInstrument from './flutter-instrument.jsx';
import SlashInstrument from './slash-instrument.jsx';
import TickleInstrument from './tickle-instrument.jsx';
import ScratchInstrument from './scratch-instrument.jsx';
import ReachInstrument from './reach-instrument.jsx';
import WaterdropInstrument from './waterdrop-instrument.jsx';

let dbg = debug('synae-server:client');

const Instruments = {
  welcome: WelcomeInstrument,
  silent: SilentInstrument,
  flutter: FlutterInstrument,
  slash: SlashInstrument,
  tickle: TickleInstrument,
  scratch: ScratchInstrument,
  reach: ReachInstrument,
  waterdrop: WaterdropInstrument,
};

export default class AudiencePanel extends React.Component {

  static propTypes = {
    rsend: React.PropTypes.func.isRequired,
    rrecv: React.PropTypes.func.isRequired,
    rconnected: React.PropTypes.func.isRequired,
    rid: React.PropTypes.string.isRequired,
    getAudioCtx: React.PropTypes.func.isRequired,
  };

  state = {
    groupId: null,
    performance: null,
    world: null,
    actx: null,
  };

  constructor (props) {
    super(props);

    // Shortcuts to rhizome callbacks
    let { rsend, rrecv, rconnected, rhizome } = this.props;
    Object.assign(this, { rsend, rrecv, rconnected, rhizome });

    this.rconnected(() => {
      this.rsend('/sys/subscribe', ['/performance-config']);
      this.rsend('/sys/subscribe', ['/world-state']);
      // Retrieve world state once connected.
      this.rsend('/sys/resend', ['/performance-config']);
      this.rsend('/sys/resend', ['/world-state']);
    });

    this.rrecv((address, args) => {
      if (address === '/world-state') {
        const world = JSON.parse(args[0]);
        this.setState({ world });
      }

      if (address === '/performance-config') {
        const performance = JSON.parse(args[0]);
        this.setState({ performance });
      }
    });
  };

  kickWebAudio = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // dbg('waakick');
    dbg('requesting audio context');
    this.setState({ actx: this.props.getAudioCtx() });
  };

  onGroupSelect = (groupId) => {
    this.setState({ ...this.state, groupId });
    // TODO: tell the server? just for visualization purposes
  };

  chooseIntent = (id) => {
    dbg('selected intent %d', id);
  };

  render () {
    let hasKickedAudio = !!this.state.actx;

    if (!hasKickedAudio) return <div style={{
      paddingTop: '45vh',
      textAlign: 'center',
    }}>
      <button
        className='btn btn-primary btn-big'
        style={{
          fontSize: '64px',
          lineHeight: '64px',
        }}
        onClick={this.kickWebAudio}
        onTouchEnd={this.kickWebAudio}>Begin</button>
    </div>;

    let self = this;
    let hasPerfomanceData = !!this.state.performance;
    let syncing = !hasPerfomanceData ? 'Waiting for Conductor...' : null;
    let { performance, world } = this.state;
    let group = hasPerfomanceData
      ? performance.groups.filter(g => g.id === this.state.groupId)[0]
      : null;
    let section = group
      ? group.sections[world.activeSection]
      : null;
    let sequence = section
      ? section.sequences[world.activeSequence]
      : null;
    let performanceStarted = section
      ? world.activeSection !== 0
      : false;
    let Instrument = sequence
      ? Instruments[sequence.gesture]
      : null;

    return (
      <div className="audience">
        {
          !hasPerfomanceData
          ? <div>
              <h1 style={{ textAlign: 'center' }}>{syncing}</h1>
            </div>
          : group

            ? <AudienceIntent onIntentChosen={this.chooseIntent} active={performanceStarted}>
                <Instrument
                sample={sequence.sample}
                instructions={sequence.instructions}
                actx={this.state.actx}
                groupId={this.state.groupId}
                iconUrl={sequence.iconUrl}
                minimumForce={sequence.minimumForce} />
              </AudienceIntent>
            : <GroupChooser
              groups={this.state.performance.groups}
              onGroupSelect={this.onGroupSelect} />
        }
      </div>
    );
  };

}
