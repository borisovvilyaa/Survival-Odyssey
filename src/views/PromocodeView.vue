<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card transparent-card">
          <div class="card-body text-center">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="promoCodeInput" class="form-label"
                  >Enter promo code:</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="nameInput"
                  v-model="nameInput"
                  placeholder="Nickname"
                />
                <input
                  type="text"
                  class="form-control mt-2"
                  id="promoCodeInput"
                  v-model="promoCode"
                  placeholder="Promo code"
                />
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <div v-if="loading" class="mt-3">
              <!-- Add a simple CSS spinner here -->
              <div class="spinner"></div>
              <p>Loading...</p>
            </div>
            <div v-else-if="statusMessage" class="mt-3">
              <p>{{ statusMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SurvivalOdysseyHome",
  data() {
    return {
      nameInput: "",
      promoCode: "",
      statusMessage: "", // Added variable for status message
      loading: false, // Added variable for loading state
    };
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true; // Set loading to true when making the request
        // Perform the fetch request to your server
        const response = await fetch(
          `http://localhost:3000/api/check-promocode/${this.nameInput}/${this.promoCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Handle error, e.g., show an error message to the user
          console.error("Failed to submit the form:", response.statusText);
          this.statusMessage = "Error occurred during form submission.";
          return;
        }

        // Process the response
        const responseData = await response.json();

        if (responseData.error) {
          // Handle error response
          this.statusMessage = `Error: ${responseData.error}`;
        } else if (responseData.message) {
          // Handle success response
          this.statusMessage = responseData.message;
        }
      } catch (error) {
        console.error("An error occurred while submitting the form:", error);
        this.statusMessage = "Error occurred during form submission.";
      } finally {
        this.loading = false; // Set loading to false regardless of success or failure
      }
    },
  },
};
</script>

<style>
.transparent-card {
  background-color: rgba(255, 255, 255, 0) !important;
  color: #fff !important;
}

/* CSS spinner style */
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
