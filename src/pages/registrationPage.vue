<template>
  <div class="registration_page">
    <div class="container">
      <section class="form-container">
        <h1 class="heading">Регистрация</h1>

        <!-- Вывод сообщения об ошибке -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <form @submit.prevent="handleSubmit">

          <!-- Выбор роли пользователя при регистрации -->
          <fieldset>
            <legend>Тип регистрации:</legend>
            <label>
              <input type="radio" name="registration_type" value="user" v-model="user.role" required> Пользователь
            </label>
            <label>
              <input type="radio" name="registration_type" value="master" v-model="user.role" required> Мастер
            </label>
          </fieldset>

          <label for="name" class="visually-hidden">Ваше имя</label>
          <input
              type="text"
              id="name"
              v-model="user.name"
              @input="clearErrorMessage"
              name="name"
              class="input name"
              placeholder="Имя"
              required
          />

          <label for="tel" class="visually-hidden">Номер телефона</label>
          <input
              type="tel"
              id="tel"
              v-model="user.tel"
              @input="clearErrorMessage"
              name="tel"
              class="input tel"
              placeholder="Номер телефона"
              required
          />

          <label for="email" class="visually-hidden">Почта</label>
          <input
              type="email"
              id="email"
              v-model="user.email"
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
              v-model="user.password"
              @input="clearErrorMessage"
              name="password"
              class="input password"
              placeholder="Пароль"
              required
          />
          <button type="submit" class="button login-button">Зарегистрироваться</button>
        </form>
        <p class="register-label">
          <span class="grey-text">У вас уже есть аккаунт?</span>
          <router-link to="/login" class="black-text"> Войдите</router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';
import { registerUser } from '@/service/authService.js';
import {isTokenExpired} from "@/service/checkToken.js";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      user : {
        name: "",
        email: "",
        tel: "",
        role: "",
        password: "",
      },
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
      localStorage.removeItem('userID');
    }
  },
  methods: {
    async handleSubmit() {
      console.log(this.user);

      const result = await registerUser(this.user);

      if (result.success) {
        this.$router.push('/');
      } else {
        this.errorMessage = result.message;
      }
    },
    clearErrorMessage() {
      this.errorMessage = "";
    }
  },
});
</script>

<style scoped>


fieldset {
  border: none;
  margin: 20px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}


legend {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
}



.registration_page{
  background: #F9CFD3;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  font-family: 'SF Pro Text', sans-serif;

  padding: 50px;
}

.container {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
