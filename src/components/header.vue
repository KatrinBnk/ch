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
        <button class="my-bookings-btn" @click="navigateToSchedule"  @mouseover="handleMouseOverSchedule"
                @mouseleave="handleMouseLeaveSchedule">Мои записи</button>
        <!-- Выпадающий список -->
        <ul v-if="scheduleVisible" class="schedule-dropdown" @mouseleave="handleMouseLeaveSchedule">
          <li v-if="schedule.length === 0" class="schedule-item">
            <img src="@/assets/sub2.svg" alt="Заглушка" class="schedule-placeholder-img" />
            <div class="schedule-item-text">
              <span class="title">Записей нет</span>
            </div>
          </li>
          <li v-for="(item, index) in schedule" :key="index" class="schedule-item">
            <img src="@/assets/sub2.svg" alt="Заглушка" class="schedule-placeholder-img" />
            <div class="schedule-item-text">
              <span class="title">{{ item.uslugaName }}</span>
              <span class="time">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</span>
            </div>
          </li>
        </ul>

        <div class="avatar-wrapper" @click="toggleUserDropdown">
          <img
              :src="userPhoto"
              alt="Аватар пользователя"
              class="user-avatar"
          />
          <ul v-if="userDropdownVisible" class="user-dropdown" @mousedown.prevent>
            <li class="user-dropdown-item" @click.stop="navigateToProfile">Профиль</li>
            <li class="user-dropdown-item" @click.stop="navigateToMessages">Сообщения</li>
            <li class="user-dropdown-item" @click.stop="navigateToReviews">Отзывы</li>
            <li class="user-dropdown-item" @click.stop="navigateToSettings">Настройки</li>
            <li class="user-dropdown-item" @click.stop="logout">Выйти</li>
          </ul>
        </div>
      </template>
      <template v-else>
        <button class="register-btn" @click="navigateToRegister">Зарегистрироваться</button>
        <button class="login-btn" @click="login">Войти</button>
      </template>
    </div>

  </header>
</template>

<script>
import {fetchUslugas} from "@/service/uslugasService.js";
import {getUserPhoto} from "@/service/userDataService.js"
import {isTokenExpired} from "@/service/checkToken.js";
import stubPhoto from "@/assets/content-img.png"
import stub2 from "@/assets/stub.svg"
import {getScheduleItemsForDay} from "@/service/scheduleService.js";

export default {
  components: {
    stub2,
  },
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
      userDropdownVisible: false,
      schedule: [], // Расписание на сегодня
      scheduleVisible: false, // Показывает, виден ли список расписания
    };
  },
  computed: {
    filteredAddresses() {
      const matchingAddresses = this.addresses.filter((address) =>
          address.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return ["Адрес не выбран",  ...matchingAddresses];
    },
  },
  async created() {
    this.isAuthorized = !isTokenExpired(localStorage.getItem('token'));

    if (localStorage.getItem('userID') === '0') {
      this.isAuthorized = true;
      this.userPhoto = stubPhoto;
    }

    if (this.isAuthorized) {
      const userId = localStorage.getItem("userID");
      if (userId) {
        try {
          const profileImage = await getUserPhoto(userId);

          if (profileImage) {
            this.userPhoto = profileImage;
          } else {
            this.userPhoto = stubPhoto;
          }
        } catch (error) {
          console.error("Ошибка при загрузке фотографии профиля:", error);
          this.userPhoto = stubPhoto;
        }
      } else{
        this.userPhoto = stubPhoto;
      }
    }

    await this.fetchAddresses();
    this.syncSelectedAddress();

    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    async fetchScheduleForToday() {
      const userId = localStorage.getItem('userID');
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0]; // Сегодняшний день
      try {
        this.schedule = await getScheduleItemsForDay(userId, today);
        console.log(this.schedule)
      } catch (error) {
        console.error('Ошибка при загрузке расписания:', error);
        this.schedule = [];
      }
    },
    async handleMouseOverSchedule() {
      this.scheduleVisible = true;
      await this.fetchScheduleForToday();
      if(localStorage.getItem("userID") === "0"){
        this.schedule = [
          {
            "uslugaName": "запись 1",
            "startTime": "2024-12-19T12:12:00",
            "endTime": "2024-12-19T10:42:00.000Z"
          },
          {
            "uslugaName": "запись 2",
            "startTime": "2024-12-19T20:53:00",
            "endTime": "2024-12-19T19:23:00.000Z"
          }
        ]
      }
    },
    handleMouseLeaveSchedule() {
      this.scheduleVisible = false;
    },
    formatTime(time) {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    handleClickOutside(event) {
      const avatarWrapper = this.$el.querySelector('.avatar-wrapper');
      if (avatarWrapper && !avatarWrapper.contains(event.target)) {
        this.userDropdownVisible = false;
      }
    },
    async fetchAddresses() {
      try {
        const uslugas = await fetchUslugas();
        this.addresses = [
          ...new Set(uslugas.map((usluga) => usluga.location)),
        ].sort();
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
        this.selectedAddress = '';
        this.searchQuery = '';
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
      this.$router.push({
        path: '/',
        query: { ...this.$route.query } // Включаем текущие query
      }).then(() => {
        const targetElement = document.getElementById('search-id');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    navigateToMessages() {
      this.$router.push('/messages');
    },
    navigateToProfile() {
      this.$router.push('/profile');
    },
    navigateToReviews() {
      this.$router.push('/reviews');
    },
    navigateToSettings() {
      this.$router.push('/settings');
    },
    navigateToRegister() {
      this.$router.push('/registration');
    },
    navigateToSchedule(){
      this.$router.push('/schedule');
    },
    login() {
      this.$router.push('/login');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      this.isAuthorized = false;
      this.$router.push('/');
    },
    toggleUserDropdown() {
      this.userDropdownVisible = !this.userDropdownVisible;
    }
  },
};
</script>

<style scoped>
.schedule-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
  z-index: 2000;
}

.schedule-item {
  padding: 8px 16px;
  cursor: default;
  font-family: 'SF Pro Text', sans-serif;
  font-size: 14px;
}

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
  position: relative;
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

.register-btn {
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
  padding: 15px 30px;
  background-color: #4848A0;
  color: #ffffff;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  margin-right: 15px;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: 400;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 30px;

  list-style: none;
  padding: 10px 0;
  margin: 10px 0 0 0;
  z-index: 2000;
  box-shadow: 0 0 7px 0 #0000001F;

  font-family: 'SF Pro Text', sans-serif;
  font-size: 18px;
  font-weight: 400;
}

.user-dropdown-item {
  padding: 10px 60px 10px 20px;
  cursor: pointer;
}

.user-dropdown-item:hover {
  background-color: #f0f0f0;
}

.schedule-placeholder-img{
  height: 44px;
  width: 44px;
}


.schedule-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0 0 7px 0 #0000001F;
  list-style: none;
  padding: 10px 0;
  z-index: 2000;
  width: 280px;
  font-family: 'SF Pro Text', sans-serif;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #E0E0E0;
}

.schedule-item:last-child {
  border-bottom: none;
}

.schedule-placeholder-img {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background: #EDEDED;
  flex-shrink: 0;
}

.schedule-item-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.schedule-item-text .title {
  font-family: 'SF Pro Text', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #000;
}

.schedule-item-text .time {
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: #888;
  margin-top: 2px;
}


</style>
