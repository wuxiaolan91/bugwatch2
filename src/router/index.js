import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserTimelineView from "@/views/user/UserTimelineView.vue";
import UserListView from "@/views/user/UserListView.vue";
import PathAnalysisView from "@/views/PathAnalysisView.vue";
import HeatmapView from "@/views/user/HeatmapView.vue";
import UserSessions from "@/views/user/UserSessions.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/apps",
      name: "appList",
      component: () => import("../views/apps/AppList.vue"),
    },
    {
      path: "/apps/create",
      name: "appCreate",
      component: () => import("../views/apps/AppCreate.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/track/EventAnalysis.vue"),
    },
    {
      path: "/track/overview",
      name: "trackOverview",
      component: HomeView,
    },
    {
      path: "/track/list",
      name: "eventList",
      component: () => import("../views/track/EventList.vue"),
    },
    {
      path: "/track/create",
      name: "eventCreate",
      component: () => import("../views/track/EventCreate.vue"),
    },
    {
      path: "/track/detail/:id",
      name: "eventDetail",
      component: () => import("../views/track/EventDetail.vue"),
    },
    {
      path: "/track/edit/:id",
      name: "eventEdit",
      component: () => import("../views/track/EventEdit.vue"),
    },
    {
      path: "/monitor/errors",
      name: "errorMonitor",
      component: () => import("../views/monitor/ErrorMonitor.vue"),
    },
    {
      path: "/monitor/error/:id",
      name: "errorDetail",
      component: () => import("../views/monitor/ErrorDetail.vue"),
    },
    {
      path: "/funnel/list",
      name: "funnelList",
      component: () => import("../views/funnel/FunnelList.vue"),
    },
    {
      path: "/funnel/create",
      name: "funnelCreate",
      component: () => import("../views/funnel/FunnelCreate.vue"),
    },
    {
      path: "/funnel/analysis",
      name: "funnelAnalysis",
      component: () => import("../views/funnel/FunnelAnalysis.vue"),
    },
    {
      path: "/user",
      name: "user",
      children: [
        {
          path: "timeline/:id",
          name: "user-timeline",
          component: UserTimelineView,
          props: true,
        },
        {
          path: "list",
          name: "user-list",
          component: UserListView,
        },
        {
          path: "sessions", // 修改这里
          name: "user-sessions",
          component: () => import("@/views/user/UserSessions.vue"), // 修改这里
        },
        {
          path: "heatmap",
          name: "user-heatmap",
          component: HeatmapView,
        },
      ],
    },
    {
      path: "/path-analysis",
      name: "pathAnalysis",
      component: PathAnalysisView,
    },
    {
      path: "/user/heatmap",
      name: "user-heatmap",
      component: HeatmapView,
    },
    {
      path: "/funnel",
      children: [
        {
          path: "detail/:id",
          name: "funnel-detail",
          component: () => import("@/views/funnel/FunnelDetail.vue"),
        },
        {
          path: "edit/:id?",
          name: "funnel-edit",
          component: () => import("@/views/funnel/FunnelEdit.vue"),
        },
      ],
    },
    // 在用户相关路由中添加
    {
      path: "/detail/:id", // 修改这里，添加前导斜杠
      name: "user-detail",
      component: () => import("@/views/user/UserDetail.vue"),
    },
  ],
});

export default router;
