import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log("Router beforeEach", to.path);
  if (to.meta.title) {
    document.title = `${to.meta.title} - 今日热榜`;
  }
  $loadingBar.start();
  next();
  console.log("Router next called");
});

router.afterEach(() => {
  console.log("Router afterEach");
  $loadingBar.finish();
});

export default router;