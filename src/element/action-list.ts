import * as util from 'util';
import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function ActionListFactory(terminal: Terminal, options: ActionListOptions) {
    return new ActionList(terminal, options);
}

const KEY_MAP: { [key: string]: string } = {
    UP: 'up',
    DOWN: 'down',
    ENTER: 'selected',
};

/**
 * Represents a single action
 */
class Action {

    private _label: string;
    private _func: (() => void);
    private _conditionFunc: null|(() => boolean);

    constructor(label: string, func: (() => void), conditionFunc: null|(() => boolean)) {
        this._label = label;
        this._func = func;
        this._conditionFunc = conditionFunc;
    }

    /**
     * Check if this action is visible or not
     */
    public isVisible(): boolean {
        if (this._conditionFunc) {
            return this._conditionFunc();
        }

        return true;
    }

    /**
     * Returns the label of the Action
     */
    public toString(): string {
        return String(this._label);
    }

    /**
     * Execute the action function
     */
    public call(): any {
        return this._func();
    }
}

/**
 * Options that can be passed to an ActionList
 */
export interface ActionListOptions {
    style: Terminal;
    selectedStyle: Terminal;
    x: number|null;
    y: number|null;
    width: number|null;

}

/**
 * Creates a menu of available actions.
 */
export class ActionList {

    private _terminal: Terminal;
    private _options: ActionListOptions;
    private _actions: Action[] = [];
    private _actionsVisible: Action[] = [];
    private _selectedIndex: number = 0;
    private _promise: {
        resolve?: (result: any) => void,
        reject?: () =>  void,
    } = {};
    private _events: { [key: string]: ((mixed: any) => void) };

    constructor(terminal: Terminal, options: ActionListOptions) {
        this._terminal = terminal;

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
     */
    public add(label: string, func: (() => void), conditionFunc: null|(() => boolean) = null): this {
        this._actions.push(new Action(label, func, conditionFunc));
        return this;
    }

    /**
     * Set options for the menu (additive)
     */
    public options(options: ActionListOptions): this {
        this._options = Object.assign({}, this._options, options);
        return this;
    }

    /**
     * Show the menu
     * Returns a promise. Resolves to the return value of the chosen action.
     */
    public show(): Promise<void> {
        return new Promise((resolve, reject) => {

            // Bind events
            this._terminal.on('key', this._events.onKeyPress);

            // Draw UI
            this.redraw();

            this._promise = {
                resolve,
                reject,
            };
        });
    }

    /**
     * Redraw the element
     */
    public redraw(): void {

        // Move to position
        if (this._options.x !== null && this._options.y !== null) {
            this._terminal.moveTo(this._options.x, this._options.y);
        }

        // Reduce to only visible items
        this._actionsVisible = this._actions.filter((action) => action.isVisible());

        // Cap selection position if it now exceeds the list size
        if (this._selectedIndex >= this._actionsVisible.length) {
            this._selectedIndex = (this._actionsVisible.length - 1);
        }

        // Get Width either from settings or from options
        let maxWidth = 0;
        if (this._options.width !== null) {
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
            this._options.style(String('').padEnd(maxWidth + 2));
            this._terminal.noFormat('\n');
        }
    }

    /**
     * Aborts the menu without making a selection.
     */
    public abort(): void {
        // unbind events
        this._terminal.off('key', this._events.onKeyPress);
    }

    /**
     * Select the specified index
     */
    public select(index: number): void {
        const action = this._actionsVisible[index];
        let result: Action = action;

        // Call function on Action if given
        if (typeof action.call === 'function') {
            result = action.call();
        }

        // Resolve outcome
        if (this._promise.resolve) {
            this._promise.resolve(result);
        }
    }

    /**
     * Handle key press
     */
    public _onKeyPress(key: string): void {

        switch (KEY_MAP[key]) {
            case 'up':
                this._selectedIndex = Math.max(0, this._selectedIndex - 1);
                this.redraw();
                break;
            case 'down':
                this._selectedIndex = Math.min(this._actionsVisible.length - 1, this._selectedIndex + 1);
                this.redraw();
                break;
            case 'selected':
                this.select(this._selectedIndex);
                break;
        }
    }
}
