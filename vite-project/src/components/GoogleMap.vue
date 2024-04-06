<template>
  <GMapMap
      :center="center"
      :zoom="15"
      map-type-id="terrain"
      style="width: 500px; height: 300px"
  >
    <GMapMarker
        :position="marker.position"
        :clickable="true"
        :draggable="true"
        @click="center=marker.position"
    />
  </GMapMap>
</template>
<script>
export default {
  name: 'App',
  props: {
    lat: Number,
    lng: Number
  },
  data() {
    return {
      center: null,
      marker: null,
    }
  },
  created() {
    this.center = { lat: this.lat, lng: this.lng };
    this.marker = { position: { lat: this.lat, lng: this.lng } };
  }
}
</script>