/* jshint esversion:6 */
import querystring from 'querystring';
export {onNextFrame,cancelFrame, paramsToObject, objectToState};

const cf = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const nf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

/**
 * Do something on next frame
 * @param {Function} cb Callback function to execute on next animation frame
 */
function onNextFrame(cb) {
  return nf(cb);
}
/**
 * cancel frame ide
 * @param {Integer} id Frame id
 */
function cancelFrame(id) {
  cf(id || 0);
}

/**
 * Returns an Array of all url parameters
 * @return {[Array]} [Key Value pairs form URL]
 */
function paramsToObject(params) {
  var out = querystring.parse(params || window.location.search.substring(1));
  return out;
}

/**
 * Replace current url state using object values
 *
 * @param {Object} query Params to replace state with
 * @return null
 */
function objectToState(query) {
  onNextFrame(function() {
    var out = window.location.pathname;
    var params = paramsToObject();
    var keysNew = Object.keys(query);
    var val;
    keysNew.forEach((kn) => {
      val = query[kn];
      if (val) {
        params[kn] = val;
      } else {
        delete params[kn];
      }
    });

    if (params) {
      out = out + '?' + querystring.stringify(params);
    }
    history.replaceState(null, null, out);
  });
}
