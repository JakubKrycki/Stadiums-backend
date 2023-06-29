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
        firstName: "Kuba",
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
        latitude: 51.48166156589778,
        longitude: -0.1909566380705461,
        category: "England",
        private: true,
      },
      etihadStadium: {
        name: "Etihad Stadium",
        team: "Manchester City F.C.",
        added_by: "->users.kubaKrycki",
        latitude: 53.48345859061238,
        longitude: -2.2001948634480617,
        category: "England",
        private: true,
      },
      bayernMunchen: {
        name: "Alianz Arena",
        team: "Bayern Munich",
        added_by: "->users.kubaKrycki",
        latitude: 48.218760397007046,
        longitude: 11.62475281492075,
        category: "Germany",
        private: false,
      }
    },
  };
  