var TinderClient = require('./tinder-client');

var authToken = process.argv[2]

knex('fake_accounts')
.where('id',1)
.update({facebook_authentication_token: authToken})
.then(function(data) {
  return
})
.then(function() {
  knex('fake_accounts')
  .where('id',1)
  .then(function(fk) {
    fk = fk[0]
    var tc = new TinderClient(fk)
    tc.authorize(tc.fbKey,tc.fbId,function(err,data) {
      if(err) {
        console.error("Failed to authenticate", err)
        return
      } else {
        knex('fake_accounts')
        .where('id',1)
        .update({tinder_authentication_token: data.body.token})
        .then(function(data) {
          console.log("Updated all successfully")
        })
      }
    })
  })
})

knex('targets')
.where('fake_account_id', 1)
.update({accessible: true})
.then(function() {
  return
})
