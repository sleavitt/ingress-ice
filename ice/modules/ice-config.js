/**
* @file Ingress-ICE, configurations
* @license MIT
*/

/*global fs */
/*global quit */
/*global args */


/*global cookiespath */
var cookiespath;

/*global config */
var config;

/*global folder */
var folder;

/*global ssnum */
var ssnum;

/*global configver */
var configver;

/*global curnum */
var curnum;

/*global loginTimeout */
var loginTimeout;

/*global twostep */
var twostep;

/*global webpage */
var webpage;

/*global page */
var page;

function initialConfiguration() {
  // Path to cookies file
  cookiespath = '.iced_cookies';

  // Parse the configuration
  config = configure(args[1]);

  // Check if no login/password/area link provided
  if (!config.login || !config.password || !config.area) {
    quit('No login/password/area link specified. You need to reconfigure ice:\n - Double-click reconfigure.cmd on Windows;\n - Start ./ingress-ice -r on Linux/Mac OS X/*BSD;');
  }

  // Create the folder variable
  folder = fs.workingDirectory + '/';

  // Calculate number of screenshots to take
  ssnum = 0;
  if (args[2]) {
    ssnum = parseInt(args[2], 10);
  }

  // Determine the version of the supplied configuration
  configver = (config.SACSID === '' || config.SACSID === undefined) ? 1 : 2;

  // Counter for number of screenshots
  curnum = 0;

  // Delay between logging in and checking if successful
  loginTimeout = 10 * 1000;

  // twostep auth trigger
  twostep = 0;

  // Initialize phantomjs so we can get started
  webpage = require('webpage');
  page    = webpage.create();

  // Suppress console and error messages
  page.onConsoleMessage = function () {};
  page.onError  = function () {};

  /**
  * aborting unnecessary API
  * @since 4.0.0
  * @author c2nprds
  */
  page.onResourceRequested = function(requestData, request) {
    if (requestData.url.match(/(getGameScore|getPlexts|getPortalDetails)/g)) {
      request.abort();
    }
  };

  //page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36';

  /** @function setViewportSize */
  if (!config.iitc) {
    page.viewportSize = {
      width: config.width + 42,
      height: config.height + 167
    };
  } else {
    page.viewportSize = {
      width: config.width,
      height: config.height
    };
  }
}

/**
* Parse the configuration .conf file
* @since 4.0.0
* @param {String} path
*/
function configure(path) {
  var settings = {};
  var settingsfile = fs.open(path, 'r');
  while(!settingsfile.atEnd()) {
    var line = settingsfile.readLine();
    if (!(line[0] === '#' || line[0] === '[' || line.indexOf('=', 1) === -1)) {
      var pos = line.indexOf('=', 1);
      var key = line.substring(0,pos);
      var value = line.substring(pos + 1);
      if (value == 'false') {
        settings[key] = false;
      } else if (/^-?[\d.]+(?:e-?\d+)?$/.test(value) && value !== '') {
        settings[key] = parseInt(value, 10);
      } else {
        settings[key] = value;
      }
    }
  }
  settingsfile.close();
  return settings;
}
