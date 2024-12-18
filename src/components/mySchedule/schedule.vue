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
      this.selectedDate = this.formatDateToYYYYMMDD(this.selectedDate);
      if (localStorage.getItem("userID") === "0"){
        if (["2024-12-18","2024-12-19","2024-12-22","2024-12-23"].includes(this.selectedDate)) {
        this.scheduleItems = [
          {
            "uslugaName": "услуга 1",
            "startTime": "2024-12-23T10:37:00",
            "endTime": "2024-12-23T09:07:00.000Z"
          },
          {
            "uslugaName": "услуга 2",
            "startTime": "2024-12-23T12:38:00",
            "endTime": "2024-12-23T11:08:00.000Z"
          }
        ];}
        else this.scheduleItems = []
      } else {
        this.scheduleItems = await getScheduleItemsForDay(this.userID, this.selectedDate);
      }
    },
    async onDateSelected(date) {
      this.selectedDate = this.formatDateToYYYYMMDD(date);
      await this.fetchScheduleItems();
    },
    formatDateToYYYYMMDD(date) {
      const d = new Date(date);

      // Проверка корректности даты
      if (isNaN(d.getTime())) {
        console.error("Некорректный формат даты:", date);
        return null;
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяцы с 0 по 11
      const day = String(d.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
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