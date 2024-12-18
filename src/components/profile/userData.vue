<template>
  <div class="user-info-container">

    <img
        :src="userPhoto"
        alt="Аватар пользователя"
        class="profile-picture"
    />

    <div class="user-info">
      <h2 class="user-name">{{ user.name }}</h2>
      <div class="divider"></div>
      <!--
      <h3 class="user-email">{{ user.email }}</h3>
      <h3 class="user-phone">{{ user.phone }}</h3>
      <h3 class="user-role">Моя роль: {{ userRole }}</h3>
      -->
    </div>
  </div>
</template>

<script>
import {getUserPhoto} from "@/service/userDataService.js";
import stuPhoto from "@/assets/content-img.png";

export default {
  name: 'UserData',
  props:{
    user: {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      userRole: null,
      userPhoto: null,
    }
  },
  async created() {
    // Определяем роль
    this.userRole = (this.user.role === "master") ? "мастер" : "пользователь";

    try {
      const profileImage = await getUserPhoto(this.user.id);
      this.userPhoto = profileImage ? profileImage : stuPhoto;
    } catch (error) {
      console.error("Ошибка при загрузке фотографии профиля:", error);
      this.userPhoto = stuPhoto;
    }
  }
}
</script>

<style scoped>
.user-info-container {
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 25px;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-picture {
  width: 114px;
  height: 114px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-name {
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 10px 0;
  font-family: 'SF Pro Text', sans-serif;
  color: black;
}

.divider {
  width: 100%;
  height: 2px;
  background-color: #E3E3E3;
  /*TODO: если нет контента пока оставить так*/
  margin: 81px 0 147px;
}

.user-info h3 {
  font-size: 16px;
  font-weight: 400;
  margin: 5px 0;
  font-family: 'SF Pro Text', sans-serif;
  color: #333;
}
</style>
