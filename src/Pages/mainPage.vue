<template>
  <Header/>
  <div class="image-container">
    <img class="content-img" src="@/assets/content-img.svg" alt="">
  </div>
  <div class="highlights">
    <highlight v-for="(highlight, index) in highlights" :key="index" :text="highlight.text" :image="highlight.image" />
  </div>
  <div class="categories-container">
    <h1 class="categories-title">Категории</h1>
    <div class="categories-list">
      <category v-for="(category, index) in categories" :key="index" :text="category.text" :image="category.image" />
    </div>
  </div>
  <div class="search-container">
    <search/>
  </div>
</template>

<script>
import Header from '../components/header.vue'
import Search from "@/components/mainPage/search.vue"
import highlight from "@/components/mainPage/highlight.vue";
import category from "@/components/mainPage/category.vue";
import { getHighlights, getCategories } from '@/service/mainDataService.js';

export default {
  components:{
    Header,
    Search,
    highlight,
    category
  },
  data() {
    return {
      highlights: getHighlights(),
      categories: getCategories()
    }
  }
}
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  margin: 30px auto 0 auto;
  max-width: calc(100% - 120px);
}

.content-img {
  width: 100%;
  height: auto;
  max-width: 100%;
}

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