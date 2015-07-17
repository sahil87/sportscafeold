/**
* Team schema
* Stores the registered team data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var TeamPlayer = require('./TeamPlayer');

var TeamSchema = new Schema({
    teamTitle: {  //Only used Admin
        type: String, 
        default: ''
    },
    teamLogo: { //Only used Admin
        type: String,
        default: ''
    },
    matches: [
        { 
            type: ObjectId, ref: 'Match' 
        }
    ],
    players: [
        { 
            type: ObjectId, ref: 'TeamPlayer' 
        }
    ],
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





TeamSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    TeamPlayer.remove({_teamId: this._id}).exec();
    next();
});

/** 
Schema method to add Team by passed params
**/
TeamSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newTeam = {};
    for (prop in params) {
        newTeam[prop] = params[prop];
    }
    var team = new this(newTeam);
    team.save(function(err, team) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, team)

        }

    });

};
module.exports = mongoose.model('Team', TeamSchema);