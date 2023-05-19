import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {

    async getPlacemarkById(id) {
        const optionalPlacemark = placemarks.find((placemark) => placemark._id === id);
        return (optionalPlacemark === undefined) ? null : optionalPlacemark;
    },

    async getPlacemarkByName(name) {
        const optionalPlacemark = placemarks.find((placemark) => placemark.name === name);
        return (optionalPlacemark === undefined) ? null : optionalPlacemark;
    },

    async getPlacemarkByNameAndUser(name, userId) {
        const optionalPlacemark = placemarks.find((placemark) => placemark.name === name && placemark.added_by === userId);
        return (optionalPlacemark === undefined) ? null : optionalPlacemark;
    },

    async getAllPlacemark() {
        return placemarks;
    },

    async getAllPlacemarkVisibleForUser(userId) {
        return placemarks.filter((placemark) => placemark.added_by === userId || placemark.private === false);
    },

    async getAllPlacemarkByUser(userId) {
        return placemarks.filter((placemark) => placemark.added_by === userId);
    },

    async getVisiblePlacemarksByCategory(userId, category) {
        return this.getAllPlacemarkVisibleForUser(userId).filter((placemark) => placemark.category === category);
    },

    async addPlacemark(placemark) {
        const dbPlacemark = await this.getPlacemarkByNameAndUser(placemark.name, placemark.added_by);
        if (dbPlacemark !== null) {
            throw new Error("Placemark with this name already exists");
        }
        placemark._id = v4();
        placemarks.push(placemark);
        return placemark;
    },

    async deletePlacemark(id) {
        const index = placemarks.findIndex((placemark) => placemark._id === id);
        if (index !== -1) {
            placemarks.splice(index, 1);
        }
    },

    async deleteAllPlacemarks() {
        placemarks = [];
    },
};
