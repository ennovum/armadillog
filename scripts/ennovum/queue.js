'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
,    ],
    function (
        mEnvironment,
        mUtils
    ) {
/* ==================================================================================================== */

/**
 * Queue interface
 */
var iQueue = {
    'queue': function (thing) {},
    'dequeue': function (thing) {},
    'queued': function (thing) {}
};

/**
 * Queue constructor
 */
var Queue = function Queue() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, iQueue);
};

/**
 * Queue prototype
 */
Queue.prototype = {

    /**
     * Initializes instance
     */
    init: function Queue_init() {
        this.thingList = [];

        this.runBound = this.run.bind(this);

        return true;
    },

    /**
     * Puts a thing to the queue
     */
    queue: function Queue_queue(thing) {
        if (this.thingList.push(thing) === 1) {
            this.run();
        }

        return true;
    },

    /**
     * Removes certain thing from the queue
     */
    dequeue: function Queue_dequeue(thing) {
        if (typeof thing === 'undefined') {
            if (this.thingList.length === 0) {
                return false;
            }

            this.thingList.shift();

            mUtils.func.async(this.runBound);
        }
        else {
            var thingIndex = this.thingList.indexOf(thing);
            if (!~thingIndex) {
                return false;
            }

            this.thingList.splice(thingIndex, 1);

            if (thingIndex === 0) {
                mUtils.func.async(this.runBound);
            }
        }

        return true;
    },

    /**
     * Runs the queue
     */
    run: function Queue_run() {
        var thingIndex = 0;
        var thing = this.thingList[thingIndex];

        if (thing === undefined) {
            return false;
        }

        if (typeof thing === 'function') {
            thing();
        }

        return true;
    },

    /**
     * Returns number of queued elements matching argument or any
     */
    queued: function Queue_queued(thing) {
        if (typeof thing === 'undefined') {
            return this.thingList.length;
        }
        else {
            var index = -1;
            var count = 0;

            while (~(index = this.thingList.indexOf(thing, index + 1))) {
                count++;
            }

            return count;
        }
    },

    /**
     *
     */
    toString: function Queue_toString() {
        return 'ennovum.Queue';
    }

};

/* ==================================================================================================== */
        return {
            'Queue': Queue,
            'iQueue': iQueue
        };
    });
