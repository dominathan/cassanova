var fs = require('fs')
var utils = require('utils');

var fname = 'redirectStuff' + new Date().getTime() + '.json';
var save = fs.pathJoin(fs.workingDirectory,'tokens',fname);
var data = {};

var casper = require('casper').create({
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
  }
});
var env = casper.cli.args[0]

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
  data.token = token;
  data.expTime = expTime;
});


casper.thenOpen('https://www.facebook.com', function() {
  console.log('redirect to homepage');

});

casper.then(function() {
  console.log('going to thumbnail page');
  casper.evaluate(function() {
     document.getElementsByClassName('fbxWelcomeBoxName')[0].click();
   })
})

casper.then(function() {
  this.wait(1000);
  if(this.exists('.profilePicThumb')) {
    this.echo("IT IS HERE")
    var item = this.getElementAttribute('.profilePicThumb','href');
    var idxId = item.indexOf('fbid');
    var idxSet = item.indexOf('&set');
    var fbId = item.slice(idxId+5,idxSet);
    data.fbId = fbId;
  }
})

casper.then(function() {
  this.echo("AND EXIT");
  this.evaluate(function() {
    document.querySelectorAll("[data-gt='{\"ref\":\"async_menu\",\"logout_menu_click\":\"menu_logout\"}']")[0].click()
  })
})

if(env === "development") {
  casper.thenOpen("http://localhost:3000/api/facebook/update/the/tokens/please", function() {
      this.echo("hit home DEV")
  });
}

if(env === "staging") {
  casper.thenOpen("http://gotindergarten-staging.herokuapp.com/api/facebook/update/the/tokens/please", function() {
      this.echo("hit home STAGE")
  });
}

if(env === "production") {
  casper.thenOpen("http://www.gotindergarten.com/api/facebook/update/the/tokens/please", function() {
      this.echo("hit home PROD")
  });
}

casper.then(function() {
  this.echo("ADD DATA")
  this.fillSelectors('form', {
      'input[name="token"]':    data.token,
      'input[name="facebookId"]': data.fbId
  }, true);
})

casper.run();
