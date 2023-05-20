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

    addPlacemark: {
      handler: async function (request, h) {
        const loggedInUser = request.auth.credentials;
        const newPlacemark = {
          name: request.payload.name,
          club: request.payload.club,
          added_by: loggedInUser._id,
          latitude: request.payload.latitude,
          longitude: request.payload.longitude,
          category: request.payload.category,
          private: request.payload.private,
        };
        await db.placemarkStore.addPlacemark(newPlacemark);
        return h.redirect("/landpage");
      },
    },
  
    deletePlacemark: {
      handler: async function (request, h) {
        await db.placemarkStore.deletePlacemarkById(request.params.id);
        return h.redirect("/landpage");
      },
    },
  };