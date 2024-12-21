<template>
  <div class="user-info-container">
    <img :src="userPhoto" alt="Аватар пользователя" class="profile-picture" />

    <div class="user-info">
      <h2 class="user-name">{{ user.name }}</h2>
      <div class="divider"></div>
    </div>

    <!-- Кнопка редактирования -->
    <button class="edit-button" @click="openEditModal">
      <img src="@/assets/icons/edit-profile.svg" alt="Редактировать профиль" />
    </button>

    <!-- Модальное окно редактирования -->
    <div v-if="isEditModalVisible" class="edit-modal">
      <div class="modal-content">
        <h2>Обновить фотографию профиля</h2>

        <form @submit.prevent="saveProfile">

          <label>
            Фотография:
            <input type="file" @change="openCropModal" />
          </label>

          <!-- Модальное окно обрезки -->
          <div v-if="showCropModal" class="crop-modal">
            <div class="crop-container">
              <img ref="cropImage" :src="currentPhoto" alt="To Crop" />
              <button type="button" @click="confirmCrop">Обрезать и сохранить</button>
              <button type="button" @click="closeCropModal">Отменить</button>
            </div>
          </div>

          <div class="modal-buttons">
            <button type="submit">Сохранить</button>
            <button type="button" @click="closeEditModal">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {getUserPhoto, uploadUserPhoto} from "@/service/userDataService.js";
import stuPhoto from "@/assets/content-img.png";

export default {
  name: "UserData",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userRole: null,
      userPhoto: null,
      isEditModalVisible: false,
      showCropModal: false,
      cropper: null,
      currentPhoto: null,
      croppedPhotoBase64: null,
    };
  },
  async created() {
    this.userRole = this.user.role === "master" ? "мастер" : "пользователь";

    try {
      const profileImage = await getUserPhoto(this.user.id);
      this.userPhoto = profileImage ? profileImage : stuPhoto;
    } catch (error) {
      console.error("Ошибка при загрузке фотографии профиля:", error);
      this.userPhoto = stuPhoto;
    }
  },
  methods: {
    openEditModal() {
      this.isEditModalVisible = true;
    },
    closeEditModal() {
      this.isEditModalVisible = false;
    },
    openCropModal(event) {
      const file = event.target.files[0];
      if (file) {
        this.currentPhoto = URL.createObjectURL(file);
        this.showCropModal = true;

        this.$nextTick(() => {
          const image = this.$refs.cropImage;
          this.cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 2,
          });
        });
      }
    },
    confirmCrop() {
      const canvas = this.cropper.getCroppedCanvas();
      this.croppedPhotoBase64 = canvas.toDataURL("image/png");
      this.closeCropModal();
      this.saveProfile();
    },
    closeCropModal() {
      this.showCropModal = false;
      this.currentPhoto = null;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      this.closeEditModal();
    },
    async saveProfile() {
      try {
        if (this.croppedPhotoBase64) {
          const base64Data = this.croppedPhotoBase64.replace(/^data:image\/png;base64,/, "");
          await uploadUserPhoto(this.user.id, base64Data);
        }
        window.location.reload();
      } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
        alert("Не удалось обновить профиль. Попробуйте попытку позже.");
      }
    },
  },
};
</script>

<style scoped>
.user-info-container {
  position: relative;
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

.edit-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content form label {
  display: block;
  margin-bottom: 15px;
  font-size: 16px;
}

.modal-content form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 5px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-buttons button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.modal-buttons button[type="submit"]:hover {
  background-color: #45a049;
}

.modal-buttons button[type="button"] {
  background-color: #f44336;
  color: white;
}

.modal-buttons button[type="button"]:hover {
  background-color: #e03131;
}

.crop-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.crop-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 30px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.crop-container img {
  display: block;
  max-width: 90%;
  padding: 20px;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.crop-container button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.crop-container button:first-of-type {
  background-color: #4caf50;
  color: white;
}

.crop-container button:first-of-type:hover {
  background-color: #45a049;
}

.crop-container button:last-of-type {
  background-color: #f44336;
  color: white;
}

.crop-container button:last-of-type:hover {
  background-color: #e03131;
}

</style>

