"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _api = _interopRequireDefault(require("./routers/api"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use((0, _cors["default"])({
  origin: ['http://localhost:4051', 'https://muhan-control-system.vercel.app', 'https://main.d3gdj7l0zvv4fe.amplifyapp.com'],
  credentials: true,
  webSocket: true
}));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/api', _api["default"]);
var _default = app;
exports["default"] = _default;