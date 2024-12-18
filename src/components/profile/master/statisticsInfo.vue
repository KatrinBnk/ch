<template>
  <div class="statistics-container">
    <h2 class="title">Статистика</h2>
    <div class="chart">
      <!-- Ось Y с метками -->
      <div class="y-axis">
        <div
            v-for="(tick, index) in yTicks"
            :key="index"
            class="y-tick"
            :style="{ top: `calc(${100 - (index / (yTicks.length - 1)) * 100}% - 6px)` }"
        >
          {{ tick }}
        </div>
      </div>

      <!-- Горизонтальные линии -->
      <div class="horizontal-lines">
        <div v-for="tick in yTicks" :key="'line-' + tick" class="line"></div>
      </div>

      <!-- Столбики -->
      <div class="bars-container">
        <div v-for="(value, index) in data" :key="index" class="bar-wrapper">
          <div class="bar" :style="{ height: value * 6.66 + 'px' }"></div>
        </div>
      </div>

      <!-- Подписи месяцев -->
      <div class="bar-months">
        <div v-for="(month, index) in months" :key="index" class="month-wrapper">
          <span class="month-label">{{ month }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//TODO: все значения статика.
export default {
  name: "StatisticsInfo",
  data() {
    return {
      data: [20, 25, 30, 10, 28, 22],
      months: ["янв", "фев", "мар", "апр", "май", "июн"],
      yTicks: [0, 5, 10, 15, 20, 25, 30], // Значения для оси Y
    };
  },
};
</script>

<style scoped>
.statistics-container {
  background-color: #ffffff;
  border-radius: 30px;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "SF Pro Text", sans-serif;
}

.title {
  text-align: center;
  margin: 0 0 30px;
  font-size: 20px;
  color: black;
  font-weight: 400;
}

.chart {
  position: relative;
  width: 100%;
  height: 200px;
}

.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
}

.y-tick {
  position: absolute;
  left: 10px;
  font-size: 15px;
  font-weight: 400;
  color: black;
  transform: translateY(-70%);
}

.horizontal-lines {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.line {
  width: 100%;
  height: 2px;
  background-color: #E3E3E3;
}

.bars-container {
  position: absolute;
  left: 40px;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  box-sizing: border-box;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.bar {
  width: 30px;
  background-color: #4848A0;
  border-radius: 8px 8px 0 0;
  transition: 0.3s;
}

.bar-months {
  position: absolute;
  left: 40px;
  right: 0;
  bottom: -20px;
  display: flex;
  justify-content: space-around;

}

.month-wrapper {
  text-align: center;

}

.month-label {
  font-size: 15px;
  font-weight: 400;
  color: black;
  margin-bottom: 20px;
}
</style>
