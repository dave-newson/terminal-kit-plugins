import {IMessageStyle} from '../element/message';

/**
 * Style definitions for messages
 */
export class MessageStyle {

    public static readonly DEFAULT = {
        id: 'default',
        alias: [''],
        prefix: null,
        padding: -1,
        full_width: true,
        style: ['defaultColor', 'bgDefaultColor'],
    } as IMessageStyle;

    public static readonly SUCCESS = {
        id: 'success',
        alias: ['ok', 'done'],
        padding: 1,
        full_width: true,
        prefix: '[OK]',
        style: ['black', 'bgBrightGreen'],
    } as IMessageStyle;

    public static readonly ERROR = {
        id: 'error',
        alias: ['err'],
        padding: 1,
        full_width: true,
        prefix: '[ERROR]',
        style: ['brightWhite', 'bgBrightRed', 'blink'],
    }as IMessageStyle;

    public static readonly WARNING = {
        id: 'warning',
        alias: ['warn'],
        padding: 1,
        full_width: true,
        prefix: '[WARNING]',
        style: ['brightWhite', 'bgRed'],
    } as IMessageStyle;

    public static readonly NOTICE = {
        id: 'notice',
        alias: ['note'],
        padding: 1,
        full_width: true,
        prefix: '[NOTICE]',
        style: ['black', 'bgBrightYellow'],
    } as IMessageStyle;
}
