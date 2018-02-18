'use strict';

const Assert = require('assert');

/**
 * Element list
 *
 * @type {object}
 */
module.exports.elements = {
    ActionList: require('./lib/action-list').element,
    Confirm: require('./lib/confirm').element,
    DataTable: require('./lib/data-table').element,
    MessageBox: require('./lib/message-box').element,
    Message: require('./lib/message').element,
    TextPrompt: require('./lib/text-prompt').element,
};

/**
 * Plugin method for mounting elements onto TerminalKit
 * @param {Terminal} terminalKit
 * @param {object|null} elements
 */
module.exports.plugin = function (terminalKit, elements = null) {

    // Check options
    Assert.ok(
        elements === null || typeof elements === 'object',
        'argument "elements" (2) must be an object or null.'
    );

    // Mount everything if nothing specified
    if (elements === null) {
        elements = module.exports.elements;
    }

    // Mount factories on prototype
    const proto = Object.getPrototypeOf(terminalKit);
    Object.keys(elements).forEach((element) => {

        // Factory
        proto[element] = function (...options) {
            return new elements[element](this, ...options);
        };
    });

};
