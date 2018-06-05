'use strict';

const term = require('terminal-kit').terminal;
require('../index.js').plugin(term);

// Standard message types
term.Message('Default message');

term.Message('Error message', 'error');

term.Message('Warning message', 'warning');

term.Message('Notice message', 'notice');

term.Message('Success message', 'success');

term.Message('Standard message', 'standard');

// Note: data does not incorporate its own new lines
term.noFormat('\n');
const msg = term.Message();
msg.show('ThisShouldAppearAs', 'data');
msg.show('OneSingleLine', 'data');
term.noFormat('\n');

// Custom message design
term.Message().addType('alias', {
    prefix: '[TEST]',
    padding: 2,
    full_width: true,
    style: ['blink', 'brightRed', 'bgBlue'],
});

term.Message('Customised message', 'alias');
