"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = void 0;
exports.DataTableFactory = DataTableFactory;
const events_1 = require("events");
function DataTableFactory(terminal, options) {
    return new DataTable(terminal, options);
}
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
function getColumn(getMethod, targetItem) {
    let getter;
    if (typeof getMethod === 'string') {
        getter = (item) => item[String(getMethod)];
    }
    else {
        getter = getMethod;
    }
    return getter(targetItem);
}
class TableConfig {
    constructor(terminal, options) {
        options.width = options.width || terminal.width;
        options.height = options.height || terminal.height;
        this.keyBindings = options.keyBindings || defaultKeyBindings;
        if (!options.allowCancel) {
            delete this.keyBindings.ESCAPE;
        }
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.style = {
            default: options.style || terminal.bgBlack.brightWhite,
            selected: options.selectedStyle || terminal.bgBrightYellow.black,
            heading: options.headingStyle || options.style || terminal.bgBlack.brightWhite,
        };
        this.scrollPadding = options.scrollPadding || 3;
        this.padding = options.padding || 1;
        this.columns = options.columns || [];
        this.columns.forEach((col) => {
            if (typeof col.get === 'string') {
                const getStr = col.get;
                col.get = (item) => {
                    return item[getStr];
                };
            }
            else if (typeof col.get !== 'function') {
                throw Error('Columns must define a "get" property.');
            }
        });
        this.filterTextSize = options.filterTextSize || 16;
    }
}
class RowItem {
    constructor(index, data) {
        this.cells = data;
        this.visible = true;
        this.index = index;
    }
}
class TableState extends events_1.EventEmitter {
    get items() {
        return this.data;
    }
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
    get filter() {
        return String(this._filter);
    }
    set filter(text) {
        this._filter = String(text).slice(0, this.config.filterTextSize);
        this.refilter();
        this.emit('change');
    }
    get selectedIndex() {
        return this._selected;
    }
    set selectedIndex(index) {
        if (index !== undefined && this.data[index] === undefined) {
            index = undefined;
        }
        this._selected = index;
        this.emit('change');
    }
    get selected() {
        if (this._selected !== undefined) {
            return this.data[this._selected];
        }
        return null;
    }
    set selected(item) {
        if (item === undefined) {
            if (this._selected && this.data[this._selected].visible === false) {
                this.selectedIndex = undefined;
            }
        }
        else {
            this.selectedIndex = item.index;
        }
    }
    constructor(config, options) {
        super();
        this.paused = false;
        this.displayArea = {
            x: 1,
            y: 1,
            width: 0,
            height: 0,
            xScroll: 0,
            yScroll: 0,
        };
        this._filter = '';
        this.config = config;
        this.paused = options.paused || false;
        this.displayArea.x = options.x || 1;
        this.displayArea.y = options.y || 1;
        this.displayArea.width = options.width || 0;
        this.displayArea.height = options.height || 0;
        this.data = options.data || [];
    }
    getFilteredItems() {
        return this.items.filter((item) => item.visible);
    }
    refilter() {
        const filterUpper = this.filter.toUpperCase();
        this.items.forEach((item) => {
            const found = this.config.columns.find((column) => {
                if (typeof this.config.filter === 'function') {
                    return this.config.filter(this.filter, item);
                }
                else {
                    return String(getColumn(column.get, item.cells))
                        .toUpperCase()
                        .indexOf(filterUpper) > -1;
                }
            });
            item.visible = (found !== undefined);
        });
    }
}
class DataTable extends events_1.EventEmitter {
    constructor(terminal, options) {
        super();
        this.grabbing = false;
        this._term = terminal;
        this._config = new TableConfig(this._term, options);
        this._state = new TableState(this._config, options);
        this.setData(options.data || []);
        this._events = {
            onKeyPress: this.onKeyPress.bind(this),
            redraw: this.redraw.bind(this),
        };
        this._state.on('change', this._events.redraw);
        this._term.on('key', this._events.onKeyPress);
        if (!this.grabbing) {
            this._term.grabInput(true);
        }
        this.promise = new Promise((resolve, reject) => {
            this._state.resolve = resolve;
            this._state.reject = reject;
            if (this._state.data.length) {
                this.redraw();
            }
            this.emit('ready');
        });
    }
    setSelected(item) {
        this._state.selected = item;
    }
    submit(isSubmit) {
        const data = (isSubmit) ? this._state.selected.cells : null;
        this._destroy();
        if (this._state.resolve) {
            this._state.resolve(data);
        }
    }
    onKeyPress(key) {
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
                    this._state.filter += key.toLowerCase();
                }
                break;
        }
    }
    redraw() {
        if (this._config.y !== undefined) {
            this._term.moveTo(1, this._config.y);
        }
        const hasHeaders = this._config.columns.some((col) => col.heading);
        const headerHeight = hasHeaders ? 1 : 0;
        const bottomBarHeight = 1;
        const dataHeight = this._state.displayArea.height - headerHeight - bottomBarHeight;
        const filteredItems = this._state.getFilteredItems();
        if (filteredItems.length &&
            filteredItems.filter((item) => (item.index === this._state.selectedIndex)).length === 0) {
            this._state.selectedIndex = filteredItems[0].index;
        }
        let pos = 0;
        filteredItems.forEach((item) => {
            if (item.index === this._state.selectedIndex) {
                if (pos < this._state.displayArea.yScroll) {
                    this._state.displayArea.yScroll = pos;
                }
                if (pos >= this._state.displayArea.yScroll + dataHeight) {
                    this._state.displayArea.yScroll = 1 + (pos - dataHeight);
                }
            }
            pos++;
        });
        const visibleItems = filteredItems.slice(this._state.displayArea.yScroll, this._state.displayArea.yScroll + dataHeight);
        let cursorPos = this._state.displayArea.y;
        if (hasHeaders) {
            this._term.moveTo(this._state.displayArea.x, cursorPos++);
            this._config.columns.forEach((column) => {
                const heading = (column.heading || '').slice(0, column.width);
                const text = heading
                    .padEnd(column.width + this._config.padding, ' ')
                    .padStart(column.width + (this._config.padding * 2), ' ');
                this._config.style.heading(text);
            });
        }
        let row = 0;
        visibleItems.forEach((item) => {
            row++;
            this._term.moveTo(this._state.displayArea.x, cursorPos++);
            this._config.columns.forEach((column) => {
                let output = this._config.style.default;
                if (this._state.selectedIndex === item.index) {
                    output = this._config.style.selected;
                }
                else if (typeof column.style === 'function') {
                    output = column.style(item.cells);
                }
                const text = String(getColumn(column.get, item.cells))
                    .slice(0, column.width)
                    .padEnd(column.width + this._config.padding, ' ')
                    .padStart(column.width + (this._config.padding * 2), ' ');
                output(text);
            });
        });
        for (; row < dataHeight; row++) {
            this._term.moveTo(this._state.displayArea.x, cursorPos++);
            this._config.style.default(String().padEnd(this._state.displayArea.width, ' '));
        }
        this._term.moveTo(this._state.displayArea.x, cursorPos);
        const filterText = ' Filter: [' + this._state.filter.padEnd(this._config.filterTextSize, ' ') + '] ';
        const itemCountMsg = ' [ ' + filteredItems.length + ' Items ] ';
        const gapWidth = this._state.displayArea.width - filterText.length - itemCountMsg.length;
        this._config.style.default(filterText + ' '.repeat(Math.max(0, gapWidth)) + itemCountMsg);
        this._term.moveTo(0, 0);
    }
    abort() {
        this._state.paused = true;
        this._destroy();
    }
    pause() {
        this._state.paused = true;
    }
    resume() {
        this._state.paused = false;
    }
    focus(giveFocus = true) {
        if (giveFocus) {
            this.resume();
        }
        else {
            this.pause();
        }
    }
    setData(data) {
        this._state.items = data;
    }
    _destroy() {
        this._term.off('key', this._events.onKeyPress);
        this._state.off('change', this._events.redraw);
    }
}
exports.DataTable = DataTable;
