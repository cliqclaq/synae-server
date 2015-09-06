import React from 'react/addons';
import binaryXHR from 'binary-xhr';

export default class extends React.Component {

  static propTypes = {
    actx: React.PropTypes.object.isRequired,
    sample: React.PropTypes.string.isRequired
  }

  state = {
    buffer: null,
    silenced: false
  }

  componentDidMount () {
    let {actx} = this.props;
    binaryXHR(this.props.sample, (err, data) => {
      actx.decodeAudioData(data, buffer => {
        this.setState({ buffer });
      });
    })
  }

  triggerSound = () => {
    let {actx} = this.props;
    let sample = actx.createBufferSource();
    sample.buffer = this.state.buffer;
    sample.connect(actx.destination);
    sample.onended = () => { sample.disconnect(); }
    sample.start();
  }

  render () {
    // I guess things go here to make a flutter happen?
    // This could just be 'gesture.jsx' with a big switch statement if the
    // gesture visualizations are mostly static.
    return <div>
      <button
        disabled={!this.state.buffer}
        onClick={this.triggerSound}>CLICK ME</button>
    </div>
  }
}
