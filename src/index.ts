import http from "http";
import { MongoClient } from "mongodb";
import socketIo from "socket.io";

import { createValidatedCollection } from "./lib/mongoHandlers";

import { setSignInListener } from "./listeners/signIn.listener";
import { setSignUpListener } from "./listeners/signUp.listener";
import { setSendMessageListener } from "./listeners/sendMessage.listener";
import { setConnectToChatListener } from "./listeners/connectToChat.listener";

const server = http.createServer().listen(3333);
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

  createValidatedCollection({
    db,
    collectionName: "users",
    options: {
      validator: {
        $or: [
          { id: { $type: "string" } },
          { login: { $type: "string" } },
          { password: { $type: "string" } },
        ],
      },
    },
  });
  createValidatedCollection({
    db,
    collectionName: "messages",
    options: {
      validator: {
        $or: [
          { id: { $type: "string" } },
          { text: { $type: "string" } },
          { date: { $type: "string" } },
          { authorId: { $type: "string" } },
        ],
      },
    },
  });

  io.on("connection", (socket) => {
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
