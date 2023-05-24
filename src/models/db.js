import { userMemStore } from "./mem/user-mem-store.js";
import { placemarkMemStore } from "./mem/placemark-mem-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";

export const db = {
  userStore: null,
  placemarkStore: null,

  init(dbMode) {
    switch (dbMode) {
      case "mongo":
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMemStore;
        this.placemarkStore = placemarkMemStore;
        break;
    }
  },
};
