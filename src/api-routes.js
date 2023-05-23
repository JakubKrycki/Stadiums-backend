import { placemarkApi } from "./api/placemark-api";
import { userApi } from "./api/user-api";


export const apiRoutes = [
    
    { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
    { method: "GET", path: "/api/users", config: userApi.findAll },
    { method: "POST", path: "/api/users", config: userApi.create },
    { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteById },
    { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
    { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

    { method: "GET", path: "/api/placemarks/{id}", config: placemarkApi.findById },
    { method: "GET", path: "/api/placemarks", config: placemarkApi.findAll },
    { method: "POST", path: "/api/placemarks", config: placemarkApi.create },
    { method: "DELETE", path: "/api/placemarks/{id}", config: placemarkApi.deleteById },
    { method: "DELETE", path: "/api/placemarks", config: placemarkApi.deleteAll },
];