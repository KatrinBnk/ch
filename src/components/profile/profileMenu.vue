<template>
  <div class="profile-menu">
    <ul class="menu-list">
      <li class="menu-item" v-for="(link, index) in links" :key="index" @click="goToRoute(link.route)">
        {{ link.title }}
      </li>
    </ul>
    <button class="logout-btn" @click="logout">Выйти</button>
  </div>
</template>

<script>
export default {
  name: "ProfileMenu",
  data() {
    return {
      links: [
        { title: "Главная", route: "/" },
        { title: "Сообщения", route: "/messages" },
        { title: "Отзывы", route: "/reviews" },
        { title: "Статистика", route: "/statistics" },
        { title: "Услуги", route: "/my-uslugas" },
        { title: "Портфолио", route: "/my-portfolio" },
        { title: "Настройки", route: "/settings" },
        { title: "Поддержка", route: "/support" },
        { title: "Избранное", route: "/favorite" },
      ]
    };
  },
  methods: {
    goToRoute(route) {
      this.$router.push(route);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-menu {
  background-color: #4848A0;
  border-radius: 30px;
  width: 263px;
  height: 100%;
  padding: 30px 14px 25px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 7px 0 #0000001F;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0 25px;
}

.menu-item {
  color: #fff;
  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 20px;
  cursor: pointer;
}

.menu-item:hover {
  opacity: 0.8;
}

.logout-btn {
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 17px;
  padding: 20px;
  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  margin-top: auto;
}

.logout-btn:hover {
  background-color: #f0f0f0;
}

</style>
