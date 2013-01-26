'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'ennovum.Utils'
	],
	function (mEnvironment, mUtils) {
/* ==================================================================================================== */
		
// debug console logs switch
var DEBUG = false;

/**
 * Layout interface
 */
var iLayout = {
};

/**
 * Layout constructor
 */
var Layout = function Layout() {
	this.init.apply(this, arguments);
	return mUtils.obj.implement({}, this, iLayout);
};

/**
 * Layout prototype
 */
Layout.prototype = {
	
	/**
	 * Initializes instance
	 * 
	 * @param {object} config configuration object
	 */
	init: function Layout_init(config) {
		DEBUG && console && console.log('Layout', 'init', arguments);
		
		switch (true) {
			case !this.configSet(config):
			case !this.viewInit():
			case !this.uiInit():
			case !this.keyboardInit():
				return false;
				break;
		}

		return true;
	},
	
	/**
	 * Initializes config
	 * 
	 * @param {object} config configuration object
	 */
	configSet: function Layout_configSet(config) {
		DEBUG && console && console.log('Layout', 'configSet', arguments);
		
		switch (false) {
			case !!config:
			case typeof config === 'object':
				console && console.error('Layout', 'configSet', 'invalid input');
				return false;
		};
		
		this.config = {
			mainmenuInputEl: config.mainmenuInputEl || null,
			inputWrapperEl: config.inputWrapperEl || null,
			inputFoldEl: config.inputFoldEl || null,
			mainmenuFilterEl: config.mainmenuFilterEl || null,
			filterWrapperEl: config.filterWrapperEl || null,
			filterFoldEl: config.filterFoldEl || null,
			mainmenuExamineEl: config.mainmenuExamineEl || null,
			examineWrapperEl: config.examineWrapperEl || null,
			examineFoldEl: config.examineFoldEl || null,
			contentBoxEl: config.contentBoxEl || null
		};
		
		return true;
	},
	
	/**
	 * Initializes view
	 */
	viewInit: function Layout_viewInit() {
		DEBUG && console && console.log('Layout', 'viewInit', arguments);

		// nothing
		
		return true;
	},
	
	/**
	 * Initializes UI
	 */
	uiInit: function Layout_uiInit() {
		DEBUG && console && console.log('Layout', 'uiInit', arguments);
		
		this.config.mainmenuInputEl.addEventListener(
			'click',
			function (evt) {
				this.inputToggle();
				evt.preventDefault();
			}.bind(this));
			
		this.config.inputFoldEl.addEventListener(
			'click',
			function (evt) {
				this.inputToggle();
				evt.preventDefault();
			}.bind(this));
			
		this.config.mainmenuFilterEl.addEventListener(
			'click',
			function (evt) {
				this.filterToggle();
				evt.preventDefault();
			}.bind(this));
			
		this.config.filterFoldEl.addEventListener(
			'click',
			function (evt) {
				this.filterToggle();
				evt.preventDefault();
			}.bind(this));
		
		this.config.mainmenuExamineEl.addEventListener(
			'click',
			function (evt) {
				this.examineToggle();
				evt.preventDefault();
			}.bind(this));
			
		this.config.examineFoldEl.addEventListener(
			'click',
			function (evt) {
				this.examineToggle();
				evt.preventDefault();
			}.bind(this));
		
		return true;
	},
	
	/**
	 * 
	 */
	keyboardInit: function Layout_keyboardInit() {
		DEBUG && console && console.log('Layout', 'keyboardInit', arguments);
		
		document.addEventListener(
			'keyup',
			function (evt) {
				switch (evt.target.tagName.toLowerCase()) {
					case 'input':
					case 'textarea':
						return;
						break;
				}
				
				switch (true) {
					case evt.keyCode === 73 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // i
						this.inputToggle();
						this.config.mainmenuInputEl.focus();
						break;

                    case evt.keyCode === 70 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // f
                        this.filterToggle();
                        this.config.mainmenuFilterEl.focus();
                        break;

                    case evt.keyCode === 69 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // e
                        this.examineToggle();
                        this.config.mainmenuExamineEl.focus();
                        break;

                    case evt.keyCode === 27 && !evt.ctrlKey && !evt.altKey && !evt.shiftKey: // esc
                        this.inputHide();
                        this.filterHide();
                        this.examineHide();
                        break;
				}
			}.bind(this));
		
		return true;
	},
	
    /**
     * 
     */
    inputHide: function Layout_inputToggle() {
        DEBUG && console && console.log('Layout', 'inputHide', arguments);
        
        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        
        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        
        return true;
    },
    
    /**
     * 
     */
    inputToggle: function Layout_inputToggle() {
        DEBUG && console && console.log('Layout', 'inputToggle', arguments);
        
        mUtils.dom.classToggle(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        
        mUtils.dom.classToggle(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        
        return true;
    },
    
    /**
     * 
     */
    filterHide: function Layout_filterToggle() {
        DEBUG && console && console.log('Layout', 'filterHide', arguments);

        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        
        return true;
    },
    
    /**
     * 
     */
    filterToggle: function Layout_filterToggle() {
        DEBUG && console && console.log('Layout', 'filterToggle', arguments);

        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classToggle(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        
        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classToggle(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        
        return true;
    },
	
    /**
     * 
     */
    examineHide: function Layout_examineToggle() {
        DEBUG && console && console.log('Layout', 'examineHide', arguments);

        mUtils.dom.classRemove(this.config.mainmenuExamineEl, 'pressed')
        
        mUtils.dom.classAdd(this.config.examineWrapperEl, 'hidden');
        
        return true;
    },
    
    /**
     * 
     */
    examineToggle: function Layout_examineToggle() {
        DEBUG && console && console.log('Layout', 'examineToggle', arguments);

        mUtils.dom.classRemove(this.config.mainmenuInputEl, 'pressed');
        mUtils.dom.classRemove(this.config.mainmenuFilterEl, 'pressed')
        mUtils.dom.classToggle(this.config.mainmenuExamineEl, 'pressed')
        
        mUtils.dom.classAdd(this.config.inputWrapperEl, 'hidden');
        mUtils.dom.classAdd(this.config.filterWrapperEl, 'hidden');
        mUtils.dom.classToggle(this.config.examineWrapperEl, 'hidden');
        
        return true;
    },
	
	/**
	 * 
	 */
	toString: function Layout_toString() {
		return 'ennovum.Layout';
	}

};

/* ==================================================================================================== */
		return {
			'Layout': Layout,
			'iLayout': iLayout
		};
	});
