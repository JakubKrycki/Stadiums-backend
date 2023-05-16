import { landpageController } from "./controllers/landpage-controller.js";

export const webRoutes = [{ method: "GET", path: "/", config: landpageController.index }];