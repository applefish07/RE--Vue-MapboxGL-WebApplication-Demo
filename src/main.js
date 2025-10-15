import { createApp } from 'vue'
import App from './App.vue'
import './assets/icons/icons.js'; // replace '@/assets/icons'


if (!window.mapMarkers) {
    window.mapMarkers = {}; // Ensure that `window.mapMarkers` exists
    console.log("✅ Initialized window.mapMarkers", window.mapMarkers);
  }
createApp(App).mount('#app')
