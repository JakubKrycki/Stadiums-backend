import { db } from "../models/db.js";

export const landpageController = {
    index: {
      handler:
        async function (request, h) {
          const loggedInUser = request.auth.credentials;
          if (loggedInUser.role === "ADMIN") {
            const viewData = {
              user: loggedInUser,
              placemarks: await db.placemarkStore.getAllPlacemarks(),
            };
            return h.view("landpage-view-admin", viewData);
          } 
            const viewData = {
              user: loggedInUser,
              placemarks: await db.placemarkStore.getAllPlacemarksByUser(loggedInUser._id),
            };
            return h.view("landpage-view", viewData);
      },
    },

    addPlacemark: {
      handler:
        async function (request, h) {
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
          try {
            await db.placemarkStore.addPlacemark(newPlacemark);
          } catch (error) {
            console.error(error);
          }
          return h.redirect("/landpage");
        },
    },
  
    deletePlacemark: {
      handler:
        async function (request, h) {
          await db.placemarkStore.deletePlacemarkById(request.params.id);
          return h.redirect("/landpage");
        },
    },

    deleteAllPlacemarks: {
      handler:
        async function (request, h) {
          await db.placemarkStore.deleteAllPlacemarks();
          return h.redirect("/landpage");
        },
      plugins: {"hapiAuthorization": {role: "ADMIN"}}
    }
  };