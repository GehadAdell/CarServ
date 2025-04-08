import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../components/index.vue";
import CheckPhone from "../components/check-phone.vue";
import Login from "../components/Login.vue";
import UserRegister from "../components/UserRegister.vue";
import mobileRegister from "../components/mobileRegister.vue";
import AddCar from "../components/AddCar.vue";
import selectcar from "../components/selectcar.vue";
import Booking from "../components/Booking.vue";
import Joborder from "../components/joborderInfo.vue";
import notification from "../components/notificationInfo.vue";
import dataJoborder from "../components/dataJobOrder.vue";

Vue.use(VueRouter);

const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null;
};

const routes = [
  { path: "/", component: Index },
  { path: "/check-phone", component: CheckPhone },
  { path: "/login", component: Login },
  { path: "/register", component: UserRegister },
  { path: "/user/register", component: mobileRegister },
  {
    path: "/add-car",
    component: AddCar,
    meta: { requiresAuth: true },
  },
  {
    path: "/choose-car",
    component: selectcar,
    meta: { requiresAuth: true },
  },
  {
    path: "/booking",
    component: Booking,
    meta: { requiresAuth: true },
  },
  {
    path: "/joborder",
    component: Joborder,
    meta: { requiresAuth: true },
  },
  {
    path: "/notification",
    component: notification,
    meta: { requiresAuth: true },
  },
  {
    path: "/data/joborder",
    component: dataJoborder,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/");
  } else {
    next();
  }
});

export default router;
