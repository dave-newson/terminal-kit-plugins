"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageElement = void 0;
exports.ImageElementFactory = ImageElementFactory;
function ImageElementFactory(terminal, path, options) {
    return (new ImageElement(terminal)).render(path, options);
}
class ImageElement {
    constructor(terminal) {
        this.terminal = terminal;
    }
    render(path, options) {
        return new Promise((resolve, reject) => {
            this.terminal.drawImage(path, options, (err, response) => {
                (err) ? reject(err) : resolve();
            });
        });
    }
}
exports.ImageElement = ImageElement;
