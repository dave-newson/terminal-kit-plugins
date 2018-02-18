'use strict';

/**
 * @name Confirm
 * @class
 */
class Confirm {

    /**
     * @param {Terminal} terminal
     */
    constructor(terminal) {
        this._terminal = terminal;

        this._input = null;
    }

    /**
     * Make confirmation request
     *
     * @param {string} question
     * @param {object} options
     * @return {Promise<boolean>}
     */
    confirm(question, { style = null } = {}) {

        style = style || this._terminal.brightYellow;
        style(question);
        this._terminal.noFormat(' [').brightYellow('y').noFormat('|').brightYellow('n').noFormat(']');

        return new Promise((resolve, reject) => {

            // Get input
            this._input = this._terminal.yesOrNo({}, (err, response) => {

                // Ensure new line after entry
                this._terminal.noFormat('\n');

                if (err) return reject(err);

                return resolve(response);
            });
        });
    }

    /**
     * Abort the input request
     */
    abort() {
        if (this._input) this._input.abort();
    }

}

/**
 * Export Element
 *
 * @type {MessageBox}
 */
exports.element = Confirm;
