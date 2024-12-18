<template>
  <div class="login_page">
  <div class="container">
    <section class="form-container">
      <h1 class="heading">Войти</h1>

      <!-- Вывод сообщения об ошибке -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <form @submit.prevent="handleSubmit">
        <label for="email" class="visually-hidden">Почта</label>
        <input
            type="email"
            id="email"
            v-model="email"
            @input="clearErrorMessage"
            name="email"
            class="input email"
            placeholder="Почта"
            required
        />

        <label for="password" class="visually-hidden">Пароль</label>
        <input
            type="password"
            id="password"
            v-model="password"
            @input="clearErrorMessage"
            name="password"
            class="input password"
            placeholder="Пароль"
            required
        />
       <a href="#" class="forgot-password">Забыли пароль?</a>
        <button type="submit" class="button login-button">Войти</button>
      </form>

      <div class="divider">
        <span class="divider-text">или</span>
      </div>

      <div class="social-buttons">
        <button
            class="button social-button vk-button"
            @click="socialLogin('vk')"
            aria-label="Войти через ВКонтакте"
        >
          <img class="social-icon vk-icon" src="@/assets/icons/vk-icon.svg" alt="ВКонтакте" />
          ВКонтакте
        </button>
        <button
            class="button social-button apple-button"
            @click="socialLogin('apple')"
            aria-label="Войти через Apple ID"
        >
          <img class="social-icon apple-icon" src="@/assets/icons/apple-icon.svg" alt="Apple ID" />
          Apple ID
        </button>
        <button
            class="button social-button google-button"
            @click="socialLogin('google')"
            aria-label="Войти через Google"
        >
          <img class="social-icon google-icon" src="@/assets/icons/google-icon.svg" alt="Google" />
          Google
        </button>
      </div>
      <p class="register-label">
        <span class="grey-text">У вас нет аккаунта?</span>
        <router-link to="/registration" class="black-text"> Зарегистрируйтесь</router-link>
      </p>
    </section>
  </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';
import { loginUser } from '@/service/authService.js';
import {isTokenExpired} from "@/service/checkToken.js";

export default defineComponent({
  name: "RegistrationPage",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
    if (!isTokenExpired(localStorage.getItem('token'))) {
      this.$router.push('/');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthorized');
      localStorage.removeItem('userID');
    }
  },
  methods: {
    async handleSubmit() {
      const result = await loginUser(this.email, this.password);

      if (result.success) {
        localStorage.setItem("isAuthorized", "true");
        localStorage.setItem("userID", result.userId);
        this.$router.push('/');
      } else {
        this.errorMessage = result.message;
      }
    },
    socialLogin(platform) {
      console.log(`Вход через ${platform}`);
    },
    clearErrorMessage() {
      this.errorMessage = "";
    }
  },
});
</script>

<style scoped>

.login_page{
  background: #F9CFD3;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  font-family: 'SF Pro Text', sans-serif;
}

.container {
  width: 100%;
  max-width: 491px;
  background: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: auto;
}

.heading {
  text-align: center;
  font-size: 40px;
  color: black;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 0;
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: normal;
}

.input {
  width: 100%;
  height: 60px;
  margin-top: 10px;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  font-size: 16px;
}


.forgot-password {
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: black;
  margin-top: 15px;
  display: block;
  text-decoration: none;
  cursor: pointer;
}

.button {
  width: 100%;
  height: 50px;
  margin-top: 35px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  border: none;
}

.login-button {
  background: #4848a0;
  color: white;
  font-size: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 10px;
}

.divider-text {
  font-weight: bold;
  color: black;
}


.social-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.social-button {
  flex: 1;
  height: 40px;
  border: 1px solid #d9d9d9;
  margin: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: black;
  background: white;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}



.register-label {
  text-align: center;
  font-size: 12px;
  margin-top: 40px;
}

.grey-text {
  color: #959595;
}

.black-text {
  color: black;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
