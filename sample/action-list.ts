#!/usr/bin/env -S npx ts-node
// this script can be run directly from CLI

// Terminal
import {terminal} from "terminal-kit";
import {TerminalKitPlugins} from "../src/types";

// Setup plugins
import {plugin} from "../src/index";
plugin(terminal);

// Prompt
const term = terminal as TerminalKitPlugins;

const callback = (item: any) => {
    console.log(item);
    term.processExit(0);
};

// Control item R
let show = false;

term.clear();
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
term.grabInput(true);
