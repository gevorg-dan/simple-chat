import { Socket } from "socket.io";
import { Collection } from "mongodb";

export function authMiddleware(
  socket: Socket,
  sessionStore: any,
  collection: Collection
) {
  sessionStore.get("login", (error: Error, session: any) => {
    if (error) {
      console.error(error);
      return;
    }
    if (!session) return;
    const login = Object.values(session).join("");
    if (login.length === 0) return;

    socket.request.session.login = 123;
    collection.findOne({ login }, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      if (!result) return;

      const response = { _id: result._id, login: result.login };
      socket.emit("sign-in-success", {
        message: "You are logged in",
        user: response,
      });
      socket.broadcast.emit("user-joined", {
        message: "User connected to chat",
        user: response,
      });
    });
  });
}
