var jwt = require('jwt-simple');
var config = require('../config/config');
var moment = require('moment');
var sockets = require('socket.io');
var CronExecutables = require('../services/cronTasks');

function startSocket(server) {
  var io = sockets.listen(server);
  var cronTasks = CronExecutables(io);

  io.on('connection', function(socket) {
    socket.on('new:response',function(response) {
      console.log("AM I CALLED?", response)
        delete response.token
        response.user_id = 1;
        console.log("AM I CALLED?", response)
        knex('responses')
          .insert(response)
          .returning('*')
          .then(function(knexResponse) {
            console.log("EMITTING", knexResponse);
            io.emit('new:response', knexResponse[0]);
          })
          .catch(function(err) {
            console.log("GOOO", err);
          })

    });

    socket.on('new:vote', function(data) {
      delete data.token
      data.user_id = 1
          knex('votes')
           .insert(data)
           .returning('*')
           .then(function(knexVote) {
             io.emit('new:vote',knexVote);
           })

    });

    socket.on('new:chat', function(data) {
      var objToSave = {room_id: parseInt(data.room_id), text: data.text};
      knex('chats')
      .insert(objToSave)
      .returning('*')
      .then(function(data) {
        io.emit('new:chat',data[0]);
      })
    });
  })
}

function ensureSocketAuthenticated(token) {
    var decoded = jwt.decode(token, config.TOKEN_SECRET);
    if(decoded.sub && decoded.exp >= moment().unix()) {
      return decoded.sub;
    } else {
      return false;
    }
};

function returnUserFromToken(token) {
  var decoded = jwt.decode(token, config.TOKEN_SECRET);
  var user;
  if(decoded.sub) {
    return decoded.sub
  } else {
    return null
  }
}


module.exports = startSocket;
