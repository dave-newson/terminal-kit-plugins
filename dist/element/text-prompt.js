"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextPrompt = void 0;
exports.TextPromptFactory = TextPromptFactory;
function TextPromptFactory(terminal, options) {
    return new TextPrompt(terminal, options);
}
class TextPrompt {
    constructor(terminal, options) {
        this._terminal = terminal;
        this._options = options || {};
    }
    options(options) {
        this._options = Object.assign({}, this._options, options);
    }
    ask(question, defaultAnswer = null) {
        if (typeof defaultAnswer === 'string') {
            this._options.default = defaultAnswer;
        }
        this._terminal.brightYellow(question);
        this._terminal.brightRed(':');
        this._terminal.noFormat(' ');
        return new Promise((resolve, reject) => {
            this._terminal.inputField(this._options, (err, response) => {
                this._terminal.noFormat('\n');
                return (err) ? reject(err) : resolve(response);
            });
        });
    }
}
exports.TextPrompt = TextPrompt;
