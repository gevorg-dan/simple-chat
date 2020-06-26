import { Db } from "mongodb";

import { createValidatedCollection } from "../lib/mongoHandlers";

export function createMessagesCollection(db: Db) {
  return createValidatedCollection({
    db,
    collectionName: "messages",
    options: {
      validator: {
        $or: [
          { id: { $type: "string" } },
          { text: { $type: "string" } },
          { date: { $type: "string" } },
          { authorId: { $type: "string" } },
        ],
      },
    },
  });
}
