import socketIo from "socket.io";
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { createConnection } from "typeorm";
const MongoDBStore = require("connect-mongodb-session")(session);

import { setSignInListener } from "./listeners/signIn.listener";
import { setSignUpListener } from "./listeners/signUp.listener";
import { setSendMessageListener } from "./listeners/sendMessage.listener";
import { setConnectToChatListener } from "./listeners/connectToChat.listener";
import { setLogoutListener } from "./listeners/logout.listener";

import { authMiddleware } from "./middleware/auth.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";

import { User } from "./entity/User";
import { Message } from "./entity/Message";

const app = express();
export const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017",
  databaseName: "chat",
  collection: "sessions",
});

const server = app.listen(3333, () => console.log("Server run"));
const io = socketIo(server);

createConnection()
  .then(async (connection) => {
    console.log("Connecting to database");

    io.use((socket, next) => {
      sessionMiddleware(socket.request, {} as any, next);
    });
    io.on("connection", (socket) => {
      authMiddleware(socket, sessionStore);

      setLogoutListener(socket);
      setSignUpListener(socket);
      setSignInListener(socket);
      setSendMessageListener(socket);
      setConnectToChatListener(socket);
    });
  })
  .catch((error) => console.error(error));
