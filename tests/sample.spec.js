'use strict';

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import test from 'tape';

const renderer = ReactTestUtils.createRenderer();

const Child1 = <h1>Some Content</h1>;
const Child2 = <h2>A second child!</h2>;
const Example = class extends React.Component {
  displayName = 'Example';
  render () {
    return <div className='hello-world'>{Child1}{Child2}</div>;
  }
};

test.skip('<Example />', t => {
  t.plan(4);

  renderer.render(<Example />);

  let output = renderer.getRenderOutput();
  t.equal(output.type, 'div', 'renders a div');
  t.equal(output.props.children.length, 2, 'has the correct number of children');
  t.equal(output.props.children[0], Child1, 'renders the first child');
  t.equal(output.props.children[1], Child2, 'renders the second child');
});
