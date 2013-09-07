'use strict';

window.define && define(
    [
        'ennovum.Environment',
        'ennovum.Utils',
        './function'
    ],
    function (
        mEnvironment,
        mUtils,
        mWorkerFunction
    ) {
/* ==================================================================================================== */

/**
 * Worker interface
 */
var iWorkerDownloader = {
    'run': function (data, ready, error) {},
    'destroy': function () {}
};

/**
 * WorkerDownloader constructor
 */
var WorkerDownloader = function WorkerDownloader() {
    this.init.apply(this, arguments);
    // mUtils.debug.spy(this);
    return mUtils.obj.implement({}, this, [iWorkerDownloader, mWorkerFunction.iWorkerFunction]);
};

/**
 * WorkerDownloader prototype
 */
WorkerDownloader.prototype = {

    /**
     * Initializes instance
     */
    init: function WorkerDownloader_init(config) {
        this.callback = function (data, success, failure) {
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

        this.oWorkerFunction = mUtils.obj.mixin(this, new mWorkerFunction.WorkerFunction(this.callback, config));

        return true;
    },

    /**
     *
     */
    toString: function WorkerDownloader_toString() {
        return 'ennovum.WorkerDownloader';
    }

};

/* ==================================================================================================== */
        return {
            'WorkerDownloader': WorkerDownloader,
            'iWorkerDownloader': iWorkerDownloader
        };
    });
