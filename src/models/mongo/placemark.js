import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
    name: String,
    team: String,
    added_by: String,
    latitude: Number,
    longitude: Number,
    category: String,
    private: Boolean,
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);