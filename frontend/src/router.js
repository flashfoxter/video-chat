import Vue from 'vue';
import Router from 'vue-router';
import MainView from "@/views/MainView";
import RoomView from "@/views/RoomView";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView
    },
    {
      path: "/room/:room",
      name: "room",
      component: RoomView,
      props: true,
      beforeEnter(to, from, next) {
        if (to.params.room) {
          next();
        }
        else {
          next(false);
        }
      }
    },
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "",
      redirect: "/"
    }
  ]
});
