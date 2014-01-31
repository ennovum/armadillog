'use strict';

define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        /**
         * Dom constructor
         */
        var Dom = function Dom() {
            /**
             *
             */
            var createElement = this.createElement = function Dom_createElement(tagName, attributes, textContent) {
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
            var classContains = this.classContains = function Dom_classContains(el) {
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
            var classAdd = this.classAdd = function Dom_classAdd(el) {
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
            var classRemove = this.classRemove = function Dom_classRemove(el) {
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
            var classToggle = this.classToggle = function Dom_classToggle(el, className) {
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
                        classAdd(el, className);
                    }
                    else {
                        classRemove(el, className);
                    }
                }

                return true;
            };

            /**
             *
             */
            var classDepend = this.classDepend = function Dom_classToggle(el, className, condition) {
                if (!el) {
                    return;
                }

                if (condition) {
                    classAdd(el, className);
                }
                else {
                    classRemove(el, className);
                }

                return true;
            };

            /**
             *
             */
            var classNth = this.classNth = function Dom_classNth(num) {
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
            var classEvenOdd = this.classEvenOdd = function Dom_classEvenOdd(num) {
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
            var triggerEvent = this.triggerEvent = function Dom_triggerEvent(el, eventType) {
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
            var selectValue = this.selectValue = function Dom_selectValue(el, value) {
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

            /**
             *
             */
            var handle = this.handle = function Dom_handle(el, eventType, handler, useCapture, preventDefault, stopPropagation, ctx) {
                el && el.addEventListener(
                    eventType,
                    function (event) {
                        handler && handler.call(ctx, event);
                        preventDefault && event.preventDefault();
                        stopPropagation && event.stopPropagation();
                    },
                    useCapture);
            };
        };

        //
        return new Dom();
    });
