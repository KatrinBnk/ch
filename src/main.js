import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "@/Pages/mainPage.vue";
import LoginPage from "@/pages/loginPage.vue";
import RegistrationPage from "@/pages/registrationPage.vue";
import SchedulePage from "@/pages/schedulePage.vue";
import ProfilePage from "@/pages/profilePage.vue";
import NotFoundPage from "@/pages/notFoundPage.vue";
import UslugasPage from "@/pages/uslugasPage.vue";
import {userIsAuthenticated} from "@/service/checkToken.js";
import PortfolioPage from "@/components/profile/my-portfolioBlock.vue";
import UpdatePortfolio from "@/components/profile/master/portfolio/UpdatePortfolio.vue";
import MyFavoritePage from "@/pages/myFavoritePage.vue";

const routes = [
    { path: '/', component: MainPage },
    { path: '/login', component: LoginPage },
    { path: '/registration', component: RegistrationPage },
    { path: '/schedule', component: SchedulePage },
    { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
    { path: '/my-uslugas', component: UslugasPage, meta: { requiresAuth: true } },
    { path: '/my-portfolio', component: PortfolioPage, meta: { requiresAuth: true } },
    {
        path: '/my-portfolio/update/:portfolioId',
        component: UpdatePortfolio,
        meta: { requiresAuth: true },
        props: true,
    },
    { path: "/my-favorite", component: MyFavoritePage, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: NotFoundPage }
];

const router = createRouter({
    history: createWebHistory('/ch'), // Префикс для корректного деплоя
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !userIsAuthenticated()) {
        next('/login');
    } else {
        next(); // Разрешение перехода
    }
});


createApp(App)
    .use(router)
    .mount('#app');



