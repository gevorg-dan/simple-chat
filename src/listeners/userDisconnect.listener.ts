import { Socket } from "socket.io";

import { prepareData } from "../lib";

import ChatState from "../state/ChatState";

export function setUserDisconnectListener(
  socket: Socket,
  writeDataToFile: (data: string) => void
) {
  socket.on("user-disconnect", (user) => {
    ChatState.users = ChatState.users.filter(({ id }) => id !== user.id);
    socket.broadcast.emit("user-disconnect", {
      message: "actually users",
      data: { users: ChatState.users },
    });
    const usersData = prepareData(ChatState.users);
    writeDataToFile(usersData.join(""));
  });
}
