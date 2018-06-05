'use strict';

const term = require('terminal-kit').terminal;
require('../../index.js').plugin(term);

term.TextPrompt().ask('How many kilograms of cheese would you like?', '50').then((weight) => {
    console.log('Weight: ' + weight);
    term.processExit();
});
