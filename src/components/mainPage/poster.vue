<template>
  <div class="poster-container">
    <div class="poster-content">
      <h1 class="poster-title">Записывайся <br /> через приложение</h1>
      <div class="poster-buttons">
        <button class="poster-button primary">Записаться</button>
        <button class="poster-button secondary">Подробнее</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Poster",
};
</script>

<style scoped>
.poster-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: url("@/assets/content-img.svg") no-repeat center center / cover;
  border-radius: 30px;
  padding: 40px 40px 40px 91px;
  margin: 50px;
  font-family: "SF Pro Text", sans-serif;
  height: 300px;
}

.poster-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.poster-title {
  font-family: 'SF Pro Text', sans-serif;
  font-size: 40px;
  font-weight: 600;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #000;
  margin-bottom: 20px;
  line-height: 1.2;
}

.poster-buttons {
  display: flex;
  gap: 15px;
}

.poster-button {
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.3s ease;
  background: #47489F;
  color: #fff;
}

.primary:hover, .secondary:hover {
  background: #48488F;
}

</style>
