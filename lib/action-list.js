'use strict';

/**
 * @name Action
 * @class
 * @private
 */
class Action {

    /**
     * @param {string} label
     * @param {function} func
     */
    constructor(label, func) {
        this._label = label;
        this._func = func;
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
     *
     * @param {Terminal} terminal
     */
    constructor(terminal) {
        this._terminal = terminal;
        this._options = {};
        this._actions = [];
        this._controller = null;
    }

    /**
     * Add an available action
     *
     * @param {string} label
     * @param {function} func
     */
    add(label, func) {
        this._actions.push(new Action(label, func));
    }

    /**
     * Set options for the menu (additive)
     *
     * @param {object} options
     */
    options(options) {
        this._options = Object.assign({}, this._options, options);
    }

    /**
     * Show the menu
     * Returns a promise. Resolves to the return value of the chosen action.
     *
     * @returns {Promise<*>}
     */
    show() {

        return new Promise((resolve, reject) => {

            // Start menu, keep track of the controller
            this._controller = this._terminal.singleColumnMenu(this._actions, this._options, (err, response) => {

                // Reject on error
                if (err) {
                    return reject(err);
                }

                // Call the chosen action
                resolve(this._actions[response.selectedIndex].call());
            });
        });

    }

    /**
     * Aborts the menu without making a selection.
     */
    abort() {
        this._controller.abort();
    }

}

/**
 * Export Element
 *
 * @type {MessageBox}
 */
exports.element = ActionList;
