'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils',
		'ennovum.Observable',
		'ennovum.Queue'
	],
	function (mEnvironment, mUtils, mObservable, mQueue) {
/* ==================================================================================================== */

// debug console logs switch
var DEBUG = false;

/**
 * ModelMap interface
 */
var iModelMap = {
	'get': function (key) {},
	'set': function (key, value) {},
	'del': function (key) {},
	'toString': function () {}
};

/**
 * ModelMap constructor
 */
var ModelMap = function ModelMap() {
	this.init.apply(this, arguments);
	return mUtils.obj.implement({}, this, [iModelMap, mObservable.iObservable, mQueue.iQueue]);
};

/**
 * ModelMap prototype
 */
ModelMap.prototype = {
	
	/**
	 * Initializes instance
	 */
	init: function ModelMap_init() {
		DEBUG && console && console.log('ModelMap', 'init', arguments);
		
		this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
		this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());
		
		this.map = {};
		
		this.eventMap = {
			'model-insert': [],
			'model-update': [],
			'model-delete': [],
			'model-forward': []
		};
		
		this.valueListenerMap = {};
		
		if (arguments.length) {
			this.set.apply(this, arguments);
		}

		return true;
	},
	
	/**
	 * Returns a value at the given key
	 * 
	 * @param {string} key key of the value to return
	 */
	get: function ModelMap_get(key) {
		DEBUG && console && console.log('ModelMap', 'get', arguments);
		
		return this.map[key];
	},
	
	/**
	 * Sets the given values at the given keys
	 * 
	 * @param {string} key key of the value to be set
	 * @param {mixed} value value to be set
	 */
	set: function ModelMap_set(key, value) {
		DEBUG && console && console.log('ModelMap', 'set', arguments);

		var insertList = [];
		var updateList = [];
		
		for (var i = 0, l = arguments.length; i < l; i += 2) {
			key = '' + arguments[i];
			value = arguments[i + 1];

			if (key in this.map) {
				var valueOld = this.map[key];
				
				if (value !== valueOld) {
					this.map[key] = value;
			
					this.valueOff(key, valueOld);
					this.valueOn(key, value);
	
					updateList.push({
						'key': key,
						'valueNew': value,
						'valueOld': valueOld
					});
				}
			}
			else {
				this.map[key] = value;
				
				this.valueOn(key, value);
		
				insertList.push({
					'key': key,
					'valueNew': value
				});
			}
		}
		
		if (insertList.length) {
			this.eventAdd('model-insert', insertList);
		}

		if (updateList.length) {
			this.eventAdd('model-update', updateList);
		}

		return true;
	},
	
	/**
	 * Removes a value at the given key
	 * 
	 * @param {string} key key of the value to be deleted
	 */
	del: function ModelMap_del(key) {
		DEBUG && console && console.log('ModelMap', 'del', arguments);
		
		var deleteList = [];

		for (var i = 0, l = arguments.length; i < l; i++) {
			key = '' + arguments[i];
			
			if (key in this.map) {
				var valueOld = this.map[key];
				
				delete this.map[key];

				this.valueOff(key, valueOld);

				deleteList.push({
					'key': key,
					'valueOld': valueOld
				});
			}
		}

		if (deleteList.length) {
			this.eventAdd('model-delete', deleteList);
		}

		return true;
	},
	
	/**
	 * Attaches event forwarding
	 * 
	 * @param {number} key key of the value to attach
	 * @param {mixed} value value to attach
	 */
	valueOn: function ModelMap_valueOn(key, value) {
		DEBUG && console && console.log('ModelMap', 'valueOn', arguments);
		
		if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
			value.on(
				[
					'model-insert',
					'model-update',
					'model-delete',
					'model-forward'
				],
				this.valueListenerMap[key] = function ModelMap_valueOn_valueListener(event, dataList) {
					this.eventAdd(
						'model-forward',
						[{
							'key': key,
							'valueNew': value,
							'event': event,
							'dataList': dataList
						}]);
				}.bind(this));
		}
		
		return true;
	},
		
	/**
	 * Detaches event forwarding
	 * 
	 * @param {number} key key of the value to detach
	 * @param {mixed} value value to detach
	 */
	valueOff: function ModelMap_valueOff(key, value) {
		DEBUG && console && console.log('ModelMap', 'valueOff', arguments);

		if (this.valueListenerMap[key]) {
			value.off(
				[
					'model-insert',
					'model-update',
					'model-delete',
					'model-forward'
				],
				this.valueListenerMap[key]);
			
			this.valueListenerMap[key] = null;
		}
		
		return true;
	},
	
	/**
	 * Adds the event to the event map and queues event map flush
	 * 
	 * @param {string} event event name
	 * @param {dataList} event data list
	 */
	eventAdd: function ModelMap_eventAdd(event, dataList) {
		DEBUG && console && console.log('ModelMap', 'eventAdd', arguments);

		this.eventMap[event].push.apply(this.eventMap[event], dataList);

		this.queue(function ModelMap_eventAdd_eventTrigger() {
			for (event in this.eventMap) {
				if (this.eventMap[event].length) {
					this.trigger(event, this.eventMap[event]);
					this.eventMap[event] = [];
				}
			}
			
			this.dequeue();
		}.bind(this));
		
		return true;
	},
		
	/**
	 * 
	 */
	toString: function ModelMap_toString() {
		return 'ennovum.model.ModelMap';
	}

};

/* ==================================================================================================== */
		return {
			'ModelMap': ModelMap,
			'iModelMap': iModelMap
		};
	});
