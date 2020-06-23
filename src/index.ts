import http from "http";
import path from "path";
import socketIo from "socket.io";

import { prepareData, savingDataToFile } from "./lib";

import ChatState from "./state/ChatState";

import { setLoginListener } from "./listeners/login.listener";
import { setNewMessageListener } from "./listeners/newMessage.listener";
import { setUserDisconnectListener } from "./listeners/userDisconnect.listener";

const [appendDataToFile, writeDataToFile, setDataToState] = savingDataToFile();
const messagesFilePath = path.resolve(__dirname, "data", "messages.txt");
const usersFilePath = path.resolve(__dirname, "data", "users.txt");

const server = http.createServer().listen(3333, () => {
  setDataToState(messagesFilePath, (messages) =>
    ChatState.setMessages(messages)
  );
  setDataToState(usersFilePath, (users) => ChatState.setUsers(users));

  setInterval(() => {
    const data = prepareData(ChatState.newMessages);

    if (ChatState.newMessages.length === 0) return;

    appendDataToFile(messagesFilePath, data.join(""));
    ChatState.newMessages = [];
  }, 30000);
});

const io = socketIo(server);

io.on("connection", (socket) => {
  setLoginListener(socket, (data) => writeDataToFile(usersFilePath, data));
  setNewMessageListener(socket);
  setUserDisconnectListener(socket, (data) =>
    writeDataToFile(usersFilePath, data)
  );
});
