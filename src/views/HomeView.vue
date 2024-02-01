<template>
  <div class="survival-odyssey-home">
    <main>
      <!-- Основной контент -->
      <div class="osu-style-content">
        <h1>Welcome to Survival Odyssey</h1>
        <p>
          Survival Odyssey is a mix of survival and online adventure where you
          dive into a post-apocalyptic world with limited resources, dangerous
          enemies, and other surviving players. Can you survive in this harsh
          world?
        </p>
        <router-link to="/download" class="btn btn-primary"
          >Join the Survival</router-link
        >
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "SurvivalOdysseyHome",
};
</script>

<style scoped>
.survival-odyssey-home {
  text-align: center;
  padding: 20px;
}

main {
  margin: 0;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.osu-style-content {
  max-width: 800px;
  text-align: left;
  padding: 20px;
  border: 2px solid #dddddd;
  border-radius: 10px;
}

.osu-style-content h1 {
  font-size: 36px;
}

.osu-style-content h2 {
  font-size: 24px;
}

.osu-style-content p {
  font-size: 16px;
  line-height: 1.5;
}

.osu-style-content ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.osu-style-content li {
  margin-bottom: 10px;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>
