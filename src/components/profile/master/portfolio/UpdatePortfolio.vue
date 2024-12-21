<template>

  <Header></Header>
  <div class="container">
    <!-- Меню слева -->
    <aside class="menu">
      <ProfileMenu />
    </aside>
    <main>
  <div class="update-portfolio-page">
    <h1>Редактирование портфолио</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Поле для описания -->
      <div class="form-group">
        <label for="description">Описание</label>
        <textarea
            id="description"
            v-model="portfolioData.description"
            placeholder="Введите описание портфолио"
            rows="4"
        ></textarea>
      </div>

      <!-- Список существующих фотографий -->
      <div class="form-group">
        <label>Фотографии</label>
        <div class="photos-list">
          <div
              v-for="(photo, index) in portfolioData.photosAsList"
              :key="index"
              class="photo-item"
          >
            <img :src="getImageUrl(photo)" alt="Portfolio Photo" />
            <div class="photo-actions">
              <button type="button" @click="removePhoto(index)">Удалить</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Превью новых фотографий -->
      <div class="form-group">
        <label>Предпросмотр новых фотографий</label>
        <div class="new-photos-preview">
          <div
              v-for="(photo, index) in previewNewPhotos"
              :key="index"
              class="photo-item"
          >
            <img :src="photo" alt="New Photo Preview" />
            <div class="photo-actions">
              <button type="button" @click="removeNewPhoto(index)">Удалить</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Поле для добавления новых фотографий -->
      <div class="form-group">
        <label for="newPhotos" class="add-file">Добавить фотографию</label>
        <input id="newPhotos" type="file" accept="image/png" @change="openCropModal" />
      </div>

      <!-- Модальное окно обрезки -->
      <div v-if="showCropModal" class="crop-modal">
        <div class="crop-container">
          <img ref="cropImage" :src="currentPhoto" alt="To Crop" />
          <button type="button" @click="confirmCrop">Обрезать и сохранить</button>
          <button type="button" @click="closeCropModal">Отменить</button>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="form-actions">
        <button type="submit" class="save-button">Сохранить изменения</button>
        <button type="button" class="cancel-button" @click="handleCancel">Назад к портфолио</button>
      </div>
    </form>
  </div>
    </main>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { getPortfolioByMasterId, updatePortfolio } from '@/service/portfolioService';
import ProfileMenu from "@/components/profile/profileMenu.vue";
import Header from "@/components/header.vue";

export default {
  components: {Header, ProfileMenu},
  props: {
    portfolioId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      portfolioData: {
        description: '',
        photosAsList: [],
        newPhotos: [],
      },
      previewNewPhotos: [],
      showCropModal: false,
      cropper: null,
      currentPhoto: null,
    };
  },
  async created() {
    await this.fetchPortfolio();
  },
  methods: {
    async fetchPortfolio() {
      try {
        const portfolio = await getPortfolioByMasterId(Number(localStorage.getItem('userID')));
        this.portfolioData.description = portfolio.description;
        this.portfolioData.photosAsList = portfolio.photosAsList || [];
      } catch (error) {
        console.error('Ошибка при загрузке портфолио:', error);
      }
    },
    getImageUrl(base64String) {
      return `data:image/png;base64,${base64String}`;
    },
    removePhoto(index) {
      this.portfolioData.photosAsList.splice(index, 1);
    },
    removeNewPhoto(index) {
      this.portfolioData.newPhotos.splice(index, 1);
      this.previewNewPhotos.splice(index, 1);
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

      const base64Image = canvas.toDataURL('image/png');
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');

      this.previewNewPhotos.push(base64Image);
      this.portfolioData.newPhotos.push(base64Data);

      this.closeCropModal();
    },
    closeCropModal() {
      this.showCropModal = false;
      this.currentPhoto = null;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },
    async handleSubmit() {
      try {

        const allPhotos = [
          ...this.portfolioData.photosAsList, // Существующие фотографии
          ...this.portfolioData.newPhotos,    // Новые фотографии
        ];

        console.log(allPhotos)

        // Формируем данные для обновления
        const portfolioData = {
          description: this.portfolioData.description,
          photos: allPhotos,
        };



        await updatePortfolio(this.portfolioId, portfolioData);

        alert('Портфолио успешно обновлено!');
      } catch (error) {
        console.error('Ошибка при обновлении портфолио:', error);
        alert('Не удалось обновить портфолио. Попробуйте снова.');
      }
    },
    handleCancel() {
      this.$router.push('/my-portfolio');
    },
  },
};
</script>

<style scoped>

.container {
  display: flex;
  gap: 20px;
  margin: 50px;
}

.update-portfolio-page {
  background-color: #ffffff;
  border-radius: 30px;
  padding: 50px;
  width: 120%;

  box-sizing: border-box;
  box-shadow: 0 0 7px 0 #0000001F;
  font-family: "SF Pro Text", sans-serif;
  font-weight: 400;
}

.form-group {
  margin-bottom: 20px;
}

textarea,
input[type='file'] {
  width: 90%;
  margin-top: 20px;
  padding: 10px 30px;
  border: 1px solid #ccc;
  border-radius: 30px;
}


.photos-list,
.new-photos-preview{
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  gap: 10px;
}

.photo-item img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.photo-actions {
  width: 100%;
  text-align: center;
}

.photo-actions button {
  background-color: #a94950;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease-in-out;
}

.photo-actions button:hover {
  background-color: #a94959;
}

input[type="file"] {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
  z-index: -1;
}

.add-file {
  display: inline-block;
  background-color: #4848A0;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-file:hover {
  background-color: #4949A9;
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
  z-index: 1000;
}

.crop-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.crop-container img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.crop-container button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.crop-container button:first-of-type {
  background-color: #4caf50;
  color: white;
}

.crop-container button:last-of-type {
  background-color: #a94959;
  color: white;
}
</style>
