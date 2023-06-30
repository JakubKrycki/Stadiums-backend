import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpec, PlacemarkSpecPlus, PlacemarkArraySpec, ImageArraySpec, ImageSpecPlus } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { decodeToken } from "./jwt-utils.js";
import { imageStore } from "../models/image-store.js";

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

    findImagesById: {
      auth: {
          strategy: "jwt",
      },
      handler: async function (request, h) {
          try {
              const images = await db.imageStore.getImagesByPlacemarkId(request.params.id);
              return images ?? [];
          } catch (err) {
              return Boom.serverUnavailable("No image with this placemark id");
          }
      },
      tags: ["api"],
      description: "Get images for placemark",
      notes: "Returns images urls",
      validate: { params: { id: IdSpec }, failAction: validationError },
      response: { schema: ImageArraySpec, failAction: validationError },
  },
    
    findAll: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            const token = request.headers.authorization.split(" ")[1];
            const userInfo = decodeToken(token);
            if (userInfo.role === "ADMIN") {
              const placemarks = await db.placemarkStore.getAllPlacemarks();
              return placemarks;
            } 
            return [];
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Get all placemarkApi",
        notes: "Returns details of all placemarkApi",
        response: { schema: PlacemarkArraySpec, failAction: validationError },
    },

    findAllAvailableForUser: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const userId = request.params.id;
                const placemarks = await db.placemarkStore.getAllPlacemarksVisibleForUser(userId);
                return placemarks ?? [];
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Get all placemarkApi",
        notes: "Returns details of all visible for user placemarkApi",
        response: { schema: PlacemarkArraySpec, failAction: validationError },
    },

    findAllByUserId: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const userId = request.params.id;
                const placemarks = await db.placemarkStore.getAllPlacemarksByUser(userId);
                return placemarks ?? [];
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
                    return h.response(placemark).code(201);
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

      uploadImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const newImage = {
                  placemark_id: request.params.id,
                  image_url: request.payload.image_url,
                }
                const image = await db.imageStore.uploadImage(newImage);
                return h.response(image).code(200);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Add an image",
        notes: "Returns the newly added image",
        response: { schema: ImageSpecPlus, failAction: validationError },
      },

      update: {
          auth: {
              strategy: "jwt",
          },
          handler: async function (request, h) {
              try {
                  const placemark = await db.placemarkStore.updatePlacemark(request.params.id, request.payload);
                  if (placemark) {
                    return h.response(placemark).code(200);
                  }
                  return Boom.badImplementation("error creating placemark");
              } catch (err) {
                  return Boom.serverUnavailable("Database Error");
              }
          },
          tags: ["api"],
          description: "Update a Placemark",
          notes: "Returns the updated placemark",
          validate: { payload: PlacemarkSpecPlus, failAction: validationError },
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

      deleteImageById: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            const image = await db.imageStore.getImageById(request.params.image_id);
            const imageName = image.image_url.split("/")[7].split(".")[0];
            await db.imageStore.deleteImageById(request.params.image_id);
            await imageStore.deleteImage(imageName);
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Delete image from placemark by id placemarkApi",
        notes: "By id placemarkApi removed from Images",
      },
};