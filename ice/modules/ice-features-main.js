/**
* @file Ingress-ICE, mandatory features
* @license MIT
*/

/*global idleReset */
/*global announce */
/*global config */
/*global page */
/*global folder */
/*global getDateTime */
/*global hideDebris */
/*global curnum */
/*global greet */
/*global configver */
/*global cookiesFileExists */
/*global firePlainLogin */
/*global addCookies */
/*global main */
/*global ssnum */
/*global phantom */
/*global addTimestamp */
/*global afterCookieLogin */

/**
* Screenshot wrapper
*/
function s() {
  announce('Screen saved');
  page.render(folder + 'ice-' + getDateTime(1).replace(/\s/g, '-') + '.png');
}

/**
* Screenshots counter
* @var {number} curnum
* @var {number} ssnum
*/
function count() {
  if (ssnum > 0) {
    announce('Screen #' + (++curnum) + '/' + ssnum + ' captured');
    if ((curnum >= ssnum) && (ssnum !== 0)) {
      announce('Finished successfully. Exiting...\nThanks for using ingress-ice!');
      quit();
    }
  }
}

/**
* Hide debris on the map like selectors
* @param {boolean} iitcz
*/
function hideDebris(iitcz) {
  if (!iitcz) {
    page.evaluate(function () {
      if (document.querySelector('#comm'))             {document.querySelector('#comm').style.display = 'none';}
      if (document.querySelector('#player_stats'))     {document.querySelector('#player_stats').style.display = 'none';}
      if (document.querySelector('#game_stats'))       {document.querySelector('#game_stats').style.display = 'none';}
      if (document.querySelector('#geotools'))         {document.querySelector('#geotools').style.display = 'none';}
      if (document.querySelector('#header'))           {document.querySelector('#header').style.display = 'none';}
      if (document.querySelector('#snapcontrol'))      {document.querySelector('#snapcontrol').style.display = 'none';}
      if (document.querySelectorAll('.img_snap')[0])   {document.querySelectorAll('.img_snap')[0].style.display = 'none';}
      if (document.querySelector('#display_msg_text')) {document.querySelector('#display_msg_text').style.display = 'none';}
    });
    page.evaluate(function () {
      var hide = document.querySelectorAll('.gmnoprint');
      for (var index = 0; index < hide.length; ++index) {
        hide[index].style.display = 'none';
      }
    });
  } else {
    window.setTimeout(function () {
      page.evaluate(function () {
        if (document.querySelector('#chat'))                      {document.querySelector('#chat').style.display = 'none';}
        if (document.querySelector('#chatcontrols'))              {document.querySelector('#chatcontrols').style.display = 'none';}
        if (document.querySelector('#chatinput'))                 {document.querySelector('#chatinput').style.display = 'none';}
        if (document.querySelector('#updatestatus'))              {document.querySelector('#updatestatus').style.display = 'none';}
        if (document.querySelector('#sidebartoggle'))             {document.querySelector('#sidebartoggle').style.display = 'none';}
        if (document.querySelector('#scrollwrapper'))             {document.querySelector('#scrollwrapper').style.display = 'none';}
        if (document.querySelector('.leaflet-control-container')) {document.querySelector('.leaflet-control-container').style.display = 'none';}
      });
    }, 2000);
  }
}

/**
* Prepare map for screenshooting. Make screenshots same width and height with map_canvas
* If IITC, also set width and height
* @param {boolean} iitcz
* @param {number} widthz
* @param {number} heightz
*/
function prepare(iitcz, widthz, heightz) {
  if (!iitcz) {
    var selector = "#map_canvas";
    setElementBounds(selector);
  } else {
    window.setTimeout(function () {
      page.evaluate(function (w, h) {
        var water = document.createElement('p');
        water.id='viewport-ice';
        water.style.position = 'absolute';
        water.style.top = '0';
        water.style.marginTop = '0';
        water.style.paddingTop = '0';
        water.style.left = '0';
        water.style.width = w;
        water.style.height = h;
        document.querySelectorAll('body')[0].appendChild(water);
      }, widthz, heightz);
      var selector = "#viewport-ice";
      setElementBounds(selector);
    }, 4000);
  }
}

/**
* Sets element bounds
* @param selector
*/
function setElementBounds(selector) {
  page.clipRect = page.evaluate(function(selector) {
    var clipRect = document.querySelector(selector).getBoundingClientRect();
    return {
      top:    clipRect.top,
      left:   clipRect.left,
      width:  clipRect.width,
      height: clipRect.height
    };
  }, selector);
}

/**
* Checks if human presence not detected and makes a human present
* @since 2.3.0
*/
function humanPresence() {
  var outside = page.evaluate(function () {
    return !!(document.getElementById('butterbar') && (document.getElementById('butterbar').style.display !== 'none'));
  });
  if (outside) {
    var rekt = page.evaluate(function () {
      return document.getElementById('butterbar').getBoundingClientRect();
    });
    page.sendEvent('click', rekt.left + rekt.width / 2, rekt.top + rekt.height / 2);
  }
}

/**
* Main function. Wrapper for others.
*/
function main() {
  if (config.timestamp) {
    page.evaluate(function () {
      if (document.getElementById('watermark-ice')) {
        var oldStamp = document.getElementById('watermark-ice');
        oldStamp.parentNode.removeChild(oldStamp);
      }
    });
  }
  if (!config.iitc) {
    humanPresence();
    hideDebris(config.iitc);
  } else {
    page.evaluate(function () {
      idleReset();
    });
  }
  window.setTimeout(function () {
    if (config.timestamp) {
      addTimestamp(getDateTime(config.timestampformat), config.iitc);
    }
    if (typeof config.beforeScreenshot == 'function') config.beforeScreenshot();
    s();
    if (typeof config.afterScreenshot == 'function') config.afterScreenshot();
    count();
  }, 2000);
}

/**
* Starter
*/
function ice() {
  greet();

  if (configver !== 2 && !cookiesFileExists()) {
    firePlainLogin();
  } else {
    announce('Using stored cookie');
    addCookies(config.SACSID, config.CSRF);
    afterCookieLogin();
  }
}
