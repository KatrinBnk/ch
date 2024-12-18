<template>
  <Header></Header>
  <div class="container">
    <!-- Меню слева -->
    <aside class="menu">
      <ProfileMenu />
    </aside>
    <div class="content-rows">
    <!-- Основной контент справа -->
    <main class="content">
      <div class="user-data">
        <UserData v-if="user" :user="this.user" />
      </div>
      <div class="statistics">
        <StatisticsInfo />
      </div>
    </main>

    <!--TODO: заглушка (баланс и прочее)-->
    <div class="content-info">
      <div class="content-block">
        <img src="@/assets/stub.svg" alt="icon-block"/>
      </div>
      <div class="content-block">
        <img src="@/assets/stub.svg" alt="icon-block"/>
      </div>
      <div class="content-block">
        <img src="@/assets/stub.svg" alt="icon-block"/>
      </div>
    </div>
      <div class="content-schedule">
        <ScheduleProfile/>
      </div>
    </div>
  </div>
</template>

<script>
import UserData from "@/components/profile/userData.vue";
import myUslugas from "@/components/profile/master/uslugas/uslugas.vue";
import Header from "@/components/header.vue";
import { getUser } from "@/service/userDataService.js";
import Portfolio from "@/components/profile/master/portfolio/portfolio.vue";
import ProfileMenu from "@/components/profile/profileMenu.vue";
import StatisticsInfo from "@/components/profile/master/statisticsInfo.vue";
import ScheduleProfile from "@/components/profile/master/schedule.vue";

export default {
  components: {
    Portfolio,
    UserData,
    myUslugas,
    Header,
    ProfileMenu,
    StatisticsInfo,
    ScheduleProfile,
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

.content-rows {
  flex: 1; /* Колонка 2 занимает оставшееся пространство */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content {
  display: flex;
  gap: 20px;
}

.user-data,
.statistics {
  flex: 1;
}

.content-info {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.content-schedule{
  display: flex;
  gap: 20px;
}

.content-block {
  flex: 1;
  height: 122px;
  background-color: #ffffff;
  border-radius: 30px;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-block img {
  width: 94px;
  height: 98px;
  background-color: #fbd4d4;
  border-radius: 22px;
}



</style>
