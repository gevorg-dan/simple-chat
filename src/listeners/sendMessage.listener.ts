import { Socket } from "socket.io";
import { getMongoRepository, ObjectID } from "typeorm";

import { Message } from "../entity/Message";
import { User } from "../entity/User";

export function setSendMessageListener(socket: Socket) {
  socket.on("send-message", async (data: any) => {
    try {
      const { text, date, author, reply } = data;
      const messageRepository = getMongoRepository(Message);
      const userRepository = getMongoRepository(User);

      const user = await userRepository.findOne({ id: new ObjectID(author) });

      const newMessage = new Message();
      newMessage.text = text;
      newMessage.date = date;
      newMessage.author = user.id.toString();
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
