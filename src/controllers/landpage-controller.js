export const landpageController = {
    index: {
      handler: async function (request, h) {
        return h.view("main");
      },
    },
  };