import { Image } from "./image.js";

export const imageMongoStore = {
    
    async getImageById(id) {
        const image = await Image.findOne({_id: id}).lean();
        return image;
    },

    async getImagesByPlacemarkId(id) {
        if (id) {
            const images = await Image.find({placemark_id: id}).lean();
            return images;
        }
        return [];
    },

    async uploadImage(image) {
        const newImage = new Image(image);
        await newImage.save();
        return image;
    },

    async deleteImageById(id) {
        try {
            await Image.deleteOne({ _id: id });
        } catch (error) {
            console.log("bad id");
        }
    },
}