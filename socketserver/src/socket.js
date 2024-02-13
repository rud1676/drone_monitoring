const SocketIO = require('socket.io');
const moment = require('moment');

const onlineMap = {};

const socketInit = (server, app) => {
  const io = SocketIO(server, {
    path: '/socket.io'
  });
  app.set('io', io);
  app.set('onlineMap', onlineMap);
  return io;
};

module.exports = (server, app) => {
  const io = socketInit(server, app);
  console.log(ig);

  const webNsp = io.of('/web-client').on('connect', (socket) => {
    console.log('hello');
    socket.emit('hello', `드론 관제탑 서버에 접속하였습니다.`);
    socket.emit('dronsConnetStatus', Object.values(onlineMap));
  });

  io.of(/^\/drone-.+$/).on('connect', (socket) => {
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {
        mission: null,
        droneName: socket.nsp.name.substring(1),
        lastSignal: moment().unix()
      };
    }

    socket.emit('hello', `드론 관제탑 서버에 접속하였습니다.`);

    // 드론의 메시지
    socket.on('message', (data) => {
      let mission;
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
        mission,
        data
      });
    });

    // 드론의 미션 정보
    socket.on('mission', (data) => {
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
        data
      });
    });

    socket.on('disconnect', () => {
      delete onlineMap[socket.nsp.name];
    });
  });
};

const checkOnlineMap = () => {
  const now = moment().unix();
  Object.keys(onlineMap).forEach((key) => {
    if (now - onlineMap[key].lastSignal > 30) {
      delete onlineMap[key];
    }
  });
  // console.log(onlineMap);
  setTimeout(checkOnlineMap, 1000); // 1초마다 체크
};

// checkOnlineMap(); 아직을 적용하지 말자
