<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="teams"
      class="elevation-1"
      :items-per-page="1000"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Teams</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Team
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.full_name"
                          :rules="nameRules"
                          label="Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.division"
                          :rules="regionRules"
                          label="Region"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          :rules="countryRules"
                          v-model="editedItem.city"
                          label="Country"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn
                    :disabled="!valid"
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.player_count="{ item }">
        <div>{{ _getPlayerCount(item.id) }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <div class="d-flex justify-center my-5">
      <v-btn
        depressed
        color="primary"
        v-if="all_teams.length > count_on_table"
        @click="LoadMoreteams()"
      >
        Load More
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    valid: true,
    all_teams: [],
    teams: [],
    count_on_table: 10,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "full_name",
      },
      { text: "Player Count", sortable: false, value: "player_count" },
      { text: "Division", sortable: false, value: "division" },
      { text: "City", sortable: false, value: "city" },
      { text: "Actions", sortable: false, value: "actions", sortable: false },
    ],

    editedIndex: -1,
    editedItem: {
      full_name: "",
      division: "",
      city: null,
    },
    nameRules: [(v) => !!v || "Name is required"],
    regionRules: [(v) => !!v || "Region is required"],
    countryRules: [(v) => !!v || "Country is required"],
    defaultItem: {
      full_name: "",
      division: "",
      city: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Team" : "Edit Team";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // this.initialize();
  },

  mounted() {
    this.GetPlayer();
  },

  methods: {
    LoadMoreteams() {
      this.count_on_table += 10;
      let temp = this.all_teams.slice(
        this.count_on_table - 10,
        this.count_on_table
      );
      this.teams = [...this.teams, ...temp];
    },
    async GetPlayer() {
      let temp = localStorage.getItem("teams");
      if (!temp) {
        const res = await axios.get("https://www.balldontlie.io/api/v1/teams");
        this.all_teams = res.data.data;
      } else {
        this.all_teams = JSON.parse(temp);
      }
      this.teams = this.all_teams.slice(0, 10);
    },

    _getPlayerCount(v) {
      let temp = JSON.parse(localStorage.getItem("players"));
      let player_count = temp.filter((f) => f.team.id == v).length;
      return player_count;
    },

    editItem(item) {
      this.editedIndex = this.teams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.teams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.teams.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.$refs.form.validate();
      if (this.editedIndex > -1) {
        Object.assign(this.teams[this.editedIndex], this.editedItem);
      } else {
        this.teams.unshift(this.editedItem);
      }
      localStorage.setItem(
        "teams",
        JSON.stringify([this.editedItem, ...this.all_teams])
      );
      // this.$store.commit("saveTeams", [this.editedItem, ...this.all_teams]);
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped></style>
