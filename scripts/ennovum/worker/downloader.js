'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.utils',
        'ennovum.worker.WorkerFunction'
    ],
    function (
        environment,
        utils,
        WorkerFunction
    ) {
        /**
         * WorkerDownloader constructor
         */
        var WorkerDownloader = function WorkerDownloader() {
            var workerFunction;

            var fn;

            /**
             * Initializes instance
             */
            var init = function WorkerDownloader_init(config) {
                fn = function (data, success, failure) {
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', data.url, true);

                        if (data.responseType) {
                            xhr.responseType = data.responseType;
                        }

                        xhr.onreadystatechange = function (event) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 0 || xhr.status === 200) {
                                    var result = xhr.response;
                                    var length = xhr.response.length;
                                    var lengthOriginal = length;

                                    if (data.limit && length > Math.abs(data.limit)) {
                                        if (data.limit < 0) {
                                            result = xhr.response.slice(data.limit);
                                            length = 0 - data.limit;
                                        }
                                        else {
                                            result = xhr.response.slice(0, data.limit);
                                            length = data.limit;
                                        }
                                    }

                                    success(
                                        {
                                            'url': data.url,
                                            'result': result,
                                            'length': length,
                                            'lengthOriginal': lengthOriginal
                                        },
                                        null);
                                }
                                else {
                                    failure(
                                        {
                                            'error': 'request failed'
                                        },
                                        null);
                                }
                            }
                        };

                        xhr.send();
                    }
                    catch (e) {
                        failure(
                            {
                                'error': e.message
                            },
                            null);
                    }
                };

                workerFunction = utils.obj.mixin(this, new WorkerFunction(fn, config));

                return true;
            };

            /**
             *
             */
            var toString = this.toString = function WorkerDownloader_toString() {
                return 'ennovum.workerDownloader';
            };

            init.apply(this, arguments);
        };

        //
        return WorkerDownloader;
    });
