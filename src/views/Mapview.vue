<template>  
  <div class="map-container">
    <Sidebar v-if="mapInstance" :mapInstance="mapInstance" />
    <div id="map" ref="mapContainer"></div>
    <MapControls v-if="mapInstance" :map="mapInstance" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import Sidebar from "@/components/Sidebar.vue";
import MapControls from "./MapControls.vue";

export default {
  name: "MapviewComponent",
  components: {
    Sidebar,
    MapControls,
  },
  setup() {
    const mapInstance = ref(null);
    const mapContainer = ref(null);

    onMounted(() => {
      const mapboxToken = import.meta.env.VUE_APP_MAPBOX_TOKEN;
         mapboxgl.accessToken = mapboxToken;

      const map = new mapboxgl.Map({
        container: mapContainer.value,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-82.363997, 23.129223], 
        zoom: 17, 
        maxZoom: 22, 
        minZoom: 12, 
      });

      // Set the map range to allow users to operate only within the Havana area
      const bounds = [
        [-82.5000, 23.0000], // Southwest corner (SW)
        [-82.2000, 23.2500]  // North-East corner (NE)
      ];
      map.setMaxBounds(bounds);

      map.on("load", () => {
        console.log("Mapbox loaded successfully!");
        mapInstance.value = map;
      });

      map.resize();
    });

    return {
      mapInstance,
      mapContainer,
    };
  },
};
</script>

<style scoped>
.map-container {
  display: flex;
  width: 100%;
  height: 100vh;
  position: relative;
}

#map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
