import * as util from 'util';
import {Terminal} from 'terminal-kit';
import {MessageStyle} from '../styles/message-styles';

/**
 * Element Factory
 */
export function MessageFactory(terminal: Terminal, message?: string, style?: string|IMessageStyle): Message {
    return new Message(terminal, message, style);
}

/**
 * Registry for message styles
 */
export class MessageStyleRegistry {
    private styles: Map<string, IMessageStyle> = new Map();

    /**
     * Add or replace a type style
     */
    public addStyle(style: IMessageStyle) {
        this.styles.set(style.id, style);
    }

    public getStyle(alias: string): IMessageStyle {
        return this.styles.get(alias) || MessageStyle.DEFAULT;
    }
}

/**
 * Message style interface
 */
export interface IMessageStyle {
    id: string;
    alias?: string[];
    prefix: null|string;
    padding: number;
    full_width: boolean;
    style: string[];
}

/**
 * Provides a style-based message system
 * You can add or override styles using addType().
 */
export class Message {
    private _terminal: Terminal;

    private styleRegistry: MessageStyleRegistry;

    /**
     * Set up dependencies for the message
     * Optionally supply the message and messageType immediately, negating the need to call show() manually.
     * messageType may be a string message alias, or an object with message options
     */
    constructor(terminal: Terminal, message: null|string = null, messageType: string|IMessageStyle = 'default') {
        this._terminal = terminal;
        this.styleRegistry = messageStyleRegistryInstance;

        // If message is passed directory, show immediately.
        if (message !== null) {
            this.show(message, messageType);
        }
    }

    public addType(alias: string, options: IMessageStyle) {
        options.id = alias;
        this.styleRegistry.addStyle(options);
    }

    /**
     * Shows the given 'text' string, formatted as the given 'messageType'.
     */
    public show(message: string, type: string|IMessageStyle): void {
        const style = this._resolveType(type);
        this._format(message, style);
    }

    /**
     * Resolve the type of alert by string name to a constant name
     */
    private _resolveType(options: string|IMessageStyle): any {

        // If string options, load the given style from cache
        if (typeof options === 'string') {
            options = String(options).toLowerCase();
            options = this.styleRegistry.getStyle(options);
        }

        // Lay the options over the top of the Default styles
        options = Object.assign({}, MessageStyle.DEFAULT, options);

        return options;
    }

    /**
     * Displays the message
     */
    private _format(message: string, options: IMessageStyle): void {

        // Run "style" array through the Terminal to jig the styles.
        let style = this._terminal;
        for (const name of options.style) {
            // Terminal can be accessed by prop to set styles
            // FIXME: But the typings really don't like this method.
            style = (style as any)[name] as Terminal;
        }

        // Determine prefix on the message
        if (options.prefix) {
            message = util.format(' %s %s', options.prefix, message);
        }

        if (options.padding >= 0) {

            // Determine vertical padding
            message =
                (String('').padEnd(options.padding, '\n')) +
                message +
                (String('').padEnd(options.padding, '\n'));

            // Horizontal padding
            message = message
                .split('\n')
                .map((line) => line.padEnd(this._terminal.width, ' '))
                .join('\n');

            // Start/End padding
            message = '\n' + message;
        }

        // Display
        style(message);

        // Write the final \n as default colours
        // This helps to reset the terminal and not bleed the styles into the next line.
        if (options.padding >= 0) {
            this._terminal.defaultColor.bgDefaultColor('\n');
        }
    }

}

/**
 * Message Styles Singleton
 */
export const messageStyleRegistryInstance = new MessageStyleRegistry();
messageStyleRegistryInstance.addStyle(MessageStyle.DEFAULT);
messageStyleRegistryInstance.addStyle(MessageStyle.SUCCESS);
messageStyleRegistryInstance.addStyle(MessageStyle.ERROR);
messageStyleRegistryInstance.addStyle(MessageStyle.NOTICE);
messageStyleRegistryInstance.addStyle(MessageStyle.WARNING);
