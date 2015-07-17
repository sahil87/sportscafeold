/**
MatchResult controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var MatchResult  = require('../Models/MatchResult'),
    Raid  = require('../Models/Raid');



function getArrayOfMatchResult(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    MatchResult.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, results) { 
            if (err) {
                fn(err, false);
            } else {
                if(results && results.length) {
                    fn(false, results);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getMatchResultData(params, fn) {
    MatchResult.findOne(params)
        .lean()
        .exec(function(err, result) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(!result) {
                    fn(false, false);
                } else {
                    fn(false, result);                                             
                }
            }
        });
}



/**
* MatchResult post
*/

function resultPost(params, fn) {
    
    MatchResult.insert(params, function(err, result) {
        if(err) {
            console.log(err);
            fn(err, false);
        } else {
            fn(false, result);            
        }
    });
}




/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** MatchResult CRUD **/

/**
* Post results
**/
exports.postMatchResults = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    resultPost(params, function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(result) {
                res.status(201).json(result);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};



/**
* Get all results
**/
exports.getMatchResults = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    MatchResult.find({})
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, results) { 
            if (err) {
                res.status(500).json(err);
            } else {
                if(results && results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(204).json(results);
                }
            }
        });
};

/**
* Get a single result by id
**/
exports.getMatchResult = function(req, res) {

    var resultId = req.params.id;
    var params = { _id: resultId };
    getMatchResultData(params, function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(result) {
                res.status(200).json(result);
            } else {
                res.status(204).json(result);
            }
        }
    });
    
};



/**
* Delete result
**/
exports.deleteMatchResult = function(req, res) {
    var resultId = req.params.id;

    MatchResult.remove({ _id: resultId }).exec(function(err) {
        if(err) {
            console.log("Found problem, MatchResultsController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            Raid.remove({ _resultId: resultId });
            res.json({ message: 'MatchResult is deleted!' });
        }
    });
}