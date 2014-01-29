'use strict';

window.define && define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        /**
         * UtilsObj constructor
         */
        var UtilsObj = function UtilsObj() {
            /**
             *
             */
            var implement = this.implement = function Utils_obj_implement(base, instance, interfaceList) {
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
            };

            /**
             *
             */
            var mixin = this.mixin = function Utils_obj_mixin(base, mixin) {
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
            };
        };

        /**
         * UtilsDom constructor
         */
        var UtilsDom = function UtilsDom() {
            /**
             *
             */
            var createElement = this.createElement = function Utils_dom_createElement(tagName, attributes, textContent) {
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
            };

            /**
             *
             */
            var classContains = this.classContains = function Utils_dom_classContains(el) {
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
            };

            /**
             *
             */
            var classAdd = this.classAdd = function Utils_dom_classAdd(el) {
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
            };

            /**
             *
             */
            var classRemove = this.classRemove = function Utils_dom_classRemove(el) {
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
            };

            /**
             *
             */
            var classToggle = this.classToggle = function Utils_dom_classToggle(el, className) {
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
            };

            /**
             *
             */
            var classDepend = this.classDepend = function Utils_dom_classToggle(el, className, condition) {
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
            };

            /**
             *
             */
            var classNth = this.classNth = function Utils_dom_classNth(num) {
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
            };

            /**
             *
             */
            var classEvenOdd = this.classEvenOdd = function Utils_dom_classEvenOdd(num) {
                switch (false) {
                    case typeof num === 'number':
                        console.error('oUtilsDom', 'classEvenOdd', 'invalid input');
                        return;
                };

                return num % 2 ? 'el-odd' : 'el-even';
            };

            /**
             *
             */
            var triggerEvent = this.triggerEvent = function Utils_dom_triggerEvent(el, eventType) {
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
            };

            /**
             *
             */
            var selectValue = this.selectValue = function Utils_dom_selectValue(el, value) {
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
            };
        };

        /**
         * UtilsString constructor
         */
        var UtilsString = function UtilsString() {
            /**
             *
             */
            var trim = this.trim = function Utils_string_trim(subject) {
                return subject.replace(/(^\s|\s$)/g, '');
            };

            var ESCAPE_XML_ENTITIES = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
            };

            /**
             *
             */
            var escapeXML = this.escapeXML =function Utils_string_escapeXML(subject) {
                return subject.replace(/[<>"'&]{1}/g, function Utils_string_escapeXML_match(match) {
                    return ESCAPE_XML_ENTITIES[match];
                });
            };
        };

        /**
         * UtilsRegexp constructor
         */
        var UtilsRegexp = function UtilsRegexp() {
            /**
             *
             */
            var escape = this.escape = function Utils_regexp_escape(subject) {
                return subject.replace(/[\[\]\{\}\?\+\*\.\\\|\(\)\^\$]/g, '\\$&');
            };
        };

        /**
         * UtilsFunc constructor
         */
        var UtilsFunc = function UtilsFunc() {
            var asyncList = [];
            var asyncTimeout = null;

            /**
             *
             */
            var async = this.async =function Utils_func_async(callback) {
                asyncList.push(callback);

                if (!asyncTimeout) {
                    asyncTimeout = setTimeout(
                        function Utils_func_async_callback() {
                            for (var i = 0, l = asyncList.length; i < l; i++) {
                                asyncList[i].call();
                            }

                            asyncList = [];
                            asyncTimeout = null;
                        },
                        0);
                }

                return true;
            };
        };

        /**
         * UtilsUrl constructor
         */
        var UtilsUrl = function UtilsUrl() {
            var URL_PARTS_REGEXP = /^([a-zA-Z]+:\/\/)?((?:www\.)?(?:[a-zA-Z0-9\-\_\.%]*[a-zA-Z]+\.[a-zA-Z]{1,4}))?(:[0-9]+)?(\/[a-zA-Z0-9\-\_\.%/]?)?(\?[a-zA-Z0-9\-\_\.%=&]*)?(#[a-zA-Z0-9\-\_]*)?$/;

            /**
             *
             */
            var validate = this.validate = function Utils_url_validate(url) {
                var match = url.match(URL_PARTS_REGEXP);

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
            };
        };

        /**
         * UtilsUrl constructor
         */
        var UtilsDebug = function UtilsDebug() {
            var FUNCTION_NAME_REGEXP = /[a-z]+ ([^\(]*)/i;

            var spySeq = 0;

            /**
             *
             */
            var spy = this.spy = function Utils_debug_spy(subject) {
                switch (true) {
                    case typeof subject === 'function':
                        subject = spyItem(subject, subject);
                        break;

                    case Array.isArray(subject):
                        for (var i = 0, l = subject.length; i < l; i++) {
                            subject[i] = spyItem(subject, subject[i]);
                        }
                        break;

                    case typeof subject === 'object':
                        for (var k in subject) {
                            subject[k] = spyItem(subject, subject[k]);
                        }
                        break;

                    default:
                        console.error('Debug', 'spy', 'unsupported subject type');
                }

                return subject;
            };

            /**
             *
             */
            var spyItem = function Utils_debug_spyItem(subject, item) {
                switch (true) {
                    case typeof item === 'function':
                        return function Debug_spyItem_spied() {
                            var seqNumber = spySeq++;
                            var name = item.toString().split('\n')[0].match(FUNCTION_NAME_REGEXP)[1] || 'anonymous';

                            console.log('[' + seqNumber + '][C]', name, arguments);
                            var result = item.apply(subject, arguments);
                            console.log('[' + seqNumber + '][R]', name, result);

                            return result;
                        };
                        break;

                    default:
                        return item;
                }
            };
        };

        //
        return {
            'obj': new UtilsObj(),
            'dom': new UtilsDom(),
            'string': new UtilsString(),
            'regexp': new UtilsRegexp(),
            'func': new UtilsFunc(),
            'url': new UtilsUrl(),
            'debug': new UtilsDebug()
        };
    });
