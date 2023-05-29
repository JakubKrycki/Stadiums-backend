import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
    
    async getPlacemarkById(id) {
        if (id) {
            const placemark = await Placemark.findOne({ _id: id }).lean();
            return placemark;
        }
        return null;
    },

    async getPlacemarkByName(name) {
        if (name) {
            const placemark = await Placemark.findOne({ name: name }).lean();
            return placemark;
        }
        return null;
    },

    async getPlacemarkByNameAndUser(name, userId) {
        if (name && userId) {
            const placemark = await Placemark.findOne({ name: name, added_by: userId }).lean();
            return placemark;
        }
        return null;
    },

    async getAllPlacemarks() {
        const placemarks = await Placemark.find().lean();
        return placemarks;
    },
    
    async getAllPlacemarksVisibleForUser(userId) {
        const placemarks = await Placemark.find({added_by: userId, private: false}).lean();
        return placemarks;
    },

    async getAllPlacemarksByUser(userId) {
        const placemarks = await Placemark.find({added_by: userId}).lean();
        return placemarks;
    },

    async getVisiblePlacemarksByCategory(userId, category) {
        const placemarks = await Placemark.find({added_by: userId, private: false, category: category}).lean();
        return placemarks;
    },

    async addPlacemark(placemark) {
        const dbPlacemark = await getPlacemarkByNameAndUser(placemark.name, placemark.added_by);
        if (dbPlacemark !== null) {
            throw new Error("Placemark with this name already exists");
        }
        const newPlacemark = new Placemark(placemark);
        const placemarkObj = await newPlacemark.save();
        const p = await this.getPlacemarkById(placemarkObj._id);
        return p;
    },

    async deletePlacemarkById(id) {
        try {
            await Placemark.deleteOne({ _id: id });
        } catch (error) {
            console.log("bad id");
        }
    },

    async deleteAllPlacemarks() {
        await Placemark.deleteMany({});
    },

    async deleteAllUserPlacemarks(userId) {
        await Placemark.deleteMany({added_by: userId});
    },
}