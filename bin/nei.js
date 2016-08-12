#!/usr/bin/env node

'use strict';
var util = require('../lib/util/util');
util.checkNodeVersion();
var main = require('../main');
var Args = require('../lib/util/args');
var splitChars = /[,;，；]/;

var options = {
    package: require('../package.json'),
    message: require('./config.js'),
    exit: function (code) {
        if (typeof(code) === 'undefined') {
            code = 0;
        }
        process.exit(code);
    },
    log: function (msg) {
        console.log(msg);
    },
    build: function (event) {
        var action = 'build';
        var config = event.options || {};
        config = this.format(action, config);
        config.action = action;
        if (!config.key) {
            this.show(action);
        } else {
            main.build(config);
        }
    },
    update: function (event) {
        var config = event.options || {};
        var id = (event.args || [])[0] || '';
        var action = 'update';
        config = this.format(action, config);
        config.action = action;
        if (id) {
            id.split(splitChars).forEach(function (it) {
                config.id = it;
                main.build(config);
            });
        } else {
            // update all project
            main.update(config);
        }
    },
    mock: function (event) {
        var action = 'mock';
        var config = event.options || {};
        var id = (event.args || [])[0];
        if (!id) {
            this.show(name);
            process.exit(0);
        }
        config = this.format(action, config);
        config.action = action;
        config.id = id;
        main.mock(config);
    },
    mobile: function (event) {
        var action = 'mobile';
        var config = event.options || {};
        var id = (event.args || [])[0];
        if (!id) {
            this.show(name);
            process.exit(0);
        }
        config = this.format(action, config);
        config.action = action;
        config.id = id;
        main.mobile(config);
    },
    server: function (event) {
        var action = 'server';
        var config = event.options || {};
        var id = (event.args || [])[0];
        config = this.format(action, config);
        config.action = action;
        config.id = id;
        main.server(config);
    },
    config: function (event) {
        var args = event.args;
        if (!/^(set|get|ls|list)$/.test(args[0])) {
            this.show('config');
        } else {
            switch (args[0]) {
                case 'set':
                    if (typeof(args[1]) !== 'undefined') {
                        util.setLocalConfig(args[1], args[2]);
                    }
                    break;
                case 'get':
                    if (args[1]) {
                        this.emit('log', util.getLocalConfig()[args[1]]);
                    } else {
                        this.show('config');
                    }
                    break;
                case 'ls':
                case 'list':
                    var config = util.getLocalConfig();
                    var str = '';
                    Object.keys(config).forEach(function (key) {
                        str += config[key] + '\n';
                    });
                    this.emit('log', str);
                    break;
            }
        }
        this.emit('exit', 0);
    }
};

var args = new Args(options);
// do command
args.exec(process.argv.slice(2));