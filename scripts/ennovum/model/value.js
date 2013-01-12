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
 * ModelValue interface
 */
var iModelValue = {
	'get': function () {},
	'set': function (value) {},
	'toString': function () {}
};

/**
 * ModelValue constructor
 */
var ModelValue = function ModelValue() {
	this.init.apply(this, arguments);
	return mUtils.obj.implement({}, this, [iModelValue, mObservable.iObservable, mQueue.iQueue]);
};

/**
 * ModelValue prototype
 */
ModelValue.prototype = {
	
	/**
	 * Initializes instance
	 */
	init: function ModelValue_init(value) {
		DEBUG && console && console.log('ModelValue', 'init', arguments);
		
		this.oObservable = mUtils.obj.mixin(this, new mObservable.Observable());
		this.oQueue = mUtils.obj.mixin(this, new mQueue.Queue());
		
		this.eventMap = {
			'model-update': []
		};
		
		this.valueListener = null;
		
		if (value !== undefined) {
			this.set(value);
		}

		return true;
	},
	
	/**
	 * Returns the value
	 */
	get: function ModelValue_get() {
		DEBUG && console && console.log('ModelValue', 'get', arguments);
		
		return this.value;
	},
	
	/**
	 * Sets the value
	 * 
	 * @param {mixed} value item's value
	 */
	set: function ModelValue_set(value) {
		DEBUG && console && console.log('ModelValue', 'set', arguments);
		
		var valueOld = this.value;
		
		if (value !== valueOld) {
			this.value = value;
			
			this.valueOff(key, valueOld);
			this.valueOn(key, value);

			this.eventAdd(
				'model-update',
				[{
					'valueNew': value,
					'valueOld': valueOld
				}]);
		}

		return true;
	},
	
	/**
	 * Attaches event forwarding
	 * 
	 * @param {mixed} value value to attach
	 */
	valueOn: function ModelValue_valueOn(value) {
		DEBUG && console && console.log('ModelValue', 'valueOn', arguments);
		
		if (value && typeof value === 'object' && 'on' in value && typeof value.on === 'function') {
			value.on(
				[
					'model-insert',
					'model-update',
					'model-delete',
					'model-forward'
				],
				this.valueListener = function ModelValue_valueOn_valueListener(event, dataList) {
					this.eventAdd(
						'model-forward',
						[{
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
	 * @param {mixed} value value to detach
	 */
	valueOff: function ModelValue_valueOff(value) {
		DEBUG && console && console.log('ModelValue', 'valueOff', arguments);
		
		if (this.valueListener) {
			value.off(
				[
					'model-insert',
					'model-update',
					'model-delete',
					'model-forward'
				],
				this.valueListener);
			
			this.valueListener = null;
		}

		return true;
	},
	
	/**
	 * Adds the event to the event map and queues event map flush
	 * 
	 * @param {string} event event name
	 * @param {dataList} event data list
	 */
	eventAdd: function ModelValue_eventAdd(event, dataList) {
		DEBUG && console && console.log('ModelValue', 'eventAdd', arguments);

		this.eventMap[event].push.apply(this.eventMap[event], dataList);

		this.queue(function ModelValue_eventAdd_eventTrigger() {
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
	toString: function ModelValue_toString() {
		return 'ennovum.model.ModelValue';
	}

};

/* ==================================================================================================== */
		return {
			'ModelValue': ModelValue,
			'iModelValue': iModelValue
		};
	});
