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
      var user = ensureSocketAuthenticated(response.token);
      if(user) {
        delete response.token
        response.user_id = user.id;
        knex('responses')
          .insert(response)
          .returning('*')
          .then(function(knexResponse) {
            io.emit('new:response', knexResponse[0]);
          })
          .catch(function(err) {
            console.log("OH FUCK ERROR", err);
          })
      }
    });

    socket.on('new:vote', function(data) {
      var user = ensureSocketAuthenticated(data.token);
      if(user) {
        delete data.token
        data.user_id = user.id;
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
      var user;
      if(data.token) {
        user = ensureSocketAuthenticated(data.token);
      }
      if(user) {
        delete data.token
        data.user_id = user.id;
        data.username = user.username;
      };
      knex('chats')
      .insert(data)
      .returning('*')
      .then(function(newChat) {
        io.emit('new:chat',newChat[0]);
      })
    });

    socket.on('new:global-chat', function(data) {
      var user;
      if(data.token) {
        user = ensureSocketAuthenticated(data.token);
      }
      if(user) {
        delete data.token
        data.user_id = user.id;
        data.username = user.username;
      };
      if(!data.room_id) {
        data.room_id = 3141592;
      }
      knex('chats')
      .insert(data)
      .returning('*')
      .then(function(newChat) {
        io.emit('new:global-chat',newChat[0]);
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


module.exports = startSocket;
