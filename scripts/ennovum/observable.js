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
         * Observable constructor
         */
        var Observable = function Observable() {
            var itc = {
                eventHandlerMap: {}
            };

            this.handle = handle.bind(this, itc);
            this.unhandle = unhandle.bind(this, itc);
            this.trigger = trigger.bind(this, itc);

            return this;
        };

        /**
         * Binds events with a function
         *
         * @param {mixed} types list of or a single event name
         * @param {function} fn handler function
         * @param {mixed} fnCtx handler function context
         */
        var handle = function Observable_handle(itc, types, fn, fnCtx, fnArgs) {
            return handleEvents(itc, types, fn, fnCtx, fnArgs);
        };

        /**
         * Unbinds events from a function
         *
         * @param {mixed} types list of or a single event name
         * @param {function} fn handler function
         * @param {mixed} fnCtx handler function context
         */
        var unhandle = function Observable_unhandle(itc, types, fn, fnCtx) {
            return unhandleEvents(itc, types, fn, fnCtx);
        };

        /**
         * Triggers events
         *
         * @param {mixed} types list of or a single event name
         * @param {mixed} data event data
         */
        var trigger = function Observable_trigger(itc, types, data) {
            return triggerEventsHandlers(itc, types, data);
        };

        /**
         *
         */
        var handleEvents = function Observable_handleEvents(itc, types, fn, fnCtx, fnArgs) {
            types = [].concat(types);

            for (var i = 0, l = types.length; i < l; i++) {
                handleEvent(itc, types[i], fn, fnCtx, fnArgs);
            }

            return true;
        };

        /**
         *
         */
        var handleEvent = function Observable_handleEvent(itc, type, fn, fnCtx, fnArgs) {
            var handler = {
                fn: fn,
                fnCtx: fnCtx,
                fnArgs: fnArgs
            };

            if (!(type in itc.eventHandlerMap)) {
                itc.eventHandlerMap[type] = [];
            }

            itc.eventHandlerMap[type].push(handler);

            return true;
        };

        /**
         *
         */
        var unhandleEvents = function Observable_unhandleEvents(itc, types, fn, fnCtx) {
            types = [].concat(types);

            for (var i = 0, l = types.length; i < l; i++) {
                unhandleEvent(itc, types[i], fn, fnCtx);
            }

            return true;
        };

        /**
         *
         */
        var unhandleEvent = function Observable_unhandleEvent(itc, type, fn, fnCtx) {
            var handlerIx = handlerIndexOf(itc, type, fn, fnCtx);

            if (!~handlerIx) {
                console.error('Observable', 'unhandleEvent', 'no such event handler', type, fn, fnCtx);
                return false;
            }

            itc.eventHandlerMap[type].splice(handlerIx, 1);

            return true;
        };

        /**
         *
         */
        var handlerIndexOf = function Observable_handlerIndexOf(itc, type, fn, fnCtx) {
            var handlers = itc.eventHandlerMap[type] || [];
            var handler;

            for (var i = 0, l = handlers.length; i < l; i++) {
                handler = handlers[i];

                if (handler.fn === fn && handler.fnCtx === fnCtx) {
                    return i;
                }
            }

            return -1;
        };

        /**
         *
         */
        var triggerEventsHandlers = function Observable_triggerEventsHandlers(itc, types, data) {
            types = [].concat(types);

            for (var i = 0, l = types.length; i < l; i++) {
                triggerEventHandlers(itc, types[i], data);
            }

            return true;
        };

        /**
         *
         */
        var triggerEventHandlers = function Observable_triggerEventHandlers(itc, type, data) {
            if (!(type in itc.eventHandlerMap) || itc.eventHandlerMap[type].length === 0) {
                return false;
            }

            for (var i = 0, l = itc.eventHandlerMap[type].length; i < l; i++) {
                triggerEventHandler(itc, type, itc.eventHandlerMap[type][i], data);
            }
        };

        /**
         *
         */
        var triggerEventHandler = function Observable_triggerEventHandler(itc, type, handler, data) {
            try {
                handler.fn.apply(handler.fnCtx, (handler.fnArgs || []).concat([type, data]));
            }
            catch (err) {
                console.error('Observable', 'triggerEventHandler', 'event handler run error', err);
            }
        };

        //
        return Observable;
    });
