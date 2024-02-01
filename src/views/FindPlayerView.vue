<template>
  <div class="find-container">
    <h2 class="mb-4">Find</h2>
    <form @submit.prevent="findPlayer" class="p-5">
      <div class="form-group">
        <label for="nick">Player nick:</label>
        <input
          v-model="nick"
          type="text"
          id="nick"
          name="nick"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary mt-4">Find</button>
    </form>
    <p id="error-message" class="error-message mt-3">{{ errorMessage }}</p>

    <div v-if="loading" class="spinner"></div>
    <div v-if="!loading">
      <div
        v-if="userData"
        class="bg-dark p-5 fadeIn"
        style="border-radius: 25px"
      >
        <h3>User Data:</h3>
        <p>Nickname: {{ userData.nickname }}</p>
        <p>Registration Time: {{ userData.creationTime }}</p>
        <p>Last Sign-In Time: {{ userData.lastSignInTime }}</p>
        <div class="d-flex gap-2">
          <router-link
            :to="`profile/${userData.nickname}`"
            class="btn btn-primary"
          >
            Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import config from "@/conf.json";
const apiHost = config.API_HOST;

export default defineComponent({
  data() {
    return {
      nick: "",
      errorMessage: "",
      userData: null,
      loading: false,
      isFriend: false,
    };
  },
  methods: {
    async friendStatus() {
      const apiUrl = `${config.API_HOST}/api/profile-data/`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        for (let i = 0; i < data.friends.length; i++) {
          const nicknameFriend = await fetch(
            `${config.API_HOST}/api/profile-data/search-by-uid?uid=${data.friends[i]}`
          );
          const dataFriend = await nicknameFriend.json();

          console.log(dataFriend);
          data.friends[i] = dataFriend.nickname;
        }

        console.log(data.friends);
        if (data.friends.indexOf(this.nick) !== -1) {
          console.log(true);
          this.isFriend = true;
        } else {
          console.log(false);

          this.isFriend = false;
        }
        this.loading = false;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async findPlayer() {
      try {
        this.loading = true;

        const response = await axios.get(
          `${apiHost}/api/profile-data/search?nickname=${this.nick}`
        );

        this.userData = response.data;
        this.errorMessage = "";
        this.friendStatus();
      } catch (error) {
        this.userData = null;
        this.loading = false;
        this.errorMessage = "User not found";
        console.error(error);
      }
    },
  },
});
</script>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
}
.fadeIn {
  animation: fadeInAnimation 0.5s ease-in-out;
}

@keyframes fadeInAnimation {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
