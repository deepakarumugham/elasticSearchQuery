//*************** Constants ****************//
var MODULE_ID = '[ESQ_REQUEST_HANDLER]';
var ACTIONS_DIR = './actions';
var ACTIONS_FILE_EXTENSION = '.js';
var logger = require('log4js').getLogger(MODULE_ID);
var initialized = false;

//*************** Require External Modules ****************//
var cacheUpdater = require('./cache_updater.js'); 

var getResponse = function(netflowRequest, callback){


		console.log("Params - ", netflowRequest);
	
		cacheUpdater.cache.queryES(netflowRequest, function(err, data, count){
			callback(err, JSON.stringify(data), count);
		
		});
	
}
exports.getResponse=getResponse;