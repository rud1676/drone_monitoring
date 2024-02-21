"use strict";

var _express = _interopRequireDefault(require("express"));
var _api = _interopRequireDefault(require("../controller/api"));
var _area = _interopRequireDefault(require("../controller/area"));
var _weather = _interopRequireDefault(require("../controller/weather"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router({
  mergeParams: true
});
router.get('/area', _area["default"]);
router.get('/health', _api["default"]);
router.get('/weather', _weather["default"]);
module.exports = router;