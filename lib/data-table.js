'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * Default key bindings for Keyboard control
 */
const defaultKeyBindings = {
    ENTER: 'submit',
    KP_ENTER: 'submit',
    UP: 'previousRow',
    DOWN: 'nextRow',
    LEFT: 'previousCol',
    RIGHT: 'nextCol',
    TAB: 'nextRow',
    SHIFT_TAB: 'previousRow',
    HOME: 'firstRow',
    END: 'lastRow',
    BACKSPACE: 'deleteLetter',
    ESCAPE: 'cancel',
};

/**
 * Configuration things that don't change
 *
 */
class TableConfig {

    /**
     * @param {*} options
     * @param {Terminal} terminal
     * @constructor
     */
    constructor (options, terminal) {

        // Key bindings
        this.keyBindings = options.keyBindings || defaultKeyBindings;

        // Remove Abort capability if not set
        if (!options.allowCancel) {
            delete this.keyBindings.ESCAPE;
        }

        this.x = options.x || 0;
        this.y = options.y || 0;

        // Styles
        this.style = {};
        this.style.default = options.style || terminal.bgBlack.brightWhite;
        this.style.selected = options.selectedStyle || terminal.bgBrightYellow.black;

        // Scroll Padding (how many lines before the edge to start scrolling)
        this.scrollPadding = options.scrollPadding || 3;

        // Column Cell padding
        this.padding = options.padding || 1;

        // Columns
        this.columns = options.columns || [];
        this.columns.forEach((col) => {
            if (typeof col.get === 'string') {
                let getStr = col.get;
                col.get = function (item) {
                    return item[getStr];
                };
            } else if (typeof col.get !== 'function') {
                throw Error('Columns must define a "get" property.');
            }
        });

        // Width of text input
        this.filterTextSize = 16;
    }
}

/**
 * Represents a single item in the table
 */
class RowItem {

    /**
     * @param {number} index
     * @param {object} data
     * @constructor
     */
    constructor(index, data) {
        this.cells = data;
        this.visible = true;
        this.index = index;
    }
}

/**
 * @name TableState
 * @class
 */
class TableState extends EventEmitter {

    /**
     * State container for the Widget
     *
     * @param {TableConfig} config
     * @param {*} options
     * @constructor
     */
    constructor(config, options) {
        super();

        this.config = config;
        this.data = [];
        this.selectedIndex = undefined;
        this.paused = !!options.paused;
        this._filter = '';
        this._selected = undefined;

        // Set display area
        this.displayArea = {
            x: options.x || 1,
            y: options.y || 1,
            width: options.width,
            height: options.height,
            xScroll: 0,
            yScroll: 0,
        };

        // Set data
        options.data = options.data || [];
        this.items = options.data;
    }

    /**
     * Return the filtered items
     */
    getFilteredItems() {
        return this.items.filter((item) => item.visible);
    }

    /**
     * Re-filter the data items by setting visibility flags
     */
    refilter() {
        this.items.forEach((item) => {
            let visible = false;

            // Check for text in cells
            this.config.columns.forEach((column) => {
                if (String(column.get(item.cells)).indexOf(this.filter) > -1) {
                    visible = true;
                }
            });

            // Apply item state
            item.visible = visible;
        });
    }

    /**
     * Items data
     * @return {Array<object>}
     */
    get items() {
        return this.data;
    }

    /**
     * Set items in table
     * @param {Array<object>} items
     */
    set items(items) {
        this.data = [];

        let i = 0;
        items.forEach((item) => {
            this.data.push(new RowItem(i, item));
            i++;
        });

        this.refilter();

        this.emit('change');
    }

    /**
     * Get filter text
     * @return {string}
     */
    get filter() {
        return String(this._filter);
    }

    /**
     * Set the filter text
     * @param {string} text
     */
    set filter(text) {
        this._filter = String(text).slice(0, this.config.filterTextSize);

        this.refilter();

        this.emit('change');
    }

    /**
     * Selected, as index
     * @return {number}
     */
    get selectedIndex() {
        return this._selected;
    }

    /**
     * Set the selected index in the table
     * @param {number} index
     */
    set selectedIndex(index) {

        if (this.data[index] === undefined) {
            index = undefined;
        }

        this._selected = index;

        this.emit('change');
    }

    /**
     * Selected, as object
     * @return {object|null}
     */
    get selected() {

        if (this._selected !== undefined) {
            return this.data[this._selected];
        }

        return null;
    }

    /**
     * Set the selected item using an Object.
     * Object is seeked in the data set, and then the index is used.
     * If the object does not exist, nothing happens.
     *
     * @param {object|null} item
     */
    set selected(item) {

        // If out-of-range selection
        if (item === undefined) {

            // If last selection is no longer visible, unset it
            if (this._selected && this.data[this._selected].visible === false) {
                this.selectedIndex = undefined;
            }
        } else {
            this.selectedIndex = item.index;
        }
    }
}

/**
 * Provides a table of the given tableData, which can be:
 *  - Browsed (up/down)
 *  - Filtered; by typing
 * - "Submitted"; chosen option is resolved in the table's Promise
 */
class DataTable extends EventEmitter {

    /**
     * @param {Terminal} terminal
     * @param {object} options
     * @constructor
     */
    constructor(terminal, options) {
        super();
        this._term = terminal;

        this._config = new TableConfig(options, this._term);
        this._state = new TableState(this._config, options);

        this._events = {
            onKeyPress: this.onKeyPress.bind(this),
            redraw: this.redraw.bind(this),
        };

        // Attach Events
        this._state.on('change', this._events.redraw);
        this._term.on('key', this._events.onKeyPress);

        // Grab the input state
        if (!this.grabbing) {
            this._term.grabInput();
        }

        this.promise = new Promise((resolve, reject) => {

            this._state.resolve = resolve;
            this._state.reject = reject;

            // Immediate draw if data provided on construct
            // Otherwise redraw will not happen until the first setData call.
            if (this._state.data.length) {
                this.redraw();
            }

            // Dispatch: Ready!
            this.emit('ready');

        });
    }

    /**
     * Move to the specified index
     *
     * @param {object} item
     */
    setSelected(item) {
        this._state.selected = item;
    }

    /**
     * When isSubmit is false, it sends a Cancel signal (undefined selection)
     *
     * @param {boolean} isSubmit
     */
    submit(isSubmit) {
        const data = (isSubmit) ? this._state.selected.cells : null;

        this._destroy();

        // Execute resolve
        this._state.resolve(data);
    }

    /**
     * Handle key presses
     *
     * @param {string} key
     */
    onKeyPress(key) {

        // When paused (no focus), do nothing.
        if (this._state.paused) {
            return;
        }

        const items = this._state.getFilteredItems();
        const selectedItemIndex = items.findIndex((item) => (item.index === this._state.selectedIndex));

        switch (this._config.keyBindings[key]) {
            case 'submit':
                this.submit(true);
                break;
            case 'previousRow':
                this.setSelected(items[selectedItemIndex - 1]);
                break;
            case 'nextRow':
                this.setSelected(items[selectedItemIndex + 1]);
                break;
            case 'firstRow':
                this.setSelected(items[0]);
                break;
            case 'nextCol':
                break;
            case 'previousCol':
                break;
            case 'lastRow':
                this.setSelected(items[items.length - 1]);
                break;
            case 'cancel':
                this.submit(false);
                break;
            case 'deleteLetter':
                this._state.filter = this._state.filter.slice(0, -1);
                break;
            default:
                if (key.length === 1) {
                    this._state.filter += key;
                }

                break;
        }
    }

    /**
     * Redraw the current display area
     */
    redraw() {

        if (this._config.y !== undefined) {
            this._term.moveTo(1, this._config.y);
        }

        // Rows token up by the filter
        const filterHeight = 2;

        // Calculate the number of visible items
        const filteredItems = this._state.getFilteredItems();

        // If the selection is no longer visible, make a new selection
        if (
            filteredItems.length &&
            filteredItems.filter((item) => (item.index === this._state.selectedIndex)).length === 0
        ) {
            this._state.selectedIndex = filteredItems[0].index;
        }

        // Default height
        let height = this._state.displayArea.height - filterHeight;

        // More items than height?
        // Give room for the "... more ..." notice
        if (filteredItems.length > height) {
            height -= 2;
        }

        // Ensure selected index is within visible yScroll
        let pos = 0;
        filteredItems.forEach((item) => {

            if (item.index === this._state.selectedIndex) {

                // Before bounds? Relocate yscroll
                if (pos < this._state.displayArea.yScroll) {
                    this._state.displayArea.yScroll = pos;
                }

                // Past bounds? Relocate yscroll
                if (pos >= this._state.displayArea.yScroll + height) {
                    this._state.displayArea.yScroll = 1 + (pos - height);
                }
            }

            pos++;
        });

        // Slice to max number of items visible
        const visibleItems = filteredItems.slice(
            this._state.displayArea.yScroll,
            this._state.displayArea.yScroll + height
        );

        // Display code
        let cursorPos = this._state.displayArea.y;

        // Move to Filter position
        this._term.moveTo(this._state.displayArea.x, cursorPos);

        // Filter text
        let filterText = ' Filter: [' + this._state.filter.padEnd(this._config.filterTextSize, ' ') + ']';
        this._config.style.default(filterText);

        // Move cursor to Table start position
        cursorPos += filterHeight;
        this._term.moveTo(this._state.displayArea.x, cursorPos++);
        if (this._state.displayArea.yScroll > 0) {
            this._config.style.default(
                String(
                    ' [ ' +
                    this._state.displayArea.yScroll +
                    ' more items ... ] '
                )
                .padEnd(this._state.displayArea.width)
            );
        } else {
            this._config.style.default(String().padEnd(this._state.displayArea.width, ' '));
        }

        // Cycle for X rows until height
        let row = 0;
        visibleItems.forEach((item) => {
            row++;

            // Move cursor to start of row
            this._term.moveTo(this._state.displayArea.x, cursorPos++);

            // For each column ...
            this._config.columns.forEach((column) => {

                // Column style
                let output = this._config.style.default;

                if (this._state.selectedIndex === item.index) {
                    // Selected style
                    output = this._config.style.selected;
                } else if (typeof column.style === 'function') {
                    output = column.style(item.cells);
                }

                // Text fixed width
                const text = String(column.get(item.cells))
                    .slice(0, column.width)
                    .padEnd(column.width + this._config.padding, ' ')
                    .padStart(column.width + (this._config.padding * 2), ' ');

                // Display this column
                output(text);
            });
        });

        // Fill in missing rows with empty
        for (; row < height; row++) {

            this._term.moveTo(this._state.displayArea.x, cursorPos++);

            this._config.style.default(String().padEnd(this._state.displayArea.width, ' '));
        }

        // X More?
        this._term.moveTo(this._state.displayArea.x, cursorPos++);

        let offScreen = filteredItems.length - height - this._state.displayArea.yScroll;
        if (offScreen > 0) {
            this._config.style.default(' [ ' + offScreen + ' more items ... ] '.padEnd(this._state.displayArea.width));
        } else {
            this._config.style.default(String().padEnd(this._state.displayArea.width, ' '));
        }

        // Number of items (aligned right, bottom)
        const itemCountMsg = '[ ' + filteredItems.length + ' Items ] ';
        this._term.moveTo(this._state.displayArea.x + this._state.displayArea.width - itemCountMsg.length, cursorPos);
        this._config.style.default(itemCountMsg);

        // Reset cursor
        this._term.moveTo(0, 0);
    }

    /**
     * Destroy the element int
     * @private
     */
    _destroy() {
        this._term.off('key', this._events.onKeyPress);
    }

    /**
     * Cancel selection, disable the element
     */
    abort() {
        this._state.paused = true;
        this._destroy();
    }

    /**
     * Pause this element, suspending input
     */
    pause() {
        this._state.paused = true;
    }

    /**
     * Resume this element
     */
    resume() {
        this._state.paused = false;
    }

    /**
     * Give focus to this element
     *
     * @param {boolean} giveFocus
     */
    focus(giveFocus = true) {
        if (giveFocus) {
            this.resume();
        } else {
            this.pause();
        }
    }

    /**
     * Set the data array for this table
     * The data structure within the array should match the table options.
     *
     * @param {Array<{object}>} data
     */
    setData(data) {
        this._state.items = data;
    }
}

/**
 * Export Element
 *
 * @type {MessageBox}
 */
exports.element = DataTable;
