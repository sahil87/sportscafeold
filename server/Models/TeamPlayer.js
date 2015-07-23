/**
* Player schema
* Stores the registered player data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var PlayerSchema = new Schema({
    first_name: {  
        type: String, 
        required: true
    },
    last_name: {  
        type: String, 
        default: ''
    },
    _teamId: {
        type: ObjectId,
        required: true,
        ref: 'Team'
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




/** 
Schema method to add Player by passed params
**/
PlayerSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newPlayer = {};
    for (prop in params) {
        newPlayer[prop] = params[prop];
    }
    var player = new this(newPlayer);
    player.save(function(err, player) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, player)

        }

    });

};

PlayerSchema.statics.getPlayerList = function(params, fn) {
    this.find(params)
        .lean()
        .exec(function(err, players) {
            if(err) {
                console.log("Problem in Player Model Line 72");
                console.error(err);
                fn(err, false);
            } else {
                //console.log('Players');
                fn(false, players);
            }
        });

};

module.exports = mongoose.model('Player', PlayerSchema);