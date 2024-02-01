<template>
  <div class="profile-container">
    <h6><strong>Player Info</strong></h6>
    <div class="profile-main d-flex align-items-center gap-4 mt-4">
      <img
        :src="userProfile.photoURL || config.defaultPhotoURL"
        alt="Profile Photo"
        class="profile-photo"
      />
      <div class="profile-main-info">
        <div class="fs-1 d-flex gap-2">
          <span v-if="loading" class="profile-info-preloader"></span>
          <strong>{{ userProfile.nickname }}</strong>
          <button @click="copyNickname" class="btn profile-btn">
            <i class="bi bi-copy"></i>
          </button>
        </div>
        <p style="font-size: 12px">
          <strong>Last Sign-In Time:</strong>
          <span v-if="loading" class="profile-info-preloader"></span>
          {{ userProfile.formattedLastSignInTime }}
        </p>
      </div>
    </div>
    <hr />
    <div class="profile-info d-flex gap-4">
      <p>
        <strong>Email:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.email }}
      </p>
      <p>
        <strong>Joined:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.formattedRegistrationDate }}
      </p>
      <p>
        <strong>Total Game Time:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.totalGameTime }} hours
      </p>
      <p>
        <strong>Balance:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.balance }} coins
      </p>
      <p>
        <strong>Donate Balance:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.donateBalance }} coins
      </p>
    </div>
    <hr />
    <div class="additional-info">
      <p>
        <strong>Role:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.role }}
      </p>
      <p>
        <strong>Kills:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.kills }}
      </p>
      <p>
        <strong>Deaths:</strong>
        <span v-if="loading" class="profile-info-preloader"></span>
        {{ userProfile.death }}
      </p>
    </div>

    <hr />
    <div class="profile-friends">
      <p><strong>Friends:</strong></p>
      <ul class="friends-list">
        <li
          v-for="friend in userProfile.friends"
          :key="friend.uid"
          class="profile-item friend-block"
        >
          <p>
            <router-link :to="`/profile/${friend.nickname}`">
              {{ friend.nickname }}</router-link
            >
            Last Sign-In Time: {{ friend.lastSignInTime }}
          </p>
        </li>
      </ul>
    </div>
    <hr />
  </div>
</template>

<script>
import config from "@/conf.json";

export default {
  data() {
    return {
      loading: true,
      userProfile: {
        email: "",
        formattedRegistrationDate: "",
        formattedLastSignInTime: "",
        photoURL: config.defaultPhotoURL,
        friends: [],
        totalGameTime: 0,
        balance: 0,
        donateBalance: 0,
        role: "",
        kills: 0,
        death: 0,
      },
    };
  },
  mounted() {
    this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      const apiUrl = `${config.API_HOST}/api/profile-data`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        this.loading = false;
        this.userProfile.email = data.email;
        this.userProfile.nickname = data.nickname;
        this.userProfile.balance = data.baseBalance;

        // Set the profile photo or use a default photo if not available
        this.userProfile.photoURL = data.photoURL || this.userProfile.photoURL;

        // Format and display registration date
        const registrationDate = new Date(data.registrationTime);
        this.userProfile.formattedRegistrationDate =
          registrationDate.toLocaleDateString();

        // Format and display last sign-in time
        const lastSignInTime = new Date(data.lastSignInTime);
        this.userProfile.formattedLastSignInTime =
          lastSignInTime.toLocaleString();

        // Update other profile information as needed
        this.userProfile.totalGameTime = data.totalGameTime || 0;
        this.userProfile.donateBalance = data.donateBalance || 0;

        // Fetch details of friends including last sign-in time
        const friendsDetails = await Promise.all(
          data.friends.map(async (friendUid) => {
            const friendInfoUrl = `${config.API_HOST}/api/profile-data/search-by-uid?uid=${friendUid}`;

            const friendInfoResponse = await fetch(friendInfoUrl);
            const friendInfoData = await friendInfoResponse.json();
            const friendInfoUrlNickname = `${config.API_HOST}/api/profile-data/search?nickname=${friendInfoData.nickname}`;

            const friendInfoResponseNickname = await fetch(
              friendInfoUrlNickname
            );
            const friendInfoDataNickname =
              await friendInfoResponseNickname.json();
            return {
              uid: friendUid,
              nickname: friendInfoData.nickname,
              lastSignInTime: friendInfoDataNickname.lastSignInTime,
            };
          })
        );

        this.userProfile.friends = friendsDetails;

        // Additional information
        this.userProfile.role = data.role;
        this.userProfile.kills = data.kills;
        this.userProfile.death = data.death;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    copyNickname() {
      // Function to copy the user's nickname to the clipboard
      const nickname = this.userProfile.nickname;

      // Create a temporary textarea element to facilitate copying
      const textarea = document.createElement("textarea");
      textarea.value = nickname;
      document.body.appendChild(textarea);

      // Select the text in the textarea and copy it to the clipboard
      textarea.select();
      document.execCommand("copy");

      // Remove the temporary textarea element
      document.body.removeChild(textarea);

      alert("Copied!");
    },
    changeProfilePhoto() {
      console.log("Changing profile photo...");
    },
  },
};
</script>

<style lang="scss">
.profile-container {
  margin-top: -24px;
  padding: 30px;
  color: #fff;
  background-color: #111111;
  font-family: "Arial", sans-serif;
}

.profile-photo {
  max-width: 100px;
  border-radius: 25px;
}

.profile-info {
  margin-top: 20px;
}

.profile-info p {
  margin-bottom: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-info-preloader {
  display: inline-block;
  width: 100px;
  height: 15px;
  background-color: #777;
  border-radius: 15px;
  animation: pulse 1.5s infinite;
  opacity: 0.1;
}

.profile-btn {
  color: #fff9 !important;
}

@keyframes pulse {
  0% {
    background-color: #777;
  }
  50% {
    background-color: #bbb;
  }
  100% {
    background-color: #777;
  }
}

.friends-list {
  margin-left: 0px !important;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.friend-block {
  flex: 1;
}

.profile-item {
  min-width: 100%;
  list-style: none;
  background-color: #1d1c1c;
  padding: 20px !important;
  border-radius: 15px;

  p {
    margin-bottom: 0px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    a {
      font-weight: bold;
      font-size: 16px;
      text-decoration: none;
    }
  }

  @media (min-width: 768px) {
    min-width: calc(50% - 20px);
  }

  @media (min-width: 1200px) {
    min-width: calc(33.33% - 20px);
  }
}
</style>
