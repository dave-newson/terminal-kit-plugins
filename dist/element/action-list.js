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
exports.ActionList = void 0;
exports.ActionListFactory = ActionListFactory;
const util = __importStar(require("util"));
function ActionListFactory(terminal, options) {
    return new ActionList(terminal, options);
}
const KEY_MAP = {
    UP: 'up',
    DOWN: 'down',
    ENTER: 'selected',
};
class Action {
    constructor(label, func, conditionFunc) {
        this._label = label;
        this._func = func;
        this._conditionFunc = conditionFunc;
    }
    isVisible() {
        if (this._conditionFunc) {
            return this._conditionFunc();
        }
        return true;
    }
    toString() {
        return String(this._label);
    }
    call() {
        return this._func();
    }
}
class ActionList {
    constructor(terminal, options) {
        this._actions = [];
        this._actionsVisible = [];
        this._selectedIndex = 0;
        this._promise = {};
        this._terminal = terminal;
        options.style = options.style || this._terminal.noFormat;
        options.selectedStyle = options.selectedStyle || options.style;
        this._options = Object.assign({
            x: null,
            y: null,
            width: null,
        }, options);
        this._events = {
            onKeyPress: this._onKeyPress.bind(this),
        };
    }
    add(label, func, conditionFunc = null) {
        this._actions.push(new Action(label, func, conditionFunc));
        return this;
    }
    options(options) {
        this._options = Object.assign({}, this._options, options);
        return this;
    }
    show() {
        return new Promise((resolve, reject) => {
            this._terminal.on('key', this._events.onKeyPress);
            this.redraw();
            this._promise = {
                resolve,
                reject,
            };
        });
    }
    redraw() {
        if (this._options.x !== null && this._options.y !== null) {
            this._terminal.moveTo(this._options.x, this._options.y);
        }
        this._actionsVisible = this._actions.filter((action) => action.isVisible());
        if (this._selectedIndex >= this._actionsVisible.length) {
            this._selectedIndex = (this._actionsVisible.length - 1);
        }
        let maxWidth = 0;
        if (this._options.width !== null) {
            maxWidth = this._options.width;
        }
        else {
            this._actions.forEach((action) => {
                const len = String(action).length;
                maxWidth = len > maxWidth ? len : maxWidth;
            });
        }
        let rows = 1;
        this._actionsVisible.forEach((item, index) => {
            rows++;
            let style = this._options.style;
            if (index === this._selectedIndex) {
                style = this._options.selectedStyle;
            }
            const str = String(item).padEnd(maxWidth).slice(0, maxWidth);
            style(util.format(' %s \n', str));
        });
        for (; rows <= this._actions.length; rows++) {
            this._options.style(String('').padEnd(maxWidth + 2));
            this._terminal.noFormat('\n');
        }
    }
    abort() {
        this._terminal.off('key', this._events.onKeyPress);
    }
    select(index) {
        const action = this._actionsVisible[index];
        let result = action;
        if (typeof action.call === 'function') {
            result = action.call();
        }
        if (this._promise.resolve) {
            this._promise.resolve(result);
        }
    }
    _onKeyPress(key) {
        switch (KEY_MAP[key]) {
            case 'up':
                this._selectedIndex = Math.max(0, this._selectedIndex - 1);
                this.redraw();
                break;
            case 'down':
                this._selectedIndex = Math.min(this._actionsVisible.length - 1, this._selectedIndex + 1);
                this.redraw();
                break;
            case 'selected':
                this.select(this._selectedIndex);
                break;
        }
    }
}
exports.ActionList = ActionList;
