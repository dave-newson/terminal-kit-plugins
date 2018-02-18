'use strict';

// Specific type constants
const types = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success',
    STANDARD: 'standard',
    DATA: 'data',
    PROGRESS: 'progress',
};
module.exports.types = Object.freeze(types);

// String-aliases for types
const alias = {
    err: types.ERROR,
    ok: types.SUCCESS,
    warn: types.WARNING,
    alert: types.WARNING,
    danger: types.WARNING,
    message: types.STANDARD,
    step: types.PROGRESS,
};

class Message
{

    /**
     * @param {Terminal} terminal
     */
    constructor(terminal) {
        this._terminal = terminal;
    }

    /**
     * Shows the given "text" string, formatted as the given "messageType".
     *
     * @param {string} message
     * @param {string} messageType
     */
    show(message, messageType = types.STANDARD)
    {
        messageType = this._resolveType(messageType);
        this._format(message, messageType);
    }

    /**
     * Resolve the type of alert by string name to a constant name
     *
     * @param {string} name
     * @return {string}
     * @private
     */
    _resolveType(name) {

        // Lowercase cast name
        name = String(name).toLowerCase();

        // Use alias if alias exists
        if (alias[name]) {
            name = alias[name];
        }

        // Use standard if type does not exist
        if (!name) {
            name = types.STANDARD;
        }

        return name;
    }

    /**
     * Displays the message
     *
     * @param {string} message
     * @param {string} messageType
     *
     * @private
     */
    _format(message, messageType) {

        let style = this._terminal.noFormat;

        // Determine style
        switch (messageType) {
            case types.ERROR:
                style = this._terminal.bgBrightRed.brightWhite.blink;
                break;
            case types.WARNING:
                style = this._terminal.bgBrightRed.black;
                break;
            case types.SUCCESS:
                style = this._terminal.bgBrightGreen.black;
                break;
            case types.DATA:
                style = this._terminal.bgBlack.brightWhite;
                break;
            case types.PROGRESS:
                style = this._terminal.bgBlack.brightGreen;
                break;
            default:
            case types.STANDARD:
                style = this._terminal.bgBlack.white;
                break;
        }

        // Display message
        style(message);
    }

}

module.exports.element = Message;
