import { Terminal } from 'terminal-kit';
export declare function ActionListFactory(terminal: Terminal, options: ActionListOptions): ActionList;
export interface ActionListOptions {
    style: Terminal;
    selectedStyle: Terminal;
    x: number | null;
    y: number | null;
    width: number | null;
}
export declare class ActionList {
    private _terminal;
    private _options;
    private _actions;
    private _actionsVisible;
    private _selectedIndex;
    private _promise;
    private _events;
    constructor(terminal: Terminal, options: ActionListOptions);
    add(label: string, func: (() => void), conditionFunc?: null | (() => boolean)): this;
    options(options: ActionListOptions): this;
    show(): Promise<void>;
    redraw(): void;
    abort(): void;
    select(index: number): void;
    _onKeyPress(key: string): void;
}
