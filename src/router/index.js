import Vue from 'vue'
import Router from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import home from "../components/home";
import login from "../components/login";
import more from "../components/more";

// import {
//   Button,Icon,Link,Radio,Row,Col,Container,Header,Main,Footer,Aside,
//   Carousel,CarouselItem,
// } from 'element-ui';

Vue.use(Router)
Vue.use(ElementUI)
export default new Router({
  routes: [
    {
      path:'/',
      redirect:"/login"
    },
    {
      path: '/home',
      component:home
    },
    {
      path: '/login',
      component:login
    },
    {
      path: '/more',
      component:more
    },
  ]
})
