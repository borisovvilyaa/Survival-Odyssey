import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "../views/ProfileView.vue";
import FindPlayerView from "../views/FindPlayerView.vue";
import TournamentView from "../views/TournamentView.vue";
import NewsPageView from "../views/NewsPageView.vue";
import NewsArticleView from "../views/NewsArticleView.vue";
import PromocodeView from "../views/PromocodeView.vue";
import DownloadView from "../views/DownloadView.vue";
import ProfileOtherView from "../views/ProfileOtherView.vue";
import RankingView from "../views/RankingView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/profile/:nickname",
    name: "profile-other",
    component: ProfileOtherView,
  },
  {
    path: "/find-player",
    name: "find-player",
    component: FindPlayerView,
  },
  {
    path: "/tournament",
    name: "tournament",
    component: TournamentView,
  },
  {
    path: "/news",
    name: "news",
    component: NewsPageView,
  },
  {
    path: "/news/articles/:id",
    name: "news-article",
    component: NewsArticleView,
  },
  {
    path: "/promocode",
    name: "Promocode",
    component: PromocodeView,
  },
  {
    path: "/download",
    name: "Download",
    component: DownloadView,
  },
  {
    path: "/ranking",
    name: "Rankings",
    component: RankingView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
