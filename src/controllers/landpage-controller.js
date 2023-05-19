import { db } from "../models/db.js";

export const landpageController = {
    index: {
      handler: async function (request, h) {
        const loggedInUser = request.auth.credentials;
        const placemarks = await db.placemarkStore.getAllPlacemarksByUser(loggedInUser._id);
        const viewData = {
          user: loggedInUser,
          placemarks: placemarks,
        };
        return h.view("landpage-view", viewData);
      },
    },
  };