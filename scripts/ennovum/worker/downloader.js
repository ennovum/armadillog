'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'ennovum.Queue',
		'./function'
	],
	function (mEnvironment, mUtils, mQueue, mWorkerFunction) {
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
	return mUtils.obj.implement({}, this, [iWorkerDownloader, mQueue.iQueue]);
};

/**
 * WorkerDownloader prototype
 */
WorkerDownloader.prototype = {

	/**
	 * Initializes instance
	 */
	init: function WorkerDownloader_init() {
		DEBUG && console && console.log('WorkerDownloader', 'init', arguments);

		this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

		this.workerFunction = new mWorkerFunction.WorkerFunction(
			function (data, success, failure) {
				try {
					var xhr = new XMLHttpRequest();
					xhr.open('GET', data.url, false);

					if (data.responseType) {
						xhr.responseType = data.responseType;
					}

					xhr.send();

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
				catch (e) {
					failure(
						{
							'error': e.message
						},
						null);
				}
			});

		return true;
	},

	/**
	 * Destroys instance
	 */
	destroy: function WorkerDownloader_destroy() {
		DEBUG && console && console.log('WorkerDownloader', 'destroy', arguments);

		this.workerFunction.destroy();

		return true;
	},

	/**
	 * Runs the worker
	 *
	 * @param {mixed} data Message data
	 */
	run: function WorkerDownloader_run(data, transferables, ready, error) {
		DEBUG && console && console.log('WorkerDownloader', 'run', arguments);

		this.queue(function () {
			this.workerFunction.run(
				{
					'url': data.url
				},
				transferables,
				function (workerData) {
					data.result = workerData.result;
					ready(data);
					this.dequeue();
				}.bind(this),
				function (workerData) {
					data.error = workerData.error;
					error(data);
					this.dequeue();
				}.bind(this));
		}.bind(this));

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
