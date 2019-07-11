import {Terminal} from 'terminal-kit';
import {ElementFactory} from './factory';
import {Confirm, ConfirmFactory} from './element/confirm';
import {TextPrompt, TextPromptFactory, TextPromptOptions} from './element/text-prompt';
import {MessageBox, MessageBoxFactory, MessageBoxOptions} from './element/message-box';
import {BasicTable, TableFactory, TableOptions} from './element/table';
import {ImageElementFactory, ImageElementOptions} from './element/image';
import {ExecActionFactory, ExecResult, IExecOptions} from './action/exec';
import {SleepAction, SleepActionFactory} from './action/sleep';
import {IMessageStyle, Message, MessageFactory} from './element/message';
import {ActionList, ActionListFactory, ActionListOptions} from './element/action-list';
import {HeaderBar, HeaderBarFactory} from './element/header-bar';
import {DataTable, DataTableFactory, DataTableOptions} from './element/data-table';
import {BrowserAction} from './action/browser';

/**
 * Element list
 *
 * @type {object}
 */
export const elements = {
    ActionList: ActionListFactory,
    Confirm: ConfirmFactory,
    DataTable: DataTableFactory,
    MessageBox: MessageBoxFactory,
    Message: MessageFactory,
    TextPrompt: TextPromptFactory,
    HeaderBar: HeaderBarFactory,
    Table: TableFactory,
    Image: ImageElementFactory,
    Exec: ExecActionFactory,
    Sleep: SleepActionFactory,
};

/**
 * Plugin method for mounting elements onto TerminalKit
 */
export function plugin(terminalKit: Terminal, elementList: null|{} = null) {

    // Mount everything if nothing specified
    if (elementList === null) {
        elementList = elements;
    }

    const proto = Object.getPrototypeOf(terminalKit);

    // Register each factory
    for ( const [ key, value ] of (Object.entries(elementList) as Array<[string, ElementFactory]>) ) {
        proto[key] = function(...options: any) {
            return value(this, ...options);
        };
    }
}
