<template>
  <div class="report-form">
    <div class="form-row">
      <label>Date:</label>
      <div class="date-picker">
        <input type="date" v-model="localForm.date" lang="en" :disabled="!editable" />
      </div>
    </div>

    <div class="form-row">
      <label>Name:</label>
      <input
        type="text"
        v-model="localForm.name"
        placeholder="Enter name of building"
        :disabled="!editable"
      />
    </div>

    <div class="form-row">
      <label>Status:</label>
      <select
        v-model="localForm.status"
        :disabled="!editable"
        :class="{ 'status-bad': localForm.status === 'Bad', 'status-good': localForm.status === 'Good' }"
      >
        <option value="Bad" class="status-bad">Bad</option>
        <option value="Good" class="status-good">Good</option>
      </select>
    </div>

    <div class="form-row">
      <label>Address:</label>
      <input
        type="text"
        v-model="localForm.address"
        placeholder="Enter address"
        :disabled="!editable"
      />
    </div>

    <div class="form-row">
      <label>Damaged Area:</label>
      <select v-model="localForm.damagedArea" :disabled="!editable">
        <option value="Exterior">Exterior</option>
        <option value="Interior">Interior</option>
      </select>
    </div>

    <div class="form-row">
      <label>Damaged Part:</label>
      <select v-model="localForm.damagedPart" :disabled="!editable">
        <option value="Door">Door</option>
        <option value="Window">Window</option>
        <option value="Balcony">Balcony</option>
        <option value="Roof">Roof</option>
        <option value="Wall">Wall</option>
        <option value="Floor">Floor</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="form-row">
      <label>Specific Damaged Part:</label>
      <textarea v-model="localForm.specificDamage" placeholder="Describe damage" :disabled="!editable"></textarea>
    </div>

    <div class="form-row">
      <label>Material:</label>
      <textarea v-model="localForm.material" placeholder="Enter material" :disabled="!editable"></textarea>
    </div>

    <div class="form-row">
      <label>Additional Notes:</label>
      <textarea v-model="localForm.additionalNotes" placeholder="Enter notes" :disabled="!editable"></textarea>
    </div>

    <div class="form-row">
      <label>Fotos:</label>
      <div class="upload-box" v-if="editable" @click="uploadPhoto">
        <span v-if="!localForm.photo">➕</span>
        <img v-else :src="localForm.photo" class="uploaded-photo" />
      </div>
      <div v-else-if="localForm.photo">
        <img :src="localForm.photo" class="uploaded-photo" />
      </div>
    </div>

    <div class="form-row">
      <label>Contact:</label>
      <input
        type="text"
        v-model="localForm.contact"
        placeholder="Enter contact"
        :disabled="!editable"
      />
    </div>

    <div class="form-actions" v-if="editable">
      <button class="btn btn-add" @click="enableMarkerPlacement">ADD</button>
      <button class="btn btn-submit" @click="submitForm">SUBMIT</button>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  props: {
    form: Object,
    editable: Boolean,
    mapInstance: Object,
    isVisible: Boolean,
    currentUserId: String, 
  },
  data() {
    return {
      localForm: { ...this.form },
      markerEnabled: false,
      localMarker: null,
      isMarkerExternallyUpdated: false,
      latestReportMarker: null,
    };
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler(newForm) {
        console.log("🔄 Form Updates:", newForm);
        this.localForm = { ...newForm };
      },
    },
    currentUserId() {
      console.log("User switching, clearing forms");
      this.localForm = {};
      this.clearMarker();
    },
  },
  methods: {
    uploadPhoto() {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          this.localForm.photo = URL.createObjectURL(file);
        }
      };
      fileInput.click();
    },
    enableMarkerPlacement() {
      if (!this.mapInstance) {
        alert("Map instance is not initialized!");
        return;
      }
      alert("Click on the map to place a marker!");
      this.markerEnabled = true;
      this.mapInstance.on("click", this.placeMarker);
    },
    placeMarker(event) {
      if (!this.markerEnabled) return;
      const { lng, lat } = event.lngLat;
      if (this.localMarker) {
        this.localMarker.remove();
      }
      const el = document.createElement("div");
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0001 23.375C16.3779 23.375 16.6945 23.2432 16.9501 22.9797C17.2056 22.7161 17.3334 22.3896 17.3334 22C17.3334 21.6104 17.2056 21.2839 16.9501 21.0203C16.6945 20.7568 16.3779 20.625 16.0001 20.625C15.6223 20.625 15.3056 20.7568 15.0501 21.0203C14.7945 21.2839 14.6667 21.6104 14.6667 22C14.6667 22.3896 14.7945 22.7161 15.0501 22.9797C15.3056 23.2432 15.6223 23.375 16.0001 23.375ZM14.6667 17.875H17.3334V9.625H14.6667V17.875ZM16.0001 30.25C14.1556 30.25 12.4223 29.8891 10.8001 29.1672C9.17786 28.4453 7.76675 27.4656 6.56675 26.2281C5.36675 24.9906 4.41675 23.5354 3.71675 21.8625C3.01675 20.1896 2.66675 18.4021 2.66675 16.5C2.66675 14.5979 3.01675 12.8104 3.71675 11.1375C4.41675 9.46458 5.36675 8.00937 6.56675 6.77187C7.76675 5.53437 9.17786 4.55469 10.8001 3.83281C12.4223 3.11094 14.1556 2.75 16.0001 2.75C17.8445 2.75 19.5779 3.11094 21.2001 3.83281C22.8223 4.55469 24.2334 5.53437 25.4334 6.77187C26.6334 8.00937 27.5834 9.46458 28.2834 11.1375C28.9834 12.8104 29.3334 14.5979 29.3334 16.5C29.3334 18.4021 28.9834 20.1896 28.2834 21.8625C27.5834 23.5354 26.6334 24.9906 25.4334 26.2281C24.2334 27.4656 22.8223 28.4453 21.2001 29.1672C19.5779 29.8891 17.8445 30.25 16.0001 30.25Z" fill="#E92727"/>
        </svg>
      `;
      el.style.cursor = "pointer";
      this.localMarker = new mapboxgl.Marker({ element: el, offset: [1020, -1085] })
        .setLngLat([lng, lat])
        .addTo(this.mapInstance);
      this.localForm.marker = { lng, lat };
      console.log("Marker placed at:", lng, lat);
      this.markerEnabled = false;
      this.mapInstance.off("click", this.placeMarker);
    },
    submitForm() {
      if (!this.localForm.name || !this.localForm.status || !this.localForm.address) {
        alert("Please fill in all required fields!");
        return;
      }
      if (this.localMarker) {
        this.localMarker.remove();
        this.latestReportMarker = this.localMarker;
        this.localMarker = null;
      }
      console.log("Form submitted:", this.localForm);
      this.$emit("submit", { ...this.localForm, userId: this.currentUserId });
    },
    showLatestReportMarker() {
      if (this.latestReportMarker && this.localForm.marker) {
        const { lng, lat } = this.localForm.marker;
        if (!this.localMarker) {
          const el = document.createElement("div");
          el.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0001 23.375C16.3779 23.375 16.6945 23.2432 16.9501 22.9797C17.2056 22.7161 17.3334 22.3896 17.3334 22C17.3334 21.6104 17.2056 21.2839 16.9501 21.0203C16.6945 20.7568 16.3779 20.625 16.0001 20.625C15.6223 20.625 15.3056 20.7568 15.0501 21.0203C14.7945 21.2839 14.6667 21.6104 14.6667 22C14.6667 22.3896 14.7945 22.7161 15.0501 22.9797C15.3056 23.2432 15.6223 23.375 16.0001 23.375ZM14.6667 17.875H17.3334V9.625H14.6667V17.875ZM16.0001 30.25C14.1556 30.25 12.4223 29.8891 10.8001 29.1672C9.17786 28.4453 7.76675 27.4656 6.56675 26.2281C5.36675 24.9906 4.41675 23.5354 3.71675 21.8625C3.01675 20.1896 2.66675 18.4021 2.66675 16.5C2.66675 14.5979 3.01675 12.8104 3.71675 11.1375C4.41675 9.46458 5.36675 8.00937 6.56675 6.77187C7.76675 5.53437 9.17786 4.55469 10.8001 3.83281C12.4223 3.11094 14.1556 2.75 16.0001 2.75C17.8445 2.75 19.5779 3.11094 21.2001 3.83281C22.8223 4.55469 24.2334 5.53437 25.4334 6.77187C26.6334 8.00937 27.5834 9.46458 28.2834 11.1375C28.9834 12.8104 29.3334 14.5979 29.3334 16.5C29.3334 18.4021 28.9834 20.1896 28.2834 21.8625C27.5834 23.5354 26.6334 24.9906 25.4334 26.2281C24.2334 27.4656 22.8223 28.4453 21.2001 29.1672C19.5779 29.8891 17.8445 30.25 16.0001 30.25Z" fill="#E92727"/>
        </svg>
          `;
          el.style.cursor = "pointer";
          this.localMarker = new mapboxgl.Marker({ element: el, offset: [1032, -1032] })
            .setLngLat([lng, lat])
            .addTo(this.mapInstance);
        }
      } else {
        console.warn("No latest report marker to show.");
      }
    },
    clearMarker() {
      if (this.localMarker) {
        this.localMarker.remove();
        this.localMarker = null;
      }
    },
  },
};
</script>

  
  <style scoped>
.status-bad {
  color: red;
  background-color: rgba(255, 0, 0, 0.103);
}
.status-good {
  color: green;
  background-color: rgba(0, 255, 0, 0.055);
}
.report-form {
  display: flex;
  flex-direction: column;
  height: 450px;
  gap: 10px;
  background: #cecece2a;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  font-family: Arial, sans-serif;
}
.form-row {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.form-row label {
  color: #646464;
  margin-bottom: 5px;
}
.date-picker {
  display: flex;
  align-items: center;
}
.form-actions {
  display: flex;
  gap: 10px;
}
input, select, textarea {
  border: 1px dashed #16b0ed;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  background: #ffffff;
  font-family: Arial, sans-serif;
}
.upload-box {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ebebebab;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.upload-box:hover {
  background: #dadada;
}
.uploaded-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn {
  margin-top: 10px;
  background: #e7e7e7;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
  font-family: Arial, sans-serif;
}
.btn:hover {
  background: #0378c8;
}
.btn-add {
  background: #04a6f3;
}
.btn-submit {
  background: #04a6f3;
}
</style>