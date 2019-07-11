/**
 * Element Factory
 */
import {Terminal} from 'terminal-kit';
import {YesOrNoOptions} from 'terminal-kit/Terminal';

export function ConfirmFactory(terminal: Terminal) {
    return new Confirm(terminal);
}

/**
 * Element which supports a simple yes/no question.
 */
export class Confirm {

    private _terminal: Terminal;
    private _input: null|any;

    constructor(terminal: Terminal) {
        this._terminal = terminal;
        this._input = null;
    }

    /**
     * Make confirmation request
     */
    public confirm(
        question: string,
        { style }: { style: Terminal|null} = { style: null }
    ) {

        style = style || this._terminal.brightYellow;
        style(question);
        this._terminal.noFormat(' [').brightYellow('y').noFormat('|').brightYellow('n').noFormat(']');

        return new Promise((resolve, reject) => {

            // Get input
            this._input = this._terminal.yesOrNo({} as YesOrNoOptions, (err, response) => {

                // Ensure new line after entry
                this._terminal.noFormat('\n');

                if (err) { return reject(err); }

                return resolve(response);
            });
        });
    }

    /**
     * Abort the input request
     */
    public abort() {
        if (this._input) { this._input.abort(); }
    }

}
