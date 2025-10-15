<template>
  <div v-if="isVisible" class="architectural-data-panel">
    <!-- Panel Title -->
    <h1 class="panel-title">Architectural Data</h1>
    <!-- Blue Border Box -->
    <div class="info-box">
      <template v-if="selectedMarker">
        <!-- Table with CSV Data -->
        <h2 class="table-title">{{ selectedMarker.name }}</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td v-for="(value, key) in row" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p class="placeholder-text">Click on a marker to view details.</p>
      </template>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import Papa from "papaparse";

export default {
props: {
  isVisible: Boolean,
  mapInstance: Object, 
},
data() {
  return {
    markers: [], 
    selectedMarker: null, 
    tableHeaders: [], 
    tableData: [], 
  };
},
watch: {
  isVisible(newVal) {
    console.log("📌 ArchitecturalData isVisible update:", newVal);
    if (newVal) {
      console.log("📌 call (programming) loadMarkers methodologies");
      this.loadMarkers();
    } else {
      console.log("📌 Clear markers from the map");
      this.clearMarkers();
    }
  },
},
methods: {
  // Loading markers data and displaying it on the map
  async loadMarkers() {
      console.log("📌 loadMarkers method is called");
    try {
      const response = await fetch("http://localhost:3000/markers"); // Load the db.json file
      if (!response.ok) throw new Error("Failed to save report")

      const data = await response.json();
      console.log("📌 Loaded markers:", data);

      // Iterating over markers data
      data.forEach((marker) => {
          // console.log("📍 Marker Data:", marker);
          
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.innerHTML = `
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
             <!-- Blue Round Background -->
              <path 
             d="M28.4166 14.3119V15.5002C28.415 18.2856 27.5131 20.9959 25.8453 23.2268C24.1776 25.4577 21.8333 27.0897 19.1623 27.8794C16.4912 28.6692 13.6364 28.5744 11.0236 27.6091C8.41084 26.6438 6.1801 24.8598 4.66408 22.5231C3.14805 20.1864 2.42798 17.4223 2.61125 14.643C2.79452 11.8636 3.87131 9.21799 5.68103 7.10062C7.49075 4.98325 9.93643 3.5076 12.6533 2.89375C15.3702 2.27991 18.2128 2.56075 20.757 3.6944" 
             fill="#99DDFF" 
          />
  
           <!-- Filled portion of the check mark -->
            <path 
          d="M28.4166 5.1669L15.4999 18.0965L11.6249 14.2215" 
             fill="#99DDFF" 
          />
  
          <!-- Blue Stroke Path（Override Fill Path） -->
           <path 
           d="M28.4166 14.3119V15.5002C28.415 18.2856 27.5131 20.9959 25.8453 23.2268C24.1776 25.4577 21.8333 27.0897 19.1623 27.8794C16.4912 28.6692 13.6364 28.5744 11.0236 27.6091C8.41084 26.6438 6.1801 24.8598 4.66408 22.5231C3.14805 20.1864 2.42798 17.4223 2.61125 14.643C2.79452 11.8636 3.87131 9.21799 5.68103 7.10062C7.49075 4.98325 9.93643 3.5076 12.6533 2.89375C15.3702 2.27991 18.2128 2.56075 20.757 3.6944M28.4166 5.1669L15.4999 18.0965L11.6249 14.2215" 
          stroke="#03A4F6" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
            />
          </svg>
          `;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => this.handleMarkerClick(marker));

        const mapMarker = new mapboxgl.Marker({
          element: el,
          offset: [1027, -1025], // Setting the offset
        }
        )
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.mapInstance);

        this.markers.push(mapMarker);
      });
    } catch (error) {
      console.error("❌ Error loading markers:", error);
    }
    console.log("Get all markers in db.", this.markers)
  },

  // Logic for handling clicked icons
  async handleMarkerClick(marker) {
    this.selectedMarker = marker;

    if (marker.csvPath) {
      try {
        const response = await fetch(`/assets/csv/${marker.csvPath.split('/').pop()}`);
        const csvText = await response.text();
        console.log("Check csv Path", response)

        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            this.tableHeaders = result.meta.fields;
            this.tableData = result.data;
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    }
  },

  // Clear all markers on the map
  clearMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  },
},
async mounted() {
  console.log("📌 ArchitecturalData component is mounted");
  console.log("📌 Initial isVisible:", this.isVisible);
  
  await this.loadMarkers();
}
};
</script>

<style scoped>
.architectural-data-panel {
  position: absolute;
  left: 100px;
  top: 0;
  height: 100vh;
  width: 550px;
  background: linear-gradient(145deg, #ffffffcb, #f7f7f7);
  padding: 20px;
  font-family: 'Inter', sans-serif;
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow-y: auto;
  font-family: Arial, sans-serif;
}

.panel-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

.info-box {
  border: 1px solid #16b0ed;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  height: 800px;
  overflow-y: auto;
}

.placeholder-text {
  color: #999;
  font-size: 14px;
  text-align: left;
}

.table-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.data-table th {
  background: #16b0ed;
  color: #fff;
}

</style>
