import { Entity, Column, OneToMany, ObjectIdColumn, ObjectID } from "typeorm";

import { Message } from "./Message";

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  login: string;

  @Column()
  password: string;
}
