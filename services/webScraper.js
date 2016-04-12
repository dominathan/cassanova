var bluebird = require("bluebird");
var fs = require('fs')
var fname = 'redirectStuff' + new Date().getTime() + '.json';
var save = fs.pathJoin(fs.workingDirectory,'tokens',fname);

var casper = require('casper').create({
  pageSettings: {
    loadImages: false, //The script is much faster when this field is set to false
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
  }
});
casper.start().thenOpen(
  "https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token",
  function() {
    console.log("Facebook website opened");
  });
casper.then(function() {
  console.log("Login using username and password");
  this.evaluate(function() {
    document.getElementById("email").value = "oliverbalkovec@outlook.com";
    document.getElementById("pass").value = "pityfortheguilty12";
    document.getElementById("loginbutton").click();
  });
});

casper.then(function() {
  var redirectUrl = this.getCurrentUrl();
  casper.echo(redirectUrl);
  var idxExpiration = redirectUrl.indexOf("&expires_in");
  var idxToken = redirectUrl.indexOf('access_token=');
  var token = redirectUrl.slice(idxToken + 13,idxExpiration);
  var expTime = redirectUrl.slice(idxExpiration + 12);
  var data = {
    token: token,
    expTime: expTime,
  }
  fs.write(save, JSON.stringify(data),'w')
});

casper.thenOpen('https://www.facebook.com', function() {
  console.log("AND EXIT");
  document.querySelectorAll("[data-gt='{\"ref\":\"async_menu\",\"logout_menu_click\":\"menu_logout\"}']")[0].click()
});

casper.run();
