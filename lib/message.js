'use strict';

const util = require('util');

// Specific type constants
const types = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success',
    STANDARD: 'standard',
    DATA: 'data',
};
module.exports.types = Object.freeze(types);

/**
 * Fallback style
 */
const defaultStyle = {
    prefix: false,
    padding: -1,
    full_width: false,
    style: ['defaultColor', 'bgDefaultColor'],
};

/**
 * Style definitions for messages
 */
const styles = {
    default: defaultStyle,
    success:    {
        padding: 1,
        full_width: true,
        prefix: '[OK]',
        style: ['black', 'bgBrightGreen'],
    },
    error:      {
        padding: 1,
        full_width: true,
        prefix: '[ERROR]',
        style: ['brightWhite', 'bgBrightRed', 'blink'],
    },
    warning:    {
        padding: 1,
        full_width: true,
        prefix: '[WARNING]',
        style: ['brightWhite', 'bgRed'],
    },
    notice:     {
        padding: 1,
        full_width: true,
        prefix: '[NOTICE]',
        style: ['black', 'bgBrightYellow'],
    },
    data:       {
        padding: -1,
        full_width: true,
        prefix: false,
        style: ['defaultColor', 'bgDefaultColor'],
    },
};
module.exports.types = styles;

/**
 * Provides a style-based message system
 * You can add or override styles using addType().
 */
class Message
{

    /**
     * Add or replace a type style
     *
     * @param {string} alias
     * @param {object} style
     */
    addType(alias, style) {
        styles[alias] = style;
    }

    /**
     * Set up dependencies for the message
     * Optionally supply the message and messageType immediately, negating the need to call show() manually.
     * messageType may be a string message alias, or an object with message options/
     *
     * @param {Terminal} terminal
     * @param {null|string} message
     * @param {null|string|object} messageType
     */
    constructor(terminal, message = null, messageType = types.STANDARD) {
        this._terminal = terminal;

        if (message !== null) {
            this.show(message, messageType);
        }
    }

    /**
     * Shows the given 'text' string, formatted as the given 'messageType'.
     *
     * @param {string} message
     * @param {string} type
     */
    show(message, type = types.STANDARD)
    {
        const options = this._resolveType(type);
        this._format(message, options);
    }

    /**
     * Resolve the type of alert by string name to a constant name
     *
     * @param {string|object} options
     * @return {object}
     * @private
     */
    _resolveType(options) {

        // If string options, load the given style from cache
        if (typeof options === 'string') {
            options = String(options).toLowerCase();
            if (styles.hasOwnProperty(options)) {
                options = styles[options];
            }
        }

        // Lay the options over the top of the Default styles
        options = Object.assign({}, defaultStyle, options);

        return options;
    }

    /**
     * Displays the message
     *
     * @param {string} message
     * @param {object} options
     *
     * @private
     */
    _format(message, options) {

        // Run "style" array through the Terminal to jig the styles.
        let style = this._terminal;
        options.style.forEach((name) => {
            style = style[name];
        });

        // Determine prefix on the message
        if (options.prefix) {
            message = util.format(' %s %s', options.prefix, message);
        }

        if (options.padding >= 0) {

            // Determine vertical padding
            message =
                (String('').padEnd(options.padding, '\n')) +
                message +
                (String('').padEnd(options.padding, '\n'));

            // Horizontal padding
            message = message
                .split('\n')
                .map((line) => line.padEnd(this._terminal.width, ' '))
                .join('\n');

            // Start/End padding
            message = '\n' + message;
        }

        // Display
        style(message);

        // Write the final \n as default colours
        // This helps to reset the terminal and not bleed the styles into the next line.
        if (options.padding >= 0) {
            this._terminal.defaultColor.bgDefaultColor('\n');
        }
    }

}

module.exports.element = Message;
