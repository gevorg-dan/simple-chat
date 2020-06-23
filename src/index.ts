import http from "http";
import path from "path";
import socketIo from "socket.io";
import uniqid from "uniqid";

import { prepareData, savingDataToFile } from "./lib";

import ChatState from "./state/ChatState";

import { User } from "./models/User";
import { Message } from "./models/Message";

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
  socket.on("login", (data) => {
    let user: User;

    if (data.id) {
      const authorizedUser = ChatState.users.find(
        (user) => user.id === data.id
      );
      user = authorizedUser!;
    } else {
      const userId = uniqid();
      user = new User(userId, data.name);
      ChatState.addUser(user);

      const usersData = prepareData(ChatState.users);
      writeDataToFile(usersFilePath, usersData.join(""));
    }

    const response = {
      message: "User added to chat",
      data: { user },
    };
    socket.emit("login-success", response);
    socket.emit("start", {
      message: "Socket-connection",
      data: { messages: ChatState.messages, users: ChatState.users },
    });
    socket.broadcast.emit("user joined", response);
    socket.broadcast.emit("new user connected", {
      message: "add new user",
      data: { users: ChatState.users },
    });
  });

  socket.on("new-message", (data) => {
    try {
      const newMessageId = uniqid();
      const author = ChatState.users.find(({ id }) => id === data.authorId);

      if (!author) {
        socket.emit("new-message-fail");
        return;
      }

      const newMessage = new Message(
        newMessageId,
        data.text,
        author,
        data.date
      );
      ChatState.addMessage(newMessage);

      const response = {
        message: "new-message-added",
        data: { newMessage },
      };

      socket.emit("new-message-added", response);
      socket.broadcast.emit("new-message-added", response);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("user-disconnect", (user) => {
    ChatState.users = ChatState.users.filter(({ id }) => id !== user.id);
    socket.broadcast.emit("user-disconnect", {
      message: "actually users",
      data: { users: ChatState.users },
    });
    const usersData = prepareData(ChatState.users);
    writeDataToFile(usersFilePath, usersData.join(""));
  });
});
