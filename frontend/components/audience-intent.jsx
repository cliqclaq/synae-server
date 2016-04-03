'use strict';

import React from 'react';

const button = {
  width: 50,
  height: 50,
  position: 'fixed',
  transition: 'opacity 300ms ease',
  opactiy: 1,
};

export default class AudienceIntent extends React.Component {

  static propTypes = {
    active: React.PropTypes.bool.isRequired,
    onIntentChosen: React.PropTypes.func.isRequired,
  };

  chooseIntent (id) {
    this.props.onIntentChosen(id);
  };

  render () {
    let tlstyle = Object.assign({
      top: 0, left: 0,
      opacity: this.props.active ? 1 : 0,
    }, button);

    let trstyle = Object.assign({
      top: 0, right: 0,
      opacity: this.props.active ? 1 : 0,
    }, button);

    let blstyle = Object.assign({
      bottom: 0, left: 0,
      opacity: this.props.active ? 1 : 0,
    }, button);

    let brstyle = Object.assign({
      bottom: 0, right: 0,
      opacity: this.props.active ? 1 : 0,
    }, button);

    return (
      <div>
        <div onClick={this.chooseIntent.bind(this, '1')} className='bg-red' style={tlstyle}></div>
        <div onClick={this.chooseIntent.bind(this, '2')} className='bg-blue' style={trstyle}></div>
        { this.props.children }
        <div onClick={this.chooseIntent.bind(this, '3')} className='bg-yellow' style={blstyle}></div>
        <div onClick={this.chooseIntent.bind(this, '4')} className='bg-green' style={brstyle}></div>
      </div>
    );
  };
};
