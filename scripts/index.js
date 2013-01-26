'use strict';

require.config({
	'packages': [
		{
			'name': 'Flexie',
			'location': 'scripts/vendor',
			'main': 'flexie.1.0.3.js'
		},
		{
			'name': 'Handlebars',
			'location': 'scripts/vendor',
			'main': 'handlebars-1.0.rc.1.js'
		},
		{
			'name': 'ennovum.Environment',
			'location': 'scripts/ennovum',
			'main': 'environment.js'
		},
		{
			'name': 'ennovum.Utils',
			'location': 'scripts/ennovum',
			'main': 'utils.js'
		},
		{
			'name': 'ennovum.Observable',
			'location': 'scripts/ennovum',
			'main': 'observable.js'
		},
		{
			'name': 'ennovum.Queue',
			'location': 'scripts/ennovum',
			'main': 'queue.js'
		},
		{
			'name': 'ennovum.Model',
			'location': 'scripts/ennovum/model',
			'main': 'model.js'
		},
		{
			'name': 'ennovum.Worker',
			'location': 'scripts/ennovum/worker',
			'main': 'worker.js'
		},
		{
			'name': 'ennovum.Armadillog',
			'location': 'scripts/ennovum/armadillog',
			'main': 'armadillog.js'
		},
		{
			'name': 'armadillog.Layout',
			'location': 'scripts/armadillog',
			'main': 'layout.js'
		}
	],
	'shim': {
		'Flexie': {
			'exports': 'Flexie'
		},
		'Handlebars': {
			'exports': 'Handlebars'
		}
	}
});

require(
	[
		'ennovum.Armadillog',
		'Flexie',
		'armadillog.Layout'
	],
	function (mArmadillog, Flexie, mLayout) {
		var config = {
			'bodyEl': document.querySelector('body'),
			'topEl': document.querySelector('#top'),
			'mainEl': document.querySelector('#main'),
			'mainmenuInputEl': document.querySelector('#armadillog-input-switch'),
			'mainmenuFilterEl': document.querySelector('#armadillog-filter-switch'),
			'mainmenuExamineEl': document.querySelector('#armadillog-examine-switch'),
			'inputWrapperEl': document.querySelector('#armadillog-input-wrapper'),
			'inputBoxEl': document.querySelector('#armadillog-input-box'),
			'inputFoldEl': document.querySelector('#armadillog-input-fold'),
			'filterWrapperEl': document.querySelector('#armadillog-filter-wrapper'),
			'filterBoxEl': document.querySelector('#armadillog-filter-box'),
			'filterFoldEl': document.querySelector('#armadillog-filter-fold'),
			'examineWrapperEl': document.querySelector('#armadillog-examine-wrapper'),
			'examineBoxEl': document.querySelector('#armadillog-examine-box'),
			'examineFoldEl': document.querySelector('#armadillog-examine-fold'),
			'contentBoxEl': document.querySelector('#armadillog-content-box'),
			'contentScrollEl': window,
			'contentDropEl': document.querySelector('#main')
		};
	
		var armadillog = new mArmadillog.Armadillog(config);
		var layout = new mLayout.Layout(config);

		var descriptionEl = document.querySelector('#description');
		var descriptionLineEl;
		var descriptionLineList = [];
		
		for (var i = 0, l = descriptionEl.childNodes.length; i < l; i++) {
			descriptionLineEl = descriptionEl.childNodes[i];
			if (descriptionLineEl.tagName) {
				descriptionLineList.push(descriptionLineEl.textContent);
			}
		}
		
		armadillog.contentTextSet(
			descriptionLineList.join("\n"),
			'Welcome message');
	});
