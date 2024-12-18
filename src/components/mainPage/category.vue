<template>
  <div class="category">
    <!--TODO: зуглушка на картинки -->
    <img class="category-image" src="../../assets/stub.svg" :alt="text" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.category-image {
  width: 100%;
  height: auto;
  aspect-ratio: 316 / 175;
  border-radius: 30px;
  object-fit: cover;
  margin-right: 10px;
}
</style>