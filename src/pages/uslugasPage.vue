<template>
  <Header></Header>
  <div class="container">
    <!-- Меню слева -->
    <aside class="menu">
      <ProfileMenu />
    </aside>
    <!-- Мои услуги -->
    <main class="content">
      <my-uslugas/>
    </main>
  </div>
</template>

<script>
import myUslugas from "@/components/profile/master/uslugas/uslugas.vue";
import Header from "@/components/header.vue";
import { getUser } from "@/service/userDataService.js";
import ProfileMenu from "@/components/profile/profileMenu.vue";


export default {
  components: {
    myUslugas,
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
