<template>
  <div class="filters-toolbar">
    <div class="filters-wrapper">
      <button class="filter-button" @click="toggleFilterDropdown">фильтры</button>
      <div v-if="filterDropdownVisible" class="filter-dropdown">
        <label v-for="(filter, index) in filterOptions" :key="index" class="filter-option">
          <input type="checkbox" v-model="filter.selected" />
          {{ filter.label }}
        </label>
      </div>
      <button class="search-button" @click="$emit('toggleSearchInput')">
        <img src="../../assets/icons/search.svg" alt="Поиск" class="search-icon" />
      </button>
    </div>
    <div v-if="searchInputVisible" class="search-input-container">
      <input type="text" v-model="searchQuery" placeholder="Введите название услуги" class="search-input" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filterOptions: {
      type: Array,
      required: true
    },
    filterDropdownVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleFilterDropdown() {
      this.$emit('toggleFilterDropdown');
    }
  }
};
</script>

<style scoped>
.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  margin-right: 60px;
  justify-content: flex-end;
}

.filter-button,
.search-button {
  font-family: 'SF Pro Text', sans-serif;
  font-size: 18px;
  font-weight: normal;

  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  height: 55px;

}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 55px;
  height: 55px;
  border-radius: 60px;
}


.filter-dropdown {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-option {
  display: block;
  margin-bottom: 5px;
}
</style>
