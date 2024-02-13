"use strict";

var _express = _interopRequireDefault(require("express"));
var _api = _interopRequireDefault(require("../controller/api"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router({
  mergeParams: true
});
router.get('/health', _api["default"]);
module.exports = router;