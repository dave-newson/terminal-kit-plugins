'use strict';

/**
 * Shows a text prompt requiring user input
 *
 * @name TextPrompt
 * @class
 */
class TextPrompt {

    /**
     * Dependency injection
     *
     * @param {Terminal} terminal
     */
    constructor(terminal) {
        this._terminal = terminal;
        this._options = {};
    }

    /**
     * Set options for the text prompt
     *
     * @param {object} options
     */
    options(options) {
        this._options = Object.assign({}, this._options, options);
    }

    /**
     * Show the prompt
     *
     * @param {string} question
     * @param {string} defaultValue
     * @return {Promise<string>}
     */
    ask(question, defaultValue = null) {

        // Default value, if available
        if (this.defaultValue !== null) {
            this._options.default = defaultValue;
        }

        // Prompt
        this._terminal.brightYellow(question);
        this._terminal.brightRed(':');
        this._terminal.white(' ');

        // Await input
        return new Promise((resolve, reject) => {
            this._terminal.inputField(this._options, (err, response) => {
                // Ensure new line after entry
                this._terminal.noFormat('\n');

                // Handle outcome
                return (err) ? reject(err) : resolve(response);
            });
        });
    }
}

/**
 * Export Element
 *
 * @type {TextPrompt}
 */
exports.element = TextPrompt;
