import { Socket } from "socket.io";
import { Collection } from "mongodb";

import { SignDataType } from "./signUp.listener";

import { sessionStore } from "../index";

export function setSignInListener(socket: Socket, collection: Collection) {
  socket.on("sign-in", (data: SignDataType) => {
    try {
      const { login: dataLogin, password: dataPassword } = data;

      collection.findOne(
        { login: dataLogin, password: dataPassword },
        (error, result) => {
          if (error) {
            console.error(error);
            return;
          }

          if (!result) {
            socket.emit("sign-in-failed", {
              message: "This user was not created",
            });
            return;
          }

          socket.request.session.login = dataLogin;
          sessionStore.set("login", dataLogin);

          const response = { _id: result._id, login: result.login };
          socket.emit("sign-in-success", {
            message: "You are logged in",
            user: response,
          });
          socket.broadcast.emit("user-joined", {
            message: "User connected to chat",
            user: response,
          });
        }
      );
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: error.message });
    }
  });
}
