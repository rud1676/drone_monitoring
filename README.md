# Drone-MonitoringApp

## Socket-Server

- Deploy: Render(https://dronesocket.onrender.com/health)
- Socket: Socket.io
- Server: Nodejs - express

### 시나리오

실제 드론이랑 테스트하며 개발할 수 없으므로 통신 시나리오를 바탕으로 소켓서버를 구성했습니다.

**드론 통신 시나리오**

1. 드론 유저는 스마트폰을 통해 드론을 제어합니다.
2. 이때 드론에서 촬영되는 영상주소와 정보들을 스마트폰에 쏴줍니다.
3. 스마트폰에서는 해당 드론에 대해서 미션 정보를 중앙 서버로 전송할 수 있습니다.(실시간으로 전송됩니다.)
4. 또한 스마트폰에서 드론 정보를 소켓서버로 된 중앙 서버로 데이터를 전송합니다.(소켓으로 연결되 실시간으로 전송됩니다.)
5. 중앙서버는 그것을 모니터링 앱으로 전송해줍니다.

### 테스트환경 시나리오

1. 모니터링 웹서버의 연결을 감지합니다.(소켓 연결 생성)

```js
const socketInit = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
  });
  app.set("io", io);
  app.set("onlineMap", onlineMap);
  return io;
};
```

2. 스마트폰에서 전송되는 드론데이터를 감지합니다.(드론과의 소켓 연결 생성)

3. 미션과 드론에 대한 정보를 감지했다면 그것을 그대로 연결된 웹서버 소켓에 그대로 보내줍니다.

2-3의 코드를 구현하면 아래와 같습니다.

```js
// 3. 드론 클라이언트 연결 처리
function handleDroneClientConnection(io, webNsp) {
  // 연결될 때 이벤트를 등록합니다.
  io.of(/^\/drone-.+$/).on("connect", (socket) => {
    // 드론 연결 및 메시지 처리 로직
    initializeDroneConnection(socket);

    // 드론에 관한 정보가 담긴 메세지를 처리 -> 모니터링 앱에 보내준다.
    socket.on("message", (data) => {
      processDroneMessage(socket, data, webNsp);
    });

    // 드론이 해야할 미션 정보(경로)를 받아 모니터링 앱에 보내준다.
    socket.on("mission", (data) => {
      updateDroneMission(socket, data, webNsp);
    });

    socket.on("disconnect", () => {
      delete onlineMap[socket.nsp.name];
    });
  });
}
```
