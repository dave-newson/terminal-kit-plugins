'use strict';

const util = require('util');

const KEY_MAP = {
    UP: 'up',
    DOWN: 'down',
    ENTER: 'selected',
};

/**
 * Represents a single action
 *
 * @name Action
 * @class
 * @private
 */
class Action {

    /**
     * @param {string} label
     * @param {function} func
     * @param {function} conditionFunc
     */
    constructor(label, func, conditionFunc) {
        this._label = label;
        this._func = func;
        this._conditionFunc = conditionFunc;
    }

    /**
     * Check if this action is visible or not
     * @returns {boolean}
     */
    isVisible() {
        if (typeof this._conditionFunc === 'function') {
            return this._conditionFunc();
        }

        return true;
    }

    /**
     * Returns the label of the Action
     */
    toString() {
        return String(this._label);
    }

    /**
     * Execute the action function
     */
    call() {
        return this._func.call();
    }
}

/**
 * Creates a menu of available actions.
 *
 * @name ActionList
 * @class
 */
class ActionList {

    /**
     * @param {Terminal} terminal
     * @param {object} options
     */
    constructor(terminal, options) {
        this._terminal = terminal;
        this._actions = [];
        this._actionsVisible = [];
        this._selectedIndex = 0;
        this._promise = null;

        // Set default styles
        options.style = options.style || this._terminal.noFormat;
        options.selectedStyle = options.selectedStyle || options.style;

        // Overlay default settings
        this._options = Object.assign({
            x: null,
            y: null,
            width: null,
        }, options);

        // Events
        this._events = {
            onKeyPress: this._onKeyPress.bind(this),
        };
    }

    /**
     * Add an available action
     *
     * @param {string} label
     * @param {function} func
     * @param {void|function} conditionFunc
     * @return ActionList
     */
    add(label, func, conditionFunc = null) {
        this._actions.push(new Action(label, func, conditionFunc));
        return this;
    }

    /**
     * Set options for the menu (additive)
     *
     * @param {object} options
     * @return ActionList
     */
    options(options) {
        this._options = Object.assign({}, this._options, options);
        return this;
    }

    /**
     * Show the menu
     * Returns a promise. Resolves to the return value of the chosen action.
     *
     * @returns {Promise<*>}
     */
    show() {
        return new Promise((resolve, reject) => {

            // Bind events
            this._terminal.on('key', this._events.onKeyPress);

            // Draw UI
            this.redraw();

            this._promise = {
                resolve: resolve,
                reject: reject,
            };
        });
    }

    /**
     * Redraw the element
     */
    redraw() {

        // Move to position
        if (this._options.x !== null && this._options.y !== null) {
            this._terminal.moveTo(this._options.x, this._options.y);
        }

        // Reduce to only visible items
        this._actionsVisible = this._actions.filter((action) => {
            return action.isVisible();
        });

        // Cap selection position if it now exceeds the list size
        if (this._selectedIndex >= this._actionsVisible.length) {
            this._selectedIndex = (this._actionsVisible.length - 1);
        }

        // Get Width either from settings or from options
        let maxWidth = 0;
        if (this._options.width > 0) {
            maxWidth = this._options.width;
        } else {
            this._actions.forEach((action) => {
                const len = String(action).length;
                maxWidth = len > maxWidth ? len : maxWidth;
            });
        }

        // Render items
        let rows = 1;
        this._actionsVisible.forEach((item, index) => {
            rows++;

            // Determine style
            let style = this._options.style;
            if (index === this._selectedIndex) {
                style = this._options.selectedStyle;
            }

            // Render item
            const str = String(item).padEnd(maxWidth).slice(0, maxWidth);
            style(util.format(' %s \n', str));
        });

        // Clear out following rows
        for (; rows <= this._actions.length; rows++) {
            this._options.style( String('').padEnd(maxWidth + 2) );
            this._terminal.noFormat('\n');
        }
    }

    /**
     * Aborts the menu without making a selection.
     */
    abort() {
        // unbind events
        this._terminal.off('key', this._events.onKeyPress);
    }

    /**
     * Select the specified index
     * @param {number} index
     */
    select(index) {
        const action = this._actionsVisible[index];
        let result = action;

        // Call function on Action if given
        if (typeof action.call === 'function') {
            result = action.call();
        }

        // Resolve outcome
        this._promise.resolve(result);
    }

    /**
     * Handle key press
     * @param key
     * @private
     */
    _onKeyPress(key) {

        switch (KEY_MAP[key]) {
            case 'up':
                this._selectedIndex = Math.max(0, this._selectedIndex-1);
                this.redraw();
                break;
            case 'down':
                this._selectedIndex = Math.min(this._actionsVisible.length - 1, this._selectedIndex+1);
                this.redraw();
                break;
            case 'selected':
                this.select(this._selectedIndex);
                break;
        }
    }
}

/**
 * Export Element
 *
 * @type {MessageBox}
 */
exports.element = ActionList;
