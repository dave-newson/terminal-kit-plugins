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
