import { accountsController } from "./controllers/accounts-controller.js";
import { landpageController } from "./controllers/landpage-controller.js";

export const webRoutes = [
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },

    { method: "GET", path: "/landpage", config: landpageController.index },
    { method: "POST", path: "/landpage/addplacemark", config: landpageController.addPlacemark },
    { method: "GET", path: "/landpage/deleteplacemark/{id}", config: landpageController.deletePlacemark },
    { method: "GET", path: "/landpage/deleteplacemark", config: landpageController.deleteAllPlacemarks },
    
    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];