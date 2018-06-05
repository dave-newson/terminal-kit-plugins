'use strict';

const term = require('terminal-kit').terminal;
require('../../index.js').plugin(term);

const callback = function(item) {
    console.log(item);
    term.processExit();
};

// Control item R
let show = false;

const list = term.ActionList({
    x: 0,
    y: 2,
    width: 40,
    style: term.brightYellow.bgBlack,
    selectedStyle: term.black.bgBrightYellow,
});
list
    .add("Alpha", () => { callback('A'); })
    .add("Bravo", () => { callback('B'); })
    .add("Magic Item", () => { callback("M") }, () => show)
    .show();

// Makes the magic item blink every 1.5s
setInterval(() => {
    show = !show;
    list.show();
}, 1500);

// Action list does not grab input by itself
term.grabInput();
