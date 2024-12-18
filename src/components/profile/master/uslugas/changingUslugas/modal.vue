<template>
  <div v-if="isVisible" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <slot></slot>
      <button @click="closeModal" class="close-btn">Закрыть</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    modalType: {
      type: String,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:isVisible', false);
    }
  }
}
</script>

<style scoped>
.modal {
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
  border-radius: 5px;
  width: 400px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  margin-bottom: 20px;
  margin-top: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button.close-btn {
  border-radius: 30px;
  background-color:  #E14550;
  position: absolute;
  top: 10px;
  right: 10px;
}

button:hover {
  background-color: #A94959;
}
</style>
