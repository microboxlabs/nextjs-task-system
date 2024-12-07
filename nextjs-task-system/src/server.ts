// server.js
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on(
  "connection",
  (socket: {
    on: (arg0: string, arg1: { (data: any): void; (): void }) => void;
    emit: (arg0: string, arg1: string) => void;
  }) => {
    console.log("Client connected");

    socket.on("client_message", (data: void) => {
      console.log("Message:", data);

      socket.emit("server_message", `Message: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  },
);

server.listen(8080, () => {
  console.log("Websocket server running on port 8080");
});
