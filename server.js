/** ************* Constants *************** */
var MODULE_ID = '[ESQ_SERVER]';
var logger = require('log4js').getLogger(MODULE_ID);
var config = require('config');
var LISTEN_PORT = config.server.port;
var CACHE_UPDATE_INTERVAL = config.cache.interval; //in minutes

// *************** Require External Modules ****************//
var express = require('express');
var router = require('./lib/router.js');
var cacheUpdater = require('./lib/cache_updater.js'); 

// *************** Application starting point ****************//
var app = express();
router.setRoutes(app);


function start(callback) {
    function startServer(){
        logger.info("Starting ESQ server");
		process.title = "ESQ";
		var server = app.listen(LISTEN_PORT, function() {
            logger.info('Listening on port %d ...', LISTEN_PORT);
			
			//Updating the cache every <CACHE_UPDATE_INTERVAL> minutes.
			//setInterval(cacheUpdater.cache.populateTopTrendingSearches,CACHE_UPDATE_INTERVAL*60*1000); 
			
		    if (callback) {
                callback(server);
            }
        });	
    }
	startServer();
}


if (require.main === module) {
	// started as a script
	start();
} else {
	// started by require().
	exports.start = start;
}

