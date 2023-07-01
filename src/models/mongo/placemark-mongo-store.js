import { Placemark } from "./placemark.js";
import { userMongoStore } from "./user-mongo-store.js";

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
        const readablePlacemarks = await this.mapToReadable(placemarks);
        return readablePlacemarks;
    },
    
    async getAllPlacemarksVisibleForUser(userId) {
        const placemarks = await Placemark.find({private: false}).lean();
        const privateUserPlacemarks = await Placemark.find({added_by: userId, private: true}).lean();
        const readablePlacemarks = await this.mapToReadable(placemarks.concat(privateUserPlacemarks));
        return readablePlacemarks;
    },

    async getAllPlacemarksByUser(userId) {
        const placemarks = await Placemark.find({added_by: userId}).lean();
        const readablePlacemarks = await this.mapToReadable(placemarks);
        return readablePlacemarks;
    },

    async getVisiblePlacemarksByCategory(userId, category) {
        const placemarks = await Placemark.find({added_by: userId, private: false, category: category}).lean();
        const readablePlacemarks = await this.mapToReadable(placemarks);
        return readablePlacemarks;
    },

    async addPlacemark(placemark) {
        const dbPlacemark = await this.getPlacemarkByNameAndUser(placemark.name, placemark.added_by);
        if (dbPlacemark !== null) {
            throw new Error("Placemark with this name already exists");
        }
        const newPlacemark = new Placemark(placemark);
        const placemarkObj = await newPlacemark.save();
        const p = await this.getPlacemarkById(placemarkObj._id);
        return p;
    },

    async updatePlacemark(id, placemark) {
        try {
            const dbPlacemark = await Placemark.findByIdAndUpdate(id, placemark, { new: true }).lean();
            return dbPlacemark;
        } catch {
            return placemark;
        }
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

    async mapToReadable(placemarks) {
        const readablePlacemarks = await Promise.all(placemarks.map(async (placemark) => {
            const user = await userMongoStore.getUserById(placemark.added_by);
            placemark.added_by_username = `${user.firstName} ${user.lastName}`;
            return placemark;
        }));
        return readablePlacemarks;
    }
}