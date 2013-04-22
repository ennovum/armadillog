'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'ennovum.Queue'
	],
	function (mEnvironment, mUtils, mQueue) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * Worker interface
 */
var iWorkerFunction = {
	'configure': function (config) {},
	'run': function (data, ready, error) {},
	'destroy': function () {}
};

/**
 * WorkerFunction constructor
 */
var WorkerFunction = function WorkerFunction() {
	this.init.apply(this, arguments);
	return mUtils.obj.implement({}, this, [iWorkerFunction, mQueue.iQueue]);
};

/**
 * WorkerFunction prototype
 */
WorkerFunction.prototype = {

	SOURCE: [
		'var ready = function (wid) {',
		'    return function (data, transferables) {',
		'        postMessage(',
		'            {',
		'                "wid": wid,',
		'                "success": true,',
		'                "data": data',
		'            },',
		'            null,',
		'            transferables);',
		'    };',
		'};',
		'var error = function (wid) {',
		'    return function (data, transferables) {',
		'        postMessage(',
		'            {',
		'                "wid": wid,',
		'                "success": false,',
		'                "data": data',
		'            },',
		'            null,',
		'            transferables);',
		'    };',
		'};',
		'this.onmessage = function(event){',
		'    (%FUNCTION%).call(this, event.data.data, ready(event.data.wid), error(event.data.wid));',
		'};',
	].join('\n'),

	DISABLE_NATIVE_WORKER_STORAGE_NAME: 'disableNativeWorker',

	/**
	 * Initializes instance
	 *
	 * @param {mixed} func Worker body function
	 */
	init: function WorkerFunction_init(callback, config) {
		DEBUG && console.log('WorkerFunction', 'init', arguments);

		this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

		switch (false) {
			case callback && typeof callback === 'function':
			case !config || typeof config === 'object':
				console.error('WorkerFunction', 'init', 'invalid input');
				return false;
				break;
		}

		this.config = {};
		this.configure({
			'disableNativeWorker': config && 'disableNativeWorker' in config ? config['disableNativeWorker'] : false
		});

		this.callback = callback;

		this.widSeq = 0;
		this.workMap = {};

		this.source = this.SOURCE.replace('%FUNCTION%', this.callback.toString());
		this.sourceURL = URL.createObjectURL(new Blob([this.source], {'type': 'text/javascript'}));

		try {
			this.worker = new Worker(this.sourceURL);

			this.worker.onmessage = function WorkerFunction_workerInit_onmessage(event) {
				this.messageHandler(event.data.wid, event.data.success, event.data.data);
			}.bind(this);

			this.worker.onerror = function WorkerFunction_workerInit_onmessage(event) {
				this.errorHandler(event.data.wid, event.message, event.filename, event.lineno);
			}.bind(this);
		}
		catch (err) {
			this.worker = null;
		}

		return true;
	},

	/**
	 *
	 */
	configure: function WorkerFunction_configure(config) {
		DEBUG && console.log('WorkerFunction', 'configure', arguments);

		switch (false) {
			case typeof config === 'object':
				console.error('WorkerFunction', 'configure', 'invalid input');
				return false;
				break;
		}

		if (config && 'disableNativeWorker' in config) {
			this.config['disableNativeWorker'] = !!config['disableNativeWorker'];
		}

		return true;
	},

	/**
	 * Destroys instance
	 */
	destroy: function WorkerFunction_destroy() {
		DEBUG && console.log('WorkerFunction', 'destroy', arguments);

		URL.revokeObjectURL(this.sourceURL);

		this.worker.terminate();

		return true;
	},

	/**
	 * Runs the worker
	 *
	 * @param {mixed} data Message data
	 */
	run: function WorkerFunction_run(data, transferables, ready, error) {
		DEBUG && console.log('WorkerFunction', 'run', arguments);

		switch (false) {
			case !transferables || transferables === null || Array.isArray(transferables):
			case !ready || typeof ready === 'function':
			case !error || typeof error === 'function':
				console.error('WorkerFunction', 'run', 'invalid input');
				return false;
				break;
		}

		var wid = '' + (this.widSeq++);
		var work = {
			'ready': ready,
			'error': error
		};

		this.workMap[wid] = work;

		this.queue(function () {
			if (!this.worker || this.config.disableNativeWorker || localStorage.getItem(this.DISABLE_NATIVE_WORKER_STORAGE_NAME)) {
				this.callback(
					data,
					function (data) {
						this.messageHandler(wid, true, data);
					}.bind(this),
					function (data) {
						this.messageHandler(wid, false, data);
					}.bind(this));
			}
			else {
				this.worker.postMessage(
					{
						'wid': wid,
						'data': data
					},
					transferables);
			}
		}.bind(this));

		this.dequeue();

		return true;
	},

	/**
	 * Handles worker message
	 *
	 * @param {mixed} data Message data
	 */
	messageHandler: function WorkerFunction_messageHandler(wid, success, data) {
		DEBUG && console.log('WorkerFunction', 'messageHandler', arguments);

		var work = this.workMap[wid];

		if (success) {
			if (work.ready) {
				work.ready.call(work.ready, data);
			}
		}
		else {
			if (work.error) {
				work.error.call(work.error, data);
			}
		}

		return true;
	},

	/**
	 * Handles worker error
	 *
	 * @param {mixed} data Error data
	 */
	errorHandler: function WorkerFunction_errorHandler(wid, message, filename, lineno) {
		DEBUG && console.log('WorkerFunction', 'errorHandler', arguments);

		console.error(message, filename, lineno);

		var work = this.workMap[wid];

		if (work.error) {
			work.error.call(work.error, {'error': message});
		}

		return true;
	},

	/**
	 *
	 */
	toString: function WorkerFunction_toString() {
		return 'ennovum.WorkerFunction';
	}

};

/* ==================================================================================================== */
		return {
			'WorkerFunction': WorkerFunction,
			'iWorkerFunction': iWorkerFunction
		};
	});
