import { Socket } from "socket.io";
import { getMongoRepository } from "typeorm";

import { User } from "../entity/User";

export function setSignUpListener(socket: Socket) {
  socket.on("sign-up", async (data: User) => {
    try {
      const { login, password } = data;
      const userRepository = getMongoRepository(User);

      const user = await userRepository.findOne({ login });

      if (user) {
        socket.emit("sign-up-failed", {
          message: "This login is already token",
        });
        return;
      }

      const newUser = new User();
      newUser.login = login;
      newUser.password = password;

      await userRepository.save(newUser);

      socket.emit("sign-up-success", {
        message: "User created",
        newUser,
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: error.message });
    }
  });
}
