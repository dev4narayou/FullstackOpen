const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const userRouter = require("./controllers/users");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

const mongoUrl = `${config.MONGODB_URI}`;
mongoose.connect(mongoUrl).catch((error) => {
  console.error("error connecting to MongoDB:", error.message);
});

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/user', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
