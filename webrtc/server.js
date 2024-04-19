const http = require("http");
const SocketIO = require("socket.io");
const express = require("express");

const app = express();

app.use(express.static("public"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("welcome", () => {
    socket.join("test");
    socket.to("test").emit("hi");
  });
  socket.on("offer", (offer) => {
    socket.to("test").emit("offer", offer);
  });
  socket.on("answer", (answer) => {
    socket.to("test").emit("answer", answer);
  });
  socket.on("ice", (ice) => {
    socket.to("test").emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
