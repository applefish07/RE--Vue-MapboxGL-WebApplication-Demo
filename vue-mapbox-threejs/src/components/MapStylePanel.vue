<template>
  <div class="map-style-panel" v-show="isVisible">
    <div class="section-title">Map Style Settings</div>
    <div class="settings">
      <!-- Basemap switch -->
      <div class="setting-group">
        <div class="group-title">Basemap</div>
        <div class="options">
          <div
            class="option"
            v-for="(map, index) in basemaps"
            :key="index"
            :class="{ active: selectedBasemap === map.style }"
            @click="selectBasemap(map.style)"
          >
            <img :src="map.icon" alt="Map Icon" />
            <span>{{ map.label }}</span>
          </div>
        </div>
      </div>

      <!-- Color theme switch -->
      <div class="setting-group">
        <div class="group-title">Color Theme</div>
        <div class="options">
          <div
            class="option"
            v-for="(theme, index) in colorThemes"
            :key="index"
            :class="{ active: selectedColorTheme === theme.style }"
            @click="selectColorTheme(theme.style)"
          >
            <img :src="theme.icon" alt="Theme Icon" />
            <span>{{ theme.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Light Present -->
    <div class="setting-group">
      <div class="group-title">Light Present</div>
      <div class="options">
        <div
          class="option"
          v-for="(theme, index) in lightPresent"
          :key="index"
          :class="{ active: selectedLightPresent === theme.style }"
          @click="selectLightPresent(theme.style)"
        >
          <img :src="theme.icon" alt="Theme Icon" />
          <span>{{ theme.label }}</span>
        </div>
      </div>
    </div>

    <!-- Visibility -->
    <div class="section-title" style="margin-top: 30px;">Visibility</div>
    <div class="visibility">
      <div
        class="toggle"
        v-for="(layer, index) in visibilityLayers"
        :key="index"
      >
        <span>{{ layer.label }}</span>
        <div
          class="toggle-switch"
          :class="{ active: layer.visible }"
          @click="toggleVisibility(layer)"
        >
          <div class="toggle-circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapStylePanel",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    mapInstance: {
      type: Object,
      required: true, 
    },
  },
  data() {
    return {
      selectedBasemap: "mapbox://styles/mapbox/standard",
      selectedColorTheme: "mapbox://styles/mapbox/light-v11",
      selectedLightPresent: "mapbox://styles/mapbox/navigation-day-v1",
      basemaps: [
        { style: "mapbox://styles/mapbox/standard", label: "Standard", icon: require("@/assets/png/standard.png") },
        { style: "mapbox://styles/mapbox/standard-satellite", label: "Satellite", icon: require("@/assets/png/satellite.png") },
      ],
      colorThemes: [
        { style: "mapbox://styles/mapbox/light-v11", label: "Light", icon: require("@/assets/png/light.png") },
        { style: "mapbox://styles/mapbox/dark-v11", label: "Dark", icon: require("@/assets/png/dark.png") },
      ],
      lightPresent: [
        { style: "mapbox://styles/mapbox/navigation-day-v1", label: "Day", icon: require("@/assets/png/day.png") },
        { style: "mapbox://styles/mapbox/navigation-night-v1", label: "Night", icon: require("@/assets/png/night.png") },
      ],
      visibilityLayers: [
        { id: "settlement-major-label", label: "City Label", visible: true },
        { id: "settlement-subdivision-label", label: "Settlement Label", visible: true },
        { id: "poi-label", label: "POI Label", visible: true },
        { id: "transit-label", label: "Transit Label", visible: true },
        { id: "path-pedestrian-label", label: "Pedestrian Road", visible: true },
        { id: "road-label", label: "Road Labels", visible: true },
      ],
    };
  },
  methods: {
    selectBasemap(style) {
      this.selectedBasemap = style;
      this.$emit("update-basemap", style);
      if (this.mapInstance) {
        this.mapInstance.setStyle(style);
      }
    },
    selectColorTheme(style) {
      this.selectedColorTheme = style;
      this.$emit("update-color-theme", style);
    },
    selectLightPresent(style) {
      this.selectedLightPresent = style;
      this.$emit("update-light-present", style);
    },
    toggleVisibility(layer) {
      if (this.mapInstance) {
        const layers = this.mapInstance.getStyle().layers;
        console.log("Available layers in the map style (streets-v12):");
        layers.forEach(layer => {
          console.log(`Layer ID: ${layer.id}, Type: ${layer.type}`);
        });

        const visibility = layer.visible ? "none" : "visible";
        try {
          this.mapInstance.setLayoutProperty(layer.id, "visibility", visibility);
          layer.visible = !layer.visible;
          console.log(`Layer visibility toggled: ${layer.id}, visible: ${layer.visible}`);
        } catch (error) {
          console.error(`Failed to toggle visibility for layer ${layer.id}:`, error);
        }
      } else {
        console.error("Map instance is not available!");
      }
    },
  },
};
</script>

<style scoped>
.map-style-panel {
  position: absolute;
  left: 100px;
  top: 0;
  height: 100vh;
  width: 400px;
  background: linear-gradient(145deg, #ffffffcb, #f7f7f7);
  padding: 20px;
  font-family: 'Inter', sans-serif;
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.section-title {
  font-weight: 700;
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
  border-bottom: 2px solid #d6d6d6;
  padding-bottom: 8px;
}

.setting-group {
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px dashed #ddd;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #555;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #16b0ed;
  border-radius: 12px;
  background-color: #fafafa;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.option:hover {
  background-color: #f0f8ff;
  transform: scale(1.03);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.option.active {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #16b0ed;
  border-radius: 12px;
  background-color: #fafafa;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.option.active:hover {
  background-color: #f0f8ff;
  transform: scale(1.03);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.option img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}



.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 16px;
  color: #555;
}

.toggle-switch {
  width: 52px;
  height: 24px;
  border-radius: 14px;
  background: #ccc;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-switch.active {
  background: #16b0ed;
}

.toggle-circle {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-circle {
  left: 32px;
}

@media (max-width: 768px) {
  .map-style-panel {
    width: 300px;
    left: 50px;
  }

  .section-title {
    font-size: 16px;
  }

  .group-title {
    font-size: 16px;
  }
}
</style>


