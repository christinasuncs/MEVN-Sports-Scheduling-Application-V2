<template>
  <v-layout class="rounded rounded-md">
    <TheNavigation />

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path"></component>
        </transition>
      </router-view>
    </v-main>
  </v-layout>
</template>
<script>
import TheNavigation from "@/components/TheNavigation.vue"
import EventTable from "@/views/EventTable.vue"
export default {
  components: { TheNavigation, EventTable },
}
</script>
