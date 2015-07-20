'use strict';

var socketio = require('socket.io');
var io;

var mongoose = require('mongoose');

//var PushNotification   = require('../server/Components/PushNotification');

function socketConnect (server) {
	io = socketio.listen(server);
	var socketData = {};
	//io.set("origins", "http://localhost:3000");

	io.use(function(socket, next)
	{
	    var query = socket.request._query;
	    socketData[socket.id] = {
	        matchId: query.matchId
	    };
	    next();
	});
	
	io.on('connection', function (socket) {
		console.log('-------------------------');
		console.log('Socket server running');
		console.log('-------------------------');
		socket.emit('connectionState', 'You are connected'); // Let all my contacts know that I am offline now.
		//var handshake = socket.handshake;
		//console.log(handshake.query);
		var matchId = socketData[socket.id].matchId;
		//console.log('socket id:' + socket.id);
		var connectionId = socket.id;
		socket.room = matchId;
		socket.matchId = matchId;
		socket.join(socket.room);
		//console.log(socket.username);
		//console.log(socket.matchId);
		//io.sockets.in(socket.room).emit(socket.matchId, emitParams);

		socket.on('submitResult', function (reqParams) {
	        // we tell the client to execute 'updatechat' with 2 parameters
	        var raidId = mongoose.Types.ObjectId();
	        console.log(reqParams);
	        var raidObj = {
	        	_id: raidId,
	            _matchId: reqParams.matchId,
	            _raiderTeam: reqParams._raiderTeam,
	            _raiderId: reqParams._raiderId,
	            touches: reqParams.touches,
	            _tackledBy: reqParams._tackledBy,
	            _dataEntryPerson: reqParams._dataEntryPerson,
	            created: new Date()
	        };
	        

	        io.sockets.in(socket.room).emit(reqParams.matchId, raidObj);  //emit message to all members of the room only
	        //msgObj.isRead = true;
	        //also save data in db here
	        Raid.insert(raidObj, function(err) {
		        if(err) {
		            console.log("Problem in line 63");
		            console.error(err);
		        }
		    });
	        
	    });

	    socket.on('showRaid', function (raidId) {
	    	//var matchId = socket.matchId;
	    	Raid.findOne({_id: raidId})
	    		.lean()
	    		.populate({
		            path: '_raiderTeam'
		        })  
		        .populate({
		            path: '_raiderId'
		        }) 
		        .populate({
		            path: 'touches'
		        }) 
		        .populate({
		            path: '_tackledBy'
		        })
		        .populate({
		            path: '_dataEntryPerson'
		        })
		        .exec(function(err, raid) {
		        	if(err) {
		        		console.log(err);
		        	} else {
		        		io.sockets.in(socket.room).emit(socket.matchId, raid);  //emit message to all members of the room only
		        	}
		        });

	    });

	    socket.on('showAllRaids', function () {
	    	var matchId = socket.matchId;
	    	Raid.find({_matchId: matchId})
	    		.lean()
	    		.populate({
		            path: '_raiderTeam'
		        })  
		        .populate({
		            path: '_raiderId'
		        }) 
		        .populate({
		            path: 'touches'
		        }) 
		        .populate({
		            path: '_tackledBy'
		        })
		        .populate({
		            path: '_dataEntryPerson'
		        })
		        .exec(function(err, raids) {
		        	if(err) {
		        		console.log(err);
		        	} else {
		        		io.sockets.in(socket.room).emit(socket.matchId, raids);  //emit message to all members of the room only
		        	}
		        });

	    });
		
		socket.on('disconnect', function(){
			socket.emit('connectionState', 'You are disconnected'); // Let all my contacts know that I am offline now.
			
		});  


	});
}

exports.boot = socketConnect;