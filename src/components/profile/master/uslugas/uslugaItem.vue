<template>
  <div class="usluga-card">
    <h3>{{ usluga.name }}</h3>
    <p>Описание: {{ usluga.description }}</p>
    <p>Локация: {{ usluga.location }}</p>
    <p>Цена: {{ usluga.price }} руб.</p>
    <div class="usluga-card-buttons">
      <button class="btn-edit" @click="$emit('edit')">Редактировать</button>
      <button class="btn-del" @click="$emit('delete')">Удалить услугу</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usluga: {
      type: Object,
      required: true,
    }
  }
};
</script>

<style scoped>

.usluga-card {
  background-color: #ffffff;
  padding: 20px;
  font-family: "SF Pro Text", sans-serif;
}

.usluga-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.usluga-card p {
  margin: 5px 0;
  color: #333;
}

.usluga-card-buttons {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit {
  margin-top: 20px;
  background-color: #4848A0;
  color: white;
}

.btn-edit:hover {
  background-color: #4959A9;
}

.btn-del {
  background-color: #E14550;
  color: white;
}

.btn-del:hover {
  background-color: #A94959;
}

</style>