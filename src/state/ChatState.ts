import { Message } from "../models/Message";
import { User } from "../models/User";

class ChatState {
  users: User[] = [];
  messages: Message[] = [];

  newMessages: Message[] = [];

  setUsers(users: User[]) {
    this.users = users;
  }
  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  addMessage(newMessage: Message) {
    this.messages.push(newMessage);
    this.newMessages.push(newMessage);
  }

  addUser(user: User) {
    const userIndex = this.users.findIndex(({ id }) => id === user.id);

    if (userIndex !== -1) return;
    this.users.push(user);
  }
}

export default new ChatState();
