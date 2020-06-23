import { Db } from "mongodb";

export function createValidatedCollection(
  {
    db,
    collectionName,
    options = {},
  }: { db: Db; collectionName: string; options?: any },
  callback?: () => void
) {
  db.createCollection(collectionName, options, function (err, results) {
    console.log(`Collection ${collectionName} created.`);
    callback && callback();
  });
}
