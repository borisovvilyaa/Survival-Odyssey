<template>
  <div class="login-container">
    <h2 class="mb-4">Login</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          v-model="email"
          type="email"
          id="email"
          name="email"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary mt-4">Login</button>
    </form>
    <p id="error-message" class="error-message mt-3">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/conf.json";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    submitForm(this: {
      email: string;
      password: string;
      errorMessage: string;
      loginUser: (apiHost: string, email: string, password: string) => void;
    }) {
      const { email, password } = this;
      const apiHost = config.API_HOST;

      // Проверка логина
      fetch(`${apiHost}/api/profile-data/islogined`)
        .then((response) => response.json())
        .then((data) => {
          if (data.isLoggedin) {
            window.location.href = "/profile";
          } else {
            // Если пользователь не залогинен, отправляем данные формы для входа
            this.loginUser(apiHost, email, password);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.errorMessage = "An error occurred. Please try again.";
        });
    },
    loginUser(apiHost: string, email: string, password: string) {
      fetch(`${apiHost}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.errorMessage = data.error;
          } else {
            window.location.href = "/profile";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.errorMessage = "An error occurred. Please try again.";
        });
    },
  },
});
</script>
