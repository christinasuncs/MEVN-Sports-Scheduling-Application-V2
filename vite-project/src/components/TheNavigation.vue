<template>
  <div id="nav">
    <v-app-bar :elevation="5">
      <template v-slot:prepend>
        <span>
          <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
        </span>
      </template>

      <v-app-bar-title>
        <AppLink to="/">Sports Scheduling App</AppLink>
      </v-app-bar-title>
      <span class="hidden-sm-and-down">
        <AppLink to="/event">Events</AppLink>
        <AppLink to="/team">Teams</AppLink>
        <AppLink to="/league">Leagues</AppLink>
      </span>
      
      <template v-if="isLoggedIn">
        <AppLink to="/" @click="logout()">Log out</AppLink>
      </template>
      <template v-else>
        <AppLink to="/login">Log in</AppLink>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="sidebar">
      <v-list>
        <v-list-item><AppLink to="/event">Events</AppLink></v-list-item>
        <v-list-item><AppLink to="/team">Teams</AppLink></v-list-item>
        <v-list-item><AppLink to="/league">Leagues</AppLink></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sidebar: false,
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
    }
  },
  methods: {
    logout() {
      localStorage.setItem('isLoggedIn', false);
      localStorage.setItem('userEmail', "")
      this.$router.push({ path: '/' }).then(() => {
      window.location.reload();
      }); // Change '/success' to the desired route
    }
  }
}
</script>
