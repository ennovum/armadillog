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
            var itc = {
                list: [],
                firstIx: 0,
                lastIx: -1
            };

            this.setAt = setAt.bind(this, itc);
            this.getAt = getAt.bind(this, itc);
            this.delAt = delAt.bind(this, itc);

            this.push = push.bind(this, itc);
            this.pop = pop.bind(this, itc);
            this.unshift = unshift.bind(this, itc);
            this.shift = shift.bind(this, itc);
            this.splice = splice.bind(this, itc);
            this.indexOf = indexOf.bind(this, itc);
            this.lastIndexOf = lastIndexOf.bind(this, itc);

            this.toString = toString.bind(this, itc);

            return this;
        };

        //
        var LENGTH_STEP = 1000;

        /**
         * Sets the value at the index
         */
        var setAt = function Buffer_setAt(itc, outdex, value) {
            var ix = itc.firstIx + outdex;

            while (ix < 0) {
                var args = [];
                args.length += LENGTH_STEP;
                itc.list = args.concat(itc.list);
                itc.firstIx += LENGTH_STEP;
                itc.lastIx += LENGTH_STEP;
                ix += LENGTH_STEP;
            }
            while (ix >= itc.list.length) {
                itc.list.length += LENGTH_STEP;
            }

            itc.list[ix] = value;

            if (ix < itc.firstIx) {
                itc.firstIx = ix;
            }
            if (ix > itc.lastIx) {
                itc.lastIx = ix;
            }

            return length();
        };

        /**
         * Gets a value at the index
         */
        var getAt = function Buffer_getAt(itc, outdex) {
            var ix = itc.firstIx + outdex;

            if (ix < itc.firstIx || ix > itc.lastIx) {
                return undefined;
            }
            else {
                return itc.list[ix];
            }
        };

        /**
         * Deletes the value at the index
         */
        var delAt = function Buffer_delAt(itc, outdex) {
            var ix = itc.firstIx + outdex;

            itc.list[ix] = undefined;

            if (ix === itc.firstIx) {
                itc.firstIx += 1;
            }
            else if (ix === itc.lastIx) {
                itc.lastIx -= 1;
            }

            return length();
        };

        /**
         * Pushes to the buffer
         */
        var push = function Buffer_push(itc, value) {
            var outdex;

            for (var i = 0, l = arguments.length; i < l; i++) {
                value = arguments[i];
                outdex = itc.lastIx - itc.firstIx + 1;
                setAt(itc, outdex, value);
            }

            return length(itc);
        };

        /**
         * Pops from the index
         */
        var pop = function Buffer_pop(itc) {
            var outdex = itc.lastIx - itc.firstIx;
            var value = getAt(itc, outdex);

            delAt(itc, outdex);

            return value;
        };

        /**
         * Unshifts to the index
         */
        var unshift = function Buffer_unshift(itc, value) {
            var outdex;

            for (var i = arguments.length - 1; i >= 0; i--) {
                value = arguments[i];
                outdex = -1;
                setAt(itc, outdex, value);
            }

            return length(itc);
        };

        /**
         * Shifts from the index
         */
        var shift = function Buffer_shift(itc) {
            var outdex = 0;
            var value = getAt(itc, outdex);

            delAt(itc, outdex);

            return value;
        };

        /**
         * Splices buffer
         */
        var splice = function Buffer_splice(itc, outdex, count, value) {
            var ix = itc.firstIx + outdex;

            if (ix < itc.firstIx || ix + count > itc.lastIx + 1) {
                throw new Error('splice failed: invalid input');
            }

            var itc.list = [];
            for (var i = ix, l = ix + count; i < l; i++) {
                itc.list.push(itc.list[i]);
            }

            var newList = Array.prototype.slice.call(arguments, 2);
            var newCount = newList.length;
            var delta = newCount - count;

            if (delta < 0) {
                for (var i = ix + newCount, l = itc.lastIx + delta; i <= l; i++) {
                    itc.list[i] = itc.list[i - delta];
                }
                for (var i = itc.lastIx + delta + 1, l = itc.lastIx; i <= l; i++) {
                    itc.list[i] = undefined;
                }
            }
            else if (delta > 0) {
                for (var i = itc.lastIx + delta; i >= ix + newCount; i--) {
                    itc.list[i] = itc.list[i - delta];
                }
            }

            itc.lastIx += delta;

            for (var i = ix, l = ix + newCount; i < l; i++) {
                itc.list[i] = newList[i - ix];
            }

            return itc.list;
        };

        /**
         * Returns index of element or -1
         */
        var indexOf = function Buffer_indexOf(itc, value) {
            var ix = itc.list.indexOf(value);

            return ix === -1 ? -1 : ix - itc.firstIx;
        };

        /**
         * Returns last index of element or -1
         */
        var lastIndexOf = function Buffer_lastIndexOf(itc, value) {
            var ix = itc.list.lastIndexOf(value);

            return ix === -1 ? -1 : ix - itc.firstIx;
        };

        /**
         * Returns length of the buffer
         */
        var length = function Buffer_length(itc) {
            return itc.lastIx - itc.firstIx + 1;
        };

        /**
         *
         */
        var toString = function Buffer_toString(itc) {
            return 'ennovum.Buffer';
        };

        //
        return Buffer;
    });
