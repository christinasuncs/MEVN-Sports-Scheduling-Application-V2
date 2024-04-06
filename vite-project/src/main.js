import { createApp } from "vue"
import router from "@/router"

import App from "./App.vue"

import AppLink from "@/components/AppLink.vue"

// Vuetify
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

import VueGoogleMaps from '@fawmi/vue-google-maps'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    //
  },
})

// import "@/assets/main.css"

const app = createApp(App)
app.component("AppLink", AppLink)

app.config.globalProperties.$hostname = "https://mevn-sports-scheduling-application-0zie.onrender.com"

app.use(router)
app.use(vuetify)
app.use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk',
  },
})

app.mount("#app")
