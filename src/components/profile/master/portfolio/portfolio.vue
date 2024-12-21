<template>
  <div class="profile-page">
    <h1 class="title-portfolio"> Портфолио мастера </h1>

    <!-- Кнопка для добавления нового портфолио, если есть доступ и портфолио еще нет -->
    <button v-if="hasAccess && !portfolioItem" class="create-portfolio-button" @click="openModal">
      Создать портфолио
    </button>

    <div v-else class="portfolio-item">
      <div v-if="portfolioItem">
        <!-- Описание портфолио -->
        <p><strong>Описание:</strong> {{ portfolioItem.description }}</p>

        <!-- Фотографии -->
        <div class="portfolio-photos">
          <img v-for="(photo, index) in portfolioItem.photosAsList" :key="index" :src="getImageUrl(photo)" alt="Portfolio Image" />
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

    <button
        v-if="portfolioItem != null"
        class="update-portfolio-button"
        @click="goToUpdatePortfolio">
      Обновить портфолио
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
    console.log(this.portfolioItem);
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
    goToUpdatePortfolio() {
      if (this.portfolioItem && this.portfolioItem.id) {
        this.$router.push(`/my-portfolio/update/${Number(this.portfolioItem.id)}`);
      } else {
        console.error('Portfolio ID отсутствует!');
      }
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
    getImageUrl(base64String) {
      if (typeof base64String === 'string') {
        return `data:image/png;base64,${base64String}`;
      }
      console.error('Invalid data format for image:', base64String);
      return '';
    }
  }
};
</script>

<style scoped>

.profile-page{
  background-color: #ffffff;
  border-radius: 30px;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 7px 0 #0000001F;
  font-family: "SF Pro Text", sans-serif;
}

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
