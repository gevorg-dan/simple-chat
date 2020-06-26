import session from "express-session";

import {sessionStore} from "../index";

export const sessionMiddleware = session({
  secret: "This is a secret",
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
});
