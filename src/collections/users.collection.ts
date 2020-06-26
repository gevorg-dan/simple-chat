import { Db } from "mongodb";

import { createValidatedCollection } from "../lib/mongoHandlers";

export function createUsersCollection(db: Db) {
  return createValidatedCollection({
    db,
    collectionName: "users",
    options: {
      validator: {
        $or: [
          { id: { $type: "string" } },
          { login: { $type: "string" } },
          { password: { $type: "string" } },
        ],
      },
    },
  });
}
