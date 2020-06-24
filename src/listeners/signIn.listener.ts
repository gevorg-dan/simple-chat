import { Socket } from "socket.io";
import { Collection } from "mongodb";

import { SignDataType } from "./signUp.listener";

export function setSignInListener(socket: Socket, collection: Collection) {
  socket.on("sign-in", (data: SignDataType) => {
    try {
      const { login: dataLogin, password: dataPassword } = data;

      collection.findOne(
        { login: dataLogin, password: dataPassword },
        (error, result) => {
          if (error) {
            console.error(error);
            socket.emit("error", { message: error.message });
            return;
          }

          if (!result) {
            socket.emit("sign-in-failed", {
              message: "This user was not created",
            });
            return;
          }

          socket.emit("sign-in-success", {
            message: "You are logged in",
            user: result,
          });
          socket.broadcast.emit("user-joined", {
            message: "User connected to chat",
            user: { _id: result._id, login: result.login },
          });
        }
      );
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: error.message });
    }
  });
}
