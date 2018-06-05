'use strict';

const term = require('terminal-kit').terminal;
require('../index.js').plugin(term);

term.Confirm().confirm('Do you like cheese?').then((answer) => {
    console.log('Answer: ' + (answer ? 'Yes' : 'No'));
    term.processExit();
});
