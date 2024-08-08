const express = require("express");
const mongoose = require("mongoose");
const cluster = require("cluster");
const os = require("os");
require("dotenv").config();
const routes = require("./routes");

const app = express(); // Moved this to the top for clarity

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`
    );
    cluster.fork(); // Restart the worker
  });
} else {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(process.env.PORT || 3000, () => {
        console.log(
          `DB & server connected, Port: ${
            process.env.PORT || 3000
          }, Worker PID: ${cluster.worker.process.pid}`
        );
      });
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });

  // Middleware
  app.use("/uploads", express.static("uploads"));
  app.use(express.json()); // Added to parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Added to parse URL-encoded request bodies

  app.use((req, res, next) => {
    console.log("Request Arrived at:", req.url);
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, authorization, Accept, User-Agent, requestedby"
    );
    next();
  });

  // Routes
  try {
    routes(app);
  } catch (err) {
    console.error("Routes error:", err);
  }
}
