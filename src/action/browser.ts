import {Terminal} from 'terminal-kit';
import {TerminalKitPlugins} from 'terminal-kit';

/**
 * Element Factory
 */
export function BrowserActionFactory(terminal: Terminal, ...args: any) {
    return new BrowserAction(terminal);
}

/**
 * Control a web browser on the OS
 */
export class BrowserAction {

    private term: TerminalKitPlugins;

    constructor(term: Terminal) {
        this.term = term as TerminalKitPlugins;
    }

    /**
     * Open a specified URL in the browser
     */
    public async open(url: string): Promise<void> {

        // Resolve cmd and args for OS
        let cmd = [];

        switch (process.platform) {
            case 'win32':
                cmd = ['cmd', '/c', 'start', url];
                break;
            case 'darwin':
                cmd = ['open', url];
                break;
            default:
                cmd = ['xdg-open', url];
                break;
        }

        // Execute command on CLI
        await this.term.Exec(cmd, {});
    }
}
