<template>
  <div class="search-container" id='search-id'>
    <div class="search-header-container">
      <h1 class="search-title">Поиск</h1>

      <filters-type-master/>

      <!-- Компоненты фильтрации -->
      <filters-search
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
      <usluga
          v-for="(service, index) in services"
          :key="index"
          :service="service"
          :isFavorite="isFavorite(service.id)"
          @show-login-modal="showLoginModal"
          @show-service-details="showServiceDetails"
          @update-favorites="toggleFavorite"
      />
    </div>

    <!-- Модальное окно с информацией об услуге -->
    <usluga-modal
        v-if="isServiceModalVisible"
        @close="closeServiceModal"
        :selected-service="selectedService"
        :is-service-modal-visible="isServiceModalVisible"
    />

  </div>
</template>

<script>
import FiltersSearch from "@/components/mainPage/search/filterCategoriesPriceSearch.vue";
import FiltersTypeMaster from "@/components/mainPage/search/filterTypeMaster.vue";
import Usluga from "@/components/mainPage/search/usluga.vue";
import UslugaModal from "@/components/mainPage/search/uslugaModal.vue";
import {filter2, filterServices} from "@/service/uslugasService.js";
import { fetchCategories } from "@/service/categoryService.js"
import {userIsAuthenticated} from "@/service/checkToken.js";
import {getFavorites} from "@/service/favorite.js";

export default {
  components: {
    UslugaModal,
    FiltersSearch,
    FiltersTypeMaster,
    Usluga
  },
  data() {
    return {
      filterOptions: [],
      services: [],
      searchQuery: '',
      isServiceModalVisible: false,
      isLoginModalVisible: false,
      selectedService: null,
      selectedSlot: null,
      stubUslugas: [{
        "name": "Услуга 1",
        "description" : "Пример описания услуги."
      }, {
        "name": "Услуга 2",
        "description" : "Пример описания услуги."
      }
      ],
      favoriteUslugas: [],
      isAuthorized: false
    };
  },
  async created(){
    this.isAuthorized = userIsAuthenticated();
    this.favoriteUslugas = await getFavorites(localStorage.getItem("userID"));
  },
  async mounted() {
    await this.loadCategories();
    this.favoriteUslugas = await getFavorites(localStorage.getItem("userID"));
  },
  methods: {
    isFavorite(uslugaID){
      return this.favoriteUslugas.includes(uslugaID);
    },
    async toggleFavorite(uslugaID, newState) {
      if (newState) {
        this.favoriteUslugas.push(uslugaID);
      } else {
        this.favoriteUslugas = this.favoriteUslugas.filter((id) => id !== uslugaID);
      }
    },
    async loadCategories() {
      try {
        const categories = await fetchCategories();
        this.filterOptions = categories.map(category => ({
          label: category,
          selected: false,
        }));
        await this.loadServices();
      } catch (error) {
        const categories = ["Категория 1", "Категория 2", "Категория 3", "Категория 4"]
        this.filterOptions = categories.map(category => ({
          label: category,
          selected: false,
        }));
        console.error('Ошибка при загрузке категорий:', error);
      }
    },
    loadServices: async function () {
      const filters = this.filterOptions
          .filter((filter) => filter.selected)
          .map((filter) => filter.label);

      const location = this.$route.query.location || null;

      try {
        //TODO: изменить на filterServices сейчас стоит ЗАГЛУШКА
        const servicesData = await filterServices({
          selectedCategories: filters,
          searchQuery: this.searchQuery,
          location,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice
        });


        // TODO: заглушка (УБРАТЬ) стоит по просьбе Реналя для примера
        this.services = servicesData.length > 0 ? servicesData : this.stubUslugas;

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
      const currentQuery = { ...this.$route.query };

      const selectedFilters = this.filterOptions
          .filter((filter) => filter.selected)
          .map((filter) => filter.label);

      const updatedQuery = {
        ...currentQuery,
        filters: selectedFilters.length ? selectedFilters.join(',') : undefined,
        search: this.searchQuery || undefined,
      };

      Object.keys(updatedQuery).forEach(key => updatedQuery[key] === undefined && delete updatedQuery[key]);

      this.$router.push({ query: updatedQuery }).then(() => {
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
    showLoginModal() {
      this.isLoginModalVisible = true;
    },
    closeLoginModal() {
      this.isLoginModalVisible = false;
    },
    showServiceDetails(service) {
      this.selectedService = service;
      this.isServiceModalVisible = true;
    },
    closeServiceModal() {
      this.isServiceModalVisible = false;
      this.selectedService = null;
      this.selectedSlot = null;
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