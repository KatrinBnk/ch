<template>
  {{console.log(visible)}}

  <div class="modal-overlay" v-if="visible" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <slot name="header"></slot>
        <button class="close-button" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit("close");
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
  z-index: 9999;
}

.modal {
  background-color: white;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 20px;
}

.modal-footer {
  margin-top: 20px;
  text-align: right;
}

.close-button {
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #333;
}

.close-button:hover {
  color: #f44336;
}
</style>
