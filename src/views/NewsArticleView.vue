<template>
  <div class="p-5 mb-3" style="border-radius: 15px">
    <router-link to="/news" class="back-link">&larr; Back to News</router-link>
    <div v-if="news.article_id" class="markdown-content">
      <h1>{{ news.title }}</h1>

      <!-- Используем v-html для вставки HTML контента -->
      <div v-html="convertMarkdownToHtml(news.content)"></div>

      <p>Published on: {{ news.publish_date }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../conf.json";
import MarkdownIt from "markdown-it";

export default {
  data() {
    return {
      news: {},
      mdParser: new MarkdownIt(),
    };
  },
  mounted() {
    const newsId = this.$route.params.id;
    this.fetchNewsFromApi(newsId);
  },
  methods: {
    async fetchNewsFromApi(newsId) {
      try {
        const response = await axios.get(
          `${config.API_HOST}/api/news/id/${newsId}`
        );
        this.news = response.data; // Используем response.data, так как title, content, timestamp находятся в самом объекте
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    convertMarkdownToHtml(markdownText) {
      return this.mdParser.render(markdownText);
    },
  },
};
</script>

<style lang="scss">
@import url(../assets/scss/markdown.scss);
</style>
