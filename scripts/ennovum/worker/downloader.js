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

// debug console logs switch
var DEBUG = false;

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
        DEBUG && console.log('WorkerDownloader', 'init', arguments);

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
                            success(
                                {
                                    'url': data.url,
                                    'result': xhr.response
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
