<template>
  <div class="icon-item" @click="handleClick">
    <!-- Dynamically load native SVG icons -->
    <SvgIcon :name="icon.name" />
  </div>
</template>

<script>
import SvgIcon from "./SvgIcon.vue";

export default {
  name: "IconItem",
  components: {
    SvgIcon,
  },
  props: {
    icon: {
      type: Object,
      required: true,
      // icon The object needs to contain the { name: icon name, label: icon name } format.
    },
  },
  methods: {
    handleClick() {
      this.$emit("click"); // trigger a click event
    },
  },
};
</script>

<style scoped>
.icon-item {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.icon-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
