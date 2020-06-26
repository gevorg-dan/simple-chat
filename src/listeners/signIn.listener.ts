import { Socket } from "socket.io";
import { MongoRepository } from "typeorm";

import { sessionStore } from "../index";

import { User } from "../entity/User";

export function setSignInListener(
  socket: Socket,
  userRepository: MongoRepository<User>
) {
  socket.on("sign-in", async (data: User) => {
    try {
      const { login, password } = data;

      const user = await userRepository.findOne({ login });

      if (!user || user.password !== password) {
        socket.emit("sign-in-failed", {
          message: "This user was not created or pass is invalid",
        });
        return;
      }

      socket.request.session.login = login;
      sessionStore.set("login", login);

      const response = { id: user.id, login: user.login };
      socket.emit("sign-in-success", {
        message: "You are logged in",
        user: response,
      });
      socket.broadcast.emit("user-joined", {
        message: "User connected to chat",
        user: response,
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: error.message });
    }
  });
}
