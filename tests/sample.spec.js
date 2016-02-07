'use strict';

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import tape from 'tape';

const renderer = ReactTestUtils.createRenderer();


const Child1 = <h1>Some Content</h1>;
const Child2 = <h2>A second child!</h2>;
const Example = class extends React.Component {
  displayName = 'Example';
  render() {
    return <div className='hello-world'>{Child1}{Child2}</div>;
  }
}

tape('render an example component', t => {
  t.plan(4);

  renderer.render(<Example />);

  let output = renderer.getRenderOutput();
  t.equal(output.type, 'div');
  t.equal(output.props.children.length, 2);
  t.equal(output.props.children[0], Child1);
  t.equal(output.props.children[1], Child2);
})