"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageStyleRegistryInstance = exports.Message = exports.MessageStyleRegistry = void 0;
exports.MessageFactory = MessageFactory;
const util = __importStar(require("util"));
const message_styles_1 = require("../styles/message-styles");
function MessageFactory(terminal, message, style) {
    return new Message(terminal, message, style);
}
class MessageStyleRegistry {
    constructor() {
        this.styles = new Map();
    }
    addStyle(style) {
        this.styles.set(style.id, style);
    }
    getStyle(alias) {
        return this.styles.get(alias) || message_styles_1.MessageStyle.DEFAULT;
    }
}
exports.MessageStyleRegistry = MessageStyleRegistry;
class Message {
    constructor(terminal, message = null, messageType = 'default') {
        this._terminal = terminal;
        this.styleRegistry = exports.messageStyleRegistryInstance;
        if (message !== null) {
            this.show(message, messageType);
        }
    }
    addType(alias, options) {
        options.id = alias;
        this.styleRegistry.addStyle(options);
    }
    show(message, type) {
        const style = this._resolveType(type);
        this._format(message, style);
    }
    _resolveType(options) {
        if (typeof options === 'string') {
            options = String(options).toLowerCase();
            options = this.styleRegistry.getStyle(options);
        }
        options = Object.assign({}, message_styles_1.MessageStyle.DEFAULT, options);
        return options;
    }
    _format(message, options) {
        let style = this._terminal;
        for (const name of options.style) {
            style = style[name];
        }
        if (options.prefix) {
            message = util.format(' %s %s', options.prefix, message);
        }
        if (options.padding >= 0) {
            message =
                (String('').padEnd(options.padding, '\n')) +
                    message +
                    (String('').padEnd(options.padding, '\n'));
            message = message
                .split('\n')
                .map((line) => line.padEnd(this._terminal.width, ' '))
                .join('\n');
            message = '\n' + message;
        }
        style(message);
        if (options.padding >= 0) {
            this._terminal.defaultColor.bgDefaultColor('\n');
        }
    }
}
exports.Message = Message;
exports.messageStyleRegistryInstance = new MessageStyleRegistry();
exports.messageStyleRegistryInstance.addStyle(message_styles_1.MessageStyle.DEFAULT);
exports.messageStyleRegistryInstance.addStyle(message_styles_1.MessageStyle.SUCCESS);
exports.messageStyleRegistryInstance.addStyle(message_styles_1.MessageStyle.ERROR);
exports.messageStyleRegistryInstance.addStyle(message_styles_1.MessageStyle.NOTICE);
exports.messageStyleRegistryInstance.addStyle(message_styles_1.MessageStyle.WARNING);
