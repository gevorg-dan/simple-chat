import { Socket } from "socket.io";
import {  getMongoRepository } from "typeorm";

import { User } from "../entity/User";

export function authMiddleware(
  socket: Socket,
  sessionStore: any
) {
  sessionStore.get("login", async (error: Error, session: any) => {
    if (error) {
      console.error(error);
      return;
    }
    if (!session) return;

    const login = Object.values(session).join("");
    if (login.length === 0) return;

    socket.request.session.login = login;
    const user = await getMongoRepository(User).findOne({ login });

    if (!user) return;

    const response = { id: user.id, login: user.login };
    socket.emit("sign-in-success", {
      message: "You are logged in",
      user: response,
    });
    socket.broadcast.emit("user-joined", {
      message: "User connected to chat",
      user: response,
    });
  });
}
