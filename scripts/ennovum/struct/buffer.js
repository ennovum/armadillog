'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils'
    ],
    function (
        environment,
        utils
    ) {
        /**
         * Buffer constructor
         */
        var Buffer = function Buffer() {
            var LENGTH_STEP = 1000;

            var list;
            var firstIx;
            var lastIx;

            /**
             * Initializes instance
             */
            var init = function Buffer_init() {
                list = [];
                firstIx = 0;
                lastIx = -1;

                return true;
            },

            /**
             * Sets the value at the index
             */
            var setAt = this.setAt = function Buffer_setAt(outdex, value) {
                var ix = firstIx + outdex;

                while (ix < 0) {
                    var args = [];
                    args.length += LENGTH_STEP;
                    list = args.concat(list);
                    firstIx += LENGTH_STEP;
                    lastIx += LENGTH_STEP;
                    ix += LENGTH_STEP;
                }
                while (ix >= list.length) {
                    list.length += LENGTH_STEP;
                }

                list[ix] = value;

                if (ix < firstIx) {
                    firstIx = ix;
                }
                if (ix > lastIx) {
                    lastIx = ix;
                }

                return length();
            };

            /**
             * Gets a value at the index
             */
            var getAt = this.getAt = function Buffer_getAt(outdex) {
                var ix = firstIx + outdex;

                if (ix < firstIx || ix > lastIx) {
                    return undefined;
                }
                else {
                    return list[ix];
                }
            };

            /**
             * Deletes the value at the index
             */
            var delAt = this.delAt = function Buffer_delAt(outdex) {
                var ix = firstIx + outdex;

                list[ix] = undefined;

                if (ix === firstIx) {
                    firstIx += 1;
                }
                else if (ix === lastIx) {
                    lastIx -= 1;
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
                    outdex = lastIx - firstIx + 1;
                    setAt(outdex, value);
                }

                return length();
            };

            /**
             * Pops from the index
             */
            var pop = this.pop = function Buffer_pop() {
                var outdex = lastIx - firstIx;
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
                var ix = firstIx + outdex;

                if (ix < firstIx || ix + count > lastIx + 1) {
                    throw new Error('splice failed: invalid input');
                }

                var list = [];
                for (var i = ix, l = ix + count; i < l; i++) {
                    list.push(list[i]);
                }

                var newList = Array.prototype.slice.call(arguments, 2);
                var newCount = newList.length;
                var delta = newCount - count;

                if (delta < 0) {
                    for (var i = ix + newCount, l = lastIx + delta; i <= l; i++) {
                        list[i] = list[i - delta];
                    }
                    for (var i = lastIx + delta + 1, l = lastIx; i <= l; i++) {
                        list[i] = undefined;
                    }
                }
                else if (delta > 0) {
                    for (var i = lastIx + delta; i >= ix + newCount; i--) {
                        list[i] = list[i - delta];
                    }
                }

                lastIx += delta;

                for (var i = ix, l = ix + newCount; i < l; i++) {
                    list[i] = newList[i - ix];
                }

                return list;
            };

            /**
             * Returns index of element or -1
             */
            var indexOf = this.indexOf = function Buffer_indexOf(value) {
                var ix = list.indexOf(value);

                return ix === -1 ? -1 : ix - firstIx;
            };

            /**
             * Returns last index of element or -1
             */
            var lastIxOf = lastIxOf = function Buffer_lastIxOf(value) {
                var ix = list.lastIxOf(value);

                return ix === -1 ? -1 : ix - firstIx;
            };

            /**
             * Returns length of the buffer
             */
            var length = this.length = function Buffer_length() {
                return lastIx - firstIx + 1;
            };

            /**
             *
             */
            var toString = this.toString = function Buffer_toString() {
                return 'ennovum.Buffer';
            };

            //
            init.apply(this, arguments);
        };

        //
        return Buffer;
    });
