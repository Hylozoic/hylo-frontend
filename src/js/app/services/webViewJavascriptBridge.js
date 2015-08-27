/* usage:
 * var connectWebViewJavascriptBridge = require('webViewJavascriptBridge');
 * connectWebViewJavascriptBridge(function(bridge) {
 *   bridge.send(...)
 * }
 */



module.exports = function(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function() {
      callback(window.WebViewJavascriptBridge);
    }, false);
  }
};
