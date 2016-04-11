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
      console.log("THIS IS RESPONSE", response)
      var user = ensureSocketAuthenticated(response.token);
      if(user) {
        console.log("WERE INSDIEE", user);
        delete response.token
        response.user_id = user.user_id;
        knex('responses')
          .insert(response)
          .returning('*')
          .then(function(knexResponse) {
            console.log("WHAT THE FUCK");
            io.emit('new:response', knexResponse[0]);
          })
          .catch(function(err) {
            console.log("FAILS", err);
          })

      }

    });

    socket.on('new:vote', function(data) {
      var user = ensureSocketAuthenticated(data.token);
      if(user) {
        delete data.token
        data.user_id = user.user_id;
        knex('votes')
        .select('*')
        .where('response_id', data.response_id)
        .andWhere('user_id', user.id)
        .then(function(voteExist) {
          if (!voteExist.length) {
            knex('votes')
             .insert(data)
             .returning('*')
             .then(function(knexVote) {
               io.emit('new:vote',knexVote);
             })
          } else {
            //user has already voted
            return false;
          }
        })
      }


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
