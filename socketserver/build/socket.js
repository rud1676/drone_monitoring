"use strict";

var SocketIO = require('socket.io');
var moment = require('moment');
var onlineMap = {};

// 서버시작시 소켓 생성
var socketInit = function socketInit(server, app) {
  var io = SocketIO(server, {
    path: '/socket.io'
  });
  app.set('io', io);
  app.set('onlineMap', onlineMap);
  return io;
};

// 2. 웹 클라이언트 연결 처리
function handleWebClientConnection(io) {
  var webNsp = io.of('/web-client').on('connect', function (socket) {
    socket.emit('hello', "\uB4DC\uB860 \uAD00\uC81C\uD0D1 \uC11C\uBC84\uC5D0 \uC811\uC18D\uD558\uC600\uC2B5\uB2C8\uB2E4.");
    socket.emit('dronsConnetStatus', Object.values(onlineMap));
  });
  return webNsp;
}

// 3. 드론 클라이언트 연결 처리
function handleDroneClientConnection(io, webNsp) {
  io.of(/^\/drone-.+$/).on('connect', function (socket) {
    // 드론 연결 및 메시지 처리 로직
    initializeDroneConnection(socket);

    // 드론에 관한 정보가 담긴 메세지를 처리 -> 모니터링 앱에 보내준다.
    socket.on('message', function (data) {
      processDroneMessage(socket, data, webNsp);
    });

    // 드론이 해야할 미션 정보(경로)를 받아 모니터링 앱에 보내준다.
    socket.on('mission', function (data) {
      updateDroneMission(socket, data, webNsp);
    });
    socket.on('disconnect', function () {
      delete onlineMap[socket.nsp.name];
    });
  });
}

// 드론 연결 초기화
function initializeDroneConnection(socket) {
  if (!onlineMap[socket.nsp.name]) {
    onlineMap[socket.nsp.name] = {
      mission: null,
      droneName: socket.nsp.name.substring(1),
      lastSignal: moment().unix()
    };
  }
  socket.emit('hello', "\uB4DC\uB860 \uAD00\uC81C\uD0D1 \uC11C\uBC84\uC5D0 \uC811\uC18D\uD558\uC600\uC2B5\uB2C8\uB2E4.");
}

// 드론 메시지 처리
function processDroneMessage(socket, data, webNsp) {
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
}

// 드론 미션 업데이트
function updateDroneMission(socket, data, webNsp) {
  //첫 통신이면 객체생성
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
}
module.exports = function (server, app) {
  var io = socketInit(server, app);
  var webNsp = handleWebClientConnection(io);
  handleDroneClientConnection(io, webNsp);
};