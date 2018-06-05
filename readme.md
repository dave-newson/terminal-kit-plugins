# TerminalKit Plugins

[![Build Status](https://travis-ci.org/dave-newson/terminal-kit-plugins.svg?branch=master)](https://travis-ci.org/dave-newson/terminal-kit-plugins)

Useful additional tools for [TerminalKit](https://github.com/cronvel/terminal-kit).

## Installation

Install the NPM library:
```bash
npm install terminal-kit-plugins
```

Add the tools to TerminalKit using the plugin method:
```js
var term = require('terminal-kit').terminal;
require('terminal-kit-plugins').plugin(term);
```

## Examples

Examples are available in `/tests/sample` and can be executed on the CLI as a node script.

## Elements

### Message

Prints a simple styles messages to the terminal.

```js
term.Message("Oh no!", "error");
```

Ideal for styling all the CLI messages in your application the same way, depending on message type.

### MessageBox

Prints a positioned stylised message alert box on the terminal.

```js
term.MessageBox({
    message: "Alert!",
    style: term.brightYellow.bgRed, 
    x: 'middle',
    y: 'middle',
    xPadding: 2,
    yPadding: 1,
    border: 1, // Border style
})
.show();
```

Nice for CLI GUI-esq notices.

### Confirm

Basic yes/no confirm prompt using promises

```js
const likesCheese = await term.Confirm().confirm("Do you like cheese?");
```

### Text Prompt

Basic input text prompt using promises

```js
const cheeseKg = await term.TextPrompt().ask("How many kilograms of cheese would you like?", "50");
```

### Header Bar

Stylised header menu which can receive button presses and execute actions.

```js
const bar = term.HeaderBar({
    x: 0,
    y:0,
    width: null, // full width
    style: term.bgBrightYellow.black,
    divider: "|",
    dividerStyle: term.bgBrightYellow.brightRed,
    padding: 4,
    get: "label",
    getKey: "key",
})
    .add({ label: "Alpha", key: "F1", action: () => { console.log('A'); } })
    .add({ label: "Bravo", key: "F2", action: () => { console.log('B'); } })
    .on('selected', (item) => {
        item.action();
    })
    .redraw();
```

Handy as a shortcut menu throughout your application.

### Action List

List of actions which accepts keyboard navigation input

```js
term.ActionList({
    x: 0,
    y: 2,
    width: 40,
    style: term.brightYellow.bgBlack,
    selectedStyle: term.black.bgBrightYellow,
})
    .add("Alpha", () => { console.log('A') })
    .add("Bravo", () => { console.log('B') })
    .add("Randomly show", () => {}, () => { return (Math.random() > 0.5); })
    .show();
```

Simple way to scroll through some action options.

### Data Table

Displays a table of data which can contain more items than the current screen height supports.
Provides type-to-search, scrolling, and extensive style options. 

```js
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
            width: 10,
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
});
```

Good for extensive or unbound lists which you might want to search.

