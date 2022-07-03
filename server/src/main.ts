import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const port = process.env.PORT ?? 3001;
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", async (_req, res) => {
  res.json({ message: "ok" });
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("cancelled");
  });
  socket.on("call-user", ({ userToCall, signalData, from, name }: any) => {
    io.to(userToCall).emit("call-user", {
      signal: signalData,
      from,
      name,
    });
  });
  socket.on("answer-call", (data: any) => {
    io.to(data.to).emit("call-accepted", data.signal);
  });
});

server.listen(port, () => {
  console.log(`The app listening on port ${port}.`);
});
