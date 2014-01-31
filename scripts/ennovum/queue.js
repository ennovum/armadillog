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
            var thingList;

            /**
             * Initializes instance
             */
            var init = function Queue_init() {
                thingList = [];

                return true;
            };

            /**
             * Puts a thing to the queue
             */
            var queue = this.queue = function Queue_queue(thing) {
                if (thingList.push(thing) === 1) {
                    run();
                }

                return true;
            };

            /**
             * Removes certain thing from the queue
             */
            var dequeue = this.dequeue =function Queue_dequeue(thing) {
                if (typeof thing === 'undefined') {
                    if (thingList.length === 0) {
                        return false;
                    }

                    thingList.shift();

                    utils.func.async(run);
                }
                else {
                    var thingIx = thingList.indexOf(thing);
                    if (!~thingIx) {
                        return false;
                    }

                    thingList.splice(thingIx, 1);

                    if (thingIx === 0) {
                        utils.func.async(run);
                    }
                }

                return true;
            };

            /**
             * Runs the queue
             */
            var run = function Queue_run() {
                var thingIx = 0;
                var thing = thingList[thingIx];

                if (thing === undefined) {
                    return false;
                }

                if (typeof thing === 'function') {
                    thing();
                }

                return true;
            };

            /**
             * Returns number of queued elements matching argument or any
             */
            var queued = this.queued = function Queue_queued(thing) {
                if (typeof thing === 'undefined') {
                    return thingList.length;
                }
                else {
                    var ix = -1;
                    var count = 0;

                    while (~(ix = thingList.indexOf(thing, ix + 1))) {
                        count++;
                    }

                    return count;
                }
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
