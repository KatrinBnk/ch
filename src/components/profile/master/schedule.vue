<template>
  <div class="schedule-container">
    <h2 class="schedule-title">Расписание</h2>
    <!-- Сетка с линиями -->
    <div class="schedule-grid">
      <div
          v-for="(time, index) in count"
          :key="index"
          class="schedule-line"
      ></div>
    </div>
    <!-- Временные метки -->
    <div class="schedule-time">
      <span
          v-for="(time, index) in timeLabels"
          :key="index"
          class="time-label"
      >
        {{ time }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleComponent",
  data() {
    return {
      count: 20,
      timeLabels: [
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
    };
  },
};
</script>

<style scoped>
.schedule-container {
  background-color: #ffffff;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "SF Pro Text", sans-serif;
  width: 100%;
  padding: 10px 40px 20px 20px;
}

.schedule-title {
  text-align: center;
  font-size: 20px;
  font-family: "SF Pro Text", sans-serif;
  font-weight: 400;
  margin-bottom: 15px;
  color: #333;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  position: relative;
  height: 120px;
}

.schedule-line {
  width: 2px;
  height: 100%;
  background-color:#E3E3E3;
  justify-self: center;
  margin-left: 50px;
}

.schedule-time {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  justify-items: center;
  font-size: 15px;
  font-family: "SF Pro Text", sans-serif;
  font-weight: 400;
  color: #333;
  margin-top: 10px;
}

.time-label {
  text-align: center;
}
</style>
