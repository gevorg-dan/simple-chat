import { User } from "./User";

export class Message {
  id: string;
  text: string;
  author: User;
  date: string;

  constructor(id: string, text: string, author: User, date: string) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.date = date;
  }
}
