'use strict';

define(
    [
        'ennovum.environment',
        'ennovum.composition',
        'ennovum.utils',
        'ennovum.worker.WorkerFunction'
    ],
    function (
        environment,
        composition,
        utils,
        WorkerFunction
    ) {
        /**
         * WorkerDownloader constructor
         */
        var WorkerDownloader = function WorkerDownloader(config) {
            var itc = {
                workerFunction: undefined,
                fn: undefined
            }

            init.call(this, itc, config);

            return this;
        };

        //
        var DOWNLOAD_FUNCTION = function (data, success, failure) {
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

        /**
         * Initializes instance
         */
        var init = function WorkerDownloader_init(itc, config) {
            itc.workerFunction = composition.mixin(this, new WorkerFunction(DOWNLOAD_FUNCTION, config));

            return true;
        };

        //
        return WorkerDownloader;
    });
