<template>
  <div class="profile-page">
    <Header  :user-id="userId"/>
    <div class="profile-content">
      <Schedule class="schedule" :user-i-d="userId"/>
      <ScheduleProfile class="profile" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Schedule from "@/components/schedule.vue";
import ScheduleProfile from "@/components/scheduleProfile.vue";

export default {
  components: {
    ScheduleProfile,
    Schedule,
    Header
  },
  data() {
    return {
      userId: null
    };
  },
  created() {
    const userId = localStorage.getItem("userID");
    const isAuthorized = localStorage.getItem("auth") === "true";

    if (!isAuthorized || !userId) {
      this.$router.push("/ch/login");
    } else {
      this.userId = userId;
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

