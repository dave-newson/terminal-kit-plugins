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
term.Confirm().confirm('Do you like cheese?').then((answer) => {
    console.log('Answer: ' + (answer ? 'Yes' : 'No'));
    term.processExit(0);
});
