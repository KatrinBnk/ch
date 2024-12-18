<template>
  <Header/>

  <main class="main-page-container">

    <!-- Постер с картинкой (и текстом, если пользователь вошел в систему)-->
    <Poster :is-authenticated="isAuthenticated" />

    <!-- Хайлайты, стоит заглушка для макета -->
    <div class="highlights">
      <Highlight v-for="(highlight, index) in highlights" :key="index" :text="highlight.text" :image="highlight.image" />
    </div>

    <!-- Категории -->
    <div class="categories-container">
      <h1 class="categories-title">Категории</h1>
      <div class="categories-list">
        <Category v-for="(category, index) in categories.slice(0, 4)" :key="index" :text="category"  image=""/>
      </div>
    </div>

  </main>

  <div class="search-container">
    <search />
  </div>
</template>

<script>
import Header from '../components/header.vue';
import Poster from '@/components/mainPage/poster.vue';
import Search from "@/components/mainPage/search/search.vue";
import Highlight from "@/components/mainPage/highlight.vue";
import Category from "@/components/mainPage/category.vue";
import { getHighlights } from "@/service/stubDataService.js";
import { fetchCategories } from "@/service/categoryService.js";  

export default {
  components: {
    Header,
    Poster,
    Search,
    Highlight,
    Category
  },
  data() {
    return {
      highlights: getHighlights(),
      categories: [],  
      isAuthenticated: true
    };
  },
  async mounted() {
    try {
      this.categories = await fetchCategories(); 
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      this.categories = ["Категория 5","Категория 4","Категория 3","Категория 2" ]
    }
  }
};
</script>

<style scoped>

.highlights {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.categories-title {
  text-align: left;
  margin-left: 60px;
  margin-bottom: 40px;
  color: black;
  font-size: 40px;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 600;
  line-height: 25px;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-left: 60px;
  padding-right: 60px;
}
</style>
