/**
 * Element Factory
 */
import {Terminal} from 'terminal-kit';
import {InputFieldOptions} from 'terminal-kit/Terminal';

export function TextPromptFactory(terminal: Terminal, options: TextPromptOptions): TextPrompt {
    return new TextPrompt(terminal, options);
}

/**
 * Options
 */
export type TextPromptOptions = InputFieldOptions;

/**
 * Shows a text prompt requiring user input
 */
export class TextPrompt {

    private _terminal: Terminal;
    private _options: TextPromptOptions;

    /**
     * Dependency injection
     */
    constructor(terminal: Terminal, options?: TextPromptOptions) {
        this._terminal = terminal;
        this._options = options || {};
    }

    /**
     * Set options for the text prompt
     */
    public options(options: TextPromptOptions) {
        this._options = Object.assign({}, this._options, options);
    }

    /**
     * Show the question prompt, return the answer
     */
    public ask(question: string, defaultAnswer: null|string = null): Promise<string> {

        // Default value, if available
        if (typeof defaultAnswer === 'string') {
            this._options.default = defaultAnswer;
        }

        // Prompt
        this._terminal.brightYellow(question);
        this._terminal.brightRed(':');
        this._terminal.noFormat(' ');

        // Await input
        return new Promise((resolve, reject) => {
            this._terminal.inputField(this._options, (err: any, response: string) => {
                // Ensure new line after entry
                this._terminal.noFormat('\n');

                // Handle outcome
                return (err) ? reject(err) : resolve(response);
            });
        });
    }
}
