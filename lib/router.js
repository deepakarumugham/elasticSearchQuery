//*************** Constants ****************//
var MODULE_ID = '[ESQ_ROUTER]';
var logger = require('log4js').getLogger(MODULE_ID);
var GET_URL_STRUCTURE = "/:tenantId/api/netflow/:srcGrp/:destGrp";


//*************** Require External Modules ****************//
var responseHandler = require("./response_handler.js");
var requestHandler = require("./request_handler.js");

// Setting routes according to the routing table
function setRoutes(app) {
    
	app.get(GET_URL_STRUCTURE, function(req, res) {
	
		var err = false;
		//Calling the request handler to retrieve top searches 
		requestHandler.getResponse(req, function(err, data){
			responseHandler.handleResponse(res,err,data);
		});	
			
	});
	
    
	function logErrors(err, req, res, next) {
			console.log("Error: ", err.stack);
			next(err);
		}
	
	function errorHandler(err, req, res, next) {
			var message = "URL: "+ req.url + " STACK: " + err.stack;
			res.status(500).send({status:500, message: message, type:'internal'});
		}
	
	app.use(logErrors);
	app.use(errorHandler);
}

//*************** EXPORTED PROPERTIES *****************//
exports.setRoutes = setRoutes;
