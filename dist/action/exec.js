"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecResult = exports.ExecAction = exports.ExecActionError = void 0;
exports.ExecActionFactory = ExecActionFactory;
const child_process_1 = require("child_process");
function ExecActionFactory(terminal, ...args) {
    return (new ExecAction(terminal)).exec(args[0], args[1]);
}
class ExecActionError extends Error {
    constructor() {
        super(...arguments);
        this.code = -1;
        this.command = '';
        this.output = '';
    }
}
exports.ExecActionError = ExecActionError;
class ExecAction {
    constructor(terminal) {
        this.errorExtra = [];
        this.terminal = terminal;
    }
    exec(command, options = {}) {
        return new Promise(async (resolve, reject) => {
            this.parseOptions(options);
            const cmd = command.slice(0, 1)[0];
            const args = command.slice(1);
            const child = (0, child_process_1.spawn)(cmd, args, options);
            let outputBuffer = String();
            if (options.interactive === false && child.stdout && child.stderr) {
                child.stdout.on('data', (data) => {
                    outputBuffer += '' + data;
                });
                child.stderr.on('data', (data) => {
                    outputBuffer += '' + data;
                });
            }
            else {
                if (this.terminal.grabbing) {
                    this.terminal.grabInput(false);
                }
            }
            child.on('error', (error) => {
                if (error.code === 'ENOENT') {
                    this.errorExtra.push('ENOENT failure code given, indicating possible bad command call.');
                }
            });
            child.on('close', async (code, signal) => {
                const result = new ExecResult(outputBuffer, code);
                if (!options.allowFailure && code !== 0) {
                    const e = new ExecActionError(`Command failed with exit code ${code}. ${this.errorExtra.join(' ')}`);
                    e.code = code;
                    e.command = command.join(' ');
                    e.output = outputBuffer;
                    reject(e);
                }
                resolve(result);
            });
        });
    }
    parseOptions(options) {
        options.stdio = 'pipe';
        options.interactive = options.interactive === undefined ? true : options.interactive;
        if (options.interactive) {
            options.shell = (options.shell === undefined) ? true : options.shell;
            options.stdio = 'inherit';
        }
        options.allowFailure = (options.allowFailure === undefined) ? false : options.allowFailure;
    }
}
exports.ExecAction = ExecAction;
class ExecResult {
    constructor(output, exitCode) {
        this.output = output;
        this.exitCode = exitCode;
    }
}
exports.ExecResult = ExecResult;
