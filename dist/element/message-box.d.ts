import { Terminal } from 'terminal-kit';
export declare function MessageBoxFactory(terminal: Terminal, options: MessageBoxOptions): MessageBox;
export interface MessageBoxOptions {
    message: string;
    style: Terminal;
    x: string;
    y: string;
    xPadding: number;
    yPadding: number;
    border: number;
}
export declare class MessageBox {
    private terminal;
    private lines;
    private style;
    private x;
    private y;
    private padding;
    private border;
    private lineWidth;
    constructor(term: Terminal, { message, style, x, y, xPadding, yPadding, border }: MessageBoxOptions);
    redraw(): void;
    show(): void;
    private drawOutline;
}
