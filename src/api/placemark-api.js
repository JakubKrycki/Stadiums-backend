import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const placemarkApi = {
    
    findById: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.uplacemarkStoreerStore.getPlacemarkById(request.params.id);
                if (!placemark) {
                    return Boom.notFound("No Placemark with this id");
                }
                return placemark;
            } catch (err) {
                return Boom.serverUnavailable("No placemark with this id");
            }
        },
    },
    
    findAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemarks = await db.placemarkStore.getAllPlacemarks();
                return placemarks;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },

    create: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.addPlacemark(request.payload);
                if (placemark) {
                    return h.response(user).code(201);
                }
                return Boom.badImplementation("error creating placemark");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
      },
    
      deleteById: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            await db.placemarkStore.deleteById(request.params.id);
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
      },
    
      deleteAll: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            await db.placemarkStore.deleteAll();
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
      },
};