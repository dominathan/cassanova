var exec = require('child_process').exec;
var env = process.env.NODE_ENV || 'development';
var child;

function getTinderTokenInfo(facebookEmail,facebookPassword) {
  return new Promise(function(resolve,reject) {
    child = exec(`node_modules/.bin/casperjs services/webScraper.js ${env} ${facebookEmail} ${facebookPassword}`, function(err,stdout,stderr) {
      console.log('stdout: \n ' + stdout);
      resolve(stdout)
       console.log('stderr: ' + stderr);
       if (err !== null) {
         reject(stdout);
         console.log('exec error: ' + err);
       }
    })
  })
}

module.exports = getTinderTokenInfo;
