import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './Pages/login.vue';
import MainPage from "@/Pages/mainPage.vue";
import ProfilePage from "@/Pages/profilePage.vue";

const routes = [
    { path: '/', component: MainPage },
    { path: '/login', component: LoginPage },
    { path: '/profile', component: ProfilePage }
];

const router = createRouter({
    history: createWebHistory('/ch'), //Указан префикс (базовое начало всех адресов) для корректного деплоя в gp
    routes
});

createApp(App)
    .use(router)
    .mount('#app');
