import { EventEmitter } from 'events';
import { Terminal } from 'terminal-kit';
export declare function DataTableFactory(terminal: Terminal, options: DataTableOptions): DataTable;
export interface DataTableOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    keyBindings?: {
        [key: string]: string;
    };
    allowCancel?: boolean;
    style?: Terminal;
    selectedStyle?: Terminal;
    headingStyle?: Terminal;
    scrollPadding?: number;
    padding?: number;
    columns: ITableColumn[];
    data?: any[];
    paused?: boolean;
    filter?: ((text: string, item: any) => boolean);
    filterTextSize?: number;
}
export interface ITableColumn {
    get: string | ((object?: any) => string);
    style?: Terminal | ((item: any) => Terminal);
    width: number;
    heading?: string;
}
export declare class DataTable extends EventEmitter {
    promise: Promise<any>;
    private _term;
    private _config;
    private _state;
    private _events;
    private grabbing;
    constructor(terminal: Terminal, options: DataTableOptions);
    setSelected(item: any): void;
    submit(isSubmit: boolean): void;
    onKeyPress(key: string): void;
    redraw(): void;
    abort(): void;
    pause(): void;
    resume(): void;
    focus(giveFocus?: boolean): void;
    setData(data: any[]): void;
    private _destroy;
}
