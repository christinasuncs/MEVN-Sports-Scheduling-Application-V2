<template>
  <v-card title="All Teams" style="width: 80%" flat>
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

      <v-data-table :headers="headers" :items="teams" :search="search" :loading="loading">
        <template v-if="isAdmin" v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Create Team</v-toolbar-title>
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
                  New Team
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
                          label="Team name"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-select
                          label="Campus"
                          v-model="editedItem.campus"
                          :items="campuses.map(campus => campus.name)"
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
          <!-- <v-icon size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon> -->
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
          title: "Team Name",
        },
        { key: "campus", title: "Campus" },
      ],
      teams: [],
      campuses: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        campus: [],
      },
      defaultItem: {
        name: "",
        campus: "",
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
          title: "Team Name",
        },
        { key: "campus", title: "Campus" },
      ]
    }
    this.fetchTeams();
    this.fetchCampus();
  },
  methods: {
    async fetchCampus(){
      try{
        const campus = await axios.get(`${this.$hostname}/api/campus`);
        this.campuses = campus.data;
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
    async fetchTeams(){
      try{
        const teams = await axios.get(`${this.$hostname}/api/team`);
        this.teams = teams.data;
        for (let i = 0; i < teams.data.length; i++){
          const team = this.teams[i];

          const campus = await axios.get(`${this.$hostname}/api/campus/${team.campus}`);
          this.teams[i].campus = campus.data.name
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
    editItem (item) {
      this.editedIndex = this.teams.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.teams.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.teams.splice(this.editedIndex, 1)
      this.closeDelete()
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
        const campusNameToIdMap = {};
        this.campuses.forEach(campus => {
          campusNameToIdMap[campus.name] = campus._id;
        });
        this.editedItem.campus = campusNameToIdMap[this.editedItem.campus];
        if (this.editedIndex > -1) {
          await axios.put(`${this.$hostname}/api/team/${this.editedItem._id}`, this.editedItem);
        } else {
          await axios.post(`${this.$hostname}/api/team`, this.editedItem)
        }
        this.loading = true;
        await this.fetchTeams();
        this.close();
      } catch (error) {
        console.error("Error saving event: ", error);
      };
    }
  },
}
</script>