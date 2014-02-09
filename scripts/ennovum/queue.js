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
         * Queue constructor
         */
        var Queue = function Queue() {
            var itc = {
                list: [],
                pauses: 0
            };

            this.queue = queue.bind(this, itc);
            this.dequeue = dequeue.bind(this, itc);
            this.queued = queued.bind(this, itc);

            this.pause = pause.bind(this, itc);
            this.unpause = unpause.bind(this, itc);
            this.paused = paused.bind(this, itc);

            return this;
        };

        /**
         * Puts a thing to the queue
         */
        var queue = function Queue_queue(itc, thing, dequeue, fnCtx, fnArgs) {
            var item = {
                thing: thing,
                dequeue: dequeue,
                fnCtx: fnCtx,
                fnArgs: fnArgs,
                run: false
            };

            if (itc.list.push(item) === 1) {
                run(itc);
            }

            return true;
        };

        /**
         * Removes certain thing from the queue
         */
        var dequeue = function Queue_dequeue(itc, thing) {
            if (typeof thing === 'undefined') {
                if (itc.list.length === 0) {
                    return false;
                }

                itc.list.shift();

                utils.async(run, this, [itc]);
            }
            else {
                var ix = indexOf(itc, thing);
                if (!~ix) {
                    return false;
                }

                itc.list.splice(ix, 1);

                if (ix === 0) {
                    utils.async(run, this, [itc]);
                }
            }

            return true;
        };

        /**
         * Runs the queue
         */
        var run = function Queue_run(itc) {
            if (paused(itc) || itc.list.length === 0) {
                return false;
            }

            var item = itc.list[0];

            if (item.run) {
                return false;
            }
            item.run = true;

            if (typeof item.thing === 'function') {
                item.thing.apply(item.fnCtx, item.fnArgs);
            }

            if (item.dequeue === true) {
                dequeue(itc);
            }

            return true;
        };

        /**
         * Returns number of queued elements matching argument or any
         */
        var queued = function Queue_queued(itc, thing) {
            if (typeof thing === 'undefined') {
                return itc.list.length;
            }
            else {
                var ix = -1;
                var count = 0;

                while (~(ix = indexOf(itc, thing, ix + 1))) {
                    count++;
                }

                return count;
            }
        };

        /**
         *
         */
        var indexOf = function Queue_indexOf(itc, thing, ixFrom) {
            for (var i = ixFrom || 0, l = itc.list.length; i < l; i++) {
                if (itc.list[i].thing === thing) {
                    return i;
                }
            }

            return -1;
        };

        /**
         *
         */
        var pause = function Queue_pause(itc) {
            itc.pauses += 1;

            return true;
        };

        /**
         *
         */
        var unpause = function Queue_unpause(itc) {
            itc.pauses -= 1;

            run(itc);

            return true;
        };

        /**
         *
         */
        var paused = function Queue_paused(itc) {
            return itc.pauses > 0;
        };

        //
        return Queue;
    });
