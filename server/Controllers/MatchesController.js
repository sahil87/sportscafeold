/**
Match controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var Match  = require('../Models/Match'),
    Result  = require('../Models/MatchResult'),
    Raid  = require('../Models/Raid');

function logError(err, lineNum){
    console.log("Problem in TeamsControler L" + lineNum);
    console.error(err);
}


function getArrayOfMatches(params, skip, limit, fn) {
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
                logError(err, 31);
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
               logError(err, 48);
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
            logError(err, 70);
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
                logError(err, 86);
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
exports.add = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    matchPost(params, function(err, match) {
        if(err) {
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
exports.getAll = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    var params = false;
    getArrayOfMatches(params, skip, limit, function(err, matches){
        if (err) {
            res.status(500).json(err);
        } else {
            if(matches && matches.length) {
                res.status(200).json(matches);
            } else {
                res.status(204).json(null);
            }
        }
    });
};

/**
* Get a single match by id
**/
exports.getOne = function(req, res) {

    var matchId = req.params.id;
    var params = { _id: matchId };
    getMatchData(params, function(err, match) {
        if(err) {
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
exports.deleteOne = function(req, res) {
    var matchId = req.params.id;

    Match.remove({ _id: matchId }).exec(function(err) {
        if(err) {
            logError(err, 193);
            res.status(500).json(err);
        } else {
            Result.remove({ _matchId: matchId });
            Raid.remove({ _matchId: matchId });
            res.json({ message: 'Match is deleted!' });
        }
    });
}