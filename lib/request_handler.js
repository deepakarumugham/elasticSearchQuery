//*************** Constants ****************//
var MODULE_ID = '[ESQ_REQUEST_HANDLER]';
var ACTIONS_DIR = './actions';
var ACTIONS_FILE_EXTENSION = '.js';
var logger = require('log4js').getLogger(MODULE_ID);
var initialized = false;

//*************** Require External Modules ****************//
var cacheUpdater = require('./cache_updater.js'); 
var NetflowRequest = require("./netflowRequest.js");

var getResponse = function(req, callback){


		netflowRequest = new NetflowRequest(req.params.tenantId, req.params.srcGrp, req.params.destGrp,
		 req.query.start, req.query.end, req.query.startTime, req.query.endTime);

		console.log("Params - ", netflowRequest);
	
		cacheUpdater.cache.queryES(netflowRequest, function(err, data){
			callback(err, JSON.stringify(data));
		
		});
	
}
exports.getResponse=getResponse;