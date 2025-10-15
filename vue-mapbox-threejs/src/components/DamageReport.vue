<template>
    <div v-if="isLoggedIn" class="damage-report-panel">
      <h1 class="main-title">Damage Report</h1>
  
      <!-- Latest Reports -->
      <div class="border-box">
        <h2 class="subtitle">Latest Report</h2>
        <div class="latest-report">
          <div class="details">
            <div class="row"><span class="label">Status:</span><span class="value">{{ latestReport.status || "N/A" }}</span></div>
            <div class="row"><span class="label">Name:</span><span class="value">{{ latestReport.name || "N/A" }}</span></div>
            <div class="row"><span class="label">Address:</span><span class="value">{{ latestReport.address || "N/A" }}</span></div>
            <div class="row"><span class="label">Created Date:</span><span class="value">{{ latestReport.date || "N/A" }}</span></div>
          </div>
          <div class="photo-container">
            <img v-if="latestReport.photo" :src="latestReport.photo" class="photo-preview" />
          </div>
        </div>
  
        <!-- buttons -->
        <div class="actions">
          <div class="left-actions">
            <button class="btn btn-show" @click="toggleForm('SHOW')">SHOW</button>
            <button class="btn btn-edit" @click="toggleForm('EDIT')">EDIT</button>
          </div>
          <div class="right-actions">
            <button class="btn btn-new-report" @click="toggleForm('NEW')">NEW REPORT</button>
          </div>
        </div>
      </div>
  
      <!-- Report Form / Report History -->
      <div class="border-box2">
        <h2 class="subtitle">{{ isFormVisible ? "Report Form" : "Report History" }}</h2>
        <report-form
          v-if="isFormVisible"
          :form="form"
          :mapInstance="mapInstance" 
          :marker="latestReport.marker"
          :editable="formType !== 'SHOW'"
          :currentUserId="currentUserId" 
          @submit="submitReport"
          @add-marker="addMarker"
          @update-marker="updateMarker"
        />
        <div v-else class="history-container">
          <div v-for="report in reportHistory" :key="report.id" class="history-item">
            <div><strong>Status:</strong> {{ report.status }}</div>
            <div><strong>Date:</strong> {{ report.date }}</div>
            <div><strong>Address:</strong> {{ report.address }}</div>
            <div><strong>Name:</strong> {{ report.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // import { transformWithEsbuild } from "vite";
import ReportForm from "./ReportForm.vue";
  
  export default {
    name: "DamageReport",
    props: {
      isLoggedIn: {
        type: Boolean,
        required: true,
      },
      mapInstance: Object, // Receives the mapInstance passed from Sidebar.vue.
      currentUserId: String, // ✅ Ensure that the Sidebar component passes the user ID
    },
    components: { ReportForm },
    watch: {
      currentUserId: {
        immediate: true,
        handler(newUserId) {
          console.log("👤 User ID change:", newUserId);
          if (newUserId) {
            this.fetchReports();
          }
        },
      },
    },
    data() {
      return {
        latestReport: {},
        reportHistory: [],
        isFormVisible: false,
        formType: "",
        form: {},
        localMarker: null,
      };
    },

    methods: {
      async fetchReports() {
  if (!this.currentUserId) {
    console.warn("currentUserId is undefined and cannot be fetched for reports");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/reports");
    if (!response.ok) throw new Error("Failed to fetch reports");

    const reports = await response.json();
    console.log("📊 All reports obtained:", reports);

    // Ensure that the report data contains the userId and filter out reports for the current user
    this.reportHistory = reports.filter(report => report.userId === this.currentUserId);
    console.log("📝 Reports from current users:", this.reportHistory);

    this.latestReport = this.reportHistory.length ? this.reportHistory[this.reportHistory.length - 1] : {};
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
      },
      toggleForm(type) {
        this.formType = type;
        this.isFormVisible = true;
        // this.form = type === "NEW" ? {} : { ...this.latestReport };
        console.log("latestreport", this.latestReport)

        this.latestReport.isMarkerExternallyUpdated = true
        this.form = type === "NEW" ? {} : { ...this.latestReport};
      },
      async submitReport(newReport) {
        try {
          const response = await fetch("http://localhost:3000/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newReport, userId: this.currentUserId }), // Use currentUserId
          });
          if (!response.ok) throw new Error("Failed to save report");
          const savedReport = await response.json();
  
          this.latestReport = { ...savedReport };
          this.reportHistory.push(savedReport);
          this.isFormVisible = false;
        } catch (error) {
          console.error("Error saving report:", error);
        }
      },
      addMarker(coords) {
        this.latestReport.marker = coords;
      },
      updateMarker(coords) {
        console.log("Marker updated in DamageReport:", coords);
        this.latestReport.marker = coords;
      }
    },
    async mounted() {
      await this.fetchReports();
    },
  };
  </script>

<style scoped>
.damage-report-panel {
  position: absolute;
  left: 100px;
  top: 0;
  height: 100vh;
  width: 500px;
  background: linear-gradient(145deg, #ffffffcb, #f7f7f7);
  padding: 20px;
  font-family: Arial, sans-serif;
  z-index: 1000;
  overflow-y: auto;
}
.main-title {
  font-size: 20px;
  margin-bottom: 10px;
  margin-left: 15px;
  color: #333;
}
.subtitle {
  font-size: 18px;
  margin-bottom: 10px;
  color: rgb(71, 71, 71);
}
.border-box {
  border: 1px solid #16b0ed;
  padding: 20px;
  border-radius: 10px;
  background: white;
  margin-bottom: 20px;
  
}

.border-box2 {
  border: 1px solid #16b0ed;
  padding: 20px;
  border-radius: 10px;
  background: white;
  margin-bottom: 10px;
}

.latest-report {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: nowrap; 
  color: rgb(102, 102, 102);
  gap: 10px;
}
.details {
  flex: 2;
}
.photo-container {

  width: 120px;
  height: 120px;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
}
.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.details .row {
  margin-bottom: 16px; 
  color: #4e4e4e;
  display: grid; 
  grid-template-columns: 50px 1fr; 
  align-items: center; 
}

.details .label {
  font-weight: bold; 
  color: #333; 
  text-align: right; 
}

.details .value {
    text-align: right; 
  color: #4e4e4e;
  padding-right: 100px; 
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.left-actions {
  display: flex;
  gap: 10px;
}

.right-actions {
  margin-left: auto; 
}

.btn {
  background: #16b0ed;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background: #0378c8;
}
.history-container {
  border: 1px dashed #ccc;
  padding: 10px;
  height: 450px;
  overflow-y: auto;
}
.history-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
}
</style>
