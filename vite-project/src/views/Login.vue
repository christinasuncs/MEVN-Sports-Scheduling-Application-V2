<template>
  <div>
    <v-card
      title="Sports Application Admin Log In"
      class="mx-auto pa-12 pb-8"
      style="margin-top: 10%"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="user.email"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        v-model="user.password"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Note: Please contact system admin if you need to reset your password.
        </v-card-text>
      </v-card>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="login()"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="/register"
          rel="noopener noreferrer"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      visible: false,
      user: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    async login() {
      try{
        const response = await axios.post(`${this.$hostname}/auth/login`, this.user)
        if (response.data === "Success") {
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('userEmail', this.user.email)
          // Redirect to the success route
          this.$router.push({ path: '/' }).then(() => {
            window.location.reload();
          }); // Change '/success' to the desired route
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  }
}
</script>
