#!/usr/bin/env -S npx ts-node
// this script can be run directly from CLI

// Terminal
import {terminal} from "terminal-kit";
import {TerminalKitPlugins} from "../src/types";

// Setup plugins
import {plugin} from "../src/index";
plugin(terminal);

// Prompt
const term = (terminal as TerminalKitPlugins);

term.clear();
term.TextPrompt()
    .ask('How many kilograms of cheese would you like?', '50').then((weight) => {
        console.log('Cheese weight: ' + weight);
        terminal.processExit(0);
    });
