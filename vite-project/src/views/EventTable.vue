<template>
    <v-card title="Event Schedule" style="width: 80%" flat>
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

        <v-data-table :headers="headers" :items="events" :search="search" :loading="loading">
          <template v-if="isAdmin" v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Create Event</v-toolbar-title>
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
                    New Event
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
                            label="Event name"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.date"
                            label="Date (yyyy-mm-dd)"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.time"
                            label="Time (hh:mm)"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                        <v-text-field
                            v-model="editedItem.type"
                            label="Types"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                        <v-text-field
                            v-model="editedItem.campus"
                            label="Campus"
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
                            hint="Pick max 2 teams"
                            persistent-hint
                            multiple
                            chips
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.sport"
                            label="Sport"
                          ></v-text-field>
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
          <template v-slot:item.campus="{ item }">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  :text="item.campus"
                  variant="outlined"
                  @click="locate(item)"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Map" :loading="mapLoading">
                  <v-progress-circular
                    v-if="mapLoading"
                    color="primary"
                    indeterminate="disable-shrink"
                    size="16"
                    width="2"
                  ></v-progress-circular>
                  <TheGoogleMap v-else :lat="selectedLocation.lat" :lng="selectedLocation.lng" />

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="Close"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
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
import TheGoogleMap from "@/components/GoogleMap.vue";
export default {
  components: { TheGoogleMap },
  data() {
    return {
      loading: true,
      mapLoading: true,
      dialog: false,
      dialogDelete: false,
      search: "",
      headers: [
        {
          align: "start",
          key: "name",
          sortable: false,
          title: "Event Name",
        },
        { key: "date", title: "Date" },
        { key: "time", title: "Time" },
        { key: "type", title: "Type" },
        { key: "campus", title: "Campus" },
        { key: "team", title: "Team" },
        { key: "sport", title: "Sport" }
      ],
      events: [],
      teams: [],
      campuses: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        date: "",
        time: "", // HH:MM
        type: "",
        campus: [],
        teams: [],
        sport: ""
      },
      defaultItem: {
        name: "",
        date: "",
        time: "", // HH:MM
        type: "",
        campus: "",
        teams: [],
        sport: ""
      },
      selectedLocation: {
        lat: null,
        lng: null
      }
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
          title: "Event Name",
        },
        { key: "date", title: "Date" },
        { key: "time", title: "Time" },
        { key: "type", title: "Type" },
        { key: "campus", title: "Campus" },
        { key: "team", title: "Team" },
        { key: "sport", title: "Sport" }
      ]
    }
    this.fetchEvents();
    this.fetchTeams();
    this.fetchCampus();
  },
  methods: {
    async fetchCampus(){
      try{
        const campus = await axios.get("http://localhost:3000/api/campus");
        this.campuses = campus.data;
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
    async fetchTeams(){
      try{
        const teams = await axios.get("http://localhost:3000/api/team");
        this.teams = teams.data;
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
    async fetchEvents(){
      try {
        const events = await axios.get("http://localhost:3000/api/event");
        this.events = events.data;
        this.events.map(event => {
          event.date = event.date.split("T")[0]
          return event
        })
        for (let i = 0; i < events.data.length; i++){
          const event = this.events[i];
          let teams = [];
          for (let j = 0; j < event.teams.length; j++) {
            const team = await axios.get(`http://localhost:3000/api/team/${event.teams[j]}`);
            teams.push(team.data.name);
          }
          this.events[i].team = teams.length == 1 ? teams[0] : `${teams[0]} vs ${teams[1]}`

          const campus = await axios.get(`http://localhost:3000/api/campus/${event.campus}`);
          this.events[i].campus = campus.data.name
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching events: ", error);
      };
    },
    editItem (item) {
      this.editedIndex = this.events.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.teams = this.editedItem.teams.map(teamId => {
        const team = this.teams.find(t => t._id === teamId);
        return team ? team.name : null; // return null or handle missing team
      })
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.events.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try {
        this.events.splice(this.editedIndex, 1)
        await axios.delete(`http://localhost:3000/api/event/${this.editedItem._id}`)
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
        // email message
        const message = `${this.editedItem.date} ${this.editedItem.time} ${this.editedItem.sport} ${this.editedItem.type} at ${this.editedItem.campus}`
        const email = localStorage.getItem('userEmail');
        const event_type = this.editedItem.type;

        const campusNameToIdMap = {};
        this.campuses.forEach(campus => {
          campusNameToIdMap[campus.name] = campus._id;
        });
        
        const teamNameToIdMap = {};
        this.teams.forEach(team => {
          teamNameToIdMap[team.name] = team._id;
        });
        this.editedItem.teams = this.editedItem.teams.map(teamName => {
          return teamNameToIdMap[teamName];
        });
        this.editedItem.campus = campusNameToIdMap[this.editedItem.campus];
        if (this.editedIndex > -1) {
          await axios.put(`http://localhost:3000/api/event/${this.editedItem._id}`, this.editedItem);
        } else {
          await axios.post(`http://localhost:3000/api/event`, this.editedItem)
        }
        this.loading = true;
        await this.fetchEvents();
        this.close();

        // send email
        await axios.post("http://localhost:3000/api/email/update", {
          email,
          event_type,
          message
        })
      } catch (error) {
        console.error("Error saving event: ", error);
      };
    },
    async locate(item) {
      this.selectedLocation = {};
      this.mapLoading = true;
      const campusNameToIdMap = {};
      this.campuses.forEach(campus => {
        campusNameToIdMap[campus.name] = campus.address;
      });
      const address = campusNameToIdMap[item.campus];
      const response = await axios.get(`http://localhost:3000/api/map/${address}`)
      this.selectedLocation = response.data.results[0].geometry.location;
      this.mapLoading = false;
    }
  },
}
</script>