<template>
  <v-btn><router-link
    v-bind="$props"
    class="internal-link"
    style="text-decoration: none; color: inherit"
    ><slot
  /></router-link></v-btn>
</template>
<script>
import { RouterLink } from "vue-router"
export default {
  props: {
    ...RouterLink.props,
  },
}
</script>
