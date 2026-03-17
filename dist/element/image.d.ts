import { Terminal } from 'terminal-kit';
export declare function ImageElementFactory(terminal: Terminal, path: string, options: ImageElementOptions): Promise<void>;
export interface ImageElementOptions {
    shrink?: {
        width: number;
        height: number;
    };
}
export declare class ImageElement {
    private terminal;
    constructor(terminal: Terminal);
    render(path: string, options: ImageElementOptions): Promise<void>;
}
