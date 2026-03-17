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
exports.HeaderBar = exports.HeaderBarEvents = void 0;
exports.HeaderBarFactory = HeaderBarFactory;
const Util = __importStar(require("util"));
const events_1 = require("events");
function HeaderBarFactory(terminal, options) {
    return new HeaderBar(terminal, options);
}
class HeaderBarEvents {
}
exports.HeaderBarEvents = HeaderBarEvents;
HeaderBarEvents.SELECTED = 'selected';
class HeaderBar {
    constructor(term, options) {
        this._eventEmitter = new events_1.EventEmitter();
        this._terminal = term;
        this._onKeyEvent = this._onKey.bind(this);
        this._items = [];
        options.x = options.x || 0;
        options.y = options.y || 0;
        options.width = options.width || this._terminal.width;
        options.style = options.style || this._terminal.noFormat;
        options.divider = options.divider || '|';
        options.padding = options.padding || 1;
        options.dividerStyle = options.dividerStyle || options.style;
        this._options = options;
        this.focus();
    }
    abort() {
        this.blur();
    }
    focus() {
        this._terminal.on('key', this._onKeyEvent);
    }
    blur() {
        this._terminal.off('key', this._onKeyEvent);
    }
    add(object) {
        this._items.push(object);
        return this;
    }
    redraw() {
        const menuItems = [];
        this._items.map((item) => {
            menuItems.push({
                label: this._getLabel(item),
                key: this._getKey(item),
            });
        });
        this._terminal.moveTo(this._options.x, this._options.y);
        let lineLen = 0;
        const style = this._options.style || this._terminal.noFormat;
        const dividerStyle = this._options.dividerStyle || style;
        menuItems.forEach((item) => {
            const str = Util.format(' [%s] %s ', item.key, item.label);
            lineLen += str.length;
            style(str);
            dividerStyle(this._options.divider);
            lineLen += String(this._options.divider).length;
        });
        const fill = this._terminal.width - lineLen;
        style(String('').padEnd(fill, ' '));
    }
    on(event, listener) {
        this._eventEmitter.on(event, listener);
        return this;
    }
    _onKey(key) {
        const found = this._items.find((item) => {
            const itemKey = this._getKey(item);
            if (key === itemKey) {
                return item;
            }
        });
        if (found === undefined) {
            return;
        }
        this._eventEmitter.emit(HeaderBarEvents.SELECTED, found);
    }
    _getKey(item) {
        if (typeof this._options.getKey === 'function') {
            return this._options.getKey(item);
        }
        else if (typeof this._options.getKey === 'string') {
            return item[this._options.getKey];
        }
        else {
            throw new Error('GetKey option ("getKey") was not set for Header Bar element.');
        }
    }
    _getLabel(item) {
        if (typeof this._options.get === 'function') {
            return this._options.get(item);
        }
        else if (typeof this._options.get === 'string') {
            return item[this._options.get];
        }
        else if (typeof item._toString === 'function') {
            return String(item);
        }
        else {
            throw new Error('Getter option ("get") was not set for Header Bar element.');
        }
    }
}
exports.HeaderBar = HeaderBar;
