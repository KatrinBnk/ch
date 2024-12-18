<template>
  <div class="profile-page">
    <h1 class="title-portfolio"> Портфолио мастера </h1>

    <!-- Кнопка для добавления нового портфолио, если есть доступ и портфолио еще нет -->
    <button v-if="hasAccess && !portfolioItem" class="create-portfolio-button" @click="openModal">
      Создать портфолио
    </button>

    <div v-else class="portfolio-item">
      <div v-if="portfolioItem">
        <!-- Опыт мастера -->
        <p><strong>Опыт:</strong> {{ portfolioItem.experience }}</p>

        <!-- Описание портфолио -->
        <p><strong>Описание:</strong> {{ portfolioItem.description }}</p>

        <!-- Фотографии -->
        <div class="portfolio-photos">
          <img v-for="(photo, index) in portfolioItem.photos" :key="index" :src="getImageUrl(photo)" alt="Portfolio Image" />
        </div>
      </div>
    </div>

    <!-- Модальное окно для создания портфолио -->
    <CreatePortfolioModal
        v-if="isModalVisible"
        :userId="userId"
        :isVisible="isModalVisible"
        @close="closeModal"
        @portfolioCreated="handlePortfolioCreated"
    />

    <button v-if="this.portfolioItem != null" class="create-portfolio-button" @click="handlePortfolioDeleted">
      Удалить портфолио
    </button>

  </div>
</template>

<script>
import {getPortfolioByMasterId, deletePortfolio} from '@/service/portfolioService';
import CreatePortfolioModal from '@/components/profile/master/portfolio/CreatePortfolioModal.vue';

export default {
  components: {
    CreatePortfolioModal
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    hasAccess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      portfolioItem: null,
      isModalVisible: false
    };
  },
  async created() {
    await this.fetchPortfolio();
  },
  methods: {
    async handlePortfolioDeleted() {

      const portfolioID = this.portfolioItem.id;
      try{
        await deletePortfolio(portfolioID);
        this.portfolioItem = null;
        console.log("Портфолио удалено");
      } catch (error){
        console.error(error);
      }
    },
    handlePortfolioUpdated(updatedPortfolio) {
      this.portfolioItem = updatedPortfolio;
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    handlePortfolioCreated() {
      this.fetchPortfolio();
    },
    async fetchPortfolio() {
      try {
        this.portfolioItem = await getPortfolioByMasterId(this.userId);
      } catch (error) {
        this.portfolioItem = null;
        console.error('Ошибка при получении портфолио:', error);
      }
    },
    getImageUrl(photoBytes) {
      const blob = new Blob([new Uint8Array(photoBytes)], { type: 'image/png' });
      return URL.createObjectURL(blob);
    }

  }
};
</script>

<style scoped>
.create-portfolio-button {
  background-color: #4848a0;
  color: white;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.create-portfolio-button:hover {
  background-color: #37378f;
}

.portfolio-photos {
  display: flex;
  flex-wrap: wrap;
}

.portfolio-photos img {
  max-width: 200px;
  margin: 10px;
  border-radius: 5px;
}
</style>
