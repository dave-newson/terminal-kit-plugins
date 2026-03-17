import { Terminal } from 'terminal-kit';
export declare function TableFactory(terminal: Terminal, data: any[], options: TableOptions): BasicTable;
export interface TableOptions {
    columns: Array<{
        key: string;
        style: ((text: string) => void);
        width: number;
    }>;
    padding: string;
    paddingStyle: ((text: string) => void);
    x: null | number;
    y: null | number;
}
export declare class BasicTable {
    constructor(terminal: Terminal, data: any[] | undefined, options: TableOptions);
    private getValue;
}
