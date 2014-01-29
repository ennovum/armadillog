'use strict';

window.define && define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        /**
         * UtilsObj interface
         */
        var iUtilsObj = {
            implement: function (base, instance, interfaceList) {},
            mixin: function (base, mixin) {}
        };

        /**
         * UtilsObj logic
         */
        var oUtilsObj = {

            /**
             *
             */
            implement: function Utils_obj_implement(base, instance, interfaceList) {
                switch (false) {
                    case base && typeof base === 'object':
                    case instance && typeof instance === 'object':
                    case interfaceList && typeof interfaceList === 'object':
                        console.error('oUtilsObj', 'implement', 'error: invalid input');
                        return;
                };

                if (!Array.isArray(interfaceList)) {
                    interfaceList = [interfaceList];
                }

                for (var i = 0, l = interfaceList.length; i < l; i++) {
                    for (var key in interfaceList[i]) {
                        if (typeof instance[key] === 'function') {
                            base[key] = instance[key].bind(instance);
                        }
                        else {
                            base[key] = instance[key];
                        }
                    }
                }

                return base;
            },

            /**
             *
             */
            mixin: function Utils_obj_mixin(base, mixin) {
                switch (false) {
                    case base && typeof base === 'object':
                    case mixin && typeof mixin === 'object':
                        console.error('oUtilsObj', 'mixin', 'error: invalid input');
                        return;
                };

                for (var key in mixin) {
                    if (key in base) {
                        continue;
                    }

                    if (typeof mixin[key] === 'function') {
                        base[key] = mixin[key].bind(mixin);
                    }
                    else {
                        base[key] = mixin[key];
                    }
                }

                return mixin;
            }

        };

        /**
         * UtilsDom interface
         */
        var iUtilsDom = {
            createElement: function (tagName, attributes, textContent) {},
            classContains: function (el) {},
            classAdd: function (el) {},
            classRemove: function (el) {},
            classToggle: function (el, className) {},
            classDepend: function (el, className, condition) {},
            classNth: function (num) {},
            classEvenOdd: function (num) {},
            triggerEvent: function (el, eventType) {},
            selectValue: function (el, value) {}
        };

        /**
         * UtilsDom logic
         */
        var oUtilsDom = {

            /**
             *
             */
            createElement: function Utils_dom_createElement(tagName, attributes, textContent) {
                switch (false) {
                    case typeof tagName === 'string':
                    case !attributes || typeof attributes === 'object':
                    case !textContent || typeof textContent === 'string':
                        console.error('oUtilsDom', 'createElement', 'invalid input');
                        return;
                };

                var el = document.createElement(tagName);

                if (attributes) {
                    for (var name in attributes) {
                        el.setAttribute(name, attributes[name]);
                    }
                }

                if (textContent) {
                    el.appendChild(document.createTextNode(textContent));
                }

                return el;
            },

            /**
             *
             */
            classContains: function Utils_dom_classContains(el) {
                if (!el) {
                    return;
                }

                var classList = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    classList.push.apply(classList, arguments[i].split(/[ ]+/));
                }

                var elClassList = el.className.split(/[ ]+/);
                var className;
                var elClassIdx;

                for (var i = 0, l = classList.length; i < l; i++) {
                    className = classList[i];

                    elClassIdx = elClassList.indexOf(className);
                    if (elClassIdx === -1) {
                        return false
                    }
                }

                return true;
            },

            /**
             *
             */
            classAdd: function Utils_dom_classAdd(el) {
                if (!el) {
                    return;
                }

                var classList = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    classList.push.apply(classList, arguments[i].split(/[ ]+/));
                }

                var elClassList = el.className.split(/[ ]+/);
                var className;
                var elClassIdx;

                for (var i = 0, l = classList.length; i < l; i++) {
                    className = classList[i];

                    elClassIdx = elClassList.indexOf(className);
                    if (elClassIdx === -1) {
                        elClassList.push(className);
                    }
                }

                className = elClassList.join(' ');
                if (el.className !== className) {
                    el.className = className;
                }

                return true;
            },

            /**
             *
             */
            classRemove: function Utils_dom_classRemove(el) {
                if (!el) {
                    return;
                }

                var classList = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    classList.push.apply(classList, arguments[i].split(/[ ]+/));
                }

                var elClassList = el.className.split(/[ ]+/);
                var className;
                var elClassIdx;

                for (var i = 0, l = classList.length; i < l; i++) {
                    className = classList[i];

                    elClassIdx = elClassList.indexOf(className);
                    if (elClassIdx !== -1) {
                        elClassList.splice(elClassIdx, 1);
                    }
                }

                className = elClassList.join(' ');
                if (el.className !== className) {
                    el.className = className;
                }

                return true;
            },

            /**
             *
             */
            classToggle: function Utils_dom_classToggle(el, className) {
                if (!el) {
                    return;
                }

                var classList = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    classList.push.apply(classList, arguments[i].split(/[ ]+/));
                }

                var elClassList = el.className.split(/[ ]+/);
                var className = true;
                var elClassIdx;

                for (var i = 0, l = classList.length; i < l; i++) {
                    className = classList[i];

                    elClassIdx = elClassList.indexOf(className);
                    if (elClassIdx === -1) {
                        this.classAdd(el, className);
                    }
                    else {
                        this.classRemove(el, className);
                    }
                }

                return true;
            },

            /**
             *
             */
            classDepend: function Utils_dom_classToggle(el, className, condition) {
                if (!el) {
                    return;
                }

                if (condition) {
                    this.classAdd(el, className);
                }
                else {
                    this.classRemove(el, className);
                }

                return true;
            },

            /**
             *
             */
            classNth: function Utils_dom_classNth(num) {
                switch (false) {
                    case typeof num === 'number':
                        console.error('oUtilsDom', 'classNth', 'invalid input');
                        return;
                };

                switch (num) {
                    case 0:
                        return 'el-zero';
                        break;

                    case 1:
                        return 'el-1st';
                        break;

                    case 2:
                        return 'el-2nd';
                        break;
                }

                return 'el-' + num + 'th';
            },

            /**
             *
             */
            classEvenOdd: function Utils_dom_classEvenOdd(num) {
                switch (false) {
                    case typeof num === 'number':
                        console.error('oUtilsDom', 'classEvenOdd', 'invalid input');
                        return;
                };

                return num % 2 ? 'el-odd' : 'el-even';
            },

            /**
             *
             */
            triggerEvent: function Utils_dom_triggerEvent(el, eventType) {
                if (!el) {
                    return;
                }

                if (document.createEvent) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent(eventType, true, true);
                    return !el.dispatchEvent(event);
                }
                else {
                    var event = document.createEventObject();
                    return el.fireEvent('on' + eventType, event)
                }

                return true;
            },

            /**
             *
             */
            selectValue: function Utils_dom_selectValue(el, value) {
                if (!el) {
                    return;
                }

                if (value === undefined) {
                    return el.options[el.selectedIndex].value;
                }
                else {
                    for (var i = 0, l = el.options.length; i < l; i++) {
                        if (el.options[i].value === value) {
                            el.selectedIndex = i;
                            break;
                        }
                    }
                }

                return true;
            }

        };

        /**
         * UtilsString interface
         */
        var iUtilsString = {
            trim: function (subject) {},
            escapeXML: function (subject) {}
        };

        /**
         * UtilsString logic
         */
        var oUtilsString = {

            /**
             *
             */
            trim: function Utils_string_trim(subject) {
                return subject.replace(/(^\s|\s$)/g, '');
            },

            //
            ESCAPE_XML_ENTITIES: {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
            },

            /**
             *
             */
            escapeXML: function Utils_string_escapeXML(subject) {
                return subject.replace(/[<>"'&]{1}/g, function Utils_string_escapeXML_match(match) {
                    return this.ESCAPE_XML_ENTITIES[match];
                }.bind(this));
            }

        };

        /**
         * UtilsRegexp interface
         */
        var iUtilsRegexp = {
            escape: function (subject) {}
        };

        /**
         * UtilsRegexp logic
         */
        var oUtilsRegexp = {

            /**
             *
             */
            escape: function Utils_regexp_escape(subject) {
                return subject.replace(/[\[\]\{\}\?\+\*\.\\\|\(\)\^\$]/g, '\\$&');
            }

        };

        /**
         * UtilsFunc interface
         */
        var iUtilsFunc = {
            async: function (callback) {}
        };

        /**
         * UtilsFunc logic
         */
        var oUtilsFunc = {

            asyncList: [],
            asyncTimeout: null,

            /**
             *
             */
            async: function Utils_func_async(callback) {
                this.asyncList.push(callback);

                if (!this.asyncTimeout) {
                    this.asyncTimeout = setTimeout(
                        function Utils_func_async_callback() {
                            var asyncList = this.asyncList;
                            this.asyncList = [];
                            this.asyncTimeout = null;

                            for (var i = 0, l = asyncList.length; i < l; i++) {
                                asyncList[i].call();
                            }
                        }.bind(this),
                        0);
                }

                return true;
            }

        };

        /**
         * UtilsUrl interface
         */
        var iUtilsUrl = {
            validate: function (url) {}
        };

        /**
         * UtilsUrl logic
         */
        var oUtilsUrl = {

            //
            URL_PARTS_REGEXP: /^([a-zA-Z]+:\/\/)?((?:www\.)?(?:[a-zA-Z0-9\-\_\.%]*[a-zA-Z]+\.[a-zA-Z]{1,4}))?(:[0-9]+)?(\/[a-zA-Z0-9\-\_\.%/]?)?(\?[a-zA-Z0-9\-\_\.%=&]*)?(#[a-zA-Z0-9\-\_]*)?$/,

            /**
             *
             */
            validate: function Utils_url_validate(url) {
                var match = url.match(this.URL_PARTS_REGEXP);

                if (!match || !match[2]) {
                    return null;
                }

                var urlValid = '';
                urlValid += match[1] ? match[1] : 'http://';
                urlValid += match[2];
                urlValid += match[3] || '';
                urlValid += match[4] ? match[4] : '/';
                urlValid += match[5] || '';
                urlValid += match[6] || '';

                return urlValid;
            }

        };

        /**
         * UtilsUrl interface
         */
        var iUtilsDebug = {
            spy: function (subject) {}
        };

        /**
         * UtilsUrl logic
         */
        var oUtilsDebug = {

            FUNCTION_NAME_REGEXP: /[a-z]+ ([^\(]*)/i,

            spySeq: 0,

            /**
             *
             */
            spy: function Utils_debug_spy(subject) {
                switch (true) {
                    case typeof subject === 'function':
                        subject = this.spyItem(subject, subject);
                        break;

                    case Array.isArray(subject):
                        for (var i = 0, l = subject.length; i < l; i++) {
                            subject[i] = this.spyItem(subject, subject[i]);
                        }
                        break;

                    case typeof subject === 'object':
                        for (var k in subject) {
                            subject[k] = this.spyItem(subject, subject[k]);
                        }
                        break;

                    default:
                        console.error('Debug', 'spy', 'unsupported subject type');
                }

                return subject;
            },

            /**
             *
             */
            spyItem: function Utils_debug_spyItem(subject, item) {
                switch (true) {
                    case typeof item === 'function':
                        return function Debug_spyItem_spied() {
                            var seqNumber = oUtilsDebug.spySeq++;
                            var name = item.toString().split('\n')[0].match(oUtilsDebug.FUNCTION_NAME_REGEXP)[1] || 'anonymous';

                            console.log('[' + seqNumber + '][C]', name, arguments);
                            var result = item.apply(subject, arguments);
                            console.log('[' + seqNumber + '][R]', name, result);

                            return result;
                        };
                        break;

                    default:
                        return item;
                }
            }

        };

        // oUtilsDebug.spy(oUtilsObj);
        // oUtilsDebug.spy(oUtilsDom);
        // oUtilsDebug.spy(oUtilsString);
        // oUtilsDebug.spy(oUtilsRegexp);
        // oUtilsDebug.spy(oUtilsUrl);
        // oUtilsDebug.spy(oUtilsDebug);

        //
        return {
            'obj': oUtilsObj.implement({}, oUtilsObj, iUtilsObj),
            'dom': oUtilsObj.implement({}, oUtilsDom, iUtilsDom),
            'string': oUtilsObj.implement({}, oUtilsString, iUtilsString),
            'regexp': oUtilsObj.implement({}, oUtilsRegexp, iUtilsRegexp),
            'func': oUtilsObj.implement({}, oUtilsFunc, iUtilsFunc),
            'url': oUtilsObj.implement({}, oUtilsUrl, iUtilsUrl),
            'debug': oUtilsObj.implement({}, oUtilsDebug, iUtilsDebug)
        };
    });
