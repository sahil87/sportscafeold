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

var PlayerPlayer = require('./PlayerPlayer');

var PlayerSchema = new Schema({
    first_name: {  //Only used Admin
        type: String, 
        default: ''
    },
    last_name: {  //Only used Admin
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
module.exports = mongoose.model('Player', PlayerSchema);