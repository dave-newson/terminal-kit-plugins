'use strict';

const term = require('terminal-kit').terminal;
require('../index.js').plugin(term);

term.HeaderBar({
    x: 0,
    y: 0,
    width: null, // full width
    style: term.bgBrightYellow.black,
    divider: "|",
    dividerStyle: term.bgBrightYellow.brightRed,
    padding: 4,
    get: "label",
    getKey: "key",
})
    .add({ label: "Alpha", key: "a" })
    .add({ label: "Bravo", key: "b" })
    .on('selected', (item) => {
        console.log("Item: " + item.label);
        term.processExit();
    })
    .redraw();

// Wait for input (header does not cause this)
term.grabInput();