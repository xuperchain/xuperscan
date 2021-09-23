import Vue from "vue";
import VueRouter from "vue-router";

if (!window.VueRouter) {
  Vue.use(VueRouter);
}
//懒加载
const Home = () => import('../views/Home.vue');
const Transaction = () => import('../views/Transaction.vue');

const BlockDetails = () => import('../views/BlockDetails.vue');
const Null = () => import('../views/null.vue');
const routes = [{
  path: "/",
  name: "Home",
  component: Home,
  meta: {
    keepAlive: true
  }
},
{
  path: "/transaction",
  name: "Transaction",

  component: Transaction,
  meta: {
    keepAlive: false
  }
},
{
  path: "/blockDetails",
  name: "BlockDetails",

  component: BlockDetails,
  meta: {
    keepAlive: false
  }
},
{
  path: "/null",
  name: "Null",

  component: Null,
  meta: {
    keepAlive: false
  }
},
];

const router = new VueRouter({
  routes
});
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  // 清空无用的页面缓存
  let toDepth = to.path.split('/').length
  let fromDepth = from.path.split('/').length
  if (toDepth < fromDepth) {
    from.meta.keepAlive = false
    to.meta.keepAlive = true
  }
  next()
})
export default router;