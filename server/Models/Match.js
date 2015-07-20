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
module.exports = mongoose.model('Match', MatchSchema);