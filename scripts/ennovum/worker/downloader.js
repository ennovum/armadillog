'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'./function'
	],
	function (mEnvironment, mUtils, mWorkerFunction) {
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
	return mUtils.obj.implement({}, this, iWorkerDownloader);
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
		
		this.workerFunction = new mWorkerFunction.WorkerFunction(
			function (wid, data, success, failure) {
				try {
					var xhr = new XMLHttpRequest();
					xhr.open('GET', data.url, false);
					
					if (data.responseType) {
						xhr.responseType = data.responseType;
					}
					
					xhr.send();
	
					if (xhr.status === 0 || xhr.status === 200) {
						success(
							wid,
							{
								'url': data.url,
								'result': xhr.response
							});
					}
					else {
						failure(wid);
					}
				}
				catch (e) {
					failure(wid);
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
	run: function WorkerDownloader_run(data, ready, error) {
		DEBUG && console && console.log('WorkerDownloader', 'run', arguments);
		
		this.workerFunction.run(
			{
				'url': data.url
			},
			function (workerData) {
				data.result = workerData.result;
				ready(data);
			}.bind(this),
			function () {
				error();
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
