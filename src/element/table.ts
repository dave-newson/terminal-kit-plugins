import {Terminal} from 'terminal-kit';

/**
 * Element Factory
 */
export function TableFactory(terminal: Terminal, data: any[], options: TableOptions) {
    return new BasicTable(terminal, data, options);
}

/**
 * Options for basic table
 */
export interface TableOptions {
    columns: Array<{
        key: string,
        style: ((text: string) => void),
        width: number,
    }>;
    padding: string;
    paddingStyle: ((text: string) => void);
    x: null|number;
    y: null|number;
}

/**
 * Draw a table on the CLI
 */
export class BasicTable {

    constructor(
        terminal: Terminal,
        data: any[] = [],
        options: TableOptions,
    ) {

        // Set optional
        options.columns = options.columns || [];
        options.padding = options.padding || ' | ';
        options.paddingStyle = options.paddingStyle || terminal.defaultColor.bgDefaultColor;
        options.x = options.x || null;
        options.y = options.y || null;

        // Apply column rules
        options.columns.forEach((column) => {

            // Set optional
            column.width = column.width || 0;
            column.style = column.style || terminal.defaultColor.bgDefaultColor;

            // Find max width
            data.forEach((row) => {
                const len = this.getValue(column.key, row).length;
                column.width = (len > column.width) ? len : column.width;
            });
        });

        // Display table
        let line = 0;
        data.forEach((row) => {

            if (options.x && options.y) {
                terminal.moveTo(options.x, options.y + line);
            } else {
                terminal.defaultColor.bgDefaultColor('\n');
            }

            // Prefix-padding
            options.paddingStyle(options.padding);

            options.columns.forEach((col) => {

                // Pad to make it look like a table kinda
                const text = this.getValue(col.key, row).padEnd(col.width, ' ');

                // Display
                col.style(text);

                // Suffix-padding
                options.paddingStyle(options.padding);
            });

            // Next line
            line++;
        });
    }

    /**
     * Get a value from the passed object
     */
    private getValue(accessor: string|((obj: {}) => string), object: any): string {

        if (typeof accessor === 'function') {
            return String(accessor(object));
        }

        if (typeof accessor === 'string') {
            return String(object[accessor]);
        }

        throw new Error('Accessor must be a function or string. Received ' + typeof accessor);
    }
}
