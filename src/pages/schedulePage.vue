<template>
  <div class="profile-page">
    <Header/>
    <div class="profile-content">
      <Schedule class="schedule" />
      <ScheduleProfile class="profile" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Schedule from "@/components/mySchedule/schedule.vue";
import ScheduleProfile from "@/components/mySchedule/scheduleProfile.vue";
import {getUser} from "@/service/userDataService.js";

export default {
  components: {
    ScheduleProfile,
    Schedule,
    Header
  },
  data() {
    return {
      userID: null,
      isAuthenticated: false
    };
  },
  async created() {
    this.userID = localStorage.getItem("userID");
    this.isAuthorized =  "true";

    if (!this.isAuthorized) {
      this.$router.push("/login");
    } else {
      try {
        const user = await getUser(this.userID)
        if (!user) {
          this.$router.push("/login");
        }
      } catch (e) {
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style scoped>

.profile-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  padding: 60px;
  box-sizing: border-box;
}

.schedule, .profile {
  width: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>

