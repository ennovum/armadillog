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
		'var ready = function (data, transferables) {',
		'    this.postMessage(',
		'        {',
		'            "success": true,',
		'            "data": data',
		'        },',
		'        null,',
		'        transferables);',
		'};',
		'var error = function (data, transferables) {',
		'    this.postMessage(',
		'        {',
		'            "success": false,',
		'            "data": data',
		'        },',
		'        null,',
		'        transferables);',
		'};',
		'this.onmessage = function(event){',
		'    (%FUNCTION%).call(this, event.data.data, ready, error);',
		'};',
	].join('\n'),

	/**
	 * Initializes instance
	 *
	 * @param {mixed} func Worker body function
	 */
	init: function WorkerFunction_init(func) {
		DEBUG && console && console.log('WorkerFunction', 'init', arguments);

		this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());

		this.workStack = [];

		this.source = this.SOURCE.replace('%FUNCTION%', typeof func === 'string' ? func : func.toString());
		this.sourceURL = URL.createObjectURL(new Blob([this.source], {'type': 'text/javascript'}));

		this.worker = new Worker(this.sourceURL);

		this.worker.onmessage = function WorkerFunction_workerInit_onmessage(event) {
			this.messageHandler(event.data.success, event.data.data);
		}.bind(this);

		this.worker.onerror = function WorkerFunction_workerInit_onmessage(event) {
			this.errorHandler(event.message, event.filename, event.lineno);
		}.bind(this);

		return true;
	},

	/**
	 * Destroys instance
	 */
	destroy: function WorkerFunction_destroy() {
		DEBUG && console && console.log('WorkerFunction', 'destroy', arguments);

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
		DEBUG && console && console.log('WorkerFunction', 'run', arguments);

		this.queue(function () {
			this.worker.postMessage(
				{
					'data': data
				},
				transferables);
		}.bind(this));

		this.workStack.push({
			'ready': ready,
			'error': error
		});

		return true;
	},

	/**
	 * Handles worker message
	 *
	 * @param {mixed} data Message data
	 */
	messageHandler: function WorkerFunction_messageHandler(success, data) {
		DEBUG && console && console.log('WorkerFunction', 'messageHandler', arguments);

		var work = this.workStack.shift();

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

		this.dequeue();

		return true;
	},

	/**
	 * Handles worker error
	 *
	 * @param {mixed} data Error data
	 */
	errorHandler: function WorkerFunction_errorHandler(message, filename, lineno) {
		DEBUG && console && console.log('WorkerFunction', 'errorHandler', arguments);

		DEBUG && console && console.error(message, filename, lineno);

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
