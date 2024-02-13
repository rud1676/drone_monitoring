"use strict";

var _app = _interopRequireDefault(require("./app"));
var _socket = _interopRequireDefault(require("./socket"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = process.env.PORT || 4211;
var handleListening = function handleListening() {
  return console.log("\u2705 Server listenting on ".concat(PORT, " \uD83D\uDE80"));
};
var server = _app["default"].listen(PORT, handleListening);
(0, _socket["default"])(server, _app["default"]);