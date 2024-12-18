<template>
  <div class="profile-container">

    <img
        :src="profilePhoto"
        alt="Аватар пользователя"
        class="profile-picture"
    />

    <div class="profile-name">
      {{userName}}
    </div>

    <!--
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
    -->
  </div>
</template>

<script>
import { getUser, getUserPhoto } from "@/service/userDataService";
import stubPhoto from "@/assets/content-img.png"

export default {
  data() {
    return {
      userID: null,
      userName: "",
      profilePhoto: null,
    };
  },
  async created() {
    this.isAuthorized = localStorage.getItem("isAuthorized") === "true";
    this.isAuthorized = true;

    if (this.isAuthorized) {
      this.userID = localStorage.getItem("userID");
      if (this.userID) {
        try {
          const profileImage = await getUserPhoto(this.userID);
          console.log(profileImage);
          if (profileImage) {
            this.profilePhoto = profileImage;
          } else {
            this.profilePhoto = stubPhoto;
          }
        } catch (error) {
          console.error("Ошибка при загрузке фотографии профиля:", error);
          this.profilePhoto = stubPhoto;
        }

        try{
          const user = await getUser(this.userID);
          if (user) {
            this.userName = user.name;
          }
        } catch (error){
          console.error(error);
        }
      }else{
        console.log("Не авторизован");
      }
    } else{
      console.log("Не авторизован");
    }
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




