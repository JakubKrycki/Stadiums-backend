export const seedData = {
    users: {
      _model: "User",
      jakubKrycki: {
        firstName: "Jakub",
        lastName: "Krycki",
        email: "jakub@krycki.pl",
        password: "jk"
      }
    },
    placemarks: {
      _model: "Placemark",
      stamfordBridge: {
        name: "Stamford Bridge",
        team: "Chelsea London F.C.",
        added_by: "->users.jakubKrycki",
        latitude: "1",
        longitude: "1",
        category: "England",
        private: true,
      }
    },
  };
  