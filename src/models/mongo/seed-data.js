export const seedData = {
    users: {
      _model: "User",
      jakubKryckiAdmin: {
        firstName: "Jakub",
        lastName: "Krycki",
        email: "jakub@krycki.pl",
        password: "jk",
        role: "ADMIN",
      },
      kubaKrycki: {
        firstName: "Jakub",
        lastName: "Krycki",
        email: "kuba@krycki.pl",
        password: "jk",
        role: "USER",
      }
    },
    placemarks: {
      _model: "Placemark",
      stamfordBridge: {
        name: "Stamford Bridge",
        team: "Chelsea London F.C.",
        added_by: "->users.jakubKryckiAdmin",
        latitude: "1",
        longitude: "1",
        category: "England",
        private: true,
      },
      etihadStadium: {
        name: "Etihad Stadium",
        team: "Manchester City F.C.",
        added_by: "->users.kubaKrycki",
        latitude: "1",
        longitude: "1",
        category: "England",
        private: true,
      }
    },
  };
  