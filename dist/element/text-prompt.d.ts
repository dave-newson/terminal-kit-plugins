import { Terminal } from 'terminal-kit';
import { InputFieldOptions } from 'terminal-kit/Terminal';
export declare function TextPromptFactory(terminal: Terminal, options: TextPromptOptions): TextPrompt;
export type TextPromptOptions = InputFieldOptions;
export declare class TextPrompt {
    private _terminal;
    private _options;
    constructor(terminal: Terminal, options?: TextPromptOptions);
    options(options: TextPromptOptions): void;
    ask(question: string, defaultAnswer?: null | string): Promise<string>;
}
