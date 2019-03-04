//*************** Constants ****************//
var MODULE_ID = '[ESQ_RESPONSE_HANDLER]';
var ACTION_MIDJET_ID = "action";

//*************** Require External Modules ****************//
var HttpStatus = require('http-status-codes');

var handleResponse = function(res,err,data) {

		if (err){
			
			res.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, {
				"Content-Type" : "application/json"
			});
			res.write("Error!");
			res.end();
			
		 } 
		
		else {
		
			res.writeHead(HttpStatus.OK, {'Content-Type': 'application/json' });
			res.write(data);
			res.end();
		   
		}
}


exports.handleResponse=handleResponse;
  
      