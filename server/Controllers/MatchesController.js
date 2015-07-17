/**
Match controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var MatchResult  = require('../Models/MatchResult');



function getArrayOfMatch(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    Match.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, matches) { 
            if (err) {
                fn(err, false);
            } else {
                if(matches && matches.length) {
                    fn(false, matches);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getMatchData(params, fn) {
    Match.findOne(params)
        .lean()
        .exec(function(err, match) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(!match) {
                    fn(false, false);
                } else {
                    fn(false, match);                                             
                }
            }
        });
}



/**
* Match post
*/

function matchPost(params, fn) {
    
    Match.insert(params, function(err, match) {
        if(err) {
            console.log(err);
            fn(err, false);
        } else {
            fn(false, match);            
        }
    });
}

function matchUpdate(matchId, params, fn){    

    var options = {
        upsert: true
    }
    //console.log(params);
    Match.findByIdAndUpdate(matchId, params, options, function(err, match) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(match) {
                    fn(false, match);
                } else {
                    fn(false, false);
                }
                
            }
        });

}


/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** Match CRUD **/

/**
* Post matches
**/
exports.postMatches = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    matchPost(params, function(err, match) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(match) {
                res.status(201).json(match);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};



/**
* Get all matches
**/
exports.getMatches = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    Match.find({})
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, matches) { 
            if (err) {
                res.status(500).json(err);
            } else {
                if(matches && matches.length) {
                    res.status(200).json(matches);
                } else {
                    res.status(204).json(matches);
                }
            }
        });
};

/**
* Get a single match by id
**/
exports.getMatch = function(req, res) {

    var matchId = req.params.id;
    var params = { _id: matchId };
    getMatchData(params, function(err, match) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(match) {
                res.status(200).json(match);
            } else {
                res.status(204).json(match);
            }
        }
    });
    
};



/**
* Delete match
**/
exports.deleteMatch = function(req, res) {
    var matchId = req.params.id;

    Match.remove({ _id: matchId }).exec(function(err) {
        if(err) {
            console.log("Found problem, MatchsController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            Device.remove({_matchId: matchId}).exec();
            res.json({ message: 'Match is deleted!' });
        }
    });
}