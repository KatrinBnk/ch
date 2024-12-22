<template>
  <Header></Header>
  <div class="container">
    <!-- Меню слева -->
    <aside class="menu">
      <ProfileMenu />
    </aside>
    <!-- Мои услуги -->
    <main class="content">
      <my-favorite/>
    </main>
  </div>
</template>

<script>
import myFavorite from "@/components/profile/myFavorite.vue";
import Header from "@/components/header.vue";
import { getUser } from "@/service/userDataService.js";
import ProfileMenu from "@/components/profile/profileMenu.vue";


export default {
  components: {
    myFavorite,
    Header,
    ProfileMenu,
  },
  data() {
    return {
      user: null,
      userID: null,
    };
  },
  async created() {
    this.userID = Number(localStorage.getItem("userID"));
    try {
      const userData = await getUser(this.userID);
      if (userData) {
        this.user = userData;
      }
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  margin: 50px;
}

</style>
