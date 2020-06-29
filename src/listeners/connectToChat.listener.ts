import { Socket } from "socket.io";
import { getMongoRepository } from "typeorm";

import { Message } from "../entity/Message";
import { User } from "../entity/User";

export function setConnectToChatListener(socket: Socket) {
  socket.on("connect-to-chat", async () => {
    const userRepository = getMongoRepository(User);
    const messageRepository = getMongoRepository(Message);

    const users = await userRepository.find({
      select: ["id", "login"],
    });
    const messages = await messageRepository.find({});

    socket.emit("successful-chat-connection", {
      message: "connection successful",
      data: { users, messages },
    });
  });
}
