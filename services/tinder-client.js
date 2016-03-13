var request = require('request');
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
var config = require("../knexfile");
var knex = require('knex')(config[env]);

var TINDER_HOST = "https://api.gotinder.com";

/**
 * Constructs a new instance of the TinderClient class
 *
 * @constructor
 * @this {TinderClient}
 */
function TinderClient(options) {
  var tcOpts = options || {};
  var xAuthToken = tcOpts.tinder_authentication_token || null;
  var lastActivity = new Date(Date.now() - 1000 * 10000000);
  var _this = this;
  _this.userId = tcOpts.tinder_id || null;
  _this.fbId = tcOpts.facebook_user_id || '';
  _this.fbKey = tcOpts.facebook_authentication_token || '';


  /**
   * The current profile's user id
   */

  /**
   * Helper for getting the request object
   * @param path {String} path the relative URI path
   * @param data {Object} an object of extra values
   */
  var getRequestOptions = function(path, data) {
    var options = {
      url: TINDER_HOST + "/" + path,
      json: data
    };

    var headers = {
        'User-Agent' : 'Tinder/4.6.1 (iPhone; iOS 9.0.1; Scale/2.00)'
    };

    if (xAuthToken) {
        headers['X-Auth-Token'] = xAuthToken;
    }

    options.headers = headers;

    return options;
  };

  /**
   * Issues a GET request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderGet = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'GET';
    request(opts, callback);
  };

  /**
   * Issues a POST request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPost = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'POST';
    request(opts, callback);
  };

  /**
   * Helper for transforming the request callback values
   * @param {Function} callback the callback
   */
  var makeTinderCallback = function(callback) {
    return function(error, res, body) {
      var data = null;

      if (!error) {
        if (typeof body === "string")
        {
          try
          {
            data = JSON.parse(body);
          } catch (err) {
            // todo
          }
        }
        else if (typeof body === "object") {
          data = body;
        }
      }

      if (callback) {
        callback(error, data);
      }
    };
  };



  /**
   * GET profile
   *
   */
  this.getProfile = function(callback) {
    tinderGet('profile',null,makeTinderCallback(callback))
  };

  /**
   * Gets a list of profiles nearby
   * @param {Number} limit the maximum number of profiles to fetch
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getRecommendations = function(limit, callback) {
    tinderGet('user/recs',
      {
        limit: limit
      },
      makeTinderCallback(callback));
  };

  /**
   * Sends a message to a user
   * @param {String} userId the id of the user
   * @param {String} message the message to send
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.sendMessage = function(userId, message, callback) {
    console.log("SENDING MESSAGE: ", message);
    tinderPost('user/matches/' + userId,
      {
        message: message
      },
      makeTinderCallback(callback));
  };

  /**
   * Swipes left for a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.pass = function(userId, callback) {
    tinderGet('pass/' + userId,
      null,
      makeTinderCallback(callback));
  };

  // *
  //  * Swipes right for a user
  //  * @param {String} userId the id of the user
  //  * @param {Function} callback the callback to invoke when the request completes

  this.like = function(userId, callback) {
    tinderGet('like/' + userId,
      null,
      makeTinderCallback(callback));
  };

  /**
   * Authorize this tinder client
   * @param {String} fbToken the Facebook token. This will be obtained when authenticating the user
   * @param {String} fbId the Facebook user id.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.authorize = function(fbToken, fbId, callback) {
    tinderPost('auth',
      {
        facebook_token: fbToken,
        facebook_id: fbId
      },
      function(error, res, body) {
        if (!error && body) {
          xAuthToken = body.token;
          _this.token = body.token;
          _this.userId = body.user._id;
          _this.defaults = body;
          knex('fake_accounts')
            .where('facebook_user_id',_this.fbId)
            .update({tinder_authentication_token: xAuthToken})
            .returning('*')
            .then(function(test) {
              console.log(test);
            })
            if(callback) {
              callback(error, res, body);
            }
        } else if (body.error){
          throw "Failed to authenticate: " + body.error
        }
      });
  };

  /**
   * Returns whether this client is authorized
   * @return whether or not this client is authorized
   */
  this.isAuthorized = function() {
    return !!xAuthToken;
  }

  /**
   * Returns the xAuthToken
   * @return xAuthToken
   */
  this.getAuthToken = function() {
    return xAuthToken || null;
  }

  /**
   * Returns client information and globals
   * Globals are used for interacting with tinder api limits
   */
  this.getDefaults = function() {
    return _this.defaults;
  }

  /**
   * Gets a list of new updates. This will be things like new messages, people who liked you, etc.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUpdates = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: lastActivity.toISOString() || new Date(Date.now() - 400000000)
      },
      makeTinderCallback(function(err, data){
        if(data) {
          last_activity = lastActivity.toISOString() || new Date(Date.now() - 400000000).toISOString(); 
        }
        lastActivity = last_activity

        if (callback) {
          callback(err, data);
        }
      }));
  };

  /**
   * Gets the entire history for the user (all matches, messages, blocks, etc.)
   *
   * NOTE: Old messages seem to not be returned after a certain threshold. Not yet
   * sure what exactly that timeout is. The official client seems to get this update
   * once when the app is installed then cache the results and only rely on the
   * incremental updates
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getHistory = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: ""
      },
      makeTinderCallback(callback));
  };

  /**
   * Updates the position for this user
   * @param {Number} lon the longitude
   * @param {Number} lat the latitutde
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePosition = function(lon, lat, callback) {
    tinderPost('user/ping',
      {
        lon: lon,
        lat: lat
      },
      makeTinderCallback(callback));
  };

  this.getPosition = function(callback) {
    tinderGet('user/ping',null,makeTinderCallback(callback));
  };

  /**
   * Get user by id
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUser = function(userId, callback){
    tinderGet('user/' + userId,
      null,
      makeTinderCallback(callback));
  };

}

module.exports = TinderClient;
