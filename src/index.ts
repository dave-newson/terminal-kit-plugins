import {Terminal} from 'terminal-kit';
import {ElementFactory} from './factory';
import {ConfirmFactory} from './element/confirm';
import {TextPromptFactory} from './element/text-prompt';
import {MessageBoxFactory} from './element/message-box';
import {TableFactory} from './element/table';
import {ImageElementFactory} from './element/image';
import {ExecActionFactory} from './action/exec';
import { SleepActionFactory} from './action/sleep';
import {MessageFactory} from './element/message';
import {ActionListFactory} from './element/action-list';
import {HeaderBarFactory} from './element/header-bar';
import {DataTableFactory} from './element/data-table';

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
