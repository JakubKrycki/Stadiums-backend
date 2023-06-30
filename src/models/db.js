import { userMemStore } from "./mem/user-mem-store.js";
import { placemarkMemStore } from "./mem/placemark-mem-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { imageMongoStore } from "./mongo/image-mongo-store.js";

export const db = {
  userStore: null,
  placemarkStore: null,
  imageStore: null,

  init(dbMode) {
    switch (dbMode) {
      case "mongo":
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
        this.imageStore = imageMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMemStore;
        this.placemarkStore = placemarkMemStore;
        break;
    }
  },
};
