<template>
  <div class="highlight">
    <!-- TODO: стоит заглушка на картинки. Нужно будет поменять. -->
    <img class="highlight-image" src="../../assets/stub.svg" :alt="text" />
    <p class="highlight-text">{{ text }}</p>
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
.highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.highlight-image {
  width: 60px;
  height: 60px;
  padding: 4px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #4a3fb0;
}

.highlight-text {

  font-family: SF Pro Text;
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  margin-top: 10px;
  word-wrap: break-word;
  color: #000000;
}
</style>
