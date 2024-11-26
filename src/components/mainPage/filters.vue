<template>
  <div class="filters-container">
    <div v-for="(filter, index) in typeServices" :key="index">
      <button
          :class="['filter-btn', { active: filter.active }]"
          @click="selectFilter(index)"
      >
        <img :src="filter.icon" alt="" class="filter-icon" />
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script>
import filterAllIcon from '@/assets/icons/filter-all-icon.svg';
import salonsIcon from '@/assets/icons/salons-icon.svg';
import mastersIcon from '@/assets/icons/masters-icon.svg';
export default {
  data() {
    return {
      typeServices: [
        { label: 'все', icon: filterAllIcon, active: true },
        { label: 'салоны красоты', icon: salonsIcon, active: false },
        { label: 'мастера', icon: mastersIcon, active: false }
      ]
    };
  },
  methods: {
    selectFilter(index) {
      this.typeServices = this.typeServices.map((filter, i) => ({
        ...filter,
        active: i === index
      }));
    }
  }
};
</script>

<style scoped>
.filters-container {
  display: flex;
  margin-bottom: -5px;
  justify-content: center;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 18px;
  font-weight: normal;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 18px;
  font-weight: normal;
  transition: background-color 0.3s, color 0.3s;
  height: 55px;
  width: 100%;
  opacity: 0.5;
}

.filter-btn.active {
  opacity: 1;
  position: relative;
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  width: 40px;
  height: 3px;
  background-color: #4a3fb0;
  border-radius: 30px;
}

</style>
