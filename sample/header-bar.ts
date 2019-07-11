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

term.clear();
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
        term.processExit(0);
    })
    .redraw();

// Wait for input (header does not cause this)
term.grabInput(true);