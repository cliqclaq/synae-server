'use strict';

import React from 'react';

const button = {
  width: 50,
  height: 50,
  position: 'fixed',
  zIndex: 1,
};

export default class AudienceIntent extends React.Component {

  static propTypes = {
    active: React.PropTypes.bool.isRequired,
    onIntentChosen: React.PropTypes.func.isRequired,
  };

  chooseIntent (id, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.props.onIntentChosen(id);
  };

  render () {
    let tlstyle = Object.assign({
      top: 0, left: 0,
      display: this.props.active ? 'inline' : 'none',
    }, button);

    let trstyle = Object.assign({
      top: 0, right: 0,
      display: this.props.active ? 'inline' : 'none',
    }, button);

    let blstyle = Object.assign({
      bottom: 0, left: 0,
      display: this.props.active ? 'inline' : 'none',
    }, button);

    let brstyle = Object.assign({
      bottom: 0, right: 0,
      display: this.props.active ? 'inline' : 'none',
    }, button);

    return (
      <div>
        <button
          onClick={this.chooseIntent.bind(this, '1')}
          className='btn bg-red'
          style={tlstyle}
        ></button>
        <button
          onClick={this.chooseIntent.bind(this, '2')}
          className='btn bg-blue'
          style={trstyle}
        ></button>
        { this.props.children }
        <button
          onClick={this.chooseIntent.bind(this, '3')}
          className='btn bg-yellow'
          style={blstyle}
        ></button>
        <button
          onClick={this.chooseIntent.bind(this, '4')}
          className='btn bg-green'
          style={brstyle}
        ></button>
      </div>
    );
  };
};
