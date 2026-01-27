import express from "express";
import userRoutes from "./routes/auth-user";
import threadRoutes from "./routes/threads";
import replyRoutes from "./routes/reply";
import likeRoutes from "./routes/like";
import followRoutes from "./routes/follow";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import http from "http";
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1", userRoutes);
app.use("/api/v1", threadRoutes);
app.use("/api/v1", replyRoutes);
app.use("/api/v1", likeRoutes);
app.use("/api/v1", followRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join-thread", (threadId: number) => {
    socket.join(`thread:${threadId}`);
  });

  socket.on("leave-thread", (threadId: number) => {
    socket.leave(`thread:${threadId}`);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
