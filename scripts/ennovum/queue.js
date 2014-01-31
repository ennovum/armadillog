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
                    var thingIndex = thingList.indexOf(thing);
                    if (!~thingIndex) {
                        return false;
                    }

                    thingList.splice(thingIndex, 1);

                    if (thingIndex === 0) {
                        utils.func.async(run);
                    }
                }

                return true;
            };

            /**
             * Runs the queue
             */
            var run = function Queue_run() {
                var thingIndex = 0;
                var thing = thingList[thingIndex];

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
                    var index = -1;
                    var count = 0;

                    while (~(index = thingList.indexOf(thing, index + 1))) {
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
