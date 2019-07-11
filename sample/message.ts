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

// Standard message types
term.Message('Default message');

term.Message('Error message', 'error');

term.Message('Warning message', 'warning');

term.Message('Notice message', 'notice');

term.Message('Success message', 'success');

term.Message('Standard message', 'standard');

// Note: data does not incorporate its own new lines
term.noFormat('\n');
const msg = term.Message();
msg.show('ThisShouldAppearAs', 'data');
msg.show('OneSingleLine', 'data');
term.noFormat('\n');

// Custom message design
term.Message().addType('alias', {
    id: 'alias',
    prefix: '[TEST]',
    padding: 2,
    full_width: true,
    style: ['blink', 'brightRed', 'bgBlue'],
});

term.Message('Customised message', 'alias');
