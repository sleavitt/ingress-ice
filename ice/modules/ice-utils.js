/**
* @file Ingress-ICE, common utilities, not related to Google/Niantic
* @license MIT
*/

/*global version */
/*global phantom */

/**
* console.log() wrapper
* @param {String} str - what to announce
*/
function announce(str) {
  console.log(getDateTime(0) + ': ' + str);
}

/**
* Returns Date and time
* @param {number} format - the format of output, 0 for DD.MM.YYY HH:MM:SS, 1 for YYYY-MM-DD--HH-MM-SS (for filenames)
* @returns {String} date
*/
function getDateTime(format) {
  var now     = new Date();
  var year    = now.getFullYear();
  var month   = now.getMonth()+1;
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds();
  if(month.toString().length === 1) {
    month = '0' + month;
  }
  if(day.toString().length === 1) {
    day = '0' + day;
  }
  if(hour.toString().length === 1) {
    hour = '0' + hour;
  }
  if(minute.toString().length === 1) {
    minute = '0' + minute;
  }
  if(second.toString().length === 1) {
    second = '0' + second;
  }
  var dateTime;
  if (format === 1) {
    dateTime = year + '-' + month + '-' + day + '  ' + hour + '-' + minute + '-' + second;
  } else {
    dateTime = day + '.' + month + '.' + year + ' ' + hour + ':' + minute + ':' + second;
  }
  return dateTime;
}

/**
* Quit if an error occured
* @param {String} err - the error text
*/
function quit(err) {
  var exitCode;

  if (err) {
    announce('ICE crashed. Reason: ' + err + ' :(');
    exitCode = 1;
  } else {
    announce('Quit');
    exitCode = 0;
  }

  setTimeout(function(){ phantom.exit(exitCode); }, 0);
  phantom.onError = function(){};
}

/**
* Greeter. Beautiful ASCII-Art logo.
*/
function greet() {
  console.log('\n     _____ )   ___      _____) \n    (, /  (__/_____)  /        \n      /     /         )__      \n  ___/__   /        /          \n(__ /     (______) (_____)  v' + version + '\n\nIf you need help or want a new feature, visit https://github.com/nibogd/ingress-ice/issues');
}

/**
* WaitFor.js from phantomjs.org
* modified to add an optional onTimeout condition as well
*/
function waitFor(testFx, onReady, onTimeout, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          clearInterval(interval); //< Stop this interval
          if (onTimeout) {
            typeof(onTimeout) === "string" ? eval(onTimeout) : onTimeout(); //< Do what it's supposed to do if we've timed out
          }
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          clearInterval(interval); //< Stop this interval
          typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
        }
      }
    }, 250); //< repeat check every 250ms
};
