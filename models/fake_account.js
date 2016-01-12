'use strict'

module.exports = function() {
  return {
    getProfileInfo: function(profileObject) {
      return {
        name: profileObject['name'],
        tinder_id: profileObject['_id'],
        bio: profileObject['bio'],
        birth_date: profileObject['birth_date'],
        gender: profileObject['gender'],
        latitude: profileObject['pos']['lat'],
        longitude: profileObject['pos']['lon'],
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    }
  }
};
