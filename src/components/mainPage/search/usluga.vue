<template>
  <div class="service"  @click="onServiceClick">
    <img src="../../../assets/stub2.svg" alt="service image" class="service-image" />
    <div class="service-info">
      <div class="service-name-rating">
        <h2 class="service-title">{{ service.name }}</h2>
        <div class="service-rating">
          <img src="../../../assets/icons/star.svg" alt="rating star" class="rating-icon" />
          <span>{{ service.rating }}</span>
        </div>
      </div>
      <div class="service-description">
        <p>{{ service.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"usluga",
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  methods: {
    onServiceClick() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$emit('show-login-modal');
      } else {
        this.$emit('show-service-details', this.service);
      }
    }
  }
};
</script>

<style scoped>
.service {
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.service-image {
  width: 100%;
  height: auto;
  aspect-ratio: 316 / 175;
  border-radius: 30px;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 15px;
}

.service-info {
  width: 100%;
}

.service-name-rating {
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.service-title {
  font-size: 30px;
  font-weight: 600;
  line-height: 25px;
  word-wrap: break-word;
  margin: 0 0 0 5px;
}

.service-description {
  font-size: 18px;
  font-weight: normal;
  color: #939393;
  margin: -5px 0 0 5px;
}

.service-rating {
  font-size: 18px;
  display: flex;
  align-items: center;
  background-color: #F7F7F7;
  padding: 5px 10px;
  border-radius: 10px;
}

.rating-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

</style>
