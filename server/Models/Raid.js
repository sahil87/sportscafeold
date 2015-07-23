/**
* Raid schema
* Stores the registered raid data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;



var RaidSchema = new Schema({
    raidNum: {
        type: Number,
        required: true
    },
    _matchId: {
        type: ObjectId,
        required: true,
        ref: 'Match'
    },
    raidResult: { //Only used Admin
        type: String,
        default : '',
        enum : ['ER', 'SR', 'ST']  //ER=>Empty Raid, SR=>Successful Raid, ST=>Successful Tackle
    },
    _raiderTeam: {
        type: ObjectId,
        required: true,
        ref: 'Team'
    },
    _raiderId: {
        type: ObjectId,
        required: true,
        ref: 'TeamPlayer'
    },
    touches: [
        { 
            type: ObjectId, ref: 'TeamPlayer' 
        }
    ],
    _tackledBy: {
        type: ObjectId,
        ref: 'TeamPlayer'
    },
    _dataEntryPerson: {
        type: ObjectId,
        required: true,
        ref: 'User'
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


/** 
Schema method to add User by passed params
**/
RaidSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newRaid = {};
    for (prop in params) {
        newRaid[prop] = params[prop];
    }
    var raid = new this(newRaid);
    raid.save(function(err, raid) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, raid)

        }

    });

};

RaidSchema.statics.getLastRaid = function(params, fn) {
    this.findOne(params)
        .lean()
        .sort('-created')
        .exec(function(err, lastRaid) {
            if(err) {
                console.log("Problem in Player Model Line 72");
                console.error(err);
                fn(err, false);
            } else {
                fn(false, lastRaid);
            }
        });

};
module.exports = mongoose.model('Raid', RaidSchema);