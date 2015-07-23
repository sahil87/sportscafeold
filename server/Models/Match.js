/**
* Match schema
* Stores the registered match data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var Result = require('./MatchResult'),
    Player = require('./TeamPlayer'),
    Raid = require('./Raid');

var MatchSchema = new Schema({
    _teamA: {
        type: ObjectId,
        required: true,
        ref: 'Team'
    }, 
    _teamB: {
        type: ObjectId,
        required: true,
        ref: 'Team'
    }, 
    matchDate             : {
        type: Date,
        default: Date.now
    },
    status              : {
        type: Boolean,
        default: true
    },
    created             : {
        type: Date,
        default: Date.now
    },
    modified            : {
        type: Date,
        default: Date.now
    }
});





MatchSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Result.remove({_matchId: this._id}).exec();
    Raid.remove({_matchId: this._id}).exec();
    next();
});

/** 
Schema method to add User by passed params
**/
MatchSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newMatch = {};
    for (prop in params) {
        newMatch[prop] = params[prop];
    }
    var match = new this(newMatch);
    match.save(function(err, match) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, match)

        }
    });
};

MatchSchema.statics.getArrayOfMatches = function(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    this.find(options)
        .lean()
        .skip(skip)
        .limit(limit)
        .exec(function(err, matches) { 
            if (err) {
                console.log("Problem in Match Model Line 91");
                console.error(err);
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

MatchSchema.statics.getMatchData = function(params, getLastRaid, fn) {
    this.findOne(params)
         .populate({
            path: '_teamA'
          }) 
         .populate({
            path: '_teamB'
          })  
         .lean()
         .exec(function(err, match) {
                if(err) {
                    logError(err, 214);
                    fn(err, false);
                } else {
                    if(match) {
                        if(match._teamA) {
                            var firstParam = { _teamId: match._teamA._id};
                            Player.getPlayerList(firstParam, function(err, playersOfTeamA) {
                                if(err) {
                                    fn(err, false);
                                } else {
                                    if(playersOfTeamA) {
                                        match._teamA.players = playersOfTeamA;
                                    } 
                                    
                                    if(match._teamB) {
                                        var secondParam = { _teamId: match._teamB._id};
                                        Player.getPlayerList(secondParam, function(err, playersOfTeamB) {
                                            if(err) {
                                                fn(err, false);
                                            } else {
                                                if(playersOfTeamB) {
                                                    match._teamB.players = playersOfTeamB;
                                                }  
                                                
                                                var raidParam = { _matchId: match._id};
                                                //console.log(raidParam);
                                                if(getLastRaid) {
                                                    Raid.getLastRaid(raidParam, function(err, lastRaid) {
                                                        if(err) {
                                                            fn(err, false);
                                                        } else {
                                                            if(lastRaid) {
                                                                match.lastRaid = lastRaid;
                                                            }                                                        
                                                            fn(false, match);
                                                        }
                                                    }); 
                                                } else {
                                                    Raid.getAllRaid(raidParam, function(err, raids) {
                                                        if(err) {
                                                            fn(err, false);
                                                        } else {
                                                            if(raids && raids.length) {
                                                                match.raids = raids;
                                                            }                                                        
                                                            fn(false, match);
                                                        }
                                                    }); 
                                                }
                                                                                               
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            fn(false, match);
                        }
                    } else {
                        fn(false, false);
                    }
                }

         });
}
module.exports = mongoose.model('Match', MatchSchema);