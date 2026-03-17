"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTable = void 0;
exports.TableFactory = TableFactory;
function TableFactory(terminal, data, options) {
    return new BasicTable(terminal, data, options);
}
class BasicTable {
    constructor(terminal, data = [], options) {
        options.columns = options.columns || [];
        options.padding = options.padding || ' | ';
        options.paddingStyle = options.paddingStyle || terminal.defaultColor.bgDefaultColor;
        options.x = options.x || null;
        options.y = options.y || null;
        options.columns.forEach((column) => {
            column.width = column.width || 0;
            column.style = column.style || terminal.defaultColor.bgDefaultColor;
            data.forEach((row) => {
                const len = this.getValue(column.key, row).length;
                column.width = (len > column.width) ? len : column.width;
            });
        });
        let line = 0;
        data.forEach((row) => {
            if (options.x && options.y) {
                terminal.moveTo(options.x, options.y + line);
            }
            else {
                terminal.defaultColor.bgDefaultColor('\n');
            }
            options.paddingStyle(options.padding);
            options.columns.forEach((col) => {
                const text = this.getValue(col.key, row).padEnd(col.width, ' ');
                col.style(text);
                options.paddingStyle(options.padding);
            });
            line++;
        });
    }
    getValue(accessor, object) {
        if (typeof accessor === 'function') {
            return String(accessor(object));
        }
        if (typeof accessor === 'string') {
            return String(object[accessor]);
        }
        throw new Error('Accessor must be a function or string. Received ' + typeof accessor);
    }
}
exports.BasicTable = BasicTable;
