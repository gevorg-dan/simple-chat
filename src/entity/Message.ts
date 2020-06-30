import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

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
