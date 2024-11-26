<template>
  <div class="search-container" id='search-id'>
    <div class="search-header-container">
      <h1 class="search-title">Поиск</h1>

      <Filters/>

      <!-- Компоненты фильтрации -->
      <filters-toolbar
          :filter-options="filterOptions"
          :searchQuery="searchQuery"
          @toggleFilter="toggleFilter"
          @applyFilters="applyFilters"
          @updateSearchQuery="updateSearchQuery"
      />
    </div>


    <!-- Отображение списка услуг -->
    <div
        class="services-list"
        :class="{ 'single-item': services.length < 3 }"
    >
      <service-component
          v-for="(service, index) in services"
          :key="index"
          :title="service.name"
          :description="service.description"
          :rating="service.rating || 4.5"
          image=""
      />
    </div>
  </div>
</template>

<script>
import FiltersToolbar from "@/components/mainPage/filtersToolbar.vue";
import Filters from "@/components/mainPage/filters.vue";
import ServiceComponent from "@/components/mainPage/service.vue";
import { getFilteredServices } from "@/service/uslugasService.js";

export default {
  components: {
    FiltersToolbar,
    ServiceComponent,
    Filters
  },
  data() {
    return {
      filterOptions: [
        { label: 'Массаж', selected: false },
        { label: 'Маникюр', selected: false },
        { label: 'Депиляция', selected: false },
        { label: 'Наращивание', selected: false },
        { label: 'Ламинирование', selected: false },
      ],
      services: [],
      searchQuery: '',
    };
  },
  methods: {
    async loadServices() {
      const filters = this.filterOptions
          .filter((filter) => filter.selected)
          .map((filter) => filter.label);

      try {
        this.services = await getFilteredServices(filters, this.searchQuery, this.$route.query.location || null);
      } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
      }
    },
    toggleFilter(index) {
      this.filterOptions[index].selected = !this.filterOptions[index].selected;
    },
    applyFilters() {
      this.updateQueryParams();
    },
    updateSearchQuery(query) {
      this.searchQuery = query;
      this.updateQueryParams();
    },
    updateQueryParams() {
      const selectedFilters = this.filterOptions
          .filter((filter) => filter.selected)
          .map((filter) => filter.label);

      const query = {
        ...this.$route.query,
        filters: selectedFilters.length ? selectedFilters.join(',') : undefined,
        search: this.searchQuery || undefined,
      };

      this.$router.push({ query }).then(() => {
        this.loadServices();
      });
    },
    syncFiltersAndSearch() {
      const query = this.$route.query;

      this.searchQuery = query.search || '';

      if (query.filters) {
        const selectedFilters = query.filters.split(',');

        this.filterOptions.forEach((filter) => {
          filter.selected = selectedFilters.includes(filter.label);
        });
      } else {
        this.filterOptions.forEach((filter) => {
          filter.selected = false;
        });
      }
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.syncFiltersAndSearch();
        this.loadServices();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.search-container {
  padding: 20px 60px;
}

.search-header-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  flex-wrap: wrap;

  border-bottom: 2px solid rgba(230, 230, 230, 0.5);
}

.search-title {
  font-size: 40px;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 600;
  margin-bottom: 20px;
}



.services-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 20px;
}

.services-list.single-item {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
}

@media (max-width: 768px) {
  .services-list {
    grid-template-columns: 1fr;
  }
}


</style>
