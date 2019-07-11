import {ExecSyncOptions, spawn} from 'child_process';
import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function ExecActionFactory(terminal: Terminal, ...args: any) {
    return (new ExecAction(terminal)).exec(args[0], args[1]);
}

/**
 * Error type for CLI exec failures
 */
export class ExecActionError extends Error {
    public code: number = -1;
    public command: string = '';
    public output: string = '';
}

/**
 * Command-line executor, for running CLI things.
 */
export class ExecAction {

    private terminal: Terminal;

    /**
     * Array of strings which may indicate additional error information
     */
    private errorExtra: string[] = [];

    constructor(terminal: Terminal) {
        this.terminal = terminal;
    }

    /**
     * Executes a command
     */
    public exec(command: string[], options: IExecOptions = {}): Promise<ExecResult> {
        return new Promise(async (resolve, reject) => {
            // Adjust options to sane values
            this.parseOptions(options);

            // Extract commands parts
            const cmd = command.slice(0, 1)[0];
            const args = command.slice(1);

            // Spawn the command
            const child = spawn(cmd, args, options);

            // Output buffer
            let outputBuffer = String();

            // Non-interactive can listen to stdio
            if (options.interactive === false && child.stdout && child.stderr) {
                // Listen STDOUT
                child.stdout.on('data', (data: string) => {
                    outputBuffer += '' + data;
                });

                // Listen for STDERR
                child.stderr.on('data', (data: string) => {
                    outputBuffer += '' + data;
                });
            } else {

                // Interactive terminals need to ensure TerminalKit isn't grabbing from STDIO
                // otherwise user input is corrupted by the dial stream consumption
                if ((this.terminal as any).grabbing) {
                    this.terminal.grabInput(false);
                }
            }

            // If we fail to spawn the command, an "error" event may be jettisoned by Spawn.
            // This usually means there's something wrong with how we tried to run the command, not the command itself.
            child.on('error', (error: any) => {
                if (error.code === 'ENOENT') {
                    this.errorExtra.push('ENOENT failure code given, indicating possible bad command call.');
                }
            });

            // Attach close event handler to resolve promise when closed
            child.on('close', async (code: number, signal: number) => {

                const result = new ExecResult(outputBuffer, code);

                // Reject on failure codes?
                if (!options.allowFailure && code !== 0) {
                    const e = new ExecActionError(
                        `Command failed with exit code ${code}. ${this.errorExtra.join(' ')}`
                    );
                    e.code = code;
                    e.command = command.join(' ');
                    e.output = outputBuffer;

                    reject(e);
                }

                // resolve command execution
                resolve(result);
            });
        });
    }

    /**
     * Parse the IExecOptions to SpawnOptions
     */
    private parseOptions(options: IExecOptions): any {

        // Default non-interactive settings
        options.stdio = 'pipe';

        // Force interactive, if not specified
        options.interactive = options.interactive === undefined ? true : options.interactive;

        // Interactive mode?
        if (options.interactive) {

            // Default: Shell should be "true", or ANSI colors get weirded
            (options.shell as any) = (options.shell === undefined) ? true : options.shell;

            // Interactive shells are a bit problematic right now
            // In order for most things to work, you need to pass the real stdin/stdout
            // using (process.stdin / inherit) mode
            // But this method can't be "listened" to by NodeJS.
            // @link https://stackoverflow.com/q/15339379
            options.stdio =  'inherit';
        }

        // Failures are not tolerated by default.
        options.allowFailure = (options.allowFailure === undefined) ? false : options.allowFailure;
    }

}

/**
 * Options you can pass to the executor
 */
export interface IExecOptions extends ExecSyncOptions {

    /**
     * When true, command will execute "interactively"
     * Users will be able to interact with the command STDIO,
     * however NodeJS will not be able to read the output of the command.
     */
    interactive?: boolean;

    /**
     * Indicates the command will execute a shell
     * This helps node deal with things like ANSI Colors across platforms.
     */
    shell?: string;

    /**
     * When true, non-zero exit codes will still cause a promise resolve ,
     * rather than a rejection.
     * This can be useful if you want to handle exit codes and error messages yourself.
     */
    allowFailure?: boolean;

    /**
     * Current working directory, in which to execute the command.
     */
    cwd?: string;
}

/**
 * Result of an execution
 */
export class ExecResult {
    public readonly output: string;
    public readonly exitCode: number;

    constructor(output: string, exitCode: number) {
        this.output = output;
        this.exitCode = exitCode;
    }
}
