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

## Tools

 - ActionList
 - Confirm
 - DataTable
 - Message
 - MessageBox
 - TextPrompt
