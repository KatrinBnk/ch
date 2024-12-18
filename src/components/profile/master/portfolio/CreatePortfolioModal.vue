<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>Создать новое портфолио</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="description">Описание:</label>
          <textarea v-model="portfolioData.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="photo">Фото (PNG, несколько файлов):</label>
          <input type="file" @change="handleFileChange" accept="image/png" multiple />
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting">Создать</button>
          <button type="button" @click="closeModal">Отменить</button>
        </div>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="isSuccessMessage" class="success-message">Портфолио успешно создано!</div>
    </div>
  </div>
</template>

<script>
import { createPortfolio } from '@/service/portfolioService';

export default {
  props: {
    userId: {
      type: Number,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      portfolioData: {
        description: '',
        photos: [] // Массив для хранения выбранных файлов
      },
      isSubmitting: false, // Флаг для блокировки кнопки отправки
      errorMessage: '', // Для отображения ошибок
      isSuccessMessage: false // Для отображения успеха
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleFileChange(event) {
      const files = event.target.files;
      const validPhotos = [];
      let invalidFileSelected = false;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'image/png') {
          validPhotos.push(file);
        } else {
          invalidFileSelected = true;
        }
      }

      if (invalidFileSelected) {
        this.errorMessage = 'Можно загружать только изображения формата PNG.';
      } else {
        this.errorMessage = '';
      }

      this.portfolioData.photos = validPhotos; // Обновляем массив фотографий
    },
    // Функция для преобразования файла в строку Base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(',')[1]; // Удаляем префикс "data:image/png;base64,"
          resolve(base64String);
        };
        reader.onerror = error => reject(error);
      });
    },
    async submitForm() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.isSuccessMessage = false;

      try {
        // Проверяем, что описание заполнено
        if (!this.portfolioData.description.trim()) {
          this.errorMessage = 'Пожалуйста, заполните поле описания.';
          this.isSubmitting = false;
          return;
        }

        // Обработка фотографий
        let photosBase64 = null;
        if (this.portfolioData.photos.length > 0) {
          const photoPromises = this.portfolioData.photos.map(file => this.fileToBase64(file));
          photosBase64 = await Promise.all(photoPromises);
        }

        // Формируем данные для отправки
        const dataToSend = {
          description: this.portfolioData.description,
          photos: photosBase64 // Это будет null, если фотографий нет
        };

        // Отправляем запрос на создание портфолио
        await createPortfolio(this.userId, dataToSend);

        // Уведомляем родительский компонент о создании
        this.$emit('portfolioCreated');

        // Показываем сообщение об успешном создании
        this.isSuccessMessage = true;

        // Закрываем модальное окно через 2 секунды
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      } catch (error) {
        console.error('Ошибка при создании портфолио:', error);
        this.errorMessage = 'Произошла ошибка при создании портфолио. Попробуйте снова.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
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
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
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
