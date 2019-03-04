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

	//console.log(" Inside Cache_updater ", netflowRequest);
	var query =   {"query": {
    "bool": {
      "should": [
        {
          "bool": {
            "must": [
              {
                "match": {
                  "serverUserGroup": netflowRequest.destGrp
                }
              },
              {
                "match": {
                  "clientUserGroup": netflowRequest.srcGrp
                }
              },{
              "range": {
      "@timestamp": {
        "gte": netflowRequest.startTime,
        "lte": netflowRequest.endTime
      }
    }
              }
            ]
          }
        },
        {
          "bool": {
            "must": [
              {
                "match": {
                  "clientUserGroup": netflowRequest.destGrp
                }
              },
              {
                "match": {
                  "serverUserGroup": netflowRequest.srcGrp
                }
              },{
              "range": {
      "@timestamp": {
        "gte": netflowRequest.startTime,
        "lte": netflowRequest.endTime
      }
    }}
            ]
          }
        }
      ]
    }
    },
    "size": netflowRequest.endOffset-netflowRequest.startOffset,
    "from": netflowRequest.startOffset,
    "_source": [
      "serverUserGroup",
      "clientUserGroup",
      "serverMacAddress",
      "clientAddress",
      "clientMacAddress",
      "serverAddress"
    ],
   
    "sort": [
      {
        "serverUserGroup": {
          "order": "desc"
        }
      }
    ]
}
	//console.log("Query : ", JSON.stringify(query));
	//Calling the search api of elasticsearch using terms aggregation 
	client.search({
	  index: "netflow_" + netflowRequest.tenantId.toLowerCase(),
	  body: JSON.stringify(query)			
	}).then(function (res) {
		
		console.log(" Response time - ", res.took);
		var err = false;
		var totalCount = res.hits.total;
		var hits = res.hits.hits;
		var result = new Array();
		for(var i=0; i<hits.length; i++){
			result.push(hits[i]._source);
		}
		var response = {
			"TotalCount": totalCount,
			"Data": result
		}

		if(callback)
			callback(err, response);
			
	}, function (err) {
		top_searches_results=[];
		console.log(err.message);
		if(callback)
			callback(err, top_searches_results);
	});
		
}

module.exports.cache = cache;
