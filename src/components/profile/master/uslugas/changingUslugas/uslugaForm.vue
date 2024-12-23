<template>
  <div>
    <label for="category">Категория</label>
    <select v-model="usluga.category" required>
      <option v-for="(category, index) in categories" :key="index" :value="category">
        {{ category }}
      </option>
    </select>

    <label for="name">Название</label>
    <input type="text" v-model="usluga.name" required />

    <label for="description">Описание</label>
    <textarea v-model="usluga.description" required></textarea>

    <label for="location">Локация</label>
    <input type="text" v-model="usluga.location" required />

    <label for="price">Цена</label>
    <input type="number" v-model="usluga.price" required />

    <label for="duration">Длительность</label>
    <input type="number" v-model="usluga.durationMinutes" required />

    <div class="usluga-slots">
      <div v-for="(slot, index) in usluga.slots" :key="index">
        <label :for="'slot-date-' + index">Дата</label>
        <input
            type="date"
            v-model="slot.date"
            :key="'slot-date-' + index"
            :value="formatDateForInput(slot.date)"
            required
            @blur="validateDate(index)"
        />

        <label :for="'slot-time-' + index">Время</label>
        <input
            type="time"
            v-model="slot.time"
            :key="'slot-time-' + index"
            @blur="validateTime(index)"
            required
        />

        <button @click="removeSlot(index)" type="button">Удалить слот</button>
      </div>

      <button @click="addSlot" type="button">Добавить слот</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usluga: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  methods: {
    validateTime(index) {
        const selectedTime = this.usluga.slots[index].time;
        const selectedDate = this.usluga.slots[index].date;

        if (!selectedTime || !selectedDate) {
          return;
        }

        const [selectedHours, selectedMinutes] = selectedTime.split(':').map(Number);

        const newSlotStart = new Date(`${selectedDate}T${selectedTime}`);
        const newSlotEnd = new Date(newSlotStart.getTime() + this.usluga.durationMinutes * 60000); // Длительность услуги в миллисекундах

        for (let i = 0; i < this.usluga.slots.length; i++) {
          if (i === index) continue;

          const existingSlot = this.usluga.slots[i];
          if (!existingSlot.date || !existingSlot.time) continue;

          const existingSlotStart = new Date(`${existingSlot.date}T${existingSlot.time}`);
          const existingSlotEnd = new Date(existingSlotStart.getTime() + this.usluga.durationMinutes * 60000);

          if (
              (newSlotStart >= existingSlotStart && newSlotStart < existingSlotEnd) || // Новый слот начинается внутри существующего
              (newSlotEnd > existingSlotStart && newSlotEnd <= existingSlotEnd) || // Новый слот заканчивается внутри существующего
              (newSlotStart <= existingSlotStart && newSlotEnd >= existingSlotEnd) // Новый слот полностью охватывает существующий
          ) {
            alert(`Невозможно выбрать время: ${selectedTime}. Оно пересекается с уже существующим слотом на ${existingSlot.date} с ${existingSlot.time}.`);
            this.usluga.slots[index].time = '';
            return;
          }
        }

        if (selectedHours < 8 || selectedHours > 18 || (selectedHours === 18 && selectedMinutes > 0)) {
          alert('Выберите время между 08:00 и 18:00!');
          this.usluga.slots[index].time = '';
        }
      },
    validateDate(index) {
      const selectedDate = this.usluga.slots[index].date;
      const today = new Date();
      const selectedSlotDate = new Date(selectedDate);

      today.setHours(0, 0, 0, 0);
      selectedSlotDate.setHours(0, 0, 0, 0);

      if (selectedSlotDate < today) {
        alert('Вы не можете выбрать прошедшую дату!');
        this.usluga.slots[index].date = '';
      }
    },
    addSlot() {
      this.usluga.slots.push({ date: '', time: '' });
    },

    removeSlot(index) {
      this.usluga.slots.splice(index, 1);
    },

    formatDateForInput(date) {
      if (!date) return '';
      const newDate = new Date(date);
      return newDate.toISOString().split('T')[0];
    },
    updateSlotDate(index, event) {
      this.usluga.slots[index].date = event.target.value;
    },
    validateForm() {
      const isValid = this.usluga.name && this.usluga.description && this.usluga.location &&
          this.usluga.price && this.usluga.durationMinutes && this.usluga.category;

      const areSlotsValid = this.usluga.slots.every(slot =>
          slot.date && slot.time
      );

      return isValid && areSlotsValid;
    },

    notifyFormValidity() {
      this.$emit('formValid', this.validateForm());
    },
  },
  watch: {
    usluga: {
      handler() {
        this.notifyFormValidity();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
input, textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

label {
  margin-bottom: 5px;
  display: block;
}
</style>
