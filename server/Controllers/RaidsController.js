/**
Raid controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var Raid  = require('../Models/Raid');



function getArrayOfRaid(params, skip, limit, fn) {
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
                console.log(err);
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
            console.log(err);
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

}


/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** Raid CRUD **/

/**
* Post raids
**/
exports.postRaids = function(req, res) {
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



/**
* Get all raids
**/
exports.getRaids = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    Raid.find({})
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, raids) { 
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
exports.getRaid = function(req, res) {

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
* Delete raid
**/
exports.deleteRaid = function(req, res) {
    var raidId = req.params.id;

    Raid.remove({ _id: raidId }).exec(function(err) {
        if(err) {
            console.log("Found problem, RaidsController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            res.json({ message: 'Raid is deleted!' });
        }
    });
}