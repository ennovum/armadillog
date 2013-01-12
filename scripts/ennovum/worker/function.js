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
	return mUtils.obj.implement({}, this, iWorkerFunction);
};

/**
 * WorkerFunction prototype
 */
WorkerFunction.prototype = {
	
	SOURCE: [
		'var ready = function (wid, data) {',
		'    this.postMessage({',
		'        "wid": wid,',
		'        "success": true,',
		'        "data": data',
		'    });',
		'};',
		'var error = function (wid, data) {',
		'    this.postMessage({',
		'        "wid": wid,',
		'        "success": false,',
		'        "data": data',
		'    });',
		'};',
		'this.onmessage = function(event){',
		'    (%FUNCTION%).call(this, event.data.wid, event.data.data, ready, error);',
		'};',
	].join('\n'),
	
	/**
	 * Initializes instance
	 * 
	 * @param {mixed} func Worker body function
	 */
	init: function WorkerFunction_init(func) {
		DEBUG && console && console.log('WorkerFunction', 'init', arguments);
		
		this.widSeq = 0;
		this.workerData = {};
		this.workerQueue = new mQueue.Queue();

		this.source = this.SOURCE.replace('%FUNCTION%', typeof func === 'string' ? func : func.toString());
		this.sourceURL = URL.createObjectURL(new Blob([this.source], {'type': 'text/javascript'}));
		
		this.worker = new Worker(this.sourceURL);
		
		this.worker.onmessage = function WorkerFunction_workerInit_onmessage(event) {
			this.messageHandler(event.data.wid, event.data.success, event.data.data);
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
	run: function WorkerFunction_run(data, ready, error) {
		DEBUG && console && console.log('WorkerFunction', 'run', arguments);
		
		var wid = this.widSeq++;
		
		this.workerQueue.queue(function () {
			this.worker.postMessage({
				'wid': wid,
				'data': data
			});
		}.bind(this));
		
		this.workerData[wid] = {
			'ready': ready,
			'error': error
		};
		
		return true;
	},
	
	/**
	 * Handles worker message
	 * 
	 * @param {mixed} data Message data
	 */
	messageHandler: function WorkerFunction_messageHandler(wid, success, data) {
		DEBUG && console && console.log('WorkerFunction', 'messageHandler', arguments);
		
		if (success) {
			if (this.workerData[wid].ready) {
				this.workerData[wid].ready.call(this.workerData[wid].ready, data);
			}
		}
		else {
			if (this.workerData[wid].error) {
				this.workerData[wid].error.call(this.workerData[wid].ready, data);
			}
		}
		
		this.workerQueue.dequeue();
		delete this.workerData[wid];
		
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
