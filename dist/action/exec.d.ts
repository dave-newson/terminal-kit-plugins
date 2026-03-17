import { ExecSyncOptions } from 'child_process';
import { Terminal } from 'terminal-kit';
export declare function ExecActionFactory(terminal: Terminal, ...args: any): Promise<ExecResult>;
export declare class ExecActionError extends Error {
    code: number;
    command: string;
    output: string;
}
export declare class ExecAction {
    private terminal;
    private errorExtra;
    constructor(terminal: Terminal);
    exec(command: string[], options?: IExecOptions): Promise<ExecResult>;
    private parseOptions;
}
export interface IExecOptions extends ExecSyncOptions {
    interactive?: boolean;
    shell?: string;
    allowFailure?: boolean;
    cwd?: string;
}
export declare class ExecResult {
    readonly output: string;
    readonly exitCode: number;
    constructor(output: string, exitCode: number);
}
