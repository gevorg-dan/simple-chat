import { Socket } from "socket.io";
import uniqid from "uniqid";

import ChatState from "../state/ChatState";

import { Message } from "../models/Message";

export function setNewMessageListener(socket: Socket) {
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
}
