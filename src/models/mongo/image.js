import Mongoose from "mongoose";

const { Schema } = Mongoose;

const imageSchema = new Schema({
    placemark_id: String,
    image_url: String,
});

export const Image = Mongoose.model("Image", imageSchema);