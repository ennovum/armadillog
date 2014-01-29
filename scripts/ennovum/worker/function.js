'use strict';

window.define && define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.Queue'
    ],
    function (
        environment,
        utils,
        Queue
    ) {
        /**
         * WorkerFunction constructor
         */
        var WorkerFunction = function WorkerFunction() {
            var SOURCE = [
                '"use strict"',
                'var ready = function (wid) {',
                '    return function (data) {',
                '        postMessage(',
                '            {',
                '                "wid": wid,',
                '                "success": true,',
                '                "data": data',
                '            },',
                '            undefined);',
                '    };',
                '};',
                'var error = function (wid) {',
                '    return function (data) {',
                '        postMessage(',
                '            {',
                '                "wid": wid,',
                '                "success": false,',
                '                "data": data',
                '            },',
                '            undefined);',
                '    };',
                '};',
                'this.onmessage = function(event){',
                '    ({{function}}).call(this, event.data.data, ready(event.data.wid), error(event.data.wid));',
                '};',
            ].join('\n');

            var DISABLE_NATIVE_WORKER_STORAGE_NAME = 'disableNativeWorker';

            var queue;

            var config;
            var callback;

            var widSeq;
            var workMap;

            var source;
            var sourceURL;

            var worker;

            /**
             * Initializes instance
             *
             * @param {mixed} func Worker body function
             */
            var init = function WorkerFunction_init(argCallback, argConfig) {
                queue = utils.obj.mixin(this, new Queue());

                switch (false) {
                    case argCallback && typeof argCallback === 'function':
                    case !argConfig || typeof argConfig === 'object':
                        console.error('WorkerFunction', 'init', 'invalid input');
                        return false;
                        break;
                }

                config = {};
                configure(argConfig || {});

                callback = argCallback;

                widSeq = 0;
                workMap = {};

                source = SOURCE.replace('{{function}}', callback.toString());
                sourceURL = URL.createObjectURL(new Blob([source], {'type': 'text/javascript'}));

                try {
                    worker = new Worker(sourceURL);

                    worker.onmessage = function WorkerFunction_workerInit_onmessage(event) {
                        messageHandler(event.data.wid, event.data.success, event.data.data);
                    };

                    worker.onerror = function WorkerFunction_workerInit_onmessage(event) {
                        errorHandler(event.data.wid, event.message, event.filename, event.lineno);
                    };
                }
                catch (err) {
                    worker = null;
                }

                return true;
            };

            /**
             *
             */
            var configure = this.configure = function WorkerFunction_configure(argConfig) {
                switch (false) {
                    case typeof argConfig === 'object':
                        console.error('WorkerFunction', 'configure', 'invalid input');
                        return false;
                        break;
                }

                if (argConfig && 'disableNativeWorker' in argConfig) {
                    config['disableNativeWorker'] = !!argConfig['disableNativeWorker'];
                }

                return true;
            };

            /**
             * Destroys instance
             */
            var destroy = this.destroy = function WorkerFunction_destroy() {
                URL.revokeObjectURL(sourceURL);

                worker.terminate();

                return true;
            };

            /**
             * Runs the worker
             *
             * @param {mixed} data Message data
             */
            var run = this.run = function WorkerFunction_run(data, additional, ready, error, ctx) {
                switch (false) {
                    case !ready || typeof ready === 'function':
                    case !error || typeof error === 'function':
                        console.error('WorkerFunction', 'run', 'invalid input');
                        return false;
                        break;
                }

                var wid = '' + (widSeq++);
                var work = {
                    'ctx': ctx || null,
                    'additional': additional || null,
                    'ready': ready || null,
                    'error': error || null
                };

                workMap[wid] = work;

                queue.queue(function () {
                    if (!worker || config.disableNativeWorker || localStorage.getItem(DISABLE_NATIVE_WORKER_STORAGE_NAME)) {
                        callback(
                            data,
                            function (data) {
                                messageHandler(wid, true, data);
                            },
                            function (data) {
                                messageHandler(wid, false, data);
                            });
                    }
                    else {
                        worker.postMessage(
                            {
                                'wid': wid,
                                'data': data
                            });
                    }
                });

                queue.dequeue();

                return true;
            };

            /**
             * Handles worker message
             *
             * @param {mixed} data Message data
             */
            var messageHandler = function WorkerFunction_messageHandler(wid, success, data) {
                var work = workMap[wid];

                if (success) {
                    if (work.ready) {
                        work.ready.call(work.ctx, data, work.additional);
                    }
                }
                else {
                    if (work.error) {
                        work.error.call(work.ctx, data, work.additional);
                    }
                }

                return true;
            };

            /**
             * Handles worker error
             *
             * @param {mixed} data Error data
             */
            var errorHandler = function WorkerFunction_errorHandler(wid, message, filename, lineno) {
                console.error(message, filename, lineno);

                var work = workMap[wid];

                if (work.error) {
                    work.error.call(work.error, {'error': message});
                }

                return true;
            };

            /**
             *
             */
            var toString =function WorkerFunction_toString() {
                return 'ennovum.workerFunction';
            };

            init.apply(this, arguments);
            // utils.debug.spy(this);
        };

        //
        return WorkerFunction;
    });
