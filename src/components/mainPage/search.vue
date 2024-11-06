<template>
  <div class="search-container">
    <div class="search-header-container">
      <h1 class="search-title">Поиск</h1>
      <filters-component/>
      <filters-toolbar :filter-options="filterOptions" :filterDropdownVisible="filterDropdownVisible"/>
    </div>
    <hr class="divider-line">
    <div class="services-list">
      <service-component v-for="(service, index) in filteredServices" :key="index" :title="service.title" :description="service.description" :rating="service.rating" />
    </div>
  </div>
</template>

<script>
import FiltersComponent from "@/components/mainPage/filters.vue";
import ServiceComponent from "@/components/mainPage/service.vue";
import FiltersToolbar from "@/components/mainPage/filtersToolbar.vue";

export default {
  components: {
    FiltersComponent,
    FiltersToolbar,
    ServiceComponent
  },
  data() {
    return {
      typeServices: [
        {label: 'все', active: true},
        {label: 'салоны красоты', active: false},
        {label: 'мастера', active: false}
      ],
      filterOptions: [
        {label: 'Опция 1', selected: false},
        {label: 'Опция 2', selected: false},
        {label: 'Опция 3', selected: false}
      ],
      services: [
        {title: 'Название', description: 'описание', rating: 4.5},
        {title: 'Название', description: 'описание', rating: 4.5},
        {title: 'Название', description: 'описание', rating: 4.5}
      ],
      filterDropdownVisible: false,
      searchInputVisible: false,
      searchQuery: ''
    };
  },
  computed: {
    filteredServices() {
      return this.services.filter(service =>
          service.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleFilterDropdown() {
      this.filterDropdownVisible = !this.filterDropdownVisible;
    },
    toggleSearchInput() {
      this.searchInputVisible = !this.searchInputVisible;
    }
  }
};
</script>

<style scoped>
.search-container {
  padding: 20px;
}

.search-header-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.search-title {
  font-size: 40px;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 600;
  margin-bottom: 20px;
  margin-left: 50px;
}


.divider-line {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0 50px 50px;
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>
