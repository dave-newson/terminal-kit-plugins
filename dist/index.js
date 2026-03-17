"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elements = void 0;
exports.plugin = plugin;
const confirm_1 = require("./element/confirm");
const text_prompt_1 = require("./element/text-prompt");
const message_box_1 = require("./element/message-box");
const table_1 = require("./element/table");
const image_1 = require("./element/image");
const exec_1 = require("./action/exec");
const sleep_1 = require("./action/sleep");
const message_1 = require("./element/message");
const action_list_1 = require("./element/action-list");
const header_bar_1 = require("./element/header-bar");
const data_table_1 = require("./element/data-table");
const browser_1 = require("./action/browser");
exports.elements = {
    ActionList: action_list_1.ActionListFactory,
    Confirm: confirm_1.ConfirmFactory,
    DataTable: data_table_1.DataTableFactory,
    MessageBox: message_box_1.MessageBoxFactory,
    Message: message_1.MessageFactory,
    TextPrompt: text_prompt_1.TextPromptFactory,
    HeaderBar: header_bar_1.HeaderBarFactory,
    Table: table_1.TableFactory,
    Image: image_1.ImageElementFactory,
    Exec: exec_1.ExecActionFactory,
    Sleep: sleep_1.SleepActionFactory,
    Browser: browser_1.BrowserActionFactory,
};
function plugin(terminalKit, elementList = null) {
    if (elementList === null) {
        elementList = exports.elements;
    }
    const proto = Object.getPrototypeOf(terminalKit);
    for (const [key, value] of Object.entries(elementList)) {
        proto[key] = function (...options) {
            return value(this, ...options);
        };
    }
}
