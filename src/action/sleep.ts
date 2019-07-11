import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function SleepActionFactory(terminal: Terminal, ...args: any) {
    return new SleepAction(terminal, args[0]);
}

/**
 * Sleep (timeout) using a Promise for the given number of seconds
 */
export class SleepAction {

    constructor(terminal: Terminal, seconds: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }
}
