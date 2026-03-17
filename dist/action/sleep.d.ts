import { Terminal } from 'terminal-kit';
export declare function SleepActionFactory(terminal: Terminal, ...args: any): SleepAction;
export declare class SleepAction {
    constructor(terminal: Terminal, seconds: number);
}
