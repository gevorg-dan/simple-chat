import { Socket } from "socket.io";
import { Collection } from "mongodb";

export function setConnectToChatListener(
  socket: Socket,
  usersCollection: Collection,
  messagesCollection: Collection
) {
  socket.on("connect-to-chat", async () => {
    const response = {
      message: "connection successful",
      data: { messages: [] as any, users: [] as any },
    };

    await Promise.all([
      usersCollection.find({}).toArray((error, result) => {
        if (error) {
          console.error(error);
          socket.emit("error", { message: error.message });
          return;
        }
        response.data.users = result;
      }),
      messagesCollection.find({}).toArray((error, result) => {
        if (error) {
          console.error(error);
          socket.emit("error", { message: error.message });
          return;
        }
        response.data.messages = result;
      }),
    ]);

    socket.emit("successful-chat-connection", response);
  });
}
