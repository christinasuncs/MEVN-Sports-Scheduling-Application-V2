<template>
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          height="250"
          max-width="800"
          width="80%"
          rounded
        >
          <div>
            <h2 class="text-h4 font-weight-black text-orange">Events</h2>

            <div class="text-h5 font-weight-medium mb-2">
              View All Events
            </div>

            <p v-if="!isAdmin" class="text-body-2 mb-4">
              Please log in for event management.
            </p>

            <AppLink to="/event" color="orange" variant="text">Go to Event</AppLink>
          </div>
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          height="250"
          max-width="800"
          width="80%"
          rounded
        >
          <div>
            <h2 class="text-h4 font-weight-black text-orange">Teams</h2>

            <div class="text-h5 font-weight-medium mb-2">
              View All Teams
            </div>

            <p v-if="!isAdmin" class="text-body-2 mb-4">
              Please log in for team management.
            </p>

            <AppLink to="/team" color="orange" variant="text">Go to Teams</AppLink>
          </div>
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          height="250"
          max-width="800"
          width="80%"
          rounded
        >
          <div>
            <h2 class="text-h4 font-weight-black text-orange">Leagues</h2>

            <div class="text-h5 font-weight-medium mb-2">
              View All Leagues
            </div>

            <p v-if="!isAdmin" class="text-body-2 mb-4">
              Please log in for league management.
            </p>

            <AppLink to="/league" color="orange" variant="text">Go to Leagues</AppLink>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    isAdmin(){
      return localStorage.getItem('isLoggedIn') == "true"
    }
  }
}
</script>
