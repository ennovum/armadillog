'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (
        mEnvironment,
        mUtils
    ) {
        /**
         * Buffer constructor
         */
        var Buffer = function Buffer() {
            var LENGTH_STEP = 1000;

            var list;
            var firstIndex;
            var lastIndex;

            /**
             * Initializes instance
             */
            var init = function Buffer_init() {
                list = [];
                firstIndex = 0;
                lastIndex = -1;

                return true;
            },

            /**
             * Sets the value at the index
             */
            var setAt = this.setAt = function Buffer_setAt(outdex, value) {
                var index = firstIndex + outdex;

                while (index < 0) {
                    var args = [];
                    args.length += LENGTH_STEP;
                    list = args.concat(list);
                    firstIndex += LENGTH_STEP;
                    lastIndex += LENGTH_STEP;
                    index += LENGTH_STEP;
                }
                while (index >= list.length) {
                    list.length += LENGTH_STEP;
                }

                list[index] = value;

                if (index < firstIndex) {
                    firstIndex = index;
                }
                if (index > lastIndex) {
                    lastIndex = index;
                }

                return length();
            };

            /**
             * Gets a value at the index
             */
            var getAt = this.getAt = function Buffer_getAt(outdex) {
                var index = firstIndex + outdex;

                if (index < firstIndex || index > lastIndex) {
                    return undefined;
                }
                else {
                    return list[index];
                }
            };

            /**
             * Deletes the value at the index
             */
            var delAt = this.delAt = function Buffer_delAt(outdex) {
                var index = firstIndex + outdex;

                list[index] = undefined;

                if (index === firstIndex) {
                    firstIndex += 1;
                }
                else if (index === lastIndex) {
                    lastIndex -= 1;
                }

                return length();
            };

            /**
             * Pushes to the buffer
             */
            var push = this.push = function Buffer_push(value) {
                var outdex;

                for (var i = 0, l = arguments.length; i < l; i++) {
                    value = arguments[i];
                    outdex = lastIndex - firstIndex + 1;
                    setAt(outdex, value);
                }

                return length();
            };

            /**
             * Pops from the index
             */
            var pop = this.pop = function Buffer_pop() {
                var outdex = lastIndex - firstIndex;
                var value = getAt(outdex);

                delAt(outdex);

                return value;
            };

            /**
             * Unshifts to the index
             */
            var unshift = this.unshift = function Buffer_unshift(value) {
                var outdex;

                for (var i = arguments.length - 1; i >= 0; i--) {
                    value = arguments[i];
                    outdex = -1;
                    setAt(outdex, value);
                }

                return length();
            };

            /**
             * Shifts from the index
             */
            var shift = this.shift = function Buffer_shift() {
                var outdex = 0;
                var value = getAt(outdex);

                delAt(outdex);

                return value;
            };

            /**
             * Splices buffer
             */
            var splice = this.splice = function Buffer_splice(outdex, count, value) {
                var index = firstIndex + outdex;

                if (index < firstIndex || index + count > lastIndex + 1) {
                    throw new Error('splice failed: invalid input');
                }

                var list = [];
                for (var i = index, l = index + count; i < l; i++) {
                    list.push(list[i]);
                }

                var newList = Array.prototype.slice.call(arguments, 2);
                var newCount = newList.length;
                var delta = newCount - count;

                if (delta < 0) {
                    for (var i = index + newCount, l = lastIndex + delta; i <= l; i++) {
                        list[i] = list[i - delta];
                    }
                    for (var i = lastIndex + delta + 1, l = lastIndex; i <= l; i++) {
                        list[i] = undefined;
                    }
                }
                else if (delta > 0) {
                    for (var i = lastIndex + delta; i >= index + newCount; i--) {
                        list[i] = list[i - delta];
                    }
                }

                lastIndex += delta;

                for (var i = index, l = index + newCount; i < l; i++) {
                    list[i] = newList[i - index];
                }

                return list;
            };

            /**
             * Returns index of element or -1
             */
            var indexOf = this.indexOf = function Buffer_indexOf(value) {
                var index = list.indexOf(value);

                return index === -1 ? -1 : index - firstIndex;
            };

            /**
             * Returns last index of element or -1
             */
            var lastIndexOf = lastIndexOf = function Buffer_lastIndexOf(value) {
                var index = list.lastIndexOf(value);

                return index === -1 ? -1 : index - firstIndex;
            };

            /**
             * Returns length of the buffer
             */
            var length = this.length = function Buffer_length() {
                return lastIndex - firstIndex + 1;
            };

            /**
             *
             */
            var toString = this.toString = function Buffer_toString() {
                return 'ennovum.Buffer';
            };

            //
            init.apply(this, arguments);
            // mUtils.debug.spy(this);
        };

        //
        return {
            'Buffer': Buffer
        };
    });
