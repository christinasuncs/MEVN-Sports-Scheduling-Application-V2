<template>
  <div>
    <v-card
      title="Sports Application Registration"
      class="mx-auto pa-12 pb-8"
      style="margin-top: 10%"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Name</div>

        <v-text-field
          density="compact"
          placeholder="Name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          v-model="user.name"
        ></v-text-field>

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
        @click="register()"
      >
        Sign up
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    visible: false,
    user: {
      name: "",
      email: "",
      password: "",
      role: ""
    }
  }),
  methods: {
    async register(){
      try{
        const response = await axios.post(`${this.$hostname}/auth/register`, this.user)
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userEmail', this.user.email)
        if (response.status === 201) {
          
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