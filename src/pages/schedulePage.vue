<template>
  <div class="profile-page">
    <Header/>
    <div class="profile-content">
      <Schedule class="schedule" />
      <ScheduleProfile class="profile" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Schedule from "@/components/mySchedule/schedule.vue";
import ScheduleProfile from "@/components/mySchedule/scheduleProfile.vue";
import {getUser} from "@/service/userDataService.js";

export default {
  components: {
    ScheduleProfile,
    Schedule,
    Header
  },
  data() {
    return {
      userID: null,
      isAuthenticated: false
    };
  },
  async created() {
    this.userID = localStorage.getItem("userID");
    this.isAuthorized =  "true";

    if (!this.isAuthorized) {
      this.$router.push("/login");
    } else {
      try {
        const user = await getUser(this.userID)
        if (!user) {
          if (localStorage.getItem("userID") === "0") {
            this.user = {
              "id": 1,
              "name": "Ирина Рыбокова",
              "email": "4@ex.ru",
              "telephone_number": "89934223969",
              "profilePicture": null,
              "role": "master",
              "portfolio": null,
              "favoriteUslugas": [],
              "uslugas": [
                {
                  "id": 1,
                  "name": "услуга 1",
                  "description": "услуга 1 описание",
                  "category": "Категория 1",
                  "location": "Казань",
                  "coordinates": null,
                  "slots": [
                    {
                      "id": 1,
                      "date": "2024-12-23T00:00:00.000+00:00",
                      "time": "10:37:00",
                      "available": false
                    }
                  ],
                  "price": 2000,
                  "durationMinutes": 90
                },
                {
                  "id": 2,
                  "name": "услуга 2",
                  "description": "услуга 2 описание",
                  "category": "Категория 4",
                  "location": "Казань",
                  "coordinates": null,
                  "slots": [
                    {
                      "id": 2,
                      "date": "2024-12-19T00:00:00.000+00:00",
                      "time": "12:38:00",
                      "available": true
                    },
                    {
                      "id": 3,
                      "date": "2024-12-22T00:00:00.000+00:00",
                      "time": "10:38:00",
                      "available": false
                    },
                    {
                      "id": 4,
                      "date": "2024-12-23T00:00:00.000+00:00",
                      "time": "12:38:00",
                      "available": false
                    },
                    {
                      "id": 5,
                      "date": "2024-12-18T00:00:00.000+00:00",
                      "time": "12:12:00",
                      "available": false
                    }
                  ],
                  "price": 2000,
                  "durationMinutes": 90
                },
                {
                  "id": 3,
                  "name": "вривра",
                  "description": "варива",
                  "category": "Категория 3",
                  "location": "Казань",
                  "coordinates": null,
                  "slots": [
                    {
                      "id": 6,
                      "date": "2024-12-18T00:00:00.000+00:00",
                      "time": "20:53:00",
                      "available": false
                    }
                  ],
                  "price": 2000,
                  "durationMinutes": 90
                }
              ],
              "writtenReviews": [],
              "receivedReviews": []
            }
          }
          //this.$router.push("/login"); //TODO: ЗАГЛУШКА
        }
      } catch (e) {
        if (localStorage.getItem("userID") === "0") {
          this.user = {
            "id": 1,
            "name": "Ирина Рыбокова",
            "email": "4@ex.ru",
            "telephone_number": "89934223969",
            "profilePicture": null,
            "role": "master",
            "portfolio": null,
            "favoriteUslugas": [],
            "uslugas": [
              {
                "id": 1,
                "name": "услуга 1",
                "description": "услуга 1 описание",
                "category": "Категория 1",
                "location": "Казань",
                "coordinates": null,
                "slots": [
                  {
                    "id": 1,
                    "date": "2024-12-23T00:00:00.000+00:00",
                    "time": "10:37:00",
                    "available": false
                  }
                ],
                "price": 2000,
                "durationMinutes": 90
              },
              {
                "id": 2,
                "name": "услуга 2",
                "description": "услуга 2 описание",
                "category": "Категория 4",
                "location": "Казань",
                "coordinates": null,
                "slots": [
                  {
                    "id": 2,
                    "date": "2024-12-19T00:00:00.000+00:00",
                    "time": "12:38:00",
                    "available": true
                  },
                  {
                    "id": 3,
                    "date": "2024-12-22T00:00:00.000+00:00",
                    "time": "10:38:00",
                    "available": false
                  },
                  {
                    "id": 4,
                    "date": "2024-12-23T00:00:00.000+00:00",
                    "time": "12:38:00",
                    "available": false
                  },
                  {
                    "id": 5,
                    "date": "2024-12-18T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": false
                  }
                ],
                "price": 2000,
                "durationMinutes": 90
              },
              {
                "id": 3,
                "name": "вривра",
                "description": "варива",
                "category": "Категория 3",
                "location": "Казань",
                "coordinates": null,
                "slots": [
                  {
                    "id": 6,
                    "date": "2024-12-18T00:00:00.000+00:00",
                    "time": "20:53:00",
                    "available": false
                  }
                ],
                "price": 2000,
                "durationMinutes": 90
              }
            ],
            "writtenReviews": [],
            "receivedReviews": []
          }
        }
        //this.$router.push("/login"); //TODO: ЗАГЛУШКА
      }
    }
  }
};
</script>

<style scoped>

.profile-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  padding: 60px;
  box-sizing: border-box;
}

.schedule, .profile {
  width: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>

