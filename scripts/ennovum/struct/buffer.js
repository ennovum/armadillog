'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils'
    ],
    function (mEnvironment, mUtils) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * Buffer interface
 */
var iBuffer = {
    setAt: function (outdex, value) {},
    getAt: function (outdex) {},
    push: function (value) {},
    pop: function () {},
    unshift: function (value) {},
    shift: function () {},
    splice: function (outdex, count, value) {},
    indexOf: function (value) {},
    lastIndexOf: function (value) {},
    length: function () {}
};

/**
 * Buffer constructor
 */
var Buffer = function Buffer() {
    this.init.apply(this, arguments);
    return mUtils.obj.implement({}, this, iBuffer);
};

/**
 * Buffer prototype
 */
Buffer.prototype = {

    LENGTH_STEP: 1000,

    /**
     * Initializes instance
     */
    init: function Buffer_init() {
        DEBUG && console.log('Buffer', 'init', arguments);

        this.list = [];
        this.firstIndex = 0;
        this.lastIndex = -1;

        return true;
    },

    /**
     * Sets the value at the index
     */
    setAt: function Buffer_setAt(outdex, value) {
        DEBUG && console.log('Buffer', 'setAt', arguments);

        var index = this.firstIndex + outdex;

        while (index < 0) {
            var args = [];
            args.length += this.LENGTH_STEP;
            this.list = args.concat(this.list);
            this.firstIndex += this.LENGTH_STEP;
            this.lastIndex += this.LENGTH_STEP;
            index += this.LENGTH_STEP;
        }
        while (index >= this.list.length) {
            this.list.length += this.LENGTH_STEP;
        }

        this.list[index] = value;

        if (index < this.firstIndex) {
            this.firstIndex = index;
        }
        if (index > this.lastIndex) {
            this.lastIndex = index;
        }

        return this.length();
    },

    /**
     * Gets a value at the index
     */
    getAt: function Buffer_getAt(outdex) {
        DEBUG && console.log('Buffer', 'getAt', arguments);

        var index = this.firstIndex + outdex;

        if (index < this.firstIndex || index > this.lastIndex) {
            return undefined;
        }
        else {
            return this.list[index];
        }
    },

    /**
     * Deletes the value at the index
     */
    delAt: function Buffer_delAt(outdex) {
        DEBUG && console.log('Buffer', 'delAt', arguments);

        var index = this.firstIndex + outdex;

        this.list[index] = undefined;

        if (index === this.firstIndex) {
            this.firstIndex += 1;
        }
        else if (index === this.lastIndex) {
            this.lastIndex -= 1;
        }

        return this.length();
    },

    /**
     * Pushes to the buffer
     */
    push: function Buffer_push(value) {
        DEBUG && console.log('Buffer', 'push', arguments);

        var outdex;

        for (var i = 0, l = arguments.length; i < l; i++) {
            value = arguments[i];
            outdex = this.lastIndex - this.firstIndex + 1;
            this.setAt(outdex, value);
        }

        return this.length();
    },

    /**
     * Pops from the index
     */
    pop: function Buffer_pop() {
        DEBUG && console.log('Buffer', 'pop', arguments);

        var outdex = this.lastIndex - this.firstIndex;
        var value = this.getAt(outdex);

        this.delAt(outdex);

        return value;
    },

    /**
     * Unshifts to the index
     */
    unshift: function Buffer_unshift(value) {
        DEBUG && console.log('Buffer', 'unshift', arguments);

        var outdex;

        for (var i = arguments.length - 1; i >= 0; i--) {
            value = arguments[i];
            outdex = -1;
            this.setAt(outdex, value);
        }

        return this.length();
    },

    /**
     * Shifts from the index
     */
    shift: function Buffer_shift() {
        DEBUG && console.log('Buffer', 'shift', arguments);

        var outdex = 0;
        var value = this.getAt(outdex);

        this.delAt(outdex);

        return value;
    },

    /**
     * Splices buffer
     */
    splice: function Buffer_splice(outdex, count, value) {
        DEBUG && console.log('Buffer', 'splice', arguments);

        var index = this.firstIndex + outdex;

        if (index < this.firstIndex || index + count > this.lastIndex + 1) {
            throw new Error('splice failed: invalid input');
        }

        var list = [];
        for (var i = index, l = index + count; i < l; i++) {
            list.push(this.list[i]);
        }

        var newList = Array.prototype.slice.call(arguments, 2);
        var newCount = newList.length;
        var delta = newCount - count;

        if (delta < 0) {
            for (var i = index + newCount, l = this.lastIndex + delta; i <= l; i++) {
                this.list[i] = this.list[i - delta];
            }
            for (var i = this.lastIndex + delta + 1, l = this.lastIndex; i <= l; i++) {
                this.list[i] = undefined;
            }
        }
        else if (delta > 0) {
            for (var i = this.lastIndex + delta; i >= index + newCount; i--) {
                this.list[i] = this.list[i - delta];
            }
        }

        this.lastIndex += delta;

        for (var i = index, l = index + newCount; i < l; i++) {
            this.list[i] = newList[i - index];
        }

        return list;
    },

    /**
     * Returns index of element or -1
     */
    indexOf: function Buffer_indexOf(value) {
        DEBUG && console.log('Buffer', 'indexOf', arguments);

        var index = this.list.indexOf(value);

        return index === -1 ? -1 : index - this.firstIndex;
    },

    /**
     * Returns last index of element or -1
     */
    lastIndexOf: function Buffer_lastIndexOf(value) {
        DEBUG && console.log('Buffer', 'lastIndexOf', arguments);

        var index = this.list.lastIndexOf(value);

        return index === -1 ? -1 : index - this.firstIndex;
    },

    /**
     * Returns length of the buffer
     */
    length: function Buffer_length() {
        DEBUG && console.log('Buffer', 'length', arguments);

        return this.lastIndex - this.firstIndex + 1;
    },

    /**
     *
     */
    toString: function Buffer_toString() {
        return 'ennovum.Buffer';
    }

};

/* ==================================================================================================== */
        return {
            'Buffer': Buffer,
            'iBuffer': iBuffer
        };
    });
