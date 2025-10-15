<template>
    <div v-if="isLoggedIn" class="filters-panel">
      <!-- filter panel -->
      <div class="panel">
        <h1 class="title">Filters</h1>
  
        <!-- Level Selection -->
        <div class="filter-section">
          <h2 class="subtitle">1. Level Selection</h2>
          <div class="filter-group">
            <label class="filter-item">
              <input type="checkbox" v-model="filters.damagedArea.Exterior" @change="applyFilters" />
              Exterior
            </label>
            <label class="filter-item">
              <input type="checkbox" v-model="filters.damagedArea.Interior" @change="applyFilters" />
              Interior
            </label>
          </div>
        </div>
  
        <div class="filter-section">
          <h2 class="subtitle">2. Level Selection</h2>
          <div class="filter-group">
            <label v-for="part in parts" :key="part" class="filter-item">
              <input type="checkbox" v-model="filters.damagedPart[part]" @change="applyFilters" />
              {{ part }}
            </label>
          </div>
        </div>
      </div>
  
      <!-- Results Panel -->
      <div v-if="filteredReports.length" class="results-panel">
        <div class="panel">
          <h1 class="title">Results</h1>
          <div class="result-items">
            <div
              class="result-item"
              v-for="report in filteredReports"
              :key="report.id"
              @click="handleResultItemClick(report)"
            >
              <div><strong>{{ report.name }}</strong></div>
              <div>{{ report.address }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Report form pop-ups -->
      <div v-if="selectedReport" class="report-popup">
        <ReportForm
          :form="selectedReport"
          :editable="false"
          :mapInstance="mapInstance"
          @close="closeReportForm"
        />
      </div>
    </div>
  </template>
  
  <script>
import ReportForm from "./ReportForm.vue";
import mapboxgl from "mapbox-gl";

export default {
  components: {
    ReportForm,
  },
  props: {
    mapInstance: Object,
    isLoggedIn: Boolean,
  },
  data() {
    return {
      reports: [],
      filters: {
        damagedArea: {
          Exterior: false,
          Interior: false,
        },
        damagedPart: {
          Door: false,
          Window: false,
          Balcony: false,
          Roof: false,
          Wall: false,
          Floor: false,
          Other: false,
        },
      },
      filteredReports: [],
      selectedReport: null,
      activeMarker: null, 
      activeReportId: null, 
    };
  },
  computed: {
    parts() {
      return Object.keys(this.filters.damagedPart);
    },
  },
  methods: {
    async fetchReports() {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();
        this.reports = this.filterConflictingReports(data.reports || []);
        this.applyFilters();
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    },
    filterConflictingReports(reports) {
      // Filtering out reports with the same name but different statuses
      const groupedReports = reports.reduce((acc, report) => {
        if (!acc[report.name]) acc[report.name] = [];
        acc[report.name].push(report);
        return acc;
      }, {});

      // Keep groups with consistent status, remove groups with inconsistent status
      return Object.values(groupedReports)
        .filter((group) => group.every((r) => r.status === group[0].status))
        .flat();
    },
    applyFilters() {
      const selectedAreas = Object.entries(this.filters.damagedArea)
        .filter((entry) => entry[1])
        .map((entry) => entry[0]);
      const selectedParts = Object.entries(this.filters.damagedPart)
        .filter((entry) => entry[1])
        .map((entry) => entry[0]);

      this.filteredReports = this.reports.filter(
        (report) =>
          selectedAreas.includes(report.damagedArea) &&
          selectedParts.includes(report.damagedPart)
      );
    },
    handleResultItemClick(report) {
      // If it's the second click, remove the Marker and close the pop-up window.
      if (this.activeReportId === report.id) {
        this.clearActiveMarker();
        this.closeReportForm();
        this.activeReportId = null; 
        return;
      }

      // First click to add Marker and display report form
      this.activeReportId = report.id;
      this.displayMarker(report);
      this.selectedReport = report;
    },
    displayMarker(report) {
      // Clearing an Existing Marker
      if (this.activeMarker) {
        this.activeMarker.remove();
        this.activeMarker = null;
      }

      // Add New Marker
      if (report.marker) {
        const { lng, lat } = report.marker;

        const el = document.createElement("div");
        el.className = "marker";
        el.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0001 23.375C16.3779 23.375 16.6945 23.2432 16.9501 22.9797C17.2056 22.7161 17.3334 22.3896 17.3334 22C17.3334 21.6104 17.2056 21.2839 16.9501 21.0203C16.6945 20.7568 16.3779 20.625 16.0001 20.625C15.6223 20.625 15.3056 20.7568 15.0501 21.0203C14.7945 21.2839 14.6667 21.6104 14.6667 22C14.6667 22.3896 14.7945 22.7161 15.0501 22.9797C15.3056 23.2432 15.6223 23.375 16.0001 23.375ZM14.6667 17.875H17.3334V9.625H14.6667V17.875ZM16.0001 30.25C14.1556 30.25 12.4223 29.8891 10.8001 29.1672C9.17786 28.4453 7.76675 27.4656 6.56675 26.2281C5.36675 24.9906 4.41675 23.5354 3.71675 21.8625C3.01675 20.1896 2.66675 18.4021 2.66675 16.5C2.66675 14.5979 3.01675 12.8104 3.71675 11.1375C4.41675 9.46458 5.36675 8.00937 6.56675 6.77187C7.76675 5.53437 9.17786 4.55469 10.8001 3.83281C12.4223 3.11094 14.1556 2.75 16.0001 2.75C17.8445 2.75 19.5779 3.11094 21.2001 3.83281C22.8223 4.55469 24.2334 5.53437 25.4334 6.77187C26.6334 8.00937 27.5834 9.46458 28.2834 11.1375C28.9834 12.8104 29.3334 14.5979 29.3334 16.5C29.3334 18.4021 28.9834 20.1896 28.2834 21.8625C27.5834 23.5354 26.6334 24.9906 25.4334 26.2281C24.2334 27.4656 22.8223 28.4453 21.2001 29.1672C19.5779 29.8891 17.8445 30.25 16.0001 30.25Z" fill="#E92727"/>
        </svg>
        `;
        el.style.cursor = "pointer";

        this.activeMarker = new mapboxgl.Marker({ element: el, offset: [1027, -1025] })
          .setLngLat([lng, lat])
          .addTo(this.mapInstance);
      }
    },
    clearActiveMarker() {
      // Remove the currently active Marker
      if (this.activeMarker) {
        this.activeMarker.remove();
        this.activeMarker = null;
      }
    },
    closeReportForm() {
      this.selectedReport = null;
    },
  },
  mounted() {
    this.fetchReports();
  },
};
</script>

  


  <style scoped>
  .filters-panel {
  position: absolute;
  left: 100px;
  top: 0;
  height: 100vh; 
  width: 450px; 
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  background: linear-gradient(145deg, #e4e4e4cb, #f7f7f7);
  padding: 20px;
  font-family: Arial, sans-serif;
  z-index: 1000;
  overflow-y: auto;
}

.title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  text-align: left; 
  margin-left: 0; 
}

.filter-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px; 
  font-family: Arial, sans-serif;
}

.subtitle {
  font-size: 17px;
  margin-bottom: 10px;
  color: #333;
}

.filter-group {
  display: flex;
  flex-direction: column; 
  gap: 15px; 
}

.filter-item {
  display: flex;
  align-items: center; 
  gap: 8px; 
  font-size: 15px;
  color: #444;
}
  
  .marker {
  background: transparent;
  width: 32px;
  height: 32px;
}

.marker.highlight {
  transform: scale(1.5);
  transition: transform 0.3s;
}

  /* Results panel style */
  .results-panel {
    position: absolute;
    top: 0;
    left: 200px;
    width: 250px;
    height: 100vh; /* Height of the screen */
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }
  
  .result-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .result-item {
    padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px; /* Rounded corners of infoboxes */
  background: #fff; /* white background */
  border: 1px solid #16b0ed;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  }
  
  .result-item:hover {
    background: #f0f0f0;
    transform: translateY(-5px);
  }
  

  /* Report form pop-up style */
  .report-popup {
    position: fixed;
    top: 50%;
    left: 38%;
    width: 400px;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 2000;
  }
  </style>
  