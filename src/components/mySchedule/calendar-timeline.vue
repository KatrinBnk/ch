<template>
  <div class="timeline-container">
    <div class="timeline">
      <!-- Линии времени с 8 до 19 -->
      <div v-for="hour in workingHours" :key="hour" class="timeline-hour">
        <span class="hour-label">{{ formatHour(hour) }}</span>
      </div>

      <!-- Записи в расписании -->
      <div
          v-for="(item, index) in scheduleItems"
          :key="index"
          class="timeline-item"
          :style="getItemStyle(item)"
          ref="timelineItems"
      >
        <div class="item-content">
          <div class="item-image" ref="itemImages">
            <img :src="stubPhoto" alt="">
          </div>
          <div class="item-details">
            <div class="item-title">{{ item.uslugaName }}</div>
            <div class="item-time">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</div>
          </div>
          <div class="btn">
            <button/>
            <button/>
            <button class="btn-cancel" type="button" @click="cancelAnAppointment(item.id)">x</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import stubPhoto from '@/assets/content-img.svg'
import {canselAppointment} from "@/service/applicationService.js"

export default {
  props: {
    scheduleItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      workingHours: Array.from({ length: 12 }, (_, i) => i + 8), // Рабочие часы с 8 до 19 (12 часов)
      stubPhoto: stubPhoto,
    };
  },
  methods: {
    formatHour(hour) {
      return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    },
    formatTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getItemStyle(item) {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);

      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;

      const topOffset = (startHour - 8) * 60;
      const height = (endHour - startHour) * 60;

      return {
        top: `${topOffset}px`,
        height: `${height}px`,
      };
    },
    updateImageHeight() {
      this.$nextTick(() => {
        const items = this.$refs.timelineItems;
        const images = this.$refs.itemImages;

        if (Array.isArray(items) && Array.isArray(images)) {
          items.forEach((item, index) => {
            const itemHeight = item.clientHeight;
            if (images[index]) {
              images[index].style.height = `${itemHeight - 20}px`;
            }
          });
        }
      });
    },
    cancelAnAppointment(id){
      if (canselAppointment(id)) {
        alert("Запись успешно отменена");
      } else{
        alert("Удаление записи на услугу невозможно.")
      }
    }
  },
  mounted() {
    this.updateImageHeight();
  },
  watch: {
    scheduleItems: {
      handler() {
        this.updateImageHeight();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>


<style scoped>
.timeline-container {
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
  position: relative;
  width: 100%;
  height: 780px;
  padding-left: 60px;
  padding-right: 20px;
  box-sizing: border-box;
}

.timeline {
  position: relative;
  width: calc(100% - 60px);
  height: 100%;
}

.timeline-hour {
  position: relative;
  height: 60px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.hour-label {
  position: absolute;
  top: -10px;
  left: -50px;
  font-size: 14px;
  color: #999;
}

.timeline-item {
  position: absolute;

  margin-left: 80px;
  width: calc(100% - 75px);
  background-color: #f8d7da;
  border-radius: 15px;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 10px;
}

.item-content {
  display: flex;
  width: 100%;
  position: relative;
}

.item-image {
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: #fcebea;
  flex-shrink: 0;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex-grow: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
}

.item-title {
  font-weight: 600;
  font-size: 20px;
  margin: 0;
  color: #000;
  font-family: 'SF Pro Text', sans-serif;
}

.item-time {
  font-size: 15px;
  margin-top: 5px;
  color: #000000;
  font-family: 'SF Pro Text', sans-serif;
  font-weight: 400;
}

.btn {
  display: flex;
  gap: 10px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  outline: none;
}

.btn-cancel{
  color: red;
}
</style>





