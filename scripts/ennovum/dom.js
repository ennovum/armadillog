'use strict';

define(
    [
        'ennovum.environment'
    ],
    function (
        environment
    ) {
        /**
         *
         */
        var createElement = function Dom_createElement(tagName, attributes, textContent) {
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

        //
        var classSplitRegex = /[ ]+/;

        /**
         *
         */
        var classListSplit = function Dom_classListGet(classValue) {
            return classValue.split(classSplitRegex);
        };

        /**
         *
         */
        var classListGet = function Dom_classListGet(el) {
            return classListSplit(el.className);
        };

        /**
         *
         */
        var classContains = function Dom_classContains(el, classValue) {
            switch (false) {
                case !!el:
                case !!classValue:
                    return false;
                    break;
            }

            var contains = true;

            classListSplit(classValue).forEach(function (className) {
                contains = classNameContains(el, className) && contains;
            });

            return contains;
        };

        /**
         *
         */
        var classNameContains = function Dom_classNameContains(el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            }

            var classList = classListGet(el);

            return classListContains(classList, className);
        };

        /**
         *
         */
        var classListContains = function Dom_classListContains(classList, className) {
            return classList.indexOf(className) !== -1;
        };

        /**
         *
         */
        var classAdd = function Dom_classAdd(el, classValue) {
            switch (false) {
                case !!el:
                case !!classValue:
                    return false;
                    break;
            }

            classListSplit(classValue).forEach(function (className) {
                classNameAdd(el, className);
            });

            return true;
        };

        /**
         *
         */
        var classNameAdd = function Dom_classNameAdd(el, className) {
            if (el.classList) {
                return el.classList.add(className);
            }

            var classList = classListGet(el);

            return classListAdd(classList, className);
        };

        /**
         *
         */
        var classListAdd = function Dom_classListAdd(classList, className) {
            var classIdx = classList.indexOf(className);

            if (classIdx === -1) {
                classList.push(className);
            }

            el.className = classList.join(' ');

            return true;
        };

        /**
         *
         */
        var classRemove = function Dom_classRemove(el, classValue) {
            switch (false) {
                case !!el:
                case !!classValue:
                    return false;
                    break;
            }

            classListSplit(classValue).forEach(function (className) {
                classNameRemove(el, className);
            });

            return true;
        };

        /**
         *
         */
        var classNameRemove = function Dom_classNameRemove(el, className) {
            if (el.classList) {
                return el.classList.remove(className);
            }

            var classList = classListGet(el);

            return classListRemove(classList, className);
        };

        /**
         *
         */
        var classListRemove = function Dom_classListRemove(classList, className) {
            var classIdx = classList.indexOf(className);

            if (classIdx !== -1) {
                classList.splice(classIdx, 1);
            }

            el.className = classList.join(' ');

            return true;
        };

        /**
         *
         */
        var classToggle = function Dom_classToggle(el, classValue) {
            switch (false) {
                case !!el:
                case !!classValue:
                    return false;
                    break;
            }

            classListSplit(classValue).forEach(function (className) {
                classNameToggle(el, className);
            });

            return true;
        };

        /**
         *
         */
        var classNameToggle = function Dom_classNameToggle(el, className) {
            if (el.classList) {
                return el.classList.toggle(className);
            }

            var classList = classListGet(el);

            if (classListContains(classList, className)) {
                return classListRemove(classList, className);
            }
            else {
                return classListAdd(classList, className);
            }
        };

        /**
         *
         */
        var classDepend = function Dom_classDepend(el, classValue, condition) {
            switch (false) {
                case !!el:
                case !!classValue:
                    return false;
                    break;
            }

            classListSplit(classValue).forEach(function (className) {
                classNameDepend(el, className, condition);
            });

            return true;
        };

        /**
         *
         */
        var classNameDepend = function Dom_classNameDepend(el, className, condition) {
            if (condition) {
                return classAdd(el, className);
            }
            else {
                return classRemove(el, className);
            }
        };

        /**
         *
         */
        var classNth = function Dom_classNth(num) {
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
        var classEvenOdd = function Dom_classEvenOdd(num) {
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
        var trigger = function Dom_trigger(el, eventType) {
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
        var handle = function Dom_handle(el, eventType, handler, useCapture, preventDefault, stopPropagation, ctx, args) {
            el && el.addEventListener(
                eventType,
                function (event) {
                    handler && handler.apply(ctx, (args || []).concat(event));
                    preventDefault && event.preventDefault();
                    stopPropagation && event.stopPropagation();
                },
                useCapture);
        };

        /**
         *
         */
        var selectValue = function Dom_selectValue(el, value) {
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

        //
        return {
            createElement: createElement,

            classContains: classContains,
            classAdd: classAdd,
            classRemove: classRemove,
            classToggle: classToggle,
            classDepend: classDepend,
            classNth: classNth,
            classEvenOdd: classEvenOdd,

            trigger: trigger,
            handle: handle,

            selectValue: selectValue
        };
    });
