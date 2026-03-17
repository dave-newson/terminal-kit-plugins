"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepAction = void 0;
exports.SleepActionFactory = SleepActionFactory;
function SleepActionFactory(terminal, ...args) {
    return new SleepAction(terminal, args[0]);
}
class SleepAction {
    constructor(terminal, seconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }
}
exports.SleepAction = SleepAction;
