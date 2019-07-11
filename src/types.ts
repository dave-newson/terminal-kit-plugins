import {Terminal} from 'terminal-kit';
import {ExecResult, IExecOptions} from './action/exec';
import {BrowserAction} from './action/browser';
import {SleepAction} from './action/sleep';
import {ActionList, ActionListOptions} from './element/action-list';
import {Confirm} from './element/confirm';
import {HeaderBar, HeaderBarOptions} from './element/header-bar';
import {ImageElementOptions} from './element/image';
import {IMessageStyle, Message} from './element/message';
import {MessageBox, MessageBoxOptions} from './element/message-box';
import {TextPrompt, TextPromptOptions} from './element/text-prompt';
import {BasicTable, TableOptions} from './element/table';
import {DataTable, DataTableOptions} from './element/data-table';

/**
 * Enables access to the Plugins
 */
export interface TerminalKitPlugins extends Terminal {

    // Actions
    Exec(command: string[], options: IExecOptions): Promise<ExecResult>;
    Browser(): BrowserAction;
    Sleep(): SleepAction;

    // Elements
    ActionList(options: ActionListOptions): ActionList;
    Confirm(): Confirm;
    HeaderBar(options: HeaderBarOptions): HeaderBar;
    Image(path: string, options: ImageElementOptions): Promise<void>;
    Message(message?: string | null, style?: string | IMessageStyle): Message;
    MessageBox(options?: MessageBoxOptions): MessageBox;
    TextPrompt(options?: TextPromptOptions): TextPrompt;
    Table(data: any[], options: TableOptions): BasicTable;
    DataTable(options: DataTableOptions): DataTable;
}
