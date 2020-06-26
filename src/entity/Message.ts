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

  @ManyToOne((type) => User, (user) => user.messages)
  author: User;

  @Column({ nullable: true, default: null })
  reply: Message;
}
