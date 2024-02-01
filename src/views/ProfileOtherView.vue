<template>
  <div class="profile-container">
    <h6><strong>Player Info</strong></h6>
    <div
      class="profile-main d-flex align-items-center justify-content-between gap-4 mt-4"
    >
      <div class="profile-main-info">
        <div>
          <p class="fs-1">
            <span v-if="loading" class="profile-info-preloader"></span>
            <strong>{{ userProfile.nickname }}</strong>
          </p>
          <p style="margin-top: -20px; font-size: 12px">
            <strong>Last Sign-In Time:</strong>
            <span v-if="loading" class="profile-info-preloader"></span>
            {{ userProfile.formattedLastSignInTime }}
          </p>
        </div>
      </div>
      <button v-if="loading" class="btn">
        <span class="profile-info-preloader"></span>
      </button>
      <!-- Inside your template -->
      <button
        v-if="!loading"
        :class="{ 'btn btn-danger': isFriend, 'btn btn-success': !isFriend }"
        @click="isFriend ? removeFromFriend() : addToFriend()"
      >
        {{ isFriend ? "UnFriend" : "Add to friend" }}
      </button>
    </div>
    <hr />
    <div class="profile-info d-flex gap-4">
      <p>
        <strong>Joined:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.formattedRegistrationDate }}
      </p>
      <p>
        <strong>Total Playtime:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.totalGameTime }}
      </p>
      <p>
        <strong>Kills:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.kills }}
      </p>
      <p>
        <strong>Death:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.deaths }}
      </p>
    </div>
    <hr />
  </div>
</template>

<script>
import config from "@/conf.json";
import router from "@/router";

export default {
  data() {
    return {
      loading: true,
      userProfile: {
        uid: "",
        nickname: "",
        formattedLastSignInTime: "",
        formattedRegistrationDate: "",
        totalGameTime: 0,
        kills: 0,
        deaths: 0,
        friends: [],
      },
      isFriend: false,
    };
  },
  mounted() {
    this.fetchProfileData();
    this.friendStatus();
  },

  methods: {
    async addToFriend() {
      try {
        const apiUrlUid = `${config.API_HOST}/api/profile-data/search-by-nickname?nickname=${this.userProfile.nickname}`;
        const responseUid = await fetch(apiUrlUid);
        const dataUid = await responseUid.json();

        const apiUrl = `${config.API_HOST}/api/profile-data/addtofriend/${dataUid.uid}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Friend added successfully");
          this.isFriend = true;
        } else {
          console.error("Error adding friend:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async removeFromFriend() {
      try {
        const apiUrlUid = `${config.API_HOST}/api/profile-data/search-by-nickname?nickname=${this.userProfile.nickname}`;
        const responseUid = await fetch(apiUrlUid);
        const dataUid = await responseUid.json();

        const apiUrl = `${config.API_HOST}/api/profile-data/removefriend/${dataUid.uid}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Friend removed successfully");
          this.isFriend = false;
        } else {
          console.error("Error removing friend:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async friendStatus() {
      const apiUrl = `${config.API_HOST}/api/profile-data/`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Friends UIDs:", data.friends);
        const apiUrlUid = `${
          config.API_HOST
        }/api/profile-data/search-by-nickname?nickname=${this.getNicknameFromUrl()}`;
        try {
          const responseUid = await fetch(apiUrlUid);
          const dataUid = await responseUid.json();
          console.log("Friends UIDs:", data.friends);
          if (data.friends.includes(dataUid.uid)) {
            console.log("Элемент найден в массиве.");
            this.isFriend = true;
          } else {
            console.log("Элемент no найден в массиве.");
            console.log(data.friends);
            this.isFriend = false;
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async fetchProfileData() {
      const nickname = this.getNicknameFromUrl();
      const me = `${config.API_HOST}/api/profile-data/`;
      try {
        const responseMe = await fetch(me);
        const dataMe = await responseMe.json();
        if (nickname == dataMe.nickname) {
          router.push(`/profile`);
        }
      } catch (error) {
        console.error("Error:", error);
        this.loading = false;
        return;
      }

      const apiUrl = `${config.API_HOST}/api/profile-data/search?nickname=${nickname}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        this.userProfile.uid = data.uid;
        this.userProfile.nickname = data.nickname;
        this.userProfile.deaths = data.deaths;
        console.log(data.deaths);
        this.userProfile.kills = data.kills;
        this.userProfile.totalGameTime = data.totalGameTime;

        // Format and display last sign-in time
        const lastSignInTime = new Date(data.lastSignInTime);
        this.userProfile.formattedLastSignInTime =
          lastSignInTime.toLocaleString();

        // Format and display registration date
        const registrationDate = new Date(data.creationTime);
        this.userProfile.formattedRegistrationDate =
          registrationDate.toLocaleDateString();
        this.loading = false;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    getNicknameFromUrl() {
      const urlParts = window.location.href.split("/");
      return urlParts[urlParts.length - 1];
    },
  },
};
</script>

<style lang="scss">
/* Your existing styles remain unchanged */
</style>
