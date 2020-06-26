import { MongoClient } from "mongodb";
import socketIo from "socket.io";
import express from "express";
import session from "express-session";
const MongoDBStore = require("connect-mongodb-session")(session);

import { createValidatedCollection } from "./lib/mongoHandlers";

import { setSignInListener } from "./listeners/signIn.listener";
import { setSignUpListener } from "./listeners/signUp.listener";
import { setSendMessageListener } from "./listeners/sendMessage.listener";
import { setConnectToChatListener } from "./listeners/connectToChat.listener";
import { setLogoutListener } from "./listeners/logout.listener";
import { authMiddleware } from "./middleware/auth.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { createUsersCollection } from "./collections/users.collection";
import { createMessagesCollection } from "./collections/messages.collection";

const app = express();
export const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017",
  databaseName: "chat",
  collection: "sessions",
});

const server = app.listen(3333);
const io = socketIo(server);

const url = "mongodb://localhost:27017";
const dbName = "chat";
const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  createUsersCollection(db);
  createMessagesCollection(db);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {} as any, next);
  });
  io.on("connection", (socket) => {
    authMiddleware(socket, sessionStore, db.collection("users"));

    setLogoutListener(socket);
    setSignUpListener(socket, db.collection("users"));
    setSignInListener(socket, db.collection("users"));
    setSendMessageListener(socket, db.collection("messages"));
    setConnectToChatListener(
      socket,
      db.collection("users"),
      db.collection("messages")
    );
  });
});
