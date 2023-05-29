import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpec, PlacemarkSpecPlus, PlacemarkArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

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
        tags: ["api"],
        description: "Get a specific placemark",
        notes: "Returns placemark details",
        validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
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
        tags: ["api"],
        description: "Get all placemarkApi",
        notes: "Returns details of all placemarkApi",
        response: { schema: PlacemarkArraySpec, failAction: validationError },
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
        tags: ["api"],
        description: "Create a Placemark",
        notes: "Returns the newly created placemark",
        validate: { payload: PlacemarkSpec, failAction: validationError },
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
      },
    
      deleteById: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            await db.placemarkStore.deletePlacemarkById(request.params.id);
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Delete placemark by id placemarkApi",
        notes: "By id placemarkApi removed from Placemarks",
      },
    
      deleteAll: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            await db.placemarkStore.deleteAllPlacemarks();
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Delete all placemarkApi",
        notes: "All placemarkApi removed from Placemarks",
      },
};