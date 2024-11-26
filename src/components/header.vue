<template>
  <header class="header">
    <!-- Логотип -->
    <div class="logo" @click="navigateToMain">LOGO</div>

    <!-- Селектор адреса -->
    <div class="address-wrapper">
      <div class="address-selector">
        <div class="dropdown-btn">
          <input
              type="text"
              class="address-input"
              v-model="searchQuery"
              @input="handleInput"
              @blur="handleBlur"
              @keyup.enter="selectAddress"
              placeholder="Введите адрес..."
              @focus="dropdownVisible = true"
              ref="addressInput"
          />
          <span class="arrow" @click="toggleDropdown">
            <img class="arrow-icon" src="../assets/icons/arrow-address.svg" alt="▼" />
          </span>
        </div>

        <ul v-if="dropdownVisible && filteredAddresses.length" class="dropdown-list" @mousedown.prevent>
          <li
              v-for="(address, index) in filteredAddresses"
              :key="index"
              @mousedown="selectAddressFromList(address)"
              class="dropdown-item"
          >
            {{ address }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="controls">
      <template v-if="isAuthorized">
        <button class="icon-btn" @click="navigateToSearch">
          <img class="icon" src="@/assets/icons/search2.svg" alt="Поиск" />
        </button>
        <button class="icon-btn" @click="navigateToMessages">
          <img class="icon" src="@/assets/icons/mail.svg" alt="Сообщения" />
        </button>
        <button class="my-bookings-btn" @click="navigateToProfile">Мои записи</button>
        <img
            :src="userPhoto || stubPhoto"
            alt="Аватар пользователя"
            class="user-avatar"
            @click="navigateToProfile"
        />
      </template>
      <template v-else>
        <button class="master-btn" @click="navigateToMaster">Я-мастер</button>
        <button class="login-btn" @click="login">Войти</button>
      </template>
    </div>

  </header>
</template>

<script>
import { getAllUslugar } from "@/service/uslugasService.js";
import { getUserPhoto } from "@/service/userDataService.js"
import {isTokenExpired} from "@/service/checkToken.js";

export default {
  data() {
    return {
      selectedAddress: '',
      addresses: [],
      searchQuery: '',
      inputVisible: false,
      dropdownVisible: false,
      isAuthorized: false,
      user: {
        profilePicture: [],
      },
      userPhoto: null,
      stubPhoto: '@/assets/content-img.svg',
    };
  },
  computed: {
    filteredAddresses() {
      const matchingAddresses = this.addresses.filter((address) =>
          address.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return ["Адрес не выбран", "Москва", "Какой-то очень очень очень длинный адрес", ...matchingAddresses];
    },
  },
  async created() {
    this.isAuthorized = !isTokenExpired(localStorage.getItem('token'));

    if (this.isAuthorized) {
      const userId = localStorage.getItem("userID");
      if (userId) {
        try {
          const profileImage = await getUserPhoto(userId);

          if (profileImage) {
            this.userPhoto = profileImage;
          } else {
            this.userPhoto = this.stubPhoto;
          }
        } catch (error) {
          console.error("Ошибка при загрузке фотографии профиля:", error);
          this.userPhoto = this.stubPhoto;
        }
      }
    }

    await this.fetchAddresses();
    this.syncSelectedAddress();
  },
  methods: {
    async fetchAddresses() {
      try {
        const uslugas = await getAllUslugar();
        const uniqueAddresses = [
          ...new Set(uslugas.map((usluga) => usluga.location)),
        ].sort();
        this.addresses = uniqueAddresses;
      } catch (error) {
        console.error("Ошибка загрузки адресов:", error);
      }
    },
    syncSelectedAddress() {
      const location = this.$route.query.location;
      if (location) {
        this.selectedAddress = location;
        this.searchQuery = location;
      }
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleInput() {
      this.dropdownVisible = this.filteredAddresses.length > 0;
    },
    handleBlur() {
      setTimeout(() => {
        this.dropdownVisible = false;
      }, 200);
    },
    selectAddress() {
      const foundAddress = this.filteredAddresses.find((address) =>
          address.toLowerCase() === this.searchQuery.toLowerCase()
      );
      if (foundAddress) {
        this.changeLocation(foundAddress);
      } else {
        alert("Выберите адрес из списка.");
      }
      this.dropdownVisible = false;
    },
    selectAddressFromList(address) {
      this.searchQuery = address;
      this.changeLocation(address);
    },
    changeLocation(address) {
      this.selectedAddress = address === 'Адрес не выбран' ? '' : address;
      this.searchQuery = address === 'Адрес не выбран' ? '' : address;
      this.inputVisible = false;
      this.dropdownVisible = false;
      const query = address === "Адрес не выбран" ? {location: null} : {location: address};
      this.$router.push({path: "/", query});
    },
    navigateToMain() {
      this.$router.push('/');
    },
    navigateToSearch() {
      this.$router.push('/').then(() => {
        const targetElement = document.getElementById('search-id');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });    },
    navigateToMessages() {
      this.$router.push('/');
    },
    navigateToProfile() {
      this.$router.push('/profile');
    },
    navigateToMaster() {
      this.$router.push('/login');
    },
    login() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 2px solid rgba(230, 230, 230, 0.5);
  margin-right: 60px;
  margin-left: 60px;
  margin-top: 15px;

  padding-bottom: 15px;
}

.logo {
  font-family: 'SF Pro Text', sans-serif;
  font-size: 25px;
  font-weight: normal;
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

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: auto;
  min-width: 100%;
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  z-index: 1000;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 15px;
  font-weight: normal;
}

.dropdown-btn {
  padding: 10px 20px;
  position: relative;
  box-sizing: border-box;
}

.arrow-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 30px;
}

.address-selector {
  position: relative;
}

.address-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  outline: none;
  background: none;
  color: inherit;
  cursor: text;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 40px 17px 20px;
  border-radius: 10px;
  width: 370px;
  box-sizing: border-box;
  height: 60px;
  background: #F7F7F7;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: normal;
}

.dropdown-list.show {
  display: block;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 15px;
  font-weight: normal;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.master-btn {
  padding: 17px 22px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: normal;

  margin-right: 20px;
}

.login-btn {
  padding: 17px 26px;
  background-color: #4a3fb0;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: normal;
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
  cursor: pointer;
  margin-right: 15px;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: normal;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
</style>
