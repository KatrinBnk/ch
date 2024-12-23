<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>Создать новое портфолио</h2>
      <form @submit.prevent="submitForm">
        <!-- Описание -->
        <div class="form-group">
          <label for="description">Описание:</label>
          <textarea v-model="portfolioData.description" required></textarea>
        </div>

        <!-- Поле для загрузки фото -->
        <div class="form-group">
          <label for="photo">Фото (хотя бы одно):</label>
          <input type="file" @change="openCropModal" accept="image/png" required />
        </div>

        <!-- Превью добавленных фото -->
        <div class="form-group">
          <label>Добавленные фотографии:</label>
          <div class="photo-preview">
            <div
                v-for="(photo, index) in previewPhotos"
                :key="index"
                class="photo-item"

            >
              <img :src="photo" alt="Photo Preview" />
            </div>
          </div>
        </div>

        <!-- Модальное окно обрезки -->
        <div v-if="showCropModal" class="crop-modal">
          <div class="crop-container">
            <img ref="cropImage" :src="currentPhoto" alt="To Crop" />
            <button type="button" @click="confirmCrop">Обрезать и сохранить</button>
            <button type="button" @click="closeCropModal">Отменить</button>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting">Создать</button>
          <button type="button" @click="closeModal">Отменить</button>
        </div>
      </form>

      <!-- Сообщения об ошибке и успехе -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="isSuccessMessage" class="success-message">Портфолио успешно создано!</div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { createPortfolio } from '@/service/portfolioService';

export default {
  props: {
    userId: {
      type: Number,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      portfolioData: {
        description: '',
        photos: [], // Обработанные фотографии (Base64 без префикса)
      },
      previewPhotos: [], // Для предпросмотра
      currentPhoto: null, // URL текущего фото для обрезки
      showCropModal: false, // Флаг отображения окна обрезки
      cropper: null,
      isSubmitting: false,
      errorMessage: '',
      isSuccessMessage: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    openCropModal(event) {
      const file = event.target.files[0];
      if (file) {
        this.currentPhoto = URL.createObjectURL(file);
        this.showCropModal = true;

        this.$nextTick(() => {
          const image = this.$refs.cropImage;
          this.cropper = new Cropper(image, {
            aspectRatio: 1, // Квадратное обрезание
            viewMode: 2,
          });
        });
      }
    },
    confirmCrop() {
      const canvas = this.cropper.getCroppedCanvas();
      const base64Image = canvas.toDataURL('image/png');
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, ''); // Убираем префикс

      // Сохраняем фото
      this.portfolioData.photos.push(base64Data);
      this.previewPhotos.push(base64Image); // Для предпросмотра с префиксом

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
    async submitForm() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.isSuccessMessage = false;

      try {
        if (!this.portfolioData.description.trim()) {
          this.errorMessage = 'Пожалуйста, заполните поле описания.';
          this.isSubmitting = false;
          return;
        }

        // Данные для отправки
        const dataToSend = {
          description: this.portfolioData.description,
          photos: this.portfolioData.photos,
        };

        await createPortfolio(this.userId, dataToSend);

        this.$emit('portfolioCreated');
        alert("Портфолио было успешно создано!")
        this.isSuccessMessage = true;

        this.closeModal();


      } catch (error) {
        console.error('Ошибка при создании портфолио:', error);
        this.errorMessage = 'Произошла ошибка при создании портфолио. Попробуйте снова.';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
  display: grid;
}

.photo-preview {
  display: flex;
  flex-wrap: wrap;
}

.photo-item img {
  max-width: 100px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-right: 10px;
  margin-bottom: 10px;
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

button {
  padding: 10px 20px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
