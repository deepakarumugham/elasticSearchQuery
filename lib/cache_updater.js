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
Cache.prototype.populateTopTrendingSearches=function populateTopTrendingSearches(callback){

	
	//Calling the search api of elasticsearch using terms aggregation 
	client.search({
	  index: ELASTICSEARCH_INDEX,
	  body: {
		"size" : 0, // Setting size=0 to hide search hits as we only want to see the aggregation results in the response.
		"aggs" : {
			"top_trending_searches" : {
				"terms" : { "field" : "keyword" , "size": TOP_SEARCHES_COUNT } // Set size=10 to retrieve only top 10 trending searches.
				}
			}
		}
			
		}).then(function (res) {
		
			var err = false;
			var hits = res.hits.hits;
			
			//If the no. of results returned by elasticsearch is less than the required top_searches_count, take that count. Else take the top_searches_count.
			var result_length = res.aggregations.top_trending_searches.buckets.length;
			var iterator_count = ( result_length < TOP_SEARCHES_COUNT ) ? result_length : TOP_SEARCHES_COUNT; 
			for(var i=0; i<iterator_count; i++){
				top_searches_results[i] = res.aggregations.top_trending_searches.buckets[i].key;
			} 
			
			console.log(top_searches_results); 
			logger.info("Updating the cache with data from elasticsearch.");
			if(callback)
				callback(err);
			
		}, function (err) {
			top_searches_results=[];
			logger.error(err.message);
			if(callback)
				callback(err);
		});
		
}

Cache.prototype.returnCacheValue = function returnCacheValue(callback){
	
		var err;
		/* If cache is empty 
		Case 1: This is the first request.
		Case 2: Previous update of cache failed. */
		if( top_searches_results.length == 0 ){
			
			//Populate the cache by querying elasticsearch.
			cache.populateTopTrendingSearches(function(err){
						
				callback(top_searches_results,err);
			});
		}
		/* If cache is not empty, return the last updated data */
		else{
				
				err = false;
				callback(top_searches_results,err);
		}
}

module.exports.cache = cache;
