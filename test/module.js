'use strict';

const expect = require('chai').expect;

describe("Module", function() {
    describe("Plugin", function () {
        it("is available on the module as a function", function () {

            const module = require('../index.js');

            expect(module).to.have.property('plugin');
            expect(module.plugin).to.be.a('function');

        });
    });

    describe("Elements", function () {
        it("Contains all plugin elements", function () {

            const module = require('../index.js');

            expect(module).to.have.property('elements');
            expect(module.elements).to.be.a('object');
            expect(module.elements).to.have.keys([
                'ActionList',
                'DataTable',
                'Confirm',
                'Message',
                'MessageBox',
                'TextPrompt',
            ]);

        });
    });
});
