const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const { jwtVerify } = require("jose");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let activeSockets: { [userId: string]: any[] } = {};

app.use(express.json());
const secret = new TextEncoder().encode(
  "UMuQhBqpbkFAKMnhHi62Bz6W8Nwzw78U8D+lQsiq2C0=",
);

io.on("connection", (socket: any) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId: string) => {
    console.log(`Socket ${socket.id} joined as user ${userId}`);
    //push the user logged in the socket in an array
    if (!activeSockets[userId]) {
      activeSockets[userId] = [];
    }
    activeSockets[userId].push(socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      activeSockets[userId] = activeSockets[userId]?.filter(
        (s) => s.id !== socket.id,
      );
      if (activeSockets[userId]?.length === 0) {
        delete activeSockets[userId]; // deletes the active socket when the user is not using the page
      }
    });
  });

  socket.on("joinGroup", (groupId: string) => {
    console.log(`Socket ${socket.id} joined group ${groupId}`);
    socket.join(`group_${groupId}`);
    if (!activeSockets[groupId]) {
      activeSockets[groupId] = []; // join the groupId if the user has one
    }
    activeSockets[groupId].push(socket);
  });

  socket.on("client_message", (data: any) => {
    console.log("Message received:", data);
    socket.emit("server_message", `Message: ${data}`);
  });

  socket.on("error", (error: any) => {
    console.log("Socket error:", error);
  });
});

{
  /*urls to emit a message to the socket */
}
app.post("/send-message", (req: any, res: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const body = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  {
    /*callback because the function doesn't permit and async function */
  }
  jwtVerify(token, secret, {
    algorithms: ["HS256"],
  })
    .then(() => {
      if (activeSockets[body.userId]) {
        activeSockets[body.userId].forEach((socket) => {
          socket.emit("server_message", body.message); //  search for a socket in the array to build a message
        });
      }

      return res.status(200).json({ success: true });
    })
    .catch((error: Error) => {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid token" });
    });
});

app.post("/send-group-message", (req: any, res: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const body = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  jwtVerify(token, secret, {
    algorithms: ["HS256"],
  })
    .then(() => {
      const groupId = body.groupId;
      const message = body.message;

      if (!groupId || !message) {
        return res.status(400).json({ message: "Missing groupId or message" });
      }

      // emits a message by the group of the socket added to the array
      io.to(`group_${groupId}`).emit("server_message", message);

      return res.status(200).json({ success: true });
    })
    .catch((error: Error) => {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid token" });
    });
});

// start the server
server.listen(8081, () => {
  console.log("WebSocket server running on port 8081");
});
