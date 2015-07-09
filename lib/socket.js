'use strict';

var socketio = require('socket.io');
var io;

var mongoose = require('mongoose');

var PushNotification   = require('../server/Component/PushNotification');

function socketConnect (server) {
	io = socketio.listen(server);
	var socketData = {};
	//io.set("origins", "http://localhost:3000");

	io.use(function(socket, next)
	{
	    var query = socket.request._query;
	    socketData[socket.id] = {
	        channelId: query.channelId,
	        username: query.username
	    };
	    next();
	});
	
	io.on('connection', function (socket) {
		//var handshake = socket.handshake;
		//console.log(handshake.query);
		var channelId = socketData[socket.id].channelId;
		var username = socketData[socket.id].username;
		//console.log('socket id:' + socket.id);
		var connectionId = socket.id;
		socket.room = channelId;
		socket.username = username;
		socket.channelId = channelId;
		socket.join(socket.room);
		//console.log(socket.username);
		//console.log(socket.channelId);

		//set emitter
		var emitParams = {
			message: {},
			type: 'signedin'
		};

		socket.broadcast.emit('chatState', socket.username+ ' is online now');  ///All my contacts know that I am online now

		//io.sockets.in(socket.room).emit(socket.channelId, emitParams);

		socket.on('sendchat', function (reqParams) {
	        // we tell the client to execute 'updatechat' with 2 parameters
	        var msgId = mongoose.Types.ObjectId();
	        var msgObj = {
	        	_id: msgId,
	            _channelId: socket.channelId,
	            username: socket.username,
	            _userId: reqParams._userId,
	            message: reqParams.message,
	            created: new Date()
	        };
	        //console.log(msgId);
	        socket.userId = reqParams._userId;

	        io.sockets.in(socket.room).emit(socket.channelId, msgObj);  //emit message to all members of the room only
	        //msgObj.isRead = true;
	        //also save data in db here
	        
	    });

		socket.on('read', function(messageId) {
			//update message status to read
			//also save data in db here
		});

		socket.on('typing', function(){
			socket.broadcast.to(socket.room).emit('chatState', socket.username+ ' typing'); //let the other user in my room know that I am typing
		});
		
		socket.on('disconnect', function(){
			socket.broadcast.emit('chatState', socket.username+ ' is offline'); // Let all my contacts know that I am offline now.
			
		});  


	});
}

exports.boot = socketConnect;