<template>
  <div v-if="isServiceModalVisible" class="modal">
    <div class="modal-content">
    <div class="modal-header">
      <h2>{{ selectedService.name }}</h2>
      <button @click="closeModal">Закрыть</button>
    </div>
    <div class="modal-body">
      <p>{{ selectedService.description }}</p>
      <p>Стоимость: {{ selectedService.price }}</p>
      <p>Длительность: {{ selectedService.duration }}</p>
      <p>Локация: {{ selectedService.location }}</p>

      <!-- Выводим доступные слоты -->
      <h3>Доступные слоты:</h3>
      <ul>
        <li v-for="(slot, index) in availableSlots" :key="index">
          <label>
            <input
                type="radio"
                :value="slot"
                v-model="selectedSlot"
                :disabled="!slot.available"
            />
            {{ slot.date }} | {{ slot.time }}
          </label>
        </li>
      </ul>
    </div>
    <div class="modal-footer">
      <button @click="applyForService" :disabled="!selectedSlot">Записаться</button>
    </div>
    </div>
  </div>
</template>

<script>
import { getFreeSlots, makeAppointment } from "@/service/applicationService.js";

export default {
  props: {
    isServiceModalVisible: Boolean,
    selectedService: Object,
  },
  data() {
    return {
      availableSlots: [],
      selectedSlot: null,
    };
  },
  async created() {
    if (this.selectedService) {
      this.loadAvailableSlots();
    }
  },
  watch: {
    selectedService: {
      handler(newService) {
        if (newService && newService.id) {
          this.loadAvailableSlots();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadAvailableSlots() {
      try {
        const slots = await getFreeSlots(this.selectedService.id);
        this.availableSlots = slots;
      } catch (error) {
        console.error("Ошибка при получении слотов:", error);
      }
    },
    closeModal() {
      this.$emit("close");
    },
    async applyForService() {
      if (!this.selectedSlot) {
        alert("Пожалуйста, выберите слот для записи.");
        return;
      }

      const userId = localStorage.getItem("userID");
      const uslugaId = this.selectedService.id;

      try {
        const appointmentResponse = await makeAppointment(userId, uslugaId, this.selectedSlot);
        if (appointmentResponse) {
          alert("Вы успешно записались на услугу!");
          this.closeModal();
          this.$emit("refreshServices");
        }
      } catch (error) {
        alert("Произошла ошибка при записи на услугу.");
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Затемнение фона */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
}

.modal-body {
  padding: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px; /* Максимальная ширина */
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-footer button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-footer button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.modal-footer button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 10px;
}

label {
  display: flex;
  align-items: center;
  font-size: 16px;
}

input[type="radio"] {
  margin-right: 8px;
}

/* Анимация появления модального окна */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

