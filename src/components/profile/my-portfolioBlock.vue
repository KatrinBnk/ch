<template>

  <Header></Header>
  <div class="container">
    <!-- Меню слева -->
    <aside class="menu">
      <ProfileMenu />
    </aside>
    <!-- Портфолио -->
    <main class="content">
      <portfolio :user-id="this.userID" :has-access="hasAccess"/>
    </main>
  </div>
</template>

<script>
import portfolio from "@/components/profile/master/portfolio/portfolio.vue";
import Header from "@/components/header.vue";
import ProfileMenu from "@/components/profile/profileMenu.vue";
import myUslugas from "@/components/profile/master/uslugas/uslugas.vue";

export default {
  name: 'Portfolio-block',
  components: {
    myUslugas,
    portfolio,
    Header,
    ProfileMenu,
  },
  data(){
    return {
      userID: null,
      hasAccess: true
    }
  },
  created() {
    this.userID = Number(localStorage.getItem("userID"));
  }

}
</script>

<style scoped>

.container {
  display: flex;
  gap: 20px;
  margin: 50px;
}

</style>