<template>
  <div class="not-found-page">
    <h1>Страница не найдена</h1>
    <p>К сожалению, запрашиваемая страница находится в разработке или не существует.</p>
    <button @click="goToHome">На главную</button>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.not-found-page h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.not-found-page p {
  font-size: 18px;
  margin-bottom: 30px;
}

.not-found-page button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background: #4848A0;
  color: #fff;
  border: none;
  border-radius: 10px;
}
</style>
