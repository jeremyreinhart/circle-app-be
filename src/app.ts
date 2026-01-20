import express from "express";
import userRoutes from "./routes/auth-user";
import threadRoutes from "./routes/threads";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", userRoutes);
app.use("/api/v1", threadRoutes);

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
