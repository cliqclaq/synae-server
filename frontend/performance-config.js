import timeToMS from './time-to-ms';
export default {
  groups: [
    {
      id: 'group-a',
      name: 'Blue',
      color: '#69cadf',
      sections: [
        {
          sequences: [
            { gesture: 'welcome' },
          ],
          timings: [
            timeToMS(0, 10),
          ],
        },
        {
          sequences: [
            { gesture: 'flutter',
              sample: 'audio/mp3/flutter.mp3',
              instructions: 'Shake phone when you hear agitation.',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/flutter.mp3',
              instructions: 'When you hear someone else\'s shake, wait two heart beats then shake.',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/flutter.mp3',
              instructions: 'Shake when others around you shake.',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/flutter.mp3',
              instructions: 'Shake as vigorously as possible!',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
          ],
          timings: [
            timeToMS(0, 42),
          ],
        },
        {
          sequences: [
            { gesture: 'tickle',
              sample: 'audio/mp3/blowing_bubbles.mp3',
              instructions: 'Tickle bubbles when you grandly exhale.',
              iconUrl: 'img/TICKLETAP_BLUE.png', },
            { gesture: 'waterdrop',
              sample: 'audio/mp3/water_drop.mp3',
              instructions: 'Tap every 4 heartbeats.',
              iconUrl: 'img/TAP_BLUE.png', },
            { gesture: 'waterdrop',
              sample: 'audio/mp3/water_drop.mp3',
              instructions: 'Tap every 2 heartbeats.',
              iconUrl: 'img/TAP_BLUE.png', },
          ],
          timings: []
        },
        {
          sequences: [
            { gesture: 'waterdrop',
              sample: 'audio/mp3/water_drop.mp3',
              instructions: 'Tap every 2 heartbeats.',
              iconUrl: 'img/TAP_BLUE.png', },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_e.mp3',
              instructions: 'Shake phone after Jocelyn performs a gesture.',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_e.mp3',
              instructions: 'Shake after Jocelyn, but wait longer each time.',
              iconUrl: 'img/SHAKE_BLUE.png',
              minimumForce: 10, },
          ],
          timings: [
            timeToMS(0, 15),
          ],
        },
        {
          sequences: [
            { gesture: 'silent',
              instructions: 'Fin.', },
          ],
          timings: []
        },
      ],
    },
    {
      id: 'group-b',
      name: 'Red',
      color: '#f05d5f',
      sections: [
        {
          sequences: [
            { gesture: 'welcome' },
          ],
          timings: [
            timeToMS(0, 10),
          ],
        },
        {
          sequences: [
            { gesture: 'silent',
              instructions: 'Be mindful of your surroundings (for now).', },
            { gesture: 'slash',
              sample: 'audio/mp3/string_swipe.mp3',
              instructions: 'Slash downwards when you hear fluttering.',
              iconUrl: 'img/SLASH_RED.png', },
            { gesture: 'slash',
              sample: 'audio/mp3/string_swipe.mp3',
              instructions: 'Slash downwards when no one near you is slashing.',
              iconUrl: 'img/SLASH_RED.png', },
            { gesture: 'slash',
              sample: 'audio/mp3/string_swipe.mp3',
              instructions: 'Slash downwards as many times as you can!',
              iconUrl: 'img/SLASH_RED.png', },
          ],
          timings: [
            timeToMS(0, 42),
          ],
        },
        {
          sequences: [
            { gesture: 'waterdrop',
              sample: 'audio/mp3/water_drop.mp3',
              instructions: 'Tap when you swallow saliva.',
              iconUrl: 'img/TAP_RED.png', },
            { gesture: 'tickle',
              sample: 'audio/mp3/blowing_bubbles.mp3',
              instructions: 'Tickle bubbles when you want to scratch your throat.',
              iconUrl: 'img/TICKLETAP_RED.png', },
            { gesture: 'tickle',
              sample: 'audio/mp3/blowing_bubbles.mp3',
              instructions: 'Tickle bubbles when you feel any muscle in your body contract.',
              iconUrl: 'img/TICKLETAP_RED.png', },
          ],
          timings: []
        },
        {
          sequences: [
            { gesture: 'tickle',
              sample: 'audio/mp3/blowing_bubbles.mp3',
              instructions: 'Tickle bubbles when you feel any muscle in your body contract.',
              iconUrl: 'img/TICKLETAP_RED.png', },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_csharp.mp3',
              instructions: 'Shake after the group on your right plays sounds.',
              iconUrl: 'img/SHAKE_RED.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_csharp.mp3',
              instructions: 'Shake after the group on your right plays sounds, but wait longer each time.',
              iconUrl: 'img/SHAKE_RED.png',
              minimumForce: 10, },
          ],
          timings: [
            timeToMS(0, 15),
          ],
        },
        {
          sequences: [
            { gesture: 'silent',
              instructions: 'Fin.', },
          ],
          timings: []
        },
      ],
    },
    {
      id: 'group-c',
      name: 'Green',
      color: '#80c898',
      sections: [
        {
          sequences: [
            { gesture: 'welcome' },
          ],
          timings: [
            timeToMS(0, 10),
          ],
        },
        {
          sequences: [
            { gesture: 'scratch',
              sample: 'audio/mp3/string_drag.mp3',
              instructions: 'Scratch the air when you hear stillness sounds.',
              iconUrl: 'img/SCRATCH_GREEN.png', },
            { gesture: 'scratch',
              sample: 'audio/mp3/string_drag.mp3',
              instructions: 'Scratch the air when you hear agitation.',
              iconUrl: 'img/SCRATCH_GREEN.png', },
            { gesture: 'scratch',
              sample: 'audio/mp3/string_drag.mp3',
              instructions: 'Scratch the air right after someone else scratches.',
              iconUrl: 'img/SCRATCH_GREEN.png', },
            { gesture: 'scratch',
              sample: 'audio/mp3/string_drag.mp3',
              instructions: 'Scratch the air as many times as possible!',
              iconUrl: 'img/SCRATCH_GREEN.png', },
          ],
          timings: [
            timeToMS(0, 42),
          ],
        },
        {
          sequences: [
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Shake quickly whenever you shift in your seat.',
              iconUrl: 'img/SHAKE_GREEN.png',
              minimumForce: 5, },
            { gesture: 'waterdrop',
              sample: 'audio/mp3/popping.mp3',
              instructions: 'Tap whenever you look around you.',
              iconUrl: 'img/TAP_GREEN.png', },
            { gesture: 'waterdrop',
              sample: 'audio/mp3/popping.mp3',
              instructions: 'Tap whenever you blink.',
              iconUrl: 'img/TAP_GREEN.png', },
          ],
          timings: []
        },
        {
          sequences: [
            { gesture: 'waterdrop',
              sample: 'audio/mp3/popping.mp3',
              instructions: 'Tap whenever you blink.',
              iconUrl: 'img/TAP_GREEN.png', },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Shake after the group in front of you plays sounds.',
              iconUrl: 'img/SHAKE_GREEN.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Shake after the group in front of you plays sounds, but wait longer each time.',
              iconUrl: 'img/SHAKE_GREEN.png',
              minimumForce: 10, },
          ],
          timings: [
            timeToMS(0, 15),
          ],
        },
        {
          sequences: [
            { gesture: 'silent',
              instructions: 'Fin.', },
          ],
          timings: []
        },
      ],
    },
    {
      id: 'group-d',
      name: 'Yellow',
      color: '#f2d86d',
      sections: [
        {
          sequences: [
            { gesture: 'welcome' },
          ],
          timings: [
            timeToMS(0, 10),
          ],
        },
        {
          sequences: [
            { gesture: 'reach',
              sample: 'audio/mp3/whisper_bells.mp3',
              instructions: 'Reach upwards when the group in front of you makes sound.',
              iconUrl: 'img/REACH_YELLOW.png', },
            { gesture: 'reach',
              sample: 'audio/mp3/whisper_bells.mp3',
              instructions: 'Reach upwards when you hear a dead spot.',
              iconUrl: 'img/REACH_YELLOW.png', },
            { gesture: 'reach',
              sample: 'audio/mp3/whisper_bells.mp3',
              instructions: 'Reach upwards when you hear sharp sounds from other groups.',
              iconUrl: 'img/REACH_YELLOW.png', },
            { gesture: 'reach',
              sample: 'audio/mp3/whisper_bells.mp3',
              instructions: 'Reach upwards as many times as you can!',
              iconUrl: 'img/REACH_YELLOW.png', },
          ],
          timings: [
            timeToMS(0, 42),
          ],
        },
        {
          sequences: [
            { gesture: 'waterdrop',
              sample: 'audio/mp3/popping.mp3',
              instructions: 'Tap when you swallow saliva.',
              iconUrl: 'img/TAP_YELLOW.png', },
            { gesture: 'reach',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Reach upwards whenever you feel an itch.',
              iconUrl: 'img/REACH_YELLOW.png', },
            { gesture: 'reach',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Reach upwards whenever you breathe out.',
              iconUrl: 'img/REACH_YELLOW.png', },
          ],
          timings: []
        },
        {
          sequences: [
            { gesture: 'reach',
              sample: 'audio/mp3/electrical_interruption.mp3',
              instructions: 'Reach upwards whenever you breathe out.',
              iconUrl: 'img/REACH_YELLOW.png', },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_fly.mp3',
              instructions: 'Shake phone after the group to your left plays sounds.',
              iconUrl: 'img/SHAKE_YELLOW.png',
              minimumForce: 10, },
            { gesture: 'flutter',
              sample: 'audio/mp3/electrical_fly.mp3',
              instructions: 'Shake phone after the group to your left plays sounds, but wait longer each time.',
              iconUrl: 'img/SHAKE_YELLOW.png',
              minimumForce: 10, },
          ],
          timings: [
            timeToMS(0, 15),
          ],
        },
        {
          sequences: [
            { gesture: 'silent',
              instructions: 'Fin.', },
          ],
          timings: []
        },
      ],
    },
  ],
};
