import { Terminal } from 'terminal-kit';
export declare function ConfirmFactory(terminal: Terminal): Confirm;
export declare class Confirm {
    private _terminal;
    private _input;
    constructor(terminal: Terminal);
    confirm(question: string, { style }?: {
        style: Terminal | null;
    }): Promise<unknown>;
    abort(): void;
}
