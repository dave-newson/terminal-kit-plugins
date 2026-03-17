"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Confirm = void 0;
exports.ConfirmFactory = ConfirmFactory;
function ConfirmFactory(terminal) {
    return new Confirm(terminal);
}
class Confirm {
    constructor(terminal) {
        this._terminal = terminal;
        this._input = null;
    }
    confirm(question, { style } = { style: null }) {
        style = style || this._terminal.brightYellow;
        style(question);
        this._terminal.noFormat(' [').brightYellow('y').noFormat('|').brightYellow('n').noFormat(']');
        return new Promise((resolve, reject) => {
            this._input = this._terminal.yesOrNo({}, (err, response) => {
                this._terminal.noFormat('\n');
                if (err) {
                    return reject(err);
                }
                return resolve(response);
            });
        });
    }
    abort() {
        if (this._input) {
            this._input.abort();
        }
    }
}
exports.Confirm = Confirm;
