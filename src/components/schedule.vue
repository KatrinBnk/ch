<template>
  <div class="schedule">
    <h1 class="tittle">Расписание</h1>
    <calendar-slider class="calendar" :selected-date="selectedDate" :today="today" @date-selected="onDateSelected"/>
    <calendar-timeline class="timeline" :schedule-items="scheduleItems" />
  </div>
</template>

<script>
import CalendarSlider from "@/components/calendar-slider.vue";
import CalendarTimeline from "@/components/calendar-timeline.vue";
import { getScheduleItemsForDay } from "@/service/scheduleService";
export default {
  components: {
    CalendarSlider,
    CalendarTimeline
  },
  props:{
    userID :{
      type: Number,
      required: true
    }
  },
  data(){
    return{
      today: this.formatDateToISO(new Date()),
      selectedDate: this.formatDateToISO(new Date()),
      scheduleItems: []
    }
  },
  async created() {
    await this.fetchScheduleItems();
  },
  methods: {
    formatDateToISO(date) {
      return date.toISOString().split("T")[0];
    },
    async fetchScheduleItems() {
      this.scheduleItems = await getScheduleItemsForDay(this.userId, this.selectedDate);
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
}

.calendar{
  margin-bottom: 50px;
}

</style>