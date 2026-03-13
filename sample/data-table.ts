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
const table = term.DataTable({
    x: 0,
    y: 5,
    // width: undefined = Full width
    height: 10,
    style: term.brightWhite.bgBlack,
    selectedStyle: term.bgBrightWhite.black,
    headingStyle: term.brightCyan.bgBlack,
    scrollPadding: 3, // Page starts scrolling when cursor gets this close to the edge
    padding: 1,       // Padding between cells
    filterTextSize: 16,
    columns: [
        {
            heading: 'Name',
            get: 'name',
            width: 20,
        },
        {
            heading: 'Status',
            get: (item) => (item.online ? "Online" : "Offline"),
            width: 20,
            style: (item) => (item.online ? term.brightGreen : term.brightRed),
        },
    ]
});

table.setData([
    { name: "Primary service", online: false },
    { name: "Backup system", online: true },
    { name: "Something else", online: true },
]);

table.promise.then((item) => {
    console.log("Selected: " + item.name);
    term.processExit(0);
});
