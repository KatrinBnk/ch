<template>
  <div class="profile-container">
    <img
        :src="user.profilePicture[0] || stubPhoto"
        alt="Фото профиля"
        class="profile-picture"
    />

    <div v-if="firstName && lastName" class="profile-name">
      <div class="first-name">{{ firstName }}</div>
      <div class="last-name">{{ lastName }}</div>
    </div>

    <div class="profile-bth">
      <img :src="stubPhoto" alt="btn"/>
      <img :src="stubPhoto" alt="btn"/>
      <img :src="stubPhoto" alt="btn"/>
    </div>

    <div class="masters-block">
      <h1>Мастера</h1>
      <div class="master-items">
      <img :src="stubPhoto" alt="master"/>
      <img :src="stubPhoto" alt="master"/>
      <img :src="stubPhoto" alt="master"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser } from "@/service/userDataService";
import stubPhoto from '@/assets/content-img.svg'

export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      user: {
        profilePicture: [],
        name: ""
      },
      stubPhoto: stubPhoto
    };
  },
  async created() {
    try {
      this.user = await getUser(this.userId);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  },
  computed: {
    firstName() {
      return this.user.name ? this.user.name.split(" ")[0] : "";
    },
    lastName() {
      return this.user.name ? this.user.name.split(" ")[1] : "";
    },
  },
};
</script>


<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;

  font-family: 'SF Pro Text', sans-serif;
  font-weight: 600;
  font-size: 25px;
}

.profile-picture {
  width: 50vw;
  max-width: 300px;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  object-fit: cover;
}

.profile-name {
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #000000;
}

.first-name,
.last-name {
  display: block;
}

.profile-bth {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.profile-bth img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  object-fit: cover;
}

.masters-block {
  width: 100%;
  text-align: start;
}

.masters-block h1 {
  margin-bottom: 10px;
  color: #000000;
}

.master-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
}

.master-items img {
  width: 270px;
  height: 90px;
  border-radius: 20px;
  background-color: #f0f0f0;
  object-fit: cover;
}
</style>




