/**
* Raids schema
* Stores the registered raid data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;



var RaidsSchema = new Schema({
    _resultId: {
        type: ObjectId,
        required: true,
        ref: 'Result'
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





RaidsSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' raid.
    RaidsRaid.remove({_raidId: this._id}).exec();
    next();
});

/** 
Schema method to add User by passed params
**/
RaidsSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newRaids = {};
    for (prop in params) {
        newRaids[prop] = params[prop];
    }
    var raid = new this(newRaids);
    raid.save(function(err, raid) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, raid)

        }

    });

};
module.exports = mongoose.model('Raids', RaidsSchema);