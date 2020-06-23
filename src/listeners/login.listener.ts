import { Socket } from "socket.io";
import uniqid from "uniqid";

import { prepareData } from "../lib";

import ChatState from "../state/ChatState";

import { User } from "../models/User";

export function setLoginListener(
  socket: Socket,
  writeDataToFile: (data: string) => void
) {
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
      writeDataToFile(usersData.join(""));
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
}
