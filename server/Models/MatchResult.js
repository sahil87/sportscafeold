/**
* Results schema
* Stores the registered result data
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Raid = require('./Raid');


var ResultsSchema = new Schema({
    _matchId: {
        type: ObjectId,
        required: true,
        ref: 'Match'
    },
    resultBool: { //Only used Admin
        type: String,
        default : 'NP',
        enum : ['W', 'L', 'T', 'NP', 'IP']  //W=>Win, L=>Loss, T=>Tied, NP=>Not Played, IP=> In progress
    },
    resultStr: {
        type: String,
        default : ''
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





ResultsSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Raid.remove({_resultId: this._id}).exec();
    next();
});

/** 
Schema method to add User by passed params
**/
ResultsSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newResults = {};
    for (prop in params) {
        newResults[prop] = params[prop];
    }
    var result = new this(newResults);
    result.save(function(err, result) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, result)

        }

    });

};
module.exports = mongoose.model('Results', ResultsSchema);