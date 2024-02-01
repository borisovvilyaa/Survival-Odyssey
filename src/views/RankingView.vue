<template>
  <div class="container mt-4">
    <h2 class="text-white">Ranking</h2>

    <!-- Dropdown for selecting ranking type -->
    <div class="mb-3">
      <label class="text-white">Select Ranking Type:</label>
      <select
        v-model="selectedRankingType"
        @change="fetchRankingData"
        class="form-select"
      >
        <option value="deaths">Deaths</option>
        <option value="kills">Kills</option>
      </select>
    </div>

    <!-- Table to display ranking data -->
    <table class="table table-dark table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nickname</th>
          <th scope="col">
            {{
              selectedRankingType.charAt(0).toUpperCase() +
              selectedRankingType.slice(1)
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in ranking" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>
            <router-link :to="`/profile/${player.nickname}`">
              {{ player.nickname }}
            </router-link>
          </td>
          <td>{{ player[selectedRankingType] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      ranking: [],
      selectedRankingType: "kills",
    };
  },
  mounted() {
    // Fetch data from the API when the component is mounted
    this.fetchRankingData();
  },
  methods: {
    async fetchRankingData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/ranking/${this.selectedRankingType}`
        );
        this.ranking = response.data.ranking;
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      }
    },
  },
};
</script>

<style>
/* Custom styles for improved table appearance */
.table {
  border-radius: 20px;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table-dark {
  background-color: #343a40;
}

.table-dark th,
.table-dark td,
.table-dark thead th {
  border-color: #454d55;
}
</style>
