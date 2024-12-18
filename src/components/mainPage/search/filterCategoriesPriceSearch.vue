<template>
  <div class="filters-toolbar" @click.self="hideSearchInput">
    <div class="filters-wrapper">
      <!-- Кнопка открытия фильтров -->
      <button class="filter-button" @click.stop="toggleFilterDropdown">фильтры</button>

      <!-- Выпадающее меню фильтров -->
      <div v-if="filterDropdownVisible" class="filter-dropdown" @click.stop>
        <label v-for="(filter, index) in filterOptions" :key="index" class="filter-option">
          <input
              type="checkbox"
              :checked="filter.selected"
              @change="toggleFilter(index)"
          />
          {{ filter.label }}
        </label>
        <button class="apply-button" @click="applyFilters">Применить</button>
        <button class="reset-button" @click="resetFilters">Сбросить</button>
      </div>

      <!-- Кнопка поиска  -->
      <button class="search-button" @click.stop="toggleSearchInput">
        <img src="../../../assets/icons/search.svg" alt="Поиск" class="search-icon" />
      </button>

      <!-- Поле ввода для поиска -->
      <input
          v-if="searchInputVisible"
          type="text"
          :value="localSearchQuery"
          @input="onSearchInput"
          placeholder="Введите название услуги"
          class="search-input"
          ref="searchInput"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filterOptions: {
      type: Array,
      required: true,
    },
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      filterDropdownVisible: false,
      searchInputVisible: false,
      localSearchQuery: this.searchQuery,
    };
  },
  methods: {
    updateUrlWithFilters() {
      const currentQuery = { ...this.$route.query };
      const selectedFilters = this.filterOptions
          .filter(filter => filter.selected)
          .map(filter => filter.label);

      const updatedQuery = {
        ...currentQuery,  // сохраняем все текущие параметры
        filters: selectedFilters.length ? selectedFilters.join(',') : undefined, // обновляем фильтры
      };

      Object.keys(updatedQuery).forEach(key => updatedQuery[key] === undefined && delete updatedQuery[key]);

      this.$router.push({ path: this.$route.path, query: updatedQuery });
    },
    toggleFilterDropdown() {
      this.filterDropdownVisible = !this.filterDropdownVisible;
      if (this.filterDropdownVisible) {
        document.addEventListener('click', this.hideFilterDropdown);
      } else {
        document.removeEventListener('click', this.hideFilterDropdown);
      }
    },
    hideFilterDropdown(event) {
      if (!this.$el.contains(event.target)) {
        this.filterDropdownVisible = false;
        document.removeEventListener('click', this.hideFilterDropdown);
      }
    },
    toggleSearchInput() {
      this.searchInputVisible = !this.searchInputVisible;
      if (this.searchInputVisible) {
        this.$nextTick(() => this.$refs.searchInput && this.$refs.searchInput.focus());
      }
    },
    hideSearchInput() {
      this.searchInputVisible = false;
    },
    toggleFilter(index) {
      this.$emit('toggleFilter', index);
    },
    applyFilters() {
      this.$emit('applyFilters');
      this.updateUrlWithFilters();
      this.filterDropdownVisible = false;
      document.removeEventListener('click', this.hideFilterDropdown);
    },
    resetFilters() {
      this.filterOptions.forEach((filter) => {
        filter.selected = false;
      });
      this.$emit('resetFilters');
      this.updateUrlWithFilters();
      this.filterDropdownVisible = false;
      document.removeEventListener('click', this.hideFilterDropdown);
    },
    onSearchInput(event) {
      const value = event.target.value;
      this.localSearchQuery = value;
      this.$emit('updateSearchQuery', value);
    },
  },
};
</script>

<style scoped>
.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;

  font-family: 'SF Pro Text', sans-serif;
  font-weight: normal;
}

.filter-button {
  font-size: 18px;
  padding: 15px 36px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 60px;
  cursor: pointer;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  z-index: 1000;
}

.filter-option {
  display: block;
  margin-bottom: 5px;
}

.apply-button {
  margin-top: 10px;
  padding: 5px 15px;
  background-color: #4a3fb0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.reset-button {
  margin-top: 10px;
  padding: 5px 15px;
  background-color: #EA3B56;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-icon {
  width: 24px;
  height: 24px;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  width: 250px;
  height: 24px;
  outline: none;
}
</style>