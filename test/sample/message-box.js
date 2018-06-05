'use strict';

const term = require('terminal-kit').terminal;
require('../../index.js').plugin(term);

term.saveCursor();

term.MessageBox({
    message: 'Alert!',
    style: term.brightYellow.bgRed,
    x: 'middle',
    y: 'middle',
    xPadding: 2,
    yPadding: 1,
    border: 1,
}).show();

term.restoreCursor();
