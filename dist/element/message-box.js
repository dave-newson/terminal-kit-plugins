"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBox = void 0;
exports.MessageBoxFactory = MessageBoxFactory;
function MessageBoxFactory(terminal, options) {
    return new MessageBox(terminal, options);
}
class MessageBox {
    constructor(term, { message, style, x = 'middle', y = 'middle', xPadding = 2, yPadding = 1, border = 2 }) {
        this.lines = [];
        this.x = 'middle';
        this.y = 'middle';
        this.padding = { x: 2, y: 1 };
        this.border = 2;
        this.lineWidth = 0;
        this.terminal = term;
        this.style = style || this.terminal.bgBrightWhite.black;
        this.x = x;
        this.y = y;
        this.padding = {
            x: xPadding,
            y: yPadding,
        };
        this.border = border;
        this.lines = String(message || '').split('\n');
        this.lineWidth = 0;
        this.lines.forEach((line) => {
            this.lineWidth = (line.length > this.lineWidth) ? line.length : this.lineWidth;
        });
    }
    redraw() {
        const style = this.style;
        let x = 0;
        if (this.x === 'middle') {
            x = Math.floor((this.terminal.width / 2) - (this.lineWidth / 2) - this.padding.x);
        }
        let y = 0;
        if (this.y === 'middle') {
            y = Math.floor(this.terminal.height / 2) - this.padding.y;
        }
        const lines = this.lines.map((line) => {
            const width = this.lineWidth + this.padding.x * 2;
            const leftPad = Math.floor((width - line.length) / 2);
            line = line.padStart(line.length + leftPad, ' ').padEnd(width, ' ');
            return line;
        });
        const empty = String().padEnd(this.lineWidth + this.padding.x * 2, ' ');
        for (let i = 0; i < this.padding.y; i++) {
            this.terminal.moveTo(x, y + i);
            style(empty);
        }
        for (let i = 0; i < lines.length; i++) {
            this.terminal.moveTo(x, y + this.padding.y + i);
            style(lines[i]);
        }
        for (let i = 0; i < this.padding.y; i++) {
            this.terminal.moveTo(x, y + lines.length + this.padding.y + i);
            style(empty);
        }
        this.drawOutline(x, y, empty.length, (this.padding.y * 2) + lines.length, {
            style,
            border: this.border,
        });
    }
    show() {
        this.redraw();
    }
    drawOutline(x, y, w, h, { style, border } = { style: this.terminal.noFormat, border: 2 }) {
        if (border === 0) {
            return;
        }
        const chars = [
            '        ',
            '──││┌┐└┘',
            '══║║╔╗╚╝',
            '▀▄██████',
        ][border];
        this.terminal.moveTo(x, y);
        style(chars[4] + String().padEnd(w - 2, chars[0]) + chars[5]);
        for (let i = 1; i < h - 1; i++) {
            this.terminal.moveTo(x, y + i);
            style(chars[2]);
            this.terminal.moveTo(x + w - 1, y + i);
            style(chars[3]);
        }
        this.terminal.moveTo(x, y + h - 1);
        style(chars[6] + String().padEnd(w - 2, chars[1]) + chars[7]);
    }
}
exports.MessageBox = MessageBox;
