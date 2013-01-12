'use strict';

window.define && define(
	[
		'ennovum.Environment',
		'./value',
		'./list',
		'./map'
	],
	function (mEnvironment, mModelValue, mModelList, mModelMap) {
		return {
			'ModelValue': mModelValue.ModelValue,
			'iModelValue': mModelValue.iModelValue,
			'ModelList': mModelList.ModelList,
			'iModelList': mModelList.iModelList,
			'ModelMap': mModelMap.ModelMap,
			'iModelMap': mModelMap.iModelMap
		};
	});
