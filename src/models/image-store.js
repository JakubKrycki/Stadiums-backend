import * as cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret,
};
cloudinary.config(credentials);

export const imageStore = {
    deleteImage: async function (img) {
        await cloudinary.v2.uploader.destroy(img, {});
    },
}