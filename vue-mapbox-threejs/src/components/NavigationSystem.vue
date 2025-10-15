<template>
    <div class="navigation-panel">
      <!-- Navigation Box -->
      <div class="navigation-box">
        <h2 class="title">Navigation System</h2>
        <div class="input-box">
          <input
            type="text"
            v-model="startPoint"
            placeholder="Choose a starting place"
            class="input"
            @click.stop="selectStartPoint"
          />
          <input
            type="text"
            v-model="endPoint"
            placeholder="Choose a destination"
            class="input"
            @click.stop="selectEndPoint"
          />
        </div>
        <div class="button-group">
          <button class="button get-direction" @click="getDirection">
            Get Direction
          </button>
          <button class="button end-navigation" @click="endNavigation">
            End Navigation
          </button>
        </div>
        <div class="transport-mode">
          <label
            ><input
              type="radio"
              value="driving"
              v-model="mode"
              @change="updateMode"
            />
            🚗 Driving</label
          >
          <label
            ><input
              type="radio"
              value="walking"
              v-model="mode"
              @change="updateMode"
              checked
            />
            🚶‍♂️ Walking</label
          >
          <label
            ><input
              type="radio"
              value="cycling"
              v-model="mode"
              @change="updateMode"
            />
            🚴 Cycling</label
          >
        </div>
      </div>
  
      <!-- Steps Box -->
      <div class="steps-box">
        <h3 class="steps-title">Steps</h3>
        <div class="info-box">
          <p v-if="distance && time">
            <strong>Total Distance:</strong> {{ distance }} km <br />
            <strong>Total Time:</strong> {{ time }} mins
          </p>
          <ol v-if="steps.length" class="steps">
            <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import mapboxgl from "mapbox-gl"; 
import axios from "axios"; 

export default {
  name: "NavigationSystem", 
  props: {
    mapInstance: Object, 
    isVisible: Boolean, 
  },
  data() {
    // Defining Responsive Data for Components
    return {
      startPoint: "", 
      endPoint: "", 
      startCoords: null, 
      endCoords: null, 
      startMarker: null, 
      endMarker: null, 
      mode: "walking", 
      distance: null, 
      time: null, 
      steps: [], 
      mapboxAccessToken: "pk.eyJ1IjoieXVhcHBsZTA2MDkiLCJhIjoiY200bmRlMDR1MDY5MDJrczlnYzZ3cmpudiJ9.lXGFmXDJ_aCzGkuBlJDU4Q", 
    };
  },
  mounted() {
    if (!this.mapInstance) {
      console.error("Map instance not ready!");
      return;
    }
    console.log("NavigationSystem initialized successfully!");
  },
  methods: {
    /**
     * Initiate the mode of selecting the starting point
     */
    selectStartPoint() {
      this.mapInstance.off("click", this.handleStartClick); // Remove the previous click event listener
      this.mapInstance.on("click", this.handleStartClick); // Add a new click event listener
    },

    /**
     * Handling of click events at the starting point
     */
    handleStartClick(e) {
      console.log('Start click coordinates:', e.lngLat); 
      this.startCoords = [e.lngLat.lng, e.lngLat.lat]; 
      this.startPoint = `Lat: ${e.lngLat.lat}, Lng: ${e.lngLat.lng}`; 
      if (this.startMarker) this.startMarker.remove(); 
      this.startMarker = this.addCustomMarker(e.lngLat, "start"); 
      this.mapInstance.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat], 
      });
      this.mapInstance.off("click", this.handleStartClick); 
    },

    /**
     * Initiate the mode of selecting the end point
     */
    selectEndPoint() {
      this.mapInstance.off("click", this.handleEndClick); 
      this.mapInstance.on("click", this.handleEndClick); 
    },

    /**
     * Handling endpoint click events
     */
    handleEndClick(e) {
      this.endCoords = [e.lngLat.lng, e.lngLat.lat]; 
      this.endPoint = `Lat: ${e.lngLat.lat}, Lng: ${e.lngLat.lng}`; 
      if (this.endMarker) this.endMarker.remove(); 
      this.endMarker = this.addCustomMarker(e.lngLat, "end"); 
      this.mapInstance.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat], 
      });
      this.mapInstance.off("click", this.handleEndClick); 
    },

    /**
     * Adding a Custom Marker to a Map
     * @param {Object} lngLat 
     * @param {string} type 
     */
    addCustomMarker(lngLat, type) {
      console.log("Adding marker at:", lngLat, "Type:", type); 

      const markerDiv = document.createElement("div"); 
      markerDiv.style.width = "50px";
      markerDiv.style.height = "50px";
      markerDiv.style.borderRadius = "50%";
      markerDiv.style.backgroundColor = "#F3FFFF";
      markerDiv.style.cursor = "pointer";
      markerDiv.style.position = 'relative';
      markerDiv.style.zIndex = 1000; 

      const innerCircle = document.createElement("div"); 
      innerCircle.style.width = "20px";
      innerCircle.style.height = "20px";
      innerCircle.style.position = "absolute"; 
      innerCircle.style.borderRadius = "50%";
      innerCircle.style.backgroundColor =
        type === "start" ? "#13C6CE" : "#16b0ed"; 
      innerCircle.style.top = "50%";
      innerCircle.style.left = "50%";
      innerCircle.style.transform = "translate(-50%, -50%)";

      markerDiv.appendChild(innerCircle); 
      console.log("Marker DOM:", markerDiv);

      const marker = new mapboxgl.Marker({
        element: markerDiv,
        anchor: "center",
        offset: [0,-1130], 
      })
      .setLngLat(lngLat)
      .addTo(this.mapInstance);


        return marker;
    },
    /**
     * Getting the navigation path
     */
    async getDirection() {
      if (!this.startCoords || !this.endCoords) {
        alert("Please select both starting and ending points."); 
        return;
      }
      const url = `https://api.mapbox.com/directions/v5/mapbox/${this.mode}/${this.startCoords[0]},${this.startCoords[1]};${this.endCoords[0]},${this.endCoords[1]}?steps=true&geometries=geojson&access_token=${this.mapboxAccessToken}`;
      try {
        const response = await axios.get(url); 
        const route = response.data.routes[0]; 
        this.distance = (route.distance / 1000).toFixed(2); 
        this.time = (route.duration / 60).toFixed(2); 
        this.steps = route.legs[0].steps.map(
          (step) => step.maneuver.instruction
        ); 
        this.drawRoute(route.geometry); 
      } catch (error) {
        console.error("Error fetching directions:", error); 
      }
    },

    /**
     * Drawing paths on a map
     * @param {Object} geojson 
     */
    drawRoute(geojson) {
      if (this.mapInstance.getSource("route-source")) {
        this.mapInstance.removeLayer("route-layer"); 
        this.mapInstance.removeSource("route-source"); 
      }
      this.mapInstance.addSource("route-source", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: geojson,
        },
      });
      this.mapInstance.addLayer({
        id: "route-layer",
        type: "line",
        source: "route-source",
        layout: { "line-join": "round", "line-cap": "round" }, 
        paint: { "line-color": "#16b0ed", "line-width": 5 }, 
      });
    },

    /**
     * End navigation and clear related data
     */
    endNavigation() {
      this.distance = null;
      this.time = null;
      this.steps = [];
      this.startPoint = "";
      this.endPoint = "";
      this.startCoords = null;
      this.endCoords = null;
      if (this.startMarker) {
    this.startMarker.remove(); 
    this.startMarker = null;
  }

  if (this.endMarker) {
    this.endMarker.remove();
    this.endMarker = null;
  }

  if (this.mapInstance.getSource("route-source")) {
    this.mapInstance.removeLayer("route-layer"); 
    this.mapInstance.removeSource("route-source"); 
  }
    },

    /**
     * Updated navigation mode
     */
    updateMode() {
      console.log(`Selected mode: ${this.mode}`); 
    },
  },
};
</script>

  
  <style scoped>
  /* Keep the original style unchanged */
  .navigation-panel {
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
  
  .navigation-box {
    height: 35%;
    border: 2px solid #16b0ed;
    border-radius: 10px;
    background: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .steps-box {
    height: 500px;
    border: 2px solid #16b0ed;
    border-radius: 10px;
    background: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }


  
  .input-box {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .input {
    padding: 12px;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .input:focus {
    border: 2px solid #16b0ed;
    outline: none;
  }
  
  .button-group {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  
  .button {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background-color: #16b0ed;
    color: white;
    transition: transform 0.3s ease;
  }
  
  .button:hover {
    transform: scale(1.05);
  }
  
  .transport-mode {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    color: rgb(116, 116, 116);
  }
  
  .get-direction {
    background-color: #16b0ed;
    color: white;
    font-size: 18px;
  }
  
  .end-navigation {
    background-color: #16b0ed;
    color: white;
    font-size: 18px;
  }
  
  .title,
  .steps-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: left;
    margin-bottom: 20px;
  }
  
  .info-box {
    flex: 1;
    border: 1px dashed #d1d1d1;
    padding: 15px;
    border-radius: 8px;
    overflow-y: auto; 
  }
  
  .steps {
    list-style: decimal;
    margin: 10px 0 0 20px;
  }
  </style>