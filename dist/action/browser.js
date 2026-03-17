"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserAction = void 0;
exports.BrowserActionFactory = BrowserActionFactory;
function BrowserActionFactory(terminal, ...args) {
    return new BrowserAction(terminal);
}
class BrowserAction {
    constructor(term) {
        this.term = term;
    }
    async open(url) {
        let cmd = [];
        switch (process.platform) {
            case 'win32':
                cmd = ['cmd', '/c', 'start', url];
                break;
            case 'darwin':
                cmd = ['open', url];
                break;
            default:
                cmd = ['xdg-open', url];
                break;
        }
        await this.term.Exec(cmd, {});
    }
}
exports.BrowserAction = BrowserAction;
