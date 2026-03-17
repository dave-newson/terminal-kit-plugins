import { Terminal } from 'terminal-kit';
export declare function MessageFactory(terminal: Terminal, message?: string, style?: string | IMessageStyle): Message;
export declare class MessageStyleRegistry {
    private styles;
    addStyle(style: IMessageStyle): void;
    getStyle(alias: string): IMessageStyle;
}
export interface IMessageStyle {
    id: string;
    alias?: string[];
    prefix: null | string;
    padding: number;
    full_width: boolean;
    style: string[];
}
export declare class Message {
    private _terminal;
    private styleRegistry;
    constructor(terminal: Terminal, message?: null | string, messageType?: string | IMessageStyle);
    addType(alias: string, options: IMessageStyle): void;
    show(message: string, type: string | IMessageStyle): void;
    private _resolveType;
    private _format;
}
export declare const messageStyleRegistryInstance: MessageStyleRegistry;
