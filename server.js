const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const http = require("http");
const logger = require("logger");
const { PORT } = require("./config/config");

class Server {
  constructor() {
    this.app = express();
    this.server = HTMLOutputElement.createServer(this.app); // HTTP server wrapping Express because we are using socket io
    this.port = PORT;
  }

  // this makes all the connections for db middleware routes etc
  async initialize() {
    try {
      await DBConnect.connect(); // mongodb connection. DBconnect
      setUpMiddleware(this.app); // setting middlewares (cors and others)
      setupRoutes(this.app); //calling all routes
      this.app.use(notFound); //if anu unknown rout is came
      this.app.use(errorHandler); //error handle

      initializeSocket(this.server); // initialize socket io

      logger.info("Server initialized successfully"); //logs all activities
    } catch (error) {
      //error catch
      logger.error("Server initialization failed:", error);
      process.exit(1); //stops server immediately. the number 1 tells the system what happened ( 1 for "stopped deu to error ")
    }
  }

  //start
  async start() {
    await this.initialize(); //here we run all the connections in the initialize function

    this.server.listen(this.port, async () => {
      logger.info(
        `Server running in ${config.NODE_ENV} mode on port ${this.port}`,
      );

      setTimeout(async () => {
        //this setTTimeout will wait for mongodb to warm up before seeding
        await runSeeders();
      }, 2000);
    });
    this.setupGraceFullShutdown(); //shutdown gracefully when exit the server
  }

  //shutdown
  setupGraceFullShutdown() {
    const graceFullShutdown = async (signal) => {
      logger.info(`${signal} received. Self dying gracefully...(:`);

      this.server.close(async () => {
        logger.info("HTTP server closed!");

        await dbConnection.disconnect();
        logger.info("DB disconnected. Graceful shutdown completed!");

        process.exit(0);
        logger.info("Safe and clean exit");
      });
    };
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); //process.on is listening to the OS.. SIGTERM = please stop gracefully
    process.on("SIGINT", () => gracefulShutdown("SIGINT")); //SIGINT= please stop
  }
}
const appServer = new Server(); // this will run the Server class's constructor function create the new object as the class do
appServer.start(); // this will do the entire boot sequence

module.exports = appServer.app; //exports express
