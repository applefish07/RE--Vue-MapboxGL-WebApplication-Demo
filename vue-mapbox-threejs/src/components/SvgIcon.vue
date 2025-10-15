<template>
    <svg :class="`icon ${className}`" aria-hidden="true">
      <use :xlink:href="`#${name}`"></use>
    </svg>
  </template>
  
  <script>
  export default {
    name: 'SvgIcon',
    props: {
      name: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
    },
  };
  </script>
  
  <style scoped>
  .icon {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  </style>
  