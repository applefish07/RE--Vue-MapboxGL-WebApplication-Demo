<template>
  <div class="app">
    <!-- Main map view only -->
    <MapviewComponent />
  </div>
</template>

<script>
import MapviewComponent from "@/views/Mapview.vue";

export default {
  name: "App",
  components: {
    MapviewComponent,
  },
};
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
