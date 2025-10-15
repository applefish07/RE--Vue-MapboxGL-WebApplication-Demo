<template>
    <div class="map-controls">
      <!-- Bottom Right Control -->
      <div class="controls-container">
        <div class="map-controls-group">
          <button class="control-button" @click="handleZoomIn">
            <svg class="control-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button class="control-button" @click="handleZoomOut">
            <svg class="control-icon" viewBox="0 0 24 24">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button 
            class="control-button compass" 
            @click="resetNorth"
            :style="{ transform: `rotate(${bearing}deg)` }"
          >
            <svg class="compass-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.69 12.86l-2.73 1.12-.41.17-.17.41-1.12 2.73c-.49.21-1.01.3-1.53.3-3.31 0-6-2.69-6-6 0-1.02.25-2.05.75-2.96l2.73-1.12.41-.17.17-.41 1.12-2.73c.49-.21 1.01-.3 1.53-.3 3.31 0 6 2.69 6 6 0 1.02-.25 2.05-.75 2.96zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MapControls",
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        bearing: 0
      };
    },
    mounted() {
      // Make sure the map object exists before binding events
      if (this.map) {
        this.map.on('rotate', this.updateCompass);
      }
    },
    beforeUnmount() {
      // Make sure the map object exists before removing the event
      if (this.map) {
        this.map.off('rotate', this.updateCompass);
      }
    },
    methods: {
      handleZoomIn() {
        if (this.map) this.map.zoomIn();
      },
  
      handleZoomOut() {
        if (this.map) this.map.zoomOut();
      },
  
      resetNorth() {
        if (this.map) {
          this.map.resetNorthPitch({
            duration: 800
          });
        }
      },
  
      updateCompass() {
        this.bearing = this.map.getBearing();
      }
    }
  };
  </script>
  
  <style scoped>
  .map-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .controls-container {
    position: absolute;
    bottom: 20px;
    right: 20px;
    pointer-events: auto;
  }
  
  .map-controls-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    padding: 8px;
  }
  
  .control-button {
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  
  .control-button:hover {
    background: #f5f5f5;
  }
  
  .control-icon {
    width: 24px;
    height: 24px;
    fill: #07ACEC;
  }
  
  .compass {
    transition: transform 0.3s;
  }
  
  .compass-icon {
    width: 24px;
    height: 24px;
    fill: #07ACEC;
  }
  </style>
  