import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function ImageElementFactory(terminal: Terminal, path: string, options: ImageElementOptions): Promise<void> {
    return (new ImageElement(terminal)).render(path, options);
}

/**
 * Image options
 */
export interface ImageElementOptions {
    shrink?: {
        width: number;
        height: number;
    };
}
/**
 * Draw an image. Returns a promise.
 */
export class ImageElement {

    private terminal: Terminal;

    constructor(terminal: Terminal) {
        this.terminal = terminal;
    }

    public render(path: string, options: ImageElementOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.terminal.drawImage(path, options, (err, response) => {
                (err) ? reject(err) : resolve();
            });
        });
    }

}
