<template>
  <div class="slider-container">
    <button @click="scrollLeft" class="slider-btn">&#8249;</button>
    <ul class="slider" ref="slider">
      <li
          v-for="(date, index) in dates"
          :key="index"
          :class="['slider-item', { active: selectedDate === formatDateToISO(date) }]"
          @click="selectDate(date)"
      >
        <div class="day-item">
          <!--<span v-if="date.getMonth() + 1 !== currentMonth" class="month">{{ date.getMonth() + 1 }}</span>-->
          <span class="day">{{ date.getDate() }}</span>
        </div>
      </li>
    </ul>
    <button @click="scrollRight" class="slider-btn">&#8250;</button>
  </div>
</template>

<script>
export default {
  props: {
    today : {
      type: Date,
      required: true
    },
    selectedDate:{
      type: Date,
      required: true
    },

  },

  data() {
    return {
      currentMonth: new Date().getMonth() + 1,
      dates: this.generateDates(),
    };
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
  },
};
</script>


<style scoped>
.slider-container {
  display: flex;
  align-items: center;
  user-select: none;
  font-family: 'SF Pro Text', sans-serif;
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
  margin: 0 8px; /* Уменьшен отступ */
  width: 50px; /* Размер круга для соответствия макету */
  height: 50px; /* Высота круга */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%; /* Круглая форма */
  cursor: pointer;
  background-color: #f0f0f0; /* Светлый фон для неактивных элементов */
  color: #333; /* Цвет текста для неактивных элементов */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.slider-item .day {
  font-size: 16px; /* Размер текста */
  font-weight: normal;
}

.slider-item.active {
  background-color: #4848A0; /* Глубокий синий для активного элемента */
  color: white; /* Белый цвет текста для активного элемента */
}
</style>



