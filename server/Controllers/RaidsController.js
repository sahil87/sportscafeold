/**
Raid controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var Raid  = require('../Models/Raid');

function logError(err, lineNum){
    console.log("Problem in TeamsControler L" + lineNum);
    console.error(err);
}

function getArrayOfRaids(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    Raid.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, raids) { 
            if (err) {
                logError(err, 28);
                fn(err, false);
            } else {
                if(raids && raids.length) {
                    fn(false, raids);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getRaidData(params, fn) {
    Raid.findOne(params)
        .lean()
        .exec(function(err, raid) {
            if(err) {
                logError(err, 45);
                fn(err, false);
            } else {
                if(!raid) {
                    fn(false, false);
                } else {
                    fn(false, raid);                                             
                }
            }
        });
}



/**
* Raid post
*/

function raidPost(params, fn) {
    
    Raid.insert(params, function(err, raid) {
        if(err) {
            logError(err, 67);
            fn(err, false);
        } else {
            fn(false, raid);            
        }
    });
}

function raidUpdate(raidId, params, fn){    

    var options = {
        upsert: true
    }
    //console.log(params);
    Raid.findByIdAndUpdate(raidId, params, options, function(err, raid) {
            if(err) {
                logError(err, 83);
                fn(err, false);
            } else {
                if(raid) {
                    fn(false, raid);
                } else {
                    fn(false, false);
                }
                
            }
        });

}


/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** Raid CRUD **/

/**
* Post raids
**/
exports.add = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    raidPost(params, function(err, raid) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(raid) {
                res.status(201).json(raid);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};

exports.addRealTime = function(fn) {
    //console.log(req.body);
    var params = req.body;
    raidPost(params, function(err, raid) {
        if(err) {
            console.log(err);
            fn(err, false);
        } else {
            if(raid) {
                fn(false, raid);
            } else {
                fn(false, false);
            }
            
        }
    });
};



/**
* Get all raids
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

    getArrayOfRaids(params, skip, limit, function(err, raids) {
        if (err) {
            res.status(500).json(err);
        } else {
            if(raids && raids.length) {
                res.status(200).json(raids);
            } else {
                res.status(204).json(raids);
            }
        }
    });
};

/**
* Get a single raid by id
**/
exports.getOne = function(req, res) {

    var raidId = req.params.id;
    var params = { _id: raidId };
    getRaidData(params, function(err, raid) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(raid) {
                res.status(200).json(raid);
            } else {
                res.status(204).json(raid);
            }
        }
    });
    
};

/**
* Get a single raid by id
**/
exports.getRaidsByMatch = function(req, res) {

    var matchId = req.params.matchId;
    var params = { _matchId: matchId };
    getRaidsByMatch(params, function(err, raids) {
        if(err) {
            res.status(500).json(err);
        } else {
            if(player) {
                res.status(200).json(raids);
            } else {
                res.status(204).json(null);
            }
        }
    });
    
};



/**
* Delete raid
**/
exports.deleteOne = function(req, res) {
    var raidId = req.params.id;

    Raid.remove({ _id: raidId }).exec(function(err) {
        if(err) {
            logError(err, 193);
            res.status(500).json(err);
        } else {
            res.json({ message: 'Raid is deleted!' });
        }
    });
}