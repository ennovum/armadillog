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
            var list;
            var pauses;

            /**
             * Initializes instance
             */
            var init = function Queue_init() {
                list = [];
                pauses = 0;

                return true;
            };

            /**
             * Puts a thing to the queue
             */
            var queue = this.queue = function Queue_queue(thing, dequeue, ctx, args) {
                var item = {
                    thing: thing,
                    dequeue: dequeue,
                    ctx: ctx,
                    args: args,
                    run: false
                };

                if (list.push(item) === 1) {
                    run();
                }

                return true;
            };

            /**
             * Removes certain thing from the queue
             */
            var dequeue = this.dequeue = function Queue_dequeue(thing) {
                if (typeof thing === 'undefined') {
                    if (list.length === 0) {
                        return false;
                    }

                    list.shift();

                    utils.func.async(run);
                }
                else {
                    var ix = indexOf(thing);
                    if (!~ix) {
                        return false;
                    }

                    list.splice(ix, 1);

                    if (ix === 0) {
                        utils.func.async(run);
                    }
                }

                return true;
            };

            /**
             * Runs the queue
             */
            var run = function Queue_run() {
                if (paused() || list.length === 0) {
                    return false;
                }

                var item = list[0];

                if (item.run) {
                    return false;
                }
                item.run = true;

                if (typeof item.thing === 'function') {
                    item.thing.apply(item.ctx, item.args);
                }

                if (item.dequeue === true) {
                    dequeue();
                }

                return true;
            };

            /**
             * Returns number of queued elements matching argument or any
             */
            var queued = this.queued = function Queue_queued(thing) {
                if (typeof thing === 'undefined') {
                    return list.length;
                }
                else {
                    var ix = -1;
                    var count = 0;

                    while (~(ix = indexOf(thing, ix + 1))) {
                        count++;
                    }

                    return count;
                }
            };

            /**
             *
             */
            var indexOf = function Queue_indexOf(thing, ixFrom) {
                for (var i = ixFrom || 0, l = list.length; i < l; i++) {
                    if (list[i].thing === thing) {
                        return i;
                    }
                }

                return -1;
            };

            /**
             *
             */
            var pause = this.pause = function Queue_pause() {
                pauses += 1;

                return true;
            };

            /**
             *
             */
            var unpause = this.unpause = function Queue_unpause() {
                pauses -= 1;

                run();

                return true;
            };

            /**
             *
             */
            var paused = this.paused = function Queue_paused() {
                return pauses > 0;
            };

            /**
             *
             */
            var toString = this.toString = function Queue_toString() {
                return 'ennovum.Queue';
            };

            //
            init.apply(this, arguments);
        };

        //
        return Queue;
    });
