/**
Player controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var Player  = require('../Models/TeamPlayer');



function getArrayOfPlayers(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    Player.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, players) { 
            if (err) {
                fn(err, false);
            } else {
                if(players && players.length) {
                    fn(false, players);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getPlayerData(params, fn) {
    Player.findOne(params)
        .lean()
        .exec(function(err, player) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(!player) {
                    fn(false, false);
                } else {
                    fn(false, player);                                             
                }
            }
        });
}



/**
* Player post
*/

function playerPost(params, fn) {
    
    Player.insert(params, function(err, player) {
        if(err) {
            console.log(err);
            fn(err, false);
        } else {
            fn(false, player);            
        }
    });
}

function playerUpdate(playerId, params, fn){    

    var options = {
        upsert: true
    }
    //console.log(params);
    Player.findByIdAndUpdate(playerId, params, options, function(err, player) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(player) {
                    fn(false, player);
                } else {
                    fn(false, false);
                }
                
            }
        });

}


/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/




/** Player CRUD **/

/**
* Post players
**/
exports.add = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    playerPost(params, function(err, player) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(player) {
                res.status(201).json(player);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};

/**
* Edit players
**/
exports.edit = function(req, res) {
    //console.log(req.body);
    var playerId = req.params.id;
    var params = req.body;
    playerUpdate(playerId, params, function(err, player) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(player) {
                res.status(201).json(player);
            } else {
                res.status(204).json(null);
            }
            
        }
    });
};



/**
* Get all players
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
    getArrayOfPlayers(params, skip, limit, function(err, players){
        if (err) {
            res.status(500).json(err);
        } else {
            if(players && players.length) {
                res.status(200).json(players);
            } else {
                res.status(204).json(null);
            }
        }
    });
};

/**
* Get a single player by id
**/
exports.getOne = function(req, res) {

    var playerId = req.params.id;
    var params = { _id: playerId };
    getPlayerData(params, function(err, player) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(player) {
                res.status(200).json(player);
            } else {
                res.status(204).json(player);
            }
        }
    });
    
};

/**
* Get a single player by id
**/
exports.getPlayersByTeam = function(req, res) {

    var teamId = req.params.teamId;
    var params = { _teamId: teamId };
    getPlayerData(params, function(err, player) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if(player) {
                res.status(200).json(player);
            } else {
                res.status(204).json(player);
            }
        }
    });
    
};



/**
* Delete player
**/
exports.deleteOne = function(req, res) {
    var playerId = req.params.id;

    Player.remove({ _id: playerId }).exec(function(err) {
        if(err) {
            console.log("Found problem, PlayersController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            res.json({ message: 'Player is deleted!' });
        }
    });
}