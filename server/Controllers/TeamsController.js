/**
Team controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var TeamPlayer  = require('../Models/TeamPlayer');



function getArrayOfTeam(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    Team.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, teams) { 
            if (err) {
                fn(err, false);
            } else {
                if(teams && teams.length) {
                    fn(false, teams);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getTeamData(params, fn) {
    Team.findOne(params)
        .lean()
        .exec(function(err, team) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(!team) {
                    fn(false, false);
                } else {
                    fn(false, team);                                             
                }
            }
        });
}



/**
* Team post
*/

function teamPost(params, fn) {
    
    Team.insert(params, function(err, team) {
        if(err) {
            console.log(err);
            fn(err, false);
        } else {
            fn(false, team);            
        }
    });
}

function teamUpdate(teamId, params, fn){    

    var options = {
        upsert: true
    }
    //console.log(params);
    Team.findByIdAndUpdate(teamId, params, options, function(err, team) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(team) {
                    fn(false, team);
                } else {
                    fn(false, false);
                }
                
            }
        });

}


/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** Team CRUD **/

/**
* Post teams
**/
exports.postTeames = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    teamPost(params, function(err, team) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(team) {
                res.status(201).json(team);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};



/**
* Get all teams
**/
exports.getTeames = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    Team.find({})
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, teams) { 
            if (err) {
                res.status(500).json(err);
            } else {
                if(teams && teams.length) {
                    res.status(200).json(teams);
                } else {
                    res.status(204).json(teams);
                }
            }
        });
};

/**
* Get a single team by id
**/
exports.getTeam = function(req, res) {

    var teamId = req.params.id;
    var params = { _id: teamId };
    getTeamData(params, function(err, team) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(team) {
                res.status(200).json(team);
            } else {
                res.status(204).json(team);
            }
        }
    });
    
};



/**
* Delete team
**/
exports.deleteTeam = function(req, res) {
    var teamId = req.params.id;

    Team.remove({ _id: teamId }).exec(function(err) {
        if(err) {
            console.log("Found problem, TeamsController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            Device.remove({_teamId: teamId}).exec();
            res.json({ message: 'Team is deleted!' });
        }
    });
}