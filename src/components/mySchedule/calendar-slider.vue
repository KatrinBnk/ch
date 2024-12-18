<template>
  <div class="slider-wrapper">
    <div class="slider-container">
      <button @click="scrollLeft" class="slider-btn">&#8249;</button>
      <ul class="slider" ref="slider">
        <li
            v-for="(date, index) in dates"
            :key="index"
            :class="['slider-item', {
              active: this.selectedDate === this.formatDateToISO(date),
              highlighted: this.isHighlightedDate(date)
            }]"
            @click="selectDate(date)"
        >
          <div class="day-item">
            <span class="day">{{ date.getDate() }}</span>
          </div>
        </li>
      </ul>
      <button @click="scrollRight" class="slider-btn">&#8250;</button>
    </div>
  </div>
</template>

<script>
import {getHighlightedDatesForCurrentMonth, getUniqueDatesWithApplications} from '@/service/scheduleService.js';

export default {
  props: {
    today: {
      type: Date,
      required: true
    },
    selectedDate: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      currentMonth: new Date().getMonth() + 1,
      dates: this.generateDates(),
      highlightedDates: []
    };
  },
  async mounted() {
    try {
      this.highlightedDates = await getUniqueDatesWithApplications();
    } catch (error) {
      console.error("Ошибка при получении дат с записями:", error);
    }
  },
  async created() {
    try {
      // Получаем записи для текущего месяца
      const applications = await getHighlightedDatesForCurrentMonth(localStorage.getItem("userID"));

      // Извлекаем уникальные даты для текущего месяца (например, формируем список всех дней с записями)
      this.highlightedDates = await getUniqueDatesWithApplications();

      console.log(this.highlightedDates); // Печатаем уникальные даты
    } catch (error) {
      console.error("Ошибка при получении расписания за месяц:", error);
    }
    if (localStorage.getItem("userID") === "0"){
      this.highlightedDates = [
        "2024-12-18",
        "2024-12-19",
        "2024-12-22",
        "2024-12-23"
      ]
    }
  },

  methods: {
    generateDates() {
      const dates = [];
      const currentDate = new Date();
      for (let i = -6; i <= 6; i++) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + i);
        dates.push(newDate);
      }
      return dates;
    },
    selectDate(date) {
      const formattedDate = this.formatDateToISO(date);
      this.$emit("date-selected", formattedDate);
    },
    scrollLeft() {
      const firstDate = new Date(this.dates[0]);
      firstDate.setDate(firstDate.getDate() - 1);
      this.dates.unshift(firstDate);
      this.dates.pop();
    },
    scrollRight() {
      const lastDate = new Date(this.dates[this.dates.length - 1]);
      lastDate.setDate(lastDate.getDate() + 1);
      this.dates.push(lastDate);
      this.dates.shift();
    },
    formatDateToISO(date) {
      return date.toISOString().split('T')[0];
    },
    isHighlightedDate(date) {
      const formattedDate = this.formatDateToISO(date);
      return this.highlightedDates.includes(formattedDate);
    }
  },
};
</script>

<style scoped>
.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.slider-container {
  display: flex;
  align-items: center;
  user-select: none;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
  position: relative;
}

.slider-container::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #E6E6E6;
  bottom: -15px;
  left: 0;
}

.slider-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 20px;
}

.slider {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.slider-item {
  margin: 0 8px;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #333;
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.slider-item .day {
  font-size: 16px;
  font-weight: normal;
}

.slider-item.highlighted {
  background-color: #F9CFD3;
}

.slider-item.active {
  background-color: #4848A0;
  color: white;
}

.slider-item.active::after {
  content: "";
  position: absolute;
  width: 50px;
  height: 2px;
  background-color: #4848A0;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
</style>
