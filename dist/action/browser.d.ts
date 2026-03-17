import { Terminal } from 'terminal-kit';
export declare function BrowserActionFactory(terminal: Terminal, ...args: any): BrowserAction;
export declare class BrowserAction {
    private term;
    constructor(term: Terminal);
    open(url: string): Promise<void>;
}
