import { Socket } from "socket.io";

import { sessionStore } from "../index";

export function setLogoutListener(socket: Socket) {
  socket.on("logout", () => {
    sessionStore.set("login", undefined);
  });
}
