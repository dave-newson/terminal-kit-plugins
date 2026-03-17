"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStyle = void 0;
class MessageStyle {
}
exports.MessageStyle = MessageStyle;
MessageStyle.DEFAULT = {
    id: 'default',
    alias: [''],
    prefix: null,
    padding: -1,
    full_width: true,
    style: ['defaultColor', 'bgDefaultColor'],
};
MessageStyle.SUCCESS = {
    id: 'success',
    alias: ['ok', 'done'],
    padding: 1,
    full_width: true,
    prefix: '[OK]',
    style: ['black', 'bgBrightGreen'],
};
MessageStyle.ERROR = {
    id: 'error',
    alias: ['err'],
    padding: 1,
    full_width: true,
    prefix: '[ERROR]',
    style: ['brightWhite', 'bgBrightRed', 'blink'],
};
MessageStyle.WARNING = {
    id: 'warning',
    alias: ['warn'],
    padding: 1,
    full_width: true,
    prefix: '[WARNING]',
    style: ['brightWhite', 'bgRed'],
};
MessageStyle.NOTICE = {
    id: 'notice',
    alias: ['note'],
    padding: 1,
    full_width: true,
    prefix: '[NOTICE]',
    style: ['black', 'bgBrightYellow'],
};
