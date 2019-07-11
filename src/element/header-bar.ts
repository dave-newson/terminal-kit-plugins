import * as Util from 'util';
import {EventEmitter} from 'events';
import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function HeaderBarFactory(terminal: Terminal, options: HeaderBarOptions) {
    return new HeaderBar(terminal, options);
}

export interface HeaderBarOptions {
    x?: number;
    y?: number;
    width: null|number;
    style?: Terminal;
    divider?: string;
    dividerStyle?: Terminal;
    padding?: number;
    get: string|((object: any) => string);
    getKey: string|((object: HeaderBarItem) => string);
}

export class HeaderBarEvents {
    public static readonly SELECTED = 'selected';
}

/**
 * Item on the header bar
 */
export interface HeaderBarItem {
    label: string;
    key: string;
}

/**
 * Shows a header bar menu
 */
export class HeaderBar {

    private _eventEmitter: EventEmitter;
    private _terminal: Terminal;
    private _onKeyEvent: (key: string) => void;
    private _items: HeaderBarItem[];
    private _options: HeaderBarOptions;

    constructor(
        term: Terminal,
        options: HeaderBarOptions
    ) {
        this._eventEmitter = new EventEmitter();
        this._terminal = term;
        this._onKeyEvent = this._onKey.bind(this);
        this._items = [];

        // Set defaults
        options.x = options.x || 0;
        options.y = options.y || 0;
        options.width = options.width || this._terminal.width;
        options.style = options.style || this._terminal.noFormat;
        options.divider = options.divider || '|';
        options.padding = options.padding || 1;
        options.dividerStyle = options.dividerStyle || options.style;

        this._options = options;

        this.focus();
    }

    public abort(): void {
        this.blur();
    }

    /**
     * Focus the element
     * Causes it to accept key presses
     */
    public focus(): void {
        // On key press
        this._terminal.on('key', this._onKeyEvent);
    }

    /**
     * Blur the element
     * Causes it to no longer hear key presses
     */
    public blur(): void {
        this._terminal.off('key', this._onKeyEvent);
    }

    /**
     * Add an item to the list
     */
    public add(object: any): this {
        this._items.push(object);
        return this;
    }

    /**
     * Redraw the menu element
     */
    public redraw(): void {

        const menuItems: HeaderBarItem[] = [];

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

        // Styles
        const style = this._options.style || this._terminal.noFormat;
        const dividerStyle = this._options.dividerStyle || style;

        // Draw each element
        menuItems.forEach((item) => {

            const str = Util.format(' [%s] %s ', item.key, item.label);
            lineLen += str.length;

            // Render label
            style(str);

            // Render divider
            dividerStyle(this._options.divider);
            lineLen += String(this._options.divider).length;
        });

        // Draw padding to line end, in the desired menu element style
        const fill = this._terminal.width - lineLen;
        style(String('').padEnd(fill, ' '));
    }

    /**
     * On event, perform action
     */
    public on(event: string, listener: (mixed?: any) => void): this {
        this._eventEmitter.on(event, listener);
        return this;
    }

    /**
     * Ok key press, perform action
     */
    private _onKey(key: string): void {

        // Find the mapped item
        const found = this._items.find((item) => {
            const itemKey = this._getKey(item);
            if (key === itemKey) {
                return item;
            }
        });

        // Do nothing if key not matched
        if (found === undefined) {
            return;
        }

        // Emit selection event
        this._eventEmitter.emit(HeaderBarEvents.SELECTED, found);
    }

    /**
     * Get the key for the given item
     */
    private _getKey(item: any): string {
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
     */
    private _getLabel(item: any): string {

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
}
