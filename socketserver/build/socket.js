"use strict";

var SocketIO = require('socket.io');
var moment = require('moment');
var onlineMap = {};
var socketInit = function socketInit(server, app) {
  var io = SocketIO(server, {
    path: '/socket.io'
  });
  app.set('io', io);
  app.set('onlineMap', onlineMap);
  return io;
};
module.exports = function (server, app) {
  var io = socketInit(server, app);
  var webNsp = io.of('/web-client').on('connect', function (socket) {
    socket.emit('hello', "\uB4DC\uB860 \uAD00\uC81C\uD0D1 \uC11C\uBC84\uC5D0 \uC811\uC18D\uD558\uC600\uC2B5\uB2C8\uB2E4.");
    socket.emit('dronsConnetStatus', Object.values(onlineMap));
  });
  io.of(/^\/drone-.+$/).on('connect', function (socket) {
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {
        mission: null,
        droneName: socket.nsp.name.substring(1),
        lastSignal: moment().unix()
      };
    }
    socket.emit('hello', "\uB4DC\uB860 \uAD00\uC81C\uD0D1 \uC11C\uBC84\uC5D0 \uC811\uC18D\uD558\uC600\uC2B5\uB2C8\uB2E4.");

    // 드론의 메시지
    socket.on('message', function (data) {
      var mission;
      if (onlineMap[socket.nsp.name]) {
        onlineMap[socket.nsp.name].lastSignal = moment().unix();
        mission = onlineMap[socket.nsp.name].mission;
      } else {
        onlineMap[socket.nsp.name] = {
          mission: null,
          droneName: socket.nsp.name.substring(1),
          lastSignal: moment().unix()
        };
      }
      webNsp.emit('message', {
        droneName: socket.nsp.name.substring(1),
        mission: mission,
        data: data
      });
    });

    // 드론의 미션 정보
    socket.on('mission', function (data) {
      if (onlineMap[socket.nsp.name]) {
        onlineMap[socket.nsp.name].mission = data;
        onlineMap[socket.nsp.name].lastSignal = moment().unix();
      } else {
        onlineMap[socket.nsp.name] = {
          mission: data,
          droneName: socket.nsp.name.substring(1),
          lastSignal: moment().unix()
        };
      }
      webNsp.emit('mission', {
        droneName: socket.nsp.name.substring(1),
        data: data
      });
    });
    socket.on('disconnect', function () {
      delete onlineMap[socket.nsp.name];
    });
  });
};
var checkOnlineMap = function checkOnlineMap() {
  var now = moment().unix();
  Object.keys(onlineMap).forEach(function (key) {
    if (now - onlineMap[key].lastSignal > 30) {
      delete onlineMap[key];
    }
  });
  // console.log(onlineMap);
  setTimeout(checkOnlineMap, 1000); // 1초마다 체크
};

// checkOnlineMap(); 아직을 적용하지 말자