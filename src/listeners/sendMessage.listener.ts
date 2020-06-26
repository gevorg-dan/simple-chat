import { Socket } from "socket.io";
import { MongoRepository } from "typeorm";

import { Message } from "../entity/Message";

export function setSendMessageListener(
  socket: Socket,
  messageRepository: MongoRepository<Message>
) {
  socket.on("send-message", async (data: Message) => {
    try {
      const { text, date, author, reply } = data;
      if (!socket.request.session.login) return;

      const newMessage = new Message();
      newMessage.text = text;
      newMessage.date = date;
      newMessage.author = author;
      newMessage.reply = reply;
      await messageRepository.save(newMessage);

      const response = {
        message: "message sent",
        data: { message: newMessage },
      };

      socket.emit("send-message-success", response);
      socket.broadcast.emit("send-message-success", response);
    } catch (e) {
      console.error(e);
    }
  });
}
