import {Terminal} from 'terminal-kit';

export type ElementFactory = (terminal: Terminal, ...args: any) => any;
