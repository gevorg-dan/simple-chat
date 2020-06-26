import { Socket } from "socket.io";
import { MongoRepository } from "typeorm";

import { Message } from "../entity/Message";
import { User } from "../entity/User";

export function setConnectToChatListener(
  socket: Socket,
  userRepository: MongoRepository<User>,
  messageRepository: MongoRepository<Message>
) {
  socket.on("connect-to-chat", async () => {
    if (!socket.request.session.login) return;

    const users = await userRepository.find({ select: ["id", "login"] });
    const messages = await messageRepository.find({
      relations: ["author"],
    });
    console.log(messages);

    socket.emit("successful-chat-connection", {
      message: "connection successful",
      data: { users, messages },
    });
  });
}
