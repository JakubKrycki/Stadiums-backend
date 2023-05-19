import { v4 } from "uuid";

let users = [];

export const userMemStore = {
  async getAllUsers() {
    return users;
  },

  async addUser(user) {
    const dbUser = await this.getUserByEmail(user.email);
    if ( dbUser !== null) {
      throw new Error("User with this email already exists");
    }
    user._id = v4();
    users.push(user);
    return user;
  },

  async getUserById(id) {
    const optionalUser = users.find((user) => user._id === id);
    return (optionalUser === undefined) ? null : optionalUser;
  },

  async getUserByEmail(email) {
    const optionalUser = users.find((user) => user.email === email);
    return (optionalUser === undefined) ? null : optionalUser;
  },

  async deleteUserById(id) {
    const index = users.findIndex((user) => user._id === id);
    if (index !== -1) {
      users.splice(index, 1);
    }
  },

  async deleteAll() {
    users = [];
  },
};
