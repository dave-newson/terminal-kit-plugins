import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function MessageBoxFactory(terminal: Terminal, options: MessageBoxOptions) {
    return new MessageBox(terminal, options);
}

/**
 * Options for the Message Box
 */
export interface MessageBoxOptions {
    message: string;
    style: Terminal;
    x: string;
    y: string;
    xPadding: number;
    yPadding: number;
    border: number;
}

/**
 * Displays text within a bordered, centered box.
 * Good for big fat alert messages
 */
export class MessageBox {

    private terminal: Terminal;
    private lines: string[] = [];
    private style: Terminal;
    private x: string = 'middle';
    private y: string = 'middle';
    private padding: {x: number, y: number} = {x: 2, y: 1};
    private border: number = 2;
    private lineWidth: number = 0;

    public constructor(
        term: Terminal,
        { message, style, x = 'middle', y = 'middle', xPadding = 2, yPadding = 1, border = 2 }: MessageBoxOptions
    ) {
        this.terminal = term;
        this.style = style || this.terminal.bgBrightWhite.black;
        this.x = x;
        this.y = y;
        this.padding = {
            x: xPadding,
            y: yPadding,
        };
        this.border = border;

        // Break lines by \n
        this.lines = String(message || '').split('\n');

        // Calculate lines max width
        this.lineWidth = 0;
        this.lines.forEach((line) => {
            this.lineWidth = (line.length > this.lineWidth) ? line.length : this.lineWidth;
        });
    }

    /**
     * Redraw the message window
     */
    public redraw(): void {
        const style = this.style;

        // Locate good text positions
        let x = 0;
        if (this.x === 'middle') {
            x = Math.floor((this.terminal.width / 2) - (this.lineWidth / 2) - this.padding.x);
        }

        let y = 0;
        if (this.y === 'middle') {
            y = Math.floor(this.terminal.height / 2) - this.padding.y;
        }

        // Pad message text for each line
        // Note: only supports center aligned text
        const lines = this.lines.map((line) => {

            // Get total line width
            const width = this.lineWidth + this.padding.x * 2;

            // Subtract current line length
            const leftPad = Math.floor((width - line.length) / 2);

            line = line.padStart(line.length + leftPad, ' ').padEnd(width, ' ');
            return line;
        });

        // Empty text bar, for vertical padding
        const empty = String().padEnd(this.lineWidth + this.padding.x * 2, ' ');

        // Empty padding before
        for (let i = 0; i < this.padding.y; i++) {
            this.terminal.moveTo(x, y + i);
            style(empty);
        }

        // Message lines
        for (let i = 0; i < lines.length; i++) {
            this.terminal.moveTo(x, y + this.padding.y + i);
            style(lines[i]);
        }

        // Empty padding after
        for (let i = 0; i < this.padding.y; i++) {
            this.terminal.moveTo(x, y + lines.length + this.padding.y + i);
            style(empty);
        }

        // Add border
        this.drawOutline(
            x,
            y,
            empty.length,
            (this.padding.y * 2) + lines.length,
            {
                style,
                border: this.border,
            }
        );
    }

    public show(): void {
        this.redraw();
    }

    /**
     * Draws a box outline over the message box using ASCII box-drawing chars
     */
    private drawOutline(
        x: number, y: number,
        w: number, h: number,
        { style, border }: { style: Terminal, border: number} = { style: this.terminal.noFormat, border: 2}
    ): void {

        // No border? No outline.
        if (border === 0) {
            return;
        }

        // "border" sets the character set (line thickness)
        // to, bottom, left, right, tl, tr, bl, br
        const chars = [
            '        ',
            '──││┌┐└┘',
            '══║║╔╗╚╝',
            '▀▄██████',
        ][border];

        // Top
        this.terminal.moveTo(x, y);
        style(chars[4] + String().padEnd(w - 2, chars[0]) + chars[5]);

        // Sides
        for (let i = 1; i < h - 1; i++) {
            this.terminal.moveTo(x, y + i);
            style(chars[2]);
            this.terminal.moveTo(x + w - 1, y + i);
            style(chars[3]);
        }

        // Bottom
        this.terminal.moveTo(x, y + h - 1);
        style(chars[6] + String().padEnd(w - 2, chars[1]) + chars[7]);
    }
}
