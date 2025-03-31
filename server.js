const preferencesRouter = require("./src/routes/preferences/adminPrefeencesRoute");
const profileRouther = require("./src/routes/pictures/profileRoutes");
const userRouter = require("./src/routes/users/usersRoutes");
const authRouter = require("./src/routes/auth/authRoutes");
const blogRouter = require("./src/routes/blog/blogRoutes");
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.get("/", async (_, res) => res.send("Eid Mabrook"));

const corsOption = {
  methods: "GET, POST, DELETE, PUT",
  origin: process.env.COROS,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());

// auth routes
app.use("/auth/api", authRouter);

// file upload
app.use("/file/api", profileRouther);

// users
app.use("/api", userRouter);
app.use("/api/user", userRouter);

//admin Preferences
app.use("/api", preferencesRouter);

//blog api
app.use("/api", blogRouter);
const server = http.createServer(app);
module.exports = server;
