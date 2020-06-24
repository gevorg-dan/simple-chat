import { Socket } from "socket.io";
import { Collection } from "mongodb";

export function setConnectToChatListener(
  socket: Socket,
  usersCollection: Collection,
  messagesCollection: Collection
) {
  socket.on("connect-to-chat", () => {
    const response = {
      message: "connection successful",
      data: { messages: [] as any, users: [] as any },
    };

    usersCollection.find({}).toArray((error, result) => {
      if (error) {
        console.error(error);
        socket.emit("error", { message: error.message });
        return;
      }
      response.data.users = result.map((user) => ({
        _id: user._id,
        login: user.login,
      }));

      messagesCollection.find({}).toArray((error, result) => {
        if (error) {
          console.error(error);
          socket.emit("error", { message: error.message });
          return;
        }
        response.data.messages = result;
        socket.emit("successful-chat-connection", response);
      });
    });
  });
}
