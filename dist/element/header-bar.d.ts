import { Terminal } from 'terminal-kit';
export declare function HeaderBarFactory(terminal: Terminal, options: HeaderBarOptions): HeaderBar;
export interface HeaderBarOptions {
    x?: number;
    y?: number;
    width: null | number;
    style?: Terminal;
    divider?: string;
    dividerStyle?: Terminal;
    padding?: number;
    get: string | ((object: any) => string);
    getKey: string | ((object: HeaderBarItem) => string);
}
export declare class HeaderBarEvents {
    static readonly SELECTED = "selected";
}
export interface HeaderBarItem {
    label: string;
    key: string;
}
export declare class HeaderBar {
    private _eventEmitter;
    private _terminal;
    private _onKeyEvent;
    private _items;
    private _options;
    constructor(term: Terminal, options: HeaderBarOptions);
    abort(): void;
    focus(): void;
    blur(): void;
    add(object: any): this;
    redraw(): void;
    on(event: string, listener: (mixed?: any) => void): this;
    private _onKey;
    private _getKey;
    private _getLabel;
}
