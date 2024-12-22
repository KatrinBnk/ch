<template>
  <div class="favorite-block">
    <h1>Избранные услуги</h1>
    <div v-if="favorites.length > 0" class="usluga-container">
      <usluga
          v-for="(service, index) in favorites"
          :key="index"
          :service="service"
          :isFavorite="true"
          @update-favorites="removeFromFavorites"
      />
    </div>
    <p v-else>У вас пока нет избранных услуг.</p>
  </div>
</template>

<script>
import Usluga from "@/components/mainPage/search/usluga.vue";
import {getFavoriteUslugas} from "@/service/favorite.js";

export default {
  name: "MyFavorites",
  components: {
    Usluga,
  },
  data() {
    return {
      favorites: [],
    };
  },
  async created() {
    await this.loadFavorites();
  },
  methods: {
    async loadFavorites() {
      try {
        const userID = localStorage.getItem("userID");
        this.favorites = await getFavoriteUslugas(userID)||[];
      } catch (error) {
        console.error("Ошибка при загрузке избранных услуг:", error);
        this.favorites = [];
      }
    },
    async removeFromFavorites(uslugaID, newState) {
      try {
        if (!newState) {
          this.favorites = this.favorites.filter((service) => service.id !== uslugaID);
        }
      } catch (error) {
        console.error("Ошибка при удалении из избранного:", error);
      }
    },
  },
};
</script>

<style scoped>

.favorite-block{
  background-color: #ffffff;
  border-radius: 30px;
  padding: 30px 60px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 7px 0 #0000001F;
  font-family: "SF Pro Text", sans-serif;
  font-weight: 400;
}
.usluga-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .usluga-container {
    grid-template-columns: 1fr;
  }
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #939393;
}
</style>
