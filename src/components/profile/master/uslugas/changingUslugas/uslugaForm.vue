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
        />

        <label :for="'slot-time-' + index">Время</label>
        <input
            type="time"
            v-model="slot.time"
            :key="'slot-time-' + index"
            min="08:00:00"
            max="18:00:00"
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
    addSlot() {
      this.usluga.slots.push({ date: '', time: '' });
    },

    removeSlot(index) {
      this.usluga.slots.splice(index, 1);
    },

    formatDateForInput(date) {
      if (!date) return '';
      // Преобразуем дату в формат YYYY-MM-DD для input type="date"
      const newDate = new Date(date);
      return newDate.toISOString().split('T')[0];
    },

    updateSlotDate(index, event) {
      // Обновляем модель даты на основании введенного значения
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
