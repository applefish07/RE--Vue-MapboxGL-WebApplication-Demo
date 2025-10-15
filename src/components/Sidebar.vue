<template> 
  <div class="sidebar">
    <!-- Logo and project name -->
    <div class="header">
      <img src="@/assets/png/Logo.png" alt="Logo" class="logo" />
      <h1 class="project-name">RE+</h1>
    </div>

    <!-- Icon Grouping -->
    <div class="icons">
      <!-- Main icon set -->
      <div class="icon-group">
        <div
          v-for="(icon, index) in mainIcons"
          :key="index"
          class="icon-wrapper"
          :class="{ active: activeIcon === index }"
          @click="toggleIconState(index)"
        >
          <SvgIcon :name="icon.name" />
        </div>
      </div>

      <!-- spacing -->
      <div class="icon-separator"></div>

      <!-- Auxiliary Icon Set -->
      <div class="icon-group">
        <div
          v-for="(icon, index) in secondaryIcons"
          :key="index"
          class="icon-wrapper"
          :class="{ active: activeIcon === index + mainIcons.length }"
          @click="toggleIconState(index + mainIcons.length)"
        >
          <SvgIcon :name="icon.name" />
        </div>
      </div>
    </div>

    <!-- user avatar -->
    <div class="footer">
      <img src="@/assets/png/user.png" alt="User Avatar" class="avatar" @click="openAuthModal" />
    </div>

    <!-- UserAuth subassemblies -->
    <UserAuth ref="userAuth" @loginSuccess="handleLoginSuccess" @logout="handleLogout" />

    <!-- NavigationSystem subassemblies -->
    <NavigationSystem v-if="showNavigationSystem" :isVisible="showNavigationSystem" :mapInstance="mapInstance" />

    <!-- DamageReport subassemblies -->
    <DamageReport 
    v-if="activeIcon === 2"  
    :isLoggedIn="isLoggedIn" 
    :mapInstance="mapInstance"
    :currentUserId="currentUserId"
    />
  
    <!-- FiltersPanel subassemblies -->
    <FiltersPanel
      v-if="activeIcon === 3 && isLoggedIn"
      :mapInstance="mapInstance"
      :isLoggedIn="isLoggedIn"
    />

    <ArchitecturalData
      v-if="activeIcon === 4"
      :isVisible="showArchitecturalData"
      :mapInstance="mapInstance"
    />


    <!-- MapStylePanel subassemblies -->
    <MapStylePanel
      v-if="showMapStylePanel"
      :isVisible="showMapStylePanel"
      :mapInstance="mapInstance"
      @update-basemap="updateBasemap"
      @update-color-theme="updateColorTheme"
      @update-light-present="updateLightPresent"
      @toggle-layer-visibility="toggleLayerVisibility"
    />
  </div>
</template>

<script>
import SvgIcon from "./SvgIcon.vue";
import UserAuth from "./UserAuth.vue";
import MapStylePanel from "./MapStylePanel.vue";
import NavigationSystem from "./NavigationSystem.vue";
import DamageReport from "./DamageReport.vue";
import FiltersPanel from "./FiltersPanel.vue";
import ArchitecturalData from "./ArchitecturalData.vue";


export default {
  name: "SidebarComponent",
  components: {
    SvgIcon,
    UserAuth,
    MapStylePanel,
    NavigationSystem,
    DamageReport,
    FiltersPanel, // 
    ArchitecturalData, // 
  },
  props: {
    mapInstance: Object,
  },
  data() {
    return {
      activeIcon: null,
      showMapStylePanel: false,
      showNavigationSystem: false,
      isLoggedIn: false, // 
      requestedIcon: null, // 
      currentUserId: null, // 
      showArchitecturalData: false,
      mainIcons: [
        { name: "icon-map-style", label: "Map Style" },
        { name: "icon-direction-box", label: "Direction Box" },
        { name: "icon-report", label: "Report" },
        { name: "icon-repair", label: "Repair" },
        { name: "icon-data", label: "Data" },
      ],
      secondaryIcons: [
        { name: "icon-profile", label: "Profile" },
        { name: "icon-settings", label: "Settings" },
      ],
    };
  },
  methods: {
    toggleIconState(index) {
  // If the click is on an icon that is currently active, close the panel
  if (this.activeIcon === index) {
    // this.activeIcon = null;
    this.showNavigationSystem = false;
    this.showMapStylePanel = false;
    this.showArchitecturalData = false;
    console.log("📌 Close the current panel，activeIcon reset to null");
    return;
  }

  // If a different icon is clicked
  this.activeIcon = index;
  console.log("Current activeIcon:", this.activeIcon);

  // Logic for handling specific icons
  if (index === 0) {
    this.showMapStylePanel = true;
    this.showNavigationSystem = false;
    this.showArchitecturalData = false;
    console.log("📌 Map Style panel display");
  } else if (index === 1) {
    this.showNavigationSystem = true;
    this.showMapStylePanel = false;
    this.showArchitecturalData = false;
    console.log("📌 NavigationSystem panel display");
  } else {
    this.showMapStylePanel = false;
    this.showNavigationSystem = false;
    this.showArchitecturalData = false;
  }

  // Processing ArchitecturalData Panel Logic
  if (index === 4) {
    this.showArchitecturalData = true
    this.showNavigationSystem = false;
    this.showMapStylePanel = false;
    console.log("📌 ArchitecturalData panel display");
  }

  // Checking user login status（针对 index === 2 和 index === 3）
  if ((index === 2 || index === 3) && !this.isLoggedIn) {
    console.warn("⚠️ User not logged in, please log in first！");
    this.requestedIcon = index; // 
    this.openAuthModal();
    this.activeIcon = null; // 
    return;
  }
},

    openAuthModal() {
      this.$refs.userAuth.openModal();
    },
    handleLoginSuccess(userId) { // 
      console.log("✅ Login Successful！");
      this.isLoggedIn = true; // 
      this.currentUserId = userId; // 
      console.log("Current Login Status:", this.isLoggedIn);
    
    // ✅ If you clicked Report before logging in, you will be automatically switched back to Report.
    if (this.requestedIcon !== null) {
      console.log("🎯 Previously clicked on:", this.requestedIcon);

      this.activeIcon = this.requestedIcon;  // 
      this.$nextTick(() => {
        this.toggleIconState(this.requestedIcon);
        this.requestedIcon = null;
      });
    }
  },
    handleLogout() {
      this.isLoggedIn = false; // 
      this.activeIcon = null; // 
    },

    displayReportForm(report) {
      console.log("Show full report form：", report);
      this.$emit("show-report", report);
    },

    updateBasemap(style) {
      if (this.mapInstance) {
        this.mapInstance.setStyle(style);
      }
    },
    updateColorTheme(style) {
      if (this.mapInstance) {
        this.mapInstance.setStyle(style);
      }
    },
    updateLightPresent(style) {
      if (this.mapInstance) {
        this.mapInstance.setStyle(style);
      }
    },
    toggleLayerVisibility(layer) {
      console.log("Layer visibility toggled:", layer);
    },
    watch: {
      isLoggedIn(newVal) {
        console.log("Sidebar.vue: isLoggedIn updated to:", newVal);
      }
    }
  },
};
</script>



<style scoped>
.sidebar {
  flex-shrink: 0; 
  width: 100px; 
  height: 100vh; 
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .sidebar {
    width: 150px; 
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 120px; 
  }
}
.header {
  text-align: center;
  margin-top: 20px;
}

.logo {
  width: 60px;
  margin-bottom: 10px;
}

.project-name {
  font-family: "Aclonica", sans-serif;
  font-size: 18px;
  color: #333;
  margin-top: 0;
}

.icons {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.icon-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.icon-separator {
  height: 50px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: transparent;
  transition: background-color 0.3s, transform 0.3s;
  cursor: pointer;
}

.icon-wrapper svg {
  width: 28px;  /* 让 SVG 变大 */
  height: 28px;
}

.icon-wrapper:hover {
  background-color: #16b0ed;
  transform: scale(1.1);
  color: white;
}

.icon-wrapper.active {
  background-color: #16b0ed;
  color: white;
}

.icon-wrapper.active svg {
  fill: currentColor;
}

.footer {
  position: absolute;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
}

.footer:hover {
  transform: scale(1.2);
}

.footer img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

</style>