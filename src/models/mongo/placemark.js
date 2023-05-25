import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
    name: String,
    team: String,
    added_by: String,
    latitude: String,
    longitude: String,
    category: String,
    private: Boolean,
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);