<template>
  <header class="header">
    <div class="logo" @click="handleMain">LOGO</div>
    <div class="address-wrapper">
      <div class="address-selector">
        <button class="dropdown-btn" @click="toggleDropdown">
          {{ selectedAddress }}
          <img class="dropdown-btn arrow-icon" src="../assets/icons/arrow-adress.svg" alt="▼">
        </button>
        <ul v-if="dropdownVisible" class="dropdown-list">
          <li
              v-for="(address, index) in addresses"
              :key="index"
              @click="selectAddress(address)"
              class="dropdown-item"
          >
            {{ address }}
          </li>
        </ul>
      </div>
    </div>
    <div class="controls">

      <!-- Если пользователь авторизован -->
      <template v-if="isAuthorized">
        <button class="icon-btn" @click="handleMain">
          <img class="icon" src="@/assets/icons/search2.svg" alt="Поиск">
        </button>
        <button class="icon-btn">
          <img class="icon" src="@/assets/icons/mail.svg" alt="Сообщения">
        </button>
        <button class="my-bookings-btn" @click="handleProfile">Мои записи</button>
        <img
            :src="user.profilePicture[0] || stubPhoto"
            alt="Аватар пользователя"
            class="user-avatar"
            @click="handleProfile"
        >
      </template>

      <!-- Если пользователь не авторизован -->
      <template v-else>
        <button class="master-btn">Я-мастер</button>
        <button class="login-btn" @click="login">Войти</button>
      </template>

    </div>
  </header>
</template>

<script>
import { getUser } from "@/service/userDataService";
import stubPhoto from '@/assets/stub.svg';

export default {
  props: {
    userId: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      selectedAddress: 'Варшавское шоссе 141к9',
      addresses: [
        'Варшавское шоссе 141к9'
      ],
      dropdownVisible: false,
      isAuthorized: false,
      user: {
        profilePicture: []
      },
      stubPhoto
    };
  },
  async created() {
    this.isAuthorized = localStorage.getItem("auth") === "true";
    if (this.isAuthorized) {
      try {
        this.user = await getUser(this.userId);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    selectAddress(address) {
      this.selectedAddress = address;
      this.dropdownVisible = false;
    },
    login() {
      this.$router.push('/ch/login');
    },
    handleProfile() {
      this.$router.push('/ch/appointments');
    },
    handleMain(){
      this.$router.push('/ch/');
    },
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px;


  background-color: #ffffff;
  border-bottom: 2px solid rgba(230, 230, 230, 0.5);

  margin-right: 55px;
  margin-left: 60px;
}

.logo {
  font-family: 'SF Pro Text', sans-serif;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}

.address-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.controls {
  display: flex;
  align-items: center;
}

.address-selector {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.arrow-icon {
  margin-left: 10px;
  width: 16px;
  height: 16px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.master-btn {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.login-btn {
  padding: 10px 20px;
  background-color: #4a3fb0;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.icon-btn {
  background-color: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
}


.my-bookings-btn {
  padding: 15px;
  background-color: #4848A0;
  color: #ffffff;
  border: none;
  border-radius: 15px;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: normal;
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

</style>
