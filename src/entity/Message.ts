import { Entity, Column, ObjectIdColumn, ObjectID, ManyToOne } from "typeorm";

import { User } from "./User";

@Entity()
export class Message {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  text: string;

  @Column()
  date: string;

  @Column()
  author: string;

  @Column({ nullable: true, default: null })
  reply: Message;
}
