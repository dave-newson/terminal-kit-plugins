'use strict';

const Util = require('util');
const EventEmitter = require('events').EventEmitter;

const EVENT_SELECTED = 'selected';

/**
 * Shows a header bar menu
 *
 * @name HeaderBar
 * @class
 */
class HeaderBar {

    constructor(
        term,
        { x = 1, y = 1, width = null, style = null, divider = '│', dividerStyle = null, padding = 4, get = null, getKey = null }
    ) {
        this._eventEmitter = new EventEmitter();
        this._terminal = term;
        this._onKeyEvent = this._onKey.bind(this);

        this._options = {
            x: x,
            y: y,
            width: width || this._terminal.width,
            style: style || this._terminal.noFormat,
            divider: divider,
            dividerStyle: dividerStyle || style,
            padding: padding,
            get: get,
            getKey: getKey,
        };

        this._items = [];

        this.focus();
    }

    abort() {
        this.blur();
    }

    /**
     * Focus the element
     * Causes it to accept key presses
     */
    focus() {
        // On key press
        this._terminal.on('key', this._onKeyEvent);
    }

    /**
     * Blur the element
     * Causes it to no longer hear key presses
     */
    blur() {
        this._terminal.off('key', this._onKeyEvent);
    }

    /**
     * Add an item to the list
     *
     * @param object
     */
    add(object) {
        this._items.push(object);
    }

    /**
     * Redraw the menu element
     */
    redraw() {

        const menuItems = [];

        // Get all items
        this._items.map((item) => {
            menuItems.push({
                label: this._getLabel(item),
                key: this._getKey(item),
            });
        });

        // Move to draw position
        this._terminal.moveTo(this._options.x, this._options.y);

        let lineLen = 0;

        // Draw each element
        menuItems.forEach((item, key) => {

            const str = Util.format(' [%s] %s ', item.key, item.label);
            lineLen += str.length;

            // Render label
            this._options.style(str);

            // Render divider
            this._options.dividerStyle(this._options.divider);
            lineLen += this._options.divider.length;
        });

        // Draw padding to line end, in the desired menu element style
        const fill = this._terminal.width - lineLen;
        this._options.style(String('').padEnd(fill, ' '));
    }

    /**
     * Ok key press, perform action
     *
     * @param {string} key
     * @private
     */
    _onKey(key) {

        // Find the mapped item
        const item = this._items.find((item) => {
            const itemKey = this._getKey(item);
            if (key === itemKey) {
                return item;
            }
        });

        // Do nothing if key not matched
        if (item === undefined) {
            return;
        }

        // Emit selection event
        this._eventEmitter.emit(EVENT_SELECTED, item);
    }

    /**
     * Get the key for the given item
     *
     * @param {object} item
     * @returns {string}
     * @private
     */
    _getKey(item) {
        if (typeof this._options.getKey === 'function') {
            // Function getter
            return this._options.getKey(item);
        } else if (typeof this._options.getKey === 'string') {
            // Named property getter
            return item[this._options.getKey];
        } else {
            // Unknown getter
            throw new Error('GetKey option ("getKey") was not set for Header Bar element.');
        }
    }

    /**
     * Get the label for the given item
     *
     * @param {object} item
     * @returns {string}
     * @private
     */
    _getLabel(item) {

        if (typeof this._options.get === 'function') {
            // Function getter
            return this._options.get(item);
        } else if (typeof this._options.get === 'string') {
            // Named property getter
            return item[this._options.get];
        } else if (typeof item._toString === 'function') {
            return String(item);
        } else {
            // Unknown getter
            throw new Error('Getter option ("get") was not set for Header Bar element.');
        }
    }

    /**
     * On event, perform action
     *
     * @param {string} event
     * @param {function} listener
     */
    on(event, listener) {
        this._eventEmitter.on(event, listener);
    }
};

/**
 * Export Element
 *
 * @type {MessageBox}
 */
exports.element = HeaderBar;
