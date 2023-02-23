import type { Router } from "vue-router";
import storage from "store";
import NProgress from "../extends/index";
import { useUserStore } from "../store/user";
const defaultPath = "/home";

const permission = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const token = storage.get("token");
    if (token) {
      if (to.path === "/login") {
        next({ path: defaultPath });
      } else {
        const userStore = useUserStore();
        // 判断是否添加好路由
        if (userStore.loadRouter) {
          next();
        } else {
          await userStore._getUserInfo();
          await userStore._GetMenus();
          next({ ...to, replace: true });
        }
      }
    } else {
      if (to.path === "/login") {
        next();
      }
      NProgress.done();
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
};

export default permission;
