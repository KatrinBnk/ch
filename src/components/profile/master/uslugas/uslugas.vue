<template>
  <div class="my-uslugas-container">
    <h1 class="my-uslugas-title">Мои услуги</h1>
    <button @click="openModal('create')">Добавить услугу</button>

    <!-- Модальные окна для создания, редактирования услуги и слотов -->
    <Modal :isVisible="isModalOpen"
           @update:isVisible="isModalOpen = $event"
           @close="closeModal"
           :modalType="modalType">
      <UslugaForm
          :usluga="newUsluga"
          :categories="categories"
          @formValid="handleFormValidation"
      />
      <button
          v-if="modalType === 'create'"
          @click="createUsluga"
          :disabled="!isFormValid"
      >
        Создать услугу
      </button>
      <button
          v-else
          @click="updateUsluga"
          :disabled="!isFormValid"
      >
        Сохранить обновления
      </button>
    </Modal>

    <div v-if="uslugas.length > 0" class="uslugas-grid">
      <div v-for="usluga in uslugas" :key="usluga.id" class="my-usluga-item">
        <UslugaCard
            :usluga="usluga"
            @delete="deleteUsluga(usluga.id)"
            @edit="editUsluga(usluga)"
            @edit-slots="editSlots(usluga)"
        />
      </div>
    </div>
    <div v-else>
      <p>Вы еще не добавили ни одной услуги!</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UslugaCard from '@/components/profile/master/uslugas/uslugaItem.vue';
import Modal from "@/components/profile/master/uslugas/changingUslugas/modal.vue";
import UslugaForm from "@/components/profile/master/uslugas/changingUslugas/uslugaForm.vue"
import {createServiceByMasterID, getServiceByMasterID, updateService} from "@/service/uslugasService.js";
import {fetchCategories} from "@/service/categoryService.js";

export default {
  components: {
    UslugaCard,
    Modal,
    UslugaForm,
  },
  data() {
    return {
      uslugas: [],
      isModalOpen: false,
      modalType: 'create',
      newUsluga: {
        id: null,
        name: '',
        description: '',
        location: '',
        price: 0,
        durationMinutes: 0,
        slots: [],
        category: '',
      },
      categories: ['Категория 1', 'Категория 2', 'Категория 3', 'Категория 4'], //TODO: тут стоят "дефолтные" категории, которые будут доступны для выбора мастера даже при отсутствии уже существующих услуг под этими категориями
      isFormValid: false,
    };
  },
  methods: {
    async fetchUslugas() {
      const userId = localStorage.getItem('userID');
      try {
        this.uslugas = await getServiceByMasterID(userId);
      } catch (error) {
        console.error('Ошибка при получении услуг:', error);
      }
    },

    openModal(type) {
      this.modalType = type;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.resetUsluga();
    },
    editUsluga(usluga) {
      this.newUsluga = {...usluga};
      this.newUsluga.slots.forEach(slot => {
        if (slot.date) {
          const newDate = new Date(slot.date);
          slot.date = newDate.toISOString().split('T')[0];
        }
      });
      this.openModal('edit');
    },

    editSlots(usluga) {
      this.newUsluga = {...usluga};
      this.newUsluga.slots.forEach(slot => {
        if (slot.date) {
          const newDate = new Date(slot.date);
          slot.date = newDate.toISOString().split('T')[0];
        }
      });
      this.openModal('edit-slots');
    },

    async createUsluga() {
      if (this.isFormValid) {
        this.formatTimeForServer(this.newUsluga.slots);

        const userId = localStorage.getItem('userID');
        try {
          const createdUsluga = await createServiceByMasterID(userId, this.newUsluga);
          this.uslugas.push(createdUsluga);
          this.closeModal();
          this.resetUsluga()
        } catch (error) {
          console.error(error);
        }
      }
    },

    async updateUsluga() {
      if (this.isFormValid) {
        this.formatTimeForServer(this.newUsluga.slots);

        try {
          await updateService(this.newUsluga);
          await this.fetchUslugas();
          this.closeModal();
          this.resetUsluga();
        } catch (error) {
          console.log(error);
        }
      }
    },

    async deleteUsluga(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8080/usluga/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        await this.fetchUslugas();
      } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
        alert("Удаление услуги невозможно: существуют активные записи!")
      }
    },

    resetUsluga() {
      this.newUsluga = {
        id: null,
        name: '',
        description: '',
        location: '',
        price: 0,
        durationMinutes: 0,
        slots: [],
        category: '',
      };
      this.isFormValid = false;
    },

    handleFormValidation(isValid) {
      this.isFormValid = isValid;
    },

    formatTimeForServer(slots) {
      slots.forEach(slot => {
        if (slot.time) {
          slot.time = `${slot.time}:00`;
        }
      });
    }
  },
  created() {
    this.fetchUslugas();
    this.resetUsluga();

    fetchCategories()
        .then(fetchedCategories => {
          const defaultCategories = this.categories; // Сохранение дефолтных категорий
          this.categories = Array.from(new Set([...defaultCategories, ...fetchedCategories])); // Уникальный список категорий
        })
        .catch(error => {
          console.error("Ошибка при загрузке категорий:", error);
        });
  }
};
</script>

<style scoped>

.my-uslugas-container{
  background-color: #ffffff;
  border-radius: 30px;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 7px 0 #0000001F;
  font-family: "SF Pro Text", sans-serif;
}

.my-uslugas-title {
  font-size: 24px;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  background-color: #4848A0;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 30px;
}

button:hover {
  background-color: #4949A9;
}

h3 {
  margin-top: 20px;
}

button[type="button"] {
  background-color: #f44336;
  margin-top: 10px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.uslugas-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px 0;
  list-style-type: none;
}

.my-usluga-item {
  background-color: #ffffff;
  border-radius: 30px;
  box-shadow: 0 0 7px 0 #0000001F;
  padding: 20px;
}


</style>
