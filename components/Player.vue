<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="players"
      class="elevation-1"
      :items-per-page="1000"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Players</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Player
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.first_name"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.last_name"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.height_feet"
                        label="Height (ft)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.height_inches"
                        label="Height (inc)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.weight_pounds"
                        label="Weight (lb)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.position"
                        label="Position"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.team_name"
                        label="Team"
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
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
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
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template> -->
    </v-data-table>

    <div class="d-flex justify-center my-5">
      <v-btn
        depressed
        color="primary"
        v-if="all_players.length > count_on_table"
        @click="LoadMorePlayers()"
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
    all_players: [],
    players: [],
    count_on_table: 10,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "First Name",
        align: "start",
        sortable: false,
        value: "first_name",
      },
      { text: "Last Name", sortable: false, value: "last_name" },
      { text: "Height (ft)", sortable: false, value: "height_feet" },
      { text: "height_inches (inc)", sortable: false, value: "height_inches" },
      { text: "Weight (lb)", sortable: false, value: "weight_pounds" },
      { text: "Position", sortable: false, value: "position" },
      { text: "Tean", sortable: false, value: "team_name" },
      { text: "Actions", sortable: false, value: "actions", sortable: false },
    ],
    players: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      last_name: "",
      height_feet: null,
      height_inches: null,
      weight_pounds: null,
      position: "",
      team_name: "",
    },
    defaultItem: {
      first_name: "",
      last_name: "",
      height_feet: null,
      height_inches: null,
      weight_pounds: null,
      position: "",
      team_name: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Player" : "Edit Player";
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
    LoadMorePlayers() {
      this.count_on_table += 10;
      let temp = this.all_players.slice(
        this.count_on_table - 10,
        this.count_on_table
      );
      this.players = [...this.players, ...temp];
    },
    async GetPlayer() {
      const res = await axios.get("https://www.balldontlie.io/api/v1/players");
      this.all_players = res.data.data.map((v) => ({
        ...v,
        team_id: v.team.id,
        team_name: v.team.full_name,
      }));
      localStorage.setItem("players", JSON.stringify(this.all_players));

      this.players = this.all_players.slice(0, 10);
    },
    editItem(item) {
      this.editedIndex = this.players.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.players.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.players.splice(this.editedIndex, 1);
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
      if (this.editedIndex > -1) {
        Object.assign(this.players[this.editedIndex], this.editedItem);
      } else {
        this.players.unshift(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped></style>
