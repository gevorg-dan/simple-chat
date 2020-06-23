import { Socket } from "socket.io";
import { Collection } from "mongodb";

export type SignDataType = {
  login: string;
  password: string;
};

export function setSignUpListener(socket: Socket, collection: Collection) {
  socket.on("sign-up", (data: SignDataType) => {
    try {
      const { login: dataLogin, password: dataPassword } = data;

      collection.findOne({ login: dataLogin }, (error, result) => {
        if (error) {
          console.error(error);
          socket.emit("error", { message: error.message });
          return;
        }

        if (result) {
          socket.emit("sign-up-failed", {
            message: "This login is already token",
          });
        }

        collection.insertOne(
          { login: dataLogin, password: dataPassword },
          (error, result) => {
            if (error) {
              console.error(error);
              socket.emit("error", { message: error.message });
              return;
            }

            socket.emit("sign-up-success", {
              message: "User created",
              newUser: result,
            });
          }
        );
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: error.message });
    }
  });
}
