<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: 'SF Pro Text';
  src: url('/fonts/SFProText-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'SF Pro Text';
  src: url('/fonts/SFProText-Semibold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}

</style>
