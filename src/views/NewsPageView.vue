<template>
  <div class="markdown-content">
    <h1 class="text-center">News</h1>
    <div class="d-flex">
      <div class="main-news">
        <p>Main News!</p>
        <h2>{{ mainNews.title }}</h2>
        <div v-html="mainNews.content"></div>

        <hr />
        <router-link
          :to="generateArticleLink(mainNews.article_id)"
          class="btn btn-primary"
        >
          Read More
        </router-link>
      </div>
      <ul>
        <li
          v-for="newsItem in news"
          :key="newsItem.article_id"
          class="p-4"
          style="list-style: none"
        >
          <h2>
            <router-link :to="generateArticleLink(newsItem.article_id)">
              {{ newsItem.title }}
            </router-link>
          </h2>
          <small
            ><i class="bi bi-calendar3"></i>
            {{ formatNewsTimestamp(newsItem.publish_date) }}</small
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import config from "../conf.json";
import MarkdownIt from "markdown-it";

export default {
  data() {
    return {
      news: [],
      mdParser: new MarkdownIt(),
      mainNews: {},
    };
  },
  mounted() {
    this.fetchNewsFromApi();
  },
  methods: {
    async fetchNewsFromApi() {
      try {
        const response = await axios.get(`${config.API_HOST}/api/news/`);
        this.news = response.data;

        this.mainNews = {
          article_id: this.news[0].article_id,
          title: this.news[0].title,
          publish_date: this.news[0].publish_date,
          content: this.mdParser.render(
            this.news[0].content.split(" ").slice(0, 30).join(" ") + "..."
          ),
        };
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    generateArticleLink(articleId) {
      return `news/articles/${articleId}`;
    },
    formatNewsTimestamp(timestamp) {
      return format(new Date(timestamp), "dd.MM.yyyy");
    },
  },
};
</script>

<style lang="scss">
@import url(../assets/scss/markdown.scss);

.markdown-content {
  padding: 20px;
}

h1 {
  text-align: center;
}

.d-flex {
  flex-direction: column;
}

.main-news,
ul {
  width: 100%;
}

.main-news {
  margin-bottom: 20px;
}

li {
  padding: 10px;
  margin-bottom: 10px;
}

h2 {
  a {
    color: #fff;
    text-decoration: none;
    transition: 0.3s;
    &:hover {
      color: #fff9;
    }
  }
}

/* Media Queries for smaller screens */
@media (min-width: 768px) {
  .d-flex {
    flex-direction: row; /* Restore the horizontal layout for larger screens */
  }

  ul {
    padding: 0 !important;
    margin: 0 !important;
    li {
      padding: 0 !important;
    }
  }
}
</style>
