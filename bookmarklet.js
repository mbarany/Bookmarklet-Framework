"use strict";

(function () {
    var nameSpace = 'com.michaelbarany.bookmarklet';
    var State;
    var bookmarklet;

    State = function () {};
    State.prototype.css = [];
    State.prototype.js = [];
    State.prototype.dependencies = [];
    State.prototype.$ = null;
    State.prototype.die = function () {
        var i;

        for (i in this.js) {
            this.js[i].parentNode.removeChild(this.js[i]);
        }
        for (i in this.css) {
            this.css[i].parentNode.removeChild(this.css[i]);
        }
    };

    bookmarklet = {
        DEFAULT_JQUERY: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',

        state: new State(),

        _execute: function (_opts, cb) {
            var _this = this;
            var js = _opts.js || [];
            var css = _opts.css || [];
            var templates = _opts.templates || [];
            var jqueryUrl = _opts.jQuery || this.DEFAULT_JQUERY;
            var i;

            for (i in css) {
                this.loadCSS(css[i]);
            }

            this.loadScripts(jqueryUrl, js, function () {
                _this.loadTemplateFiles(templates).then(cb, function (e) {
                    throw e;
                });
            });
        },

        backupGlobals: function () {
            this.oldExports = window.exports;
            this.oldModule = window.module;
            this.oldDefine = window.define;
            // Temporarily disables AMD module loading if present
            window.define = undefined;
        },

        restoreGlobals: function () {
            window.exports = this.oldExports;
            window.module = this.oldModule;
            window.define = this.oldDefine;
        },

        loadCSS: function (file) {
            var r = Math.random();
            var element = document.createElement('link');
            element.setAttribute('rel', 'stylesheet');
            element.setAttribute('type', 'text/css');
            element.setAttribute('id', 'bookmarklet_css');
            element.setAttribute('href', file + '?_=' + r);

            document.getElementsByTagName('head')[0].appendChild(element);
            this.state.css.push(element);
        },

        loadScripts: function (jqueryUrl, js, cb) {
            var _this = this;
            this.loadJS(jqueryUrl, function ($) {
                _this.state.$ = $;
                _this.state.dependencies.push($);

                _this.loadJSFiles(js, cb);
            });
        },

        loadJSFiles: function (files, cb) {
            var _this = this;

            if (!files.length) {
                cb();
                return;
            }

            this.loadJS(files.shift(), function (dep) {
                _this.state.dependencies.push(dep);
                _this.loadJSFiles(files, cb);
            });
        },

        loadJS: function (file, cb) {
            var r = Math.random();
            var element = document.createElement('script');

            window.exports = {};
            window.module = {
                exports: {}
            };

            element.type = 'text/javascript';
            element.src = file + '?_=' + r;
            element.onload = function () {
                var dep = window.module.exports;
                if (cb) {
                    cb(dep);
                }
            };

            document.body.appendChild(element);
            this.state.js.push(element);
        },

        loadTemplateFiles: function (files) {
            var _this = this;

            if (!files.length) {
                return;
            }

            return this.loadTemplate(files.shift()).then(function (data) {
                _this.state.dependencies.push(data);
                return _this.loadTemplateFiles(files);
            }); 
       
        },

        loadTemplate: function (file) {
            return this.state.$.ajax({
                url: file
            });
        },

        run: function (url) {
            this.backupGlobals();
            this.loadJS(url);
            this.restoreGlobals();
        },

        execute: function (_opts, cb) {
            var _this = this;

            this.backupGlobals();
            this._execute(_opts, function () {
                _this.restoreGlobals();
                cb.apply(cb, _this.state.dependencies);
            });
        },

        die: function () {
            this.state.die();
            this.state = new State();
        }
    };

    // Exports
    window[nameSpace] = {
        run: function () {
            bookmarklet.run.apply(bookmarklet, arguments);
        },

        execute: function () {
            bookmarklet.execute.apply(bookmarklet, arguments);
        },

        die: function () {
            bookmarklet.die.apply(bookmarklet, arguments);
        }
    };

})();
