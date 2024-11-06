import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './Pages/login.vue';
import MainPage from "@/Pages/mainPage.vue";
import ProfilePage from "@/Pages/profilePage.vue";

// Определяем маршруты
const routes = [
    { path: '/ch/', component: MainPage },
    { path: '/ch/login', component: LoginPage },
    {path: '/ch/appointments', component: ProfilePage}
];

// Создаем экземпляр маршрутизатора
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Создаем и монтируем Vue приложение
createApp(App)
    .use(router)
    .mount('#app');
