export const state = () => ({
  userName: "",
  password: "",
  store_teams: [],
  store_players: null,
});

export const getters = {};

export const mutations = {
  login(state, userName) {
    state.userName = userName;
    localStorage.setItem("userName", userName);
    this.$router.push("/Home");
    alert("Logged in");
  },
  logout(state) {
    state.userName = "";
    localStorage.removeItem("userName");
    this.$router.push("/");
    alert("Logged out");
  },
  initialStore(state) {
    if (localStorage.getItem("userName")) {
      state.userName = localStorage.getItem("userName");
    }
    if (localStorage.getItem("teams")) {
      state.store_teams = JSON.parse(localStorage.getItem("teams"));
    }
    if (localStorage.getItem("players")) {
      state.store_players = JSON.parse(localStorage.getItem("players"));
    }
  },

  // Players
  savePlayers(state, store_players) {
    state.store_players = store_players;
    localStorage.setItem("players", JSON.stringify(store_players));
  },

  // Teams
  saveTeams(state, store_teams) {
    state.store_teams = store_teams;
    localStorage.setItem("teams", JSON.stringify(store_teams));
  },
};
