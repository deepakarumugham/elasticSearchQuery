//*************** Constants ****************//
var MODULE_ID = '[ESQ_REQUEST_HANDLER]';
var ACTIONS_DIR = './actions';
var ACTIONS_FILE_EXTENSION = '.js';
var logger = require('log4js').getLogger(MODULE_ID);
var initialized = false;

//*************** Require External Modules ****************//
var cacheUpdater = require('./cache_updater.js'); 

var getResponse = function(callback){
	
		cacheUpdater.cache.returnCacheValue(function(data,err){
			var result = JSON.stringify(data);
			callback(result,err);
		
		});
	
}
exports.getResponse=getResponse;