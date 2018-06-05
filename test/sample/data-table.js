'use strict';

const term = require('terminal-kit').terminal;
require('../../index.js').plugin(term);

term.clear();

const table = term.DataTable({
    x: 0,
    y: 5,
    width: null, // Full width
    height: 5, // 5 items high
    style: term.brightWhite.bgBlack,
    selectedStyle: term.bgBrightWhite.black,
    scrollPadding: 3, // Page starts scrolling when cursor gets those close to the edge
    padding: 1, // Padding between cells
    filterTextSize: 16, // Size of type-to-search filter
    columns: [
        {
            get: 'name',
            width: 20,
        },
        {
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
    term.processExit();
});
