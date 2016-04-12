var data = {};
var user = {}

var casper = require('casper').create({
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
  }
});

/*
  Arguments to gra proper user info and hwere to store
  1) environment to store in
  2) facebook Email
  3) facebook password
*/


var env = casper.cli.args[0]
user.email = casper.cli.args[1].trim()
user.password = casper.cli.args[2].trim();
console.log(JSON.stringify(user));

casper.start().thenOpen(
  "https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token",
  function() {
});

casper.then(function() {
  this.evaluate(function(email,password) {
    document.getElementById("email").value = email;
    document.getElementById("pass").value = password;
    document.getElementById("loginbutton").click();
  },user.email,user.password);
});

casper.then(function() {
  var redirectUrl = this.getCurrentUrl();
  var idxExpiration = redirectUrl.indexOf("&expires_in");
  var idxToken = redirectUrl.indexOf('access_token=');
  var token = redirectUrl.slice(idxToken + 13,idxExpiration);
  var expTime = redirectUrl.slice(idxExpiration + 12);
  data.token = token;
  data.expTime = expTime;
});


casper.thenOpen('https://www.facebook.com', function() {

});

casper.then(function() {
  casper.evaluate(function() {
     document.getElementsByClassName('fbxWelcomeBoxName')[0].click();
   })
})

casper.then(function() {
  this.wait(1000);
  if(this.exists('.profilePicThumb')) {
    var item = this.getElementAttribute('.profilePicThumb','href');
    var idxId = item.indexOf('fbid');
    var idxSet = item.indexOf('&set');
    var fbId = item.slice(idxId+5,idxSet);
    data.fbId = fbId;
    casper.echo(JSON.stringify(data));
  }
})

casper.then(function() {
  this.evaluate(function() {
    document.querySelectorAll("[data-gt='{\"ref\":\"async_menu\",\"logout_menu_click\":\"menu_logout\"}']")[0].click()
  })
})

casper.run();
