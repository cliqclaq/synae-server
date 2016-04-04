import test from 'tape';
import sinon from 'sinon';

import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import AudiencePanel from '../frontend/components/audience-panel.jsx';
import GroupChooser from '../frontend/components/group-chooser.jsx';

test('<AudiencePanel />: no audio context', t => {
  let renderer = createRenderer();
  let noop = () => {};

  renderer.render(
    <AudiencePanel
      rconnected={noop}
      rrecv={noop}
      rsend={noop}
      rid='test' />
  );
  let output = renderer.getRenderOutput();

  t.equals(output.props.children.type, 'button', 'renders a button to kick audio');
  t.end();
});

test('<AudiencePanel />: has audio context', t => {
  let renderer = createRenderer();
  let noop = () => {};

  let expectedMessage = (
    <div className='audience'>
      <div>
        <h1 style={{ textAlign: 'center' }}>{'Waiting for Conductor...'}</h1>
      </div>
    </div>
  );
  function returnMockedAudioCtx () { return {}; }

  renderer.render(
    <AudiencePanel
      getAudioCtx={returnMockedAudioCtx}
      rconnected={noop}
      rrecv={noop}
      rsend={noop}
      rid='test' />
  );
  let output = renderer.getRenderOutput();
  output.props.children.props.onClick();

  output = renderer.getRenderOutput();

  t.deepEquals(output, expectedMessage, 'renders a waiting message');
  t.end();
});

test('AudiencePanel />: has data but no group', t => {
  let renderer = createRenderer();
  let noop = () => {};

  let rrecv = sinon.spy();
  function returnMockedAudioCtx () { return {}; }

  renderer.render(
    <AudiencePanel
      getAudioCtx={returnMockedAudioCtx}
      rconnected={noop}
      rrecv={rrecv}
      rsend={noop}
      rid='test' />
  );

  let output = renderer.getRenderOutput();
  output.props.children.props.onClick();

  output = renderer.getRenderOutput();

  // simulate response for world state
  rrecv.getCall(0).args[0]('/world-state', ['{ "groups": [] }']);

  let component = renderer.getRenderOutput();

  t.equals(component.props.children.type, GroupChooser, 'renders a group chooser');
  t.end();
});
