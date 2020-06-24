import { Socket } from "socket.io";
import { Collection } from "mongodb";

type MessageDataType = {
  text: string;
  date: string;
  authorId: string;
};

export function setSendMessageListener(socket: Socket, collection: Collection) {
  socket.on("send-message", (data: MessageDataType) => {
    try {
      const { text, date, authorId } = data;

      collection.insertOne({ text, date, authorId }, (error, result) => {
        if (error) {
          console.error(error);
          socket.emit("send-message-failed", {
            message: "failed to send message",
          });
          return;
        }

        const response = {
          message: "message sent",
          data: { message: result.ops[0] },
        };
        console.log(result.ops);

        socket.emit("send-message-success", response);
        socket.broadcast.emit("send-message-success", response);
      });
    } catch (e) {
      console.error(e);
    }
  });
}
