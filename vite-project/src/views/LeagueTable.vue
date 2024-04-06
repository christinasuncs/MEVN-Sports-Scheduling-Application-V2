<template>
  <v-card title="All Leagues" style="width: 80%" flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table :headers="headers" :items="leagues" :search="search" :loading="loading">
        <template v-if="isAdmin" v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Create League</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="700px"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  class="mb-2"
                  color="primary"
                  dark
                  v-bind="props"
                >
                  New League
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="League name"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-select
                          label="Teams"
                          v-model="editedItem.teams"
                          :items="teams.map(team => team.name)"
                          multiple
                          chips
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: true,
      dialog: false,
      dialogDelete: false,
      search: "",
      headers: [
        {
          align: "start",
          key: "name",
          sortable: false,
          title: "League Name",
        },
        { key: "team", title: "Team" },
      ],
      teams: [],
      leagues: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        teams: [],
      },
      defaultItem: {
        name: "",
        teams: [],
      },
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    isAdmin(){
      return localStorage.getItem('isLoggedIn') == "true"
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  mounted(){
    if(this.isAdmin){
      this.headers.push({ title: 'Actions', key: 'actions', sortable: false });
    } else {
      this.headers = [
        {
          align: "start",
          key: "name",
          sortable: false,
          title: "League Name",
        },
        { key: "team", title: "Team" },
      ]
    }
    this.fetchTeams();
    this.fetchLeagues();
  },
  methods: {
    async fetchTeams(){
      try{
        const teams = await axios.get("http://localhost:3000/api/team");
        this.teams = teams.data;
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    },
    async fetchLeagues(){
      try{
        const leagues = await axios.get("http://localhost:3000/api/league");
        this.leagues = leagues.data;
        for (let i = 0; i < leagues.data.length; i++){
          const league = this.leagues[i];

          let teams = [];
          for (let j = 0; j < league.teams.length; j++) {
            const team = await axios.get(`http://localhost:3000/api/team/${league.teams[j]}`);
            teams.push(team.data.name);
          }
          this.leagues[i].team = teams.join(", ")
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching leagues: ", error);
      }
    },
    editItem (item) {
      this.editedIndex = this.leagues.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.teams = this.editedItem.teams.map(teamId => {
        const team = this.teams.find(t => t._id === teamId);
        return team ? team.name : null; // return null or handle missing team
      })
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.leagues.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try {
        this.leagues.splice(this.editedIndex, 1)
        await axios.delete(`http://localhost:3000/api/league/${this.editedItem._id}`)
        this.closeDelete()
      } catch (error) {
        console.error("Error saving event: ", error);
      };
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      try {
        const teamNameToIdMap = {};
        this.teams.forEach(team => {
          teamNameToIdMap[team.name] = team._id;
        });
        this.editedItem.teams = this.editedItem.teams.map(teamName => {
          return teamNameToIdMap[teamName];
        });
        if (this.editedIndex > -1) {
          await axios.put(`http://localhost:3000/api/league/${this.editedItem._id}`, this.editedItem);
        } else {
          await axios.post(`http://localhost:3000/api/league`, this.editedItem)
        }
        this.loading = true;
        await this.fetchLeagues();
        this.close();
      } catch (error) {
        console.error("Error saving event: ", error);
      };
    }
  },
}
</script>