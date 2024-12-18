<template>
  <div class="schedule">
    <h1 class="tittle">Мои записи</h1>
    <calendar-slider class="calendar"
                     :selected-date="selectedDate"
                     :today="today"
                     @date-selected="onDateSelected"
    />
    <calendar-timeline class="timeline" :schedule-items="scheduleItems" />
  </div>
</template>

<script>
import CalendarSlider from "@/components/mySchedule/calendar-slider.vue";
import CalendarTimeline from "@/components/mySchedule/calendar-timeline.vue";
import { getScheduleItemsForDay } from "@/service/scheduleService";
export default {
  components: {
    CalendarSlider,
    CalendarTimeline
  },
  data(){
    return{
      today: new Date(),
      selectedDate: new Date(),
      scheduleItems: [],
      userID: null
    }
  },
  async created() {
    this.userID = localStorage.getItem("userID");
    await this.fetchScheduleItems();
  },
  methods: {
    async fetchScheduleItems() {
      this.scheduleItems = await getScheduleItemsForDay(this.userID, this.selectedDate);
    },
    async onDateSelected(date) {
      this.selectedDate = date;
      await this.fetchScheduleItems();
    }
  }

}
</script>

<style scoped>

.tittle{
  margin-top: 0;
  margin-bottom: 50px;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 600;
}

.calendar{
  margin-bottom: 60px;
}

</style>