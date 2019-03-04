//*************** Constants ****************//
var MODULE_ID = '[ESQ_UPDATER]';
var ACTIONS_DIR = './actions';
var ACTIONS_FILE_EXTENSION = '.js';
var logger = require('log4js').getLogger(MODULE_ID);

var config = require('config');
var ELASTICSEARCH_HOST = config.elasticsearch.url;
var ELASTICSEARCH_INDEX = config.elasticsearch.index;
var TOP_SEARCHES_COUNT = config.elasticsearch.top_searches_count;

//*************** Require External Modules ****************//
var elasticsearch = require('elasticsearch');
var HttpStatus = require('http-status-codes');
var top_searches_results = [] ;

//Initializing elasticsearch client
var client = new elasticsearch.Client({
	host: ELASTICSEARCH_HOST
});

//Checking if elasticsearch is up and running
console.log("ELASTICSEARCH_HOST: " + ELASTICSEARCH_HOST);
client.ping({
	requestTimeout: 5000	
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

 
//Constructor
function Cache(){
	
	top_searches_results;
}

var cache = new Cache(); 

//Retrieving the top trending searches using the elasticsearch api
Cache.prototype.queryES=function queryES(netflowRequest, callback){

	console.log(" Inside Cache_updater ", netflowRequest);
	
	//Calling the search api of elasticsearch using terms aggregation 
	client.search({
	  index: "netflow_" + netflowRequest.tenantId.toLowerCase(),
	  body: {
	  	"query": {
    		"bool": {
      			"must": [
        			{
          				"match": {
            				"clientUserGroup": netflowRequest.srcGrp
          				}
        			},
        			{
          				"match": {
          					"serverUserGroup": netflowRequest.destGrp
          				}
        			}
      			]
    		}
  		}
	  }				
	}).then(function (res) {
		
		var err = false;
		var hits = res.hits.hits;
		var result = new Array();
		for(var i=0; i<hits.length; i++){
			result.push(hits[i]._source);
		}
		//console.log(" Responce - ", result);

		if(callback)
			callback(err, result);
			
	}, function (err) {
		top_searches_results=[];
		console.log(err.message);
		if(callback)
			callback(err, top_searches_results);
	});
		
}

module.exports.cache = cache;
