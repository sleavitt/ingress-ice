/**
* @file Ingress-ICE, extra features
* @license MIT
*/

/*global page */
/*global config */

/**
* Adds a timestamp to a screenshot
* @since 2.3.0
* @param {String} time
* @param {boolean} iitcz
*/
function addTimestamp(time, iitcz) {
  if (!iitcz) {
    page.evaluate(function (dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = 'orange';
      water.style.top = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.fontFamily = 'monospace';
      document.querySelector('#map_canvas').appendChild(water);
    }, time);
  } else {
    page.evaluate(function (dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = '#3A539B';
      water.style.top = '0';
      water.style.zIndex = '4404';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.fontFamily = 'monospace';
      document.querySelectorAll('body')[0].appendChild(water);
    }, time);
  }
}

/**
* Inserts IITC and defines settings
* @var hideRes
* @var hideEnl
* @var hideLink
* @var hideField
* @var minlevel
* @var maxlevel
* @author akileos (https://github.com/akileos)
* @author Nikitakun
*/
function addIitc() {
  var iitcScripts = [{
    'src': 'https://secure.jonatkins.com/iitc/release/total-conversion-build.user.js',
    'params': {
      'ingress.intelmap.layergroupdisplayed': {
        'Unclaimed Portals': Boolean(config.minlevel === 1),
        'Level 1 Portals': Boolean(config.minlevel === 1),
        'Level 2 Portals': Boolean((config.minlevel <= 2) && (config.maxlevel >= 2)),
        'Level 3 Portals': Boolean((config.minlevel <= 3) && (config.maxlevel >= 3)),
        'Level 4 Portals': Boolean((config.minlevel <= 4) && (config.maxlevel >= 4)),
        'Level 5 Portals': Boolean((config.minlevel <= 5) && (config.maxlevel >= 5)),
        'Level 6 Portals': Boolean((config.minlevel <= 6) && (config.maxlevel >= 6)),
        'Level 7 Portals': Boolean((config.minlevel <= 7) && (config.maxlevel >= 7)),
        'Level 8 Portals': Boolean(config.maxlevel === 8),
        'Fields': !config.hideField,
        'Links': !config.hideLink,
        'Resistance': !config.hideRes,
        'Enlightened': !config.hideEnl,
        'DEBUG Data Tiles': false,
        'Artifacts': true,
        'Ornaments': true
      }
    }
  }];

  if (config.plugins) {
    plugins = JSON.parse(config.plugins);
    plugins.forEach(function(plugin) {
      iitcScripts.push(plugin);
    });
  }

  page.evaluate(function(iitcScripts) {
    iitcScripts.forEach(function(iitcScript) {
      if (iitcScript) {
        if (iitcScript.params) {
          Object.keys(iitcScript.params).forEach(function(key) {
            localStorage[key] = JSON.stringify(iitcScript.params[key]);
          });
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = iitcScript.src;
        document.body.appendChild(script);
      }
    });
  }, iitcScripts);

  waitFor(function() {
    return page.evaluate(function() {
      return window.iitcLoaded === true;
    });
  }, function() {
    announce('IITC finished loading');
  }, function() {
    announce('IITC failed to load in a timely manner');
  }, 30000);
}
