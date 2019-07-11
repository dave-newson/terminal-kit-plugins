import {createTerminal} from 'terminal-kit';
import * as TerminalKitPlugins from './index';

describe('Module', () => {

    describe('Plugin', () => {
        it('is available on the module as a function', () => {
            expect(TerminalKitPlugins).toHaveProperty('plugin');
            expect(typeof TerminalKitPlugins.plugin).toBe('function');
        });
    });

    // Setup TerminalKit with Plugins
    const terminal = createTerminal();
    TerminalKitPlugins.plugin(terminal);

    describe('Elements', () => {
        it('Contains all plugin elements', () => {

            expect(TerminalKitPlugins).toHaveProperty('elements');
            expect(typeof TerminalKitPlugins.elements).toBe('object');
            expect(Object.keys(TerminalKitPlugins.elements)).toEqual([
                'ActionList',
                'Confirm',
                'DataTable',
                'MessageBox',
                'Message',
                'TextPrompt',
                'HeaderBar',
                'Table',
                'Image',
                'Exec',
                'Sleep',
                'Browser'
            ]);
        });
    });
});
