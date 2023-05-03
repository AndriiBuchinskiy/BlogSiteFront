import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import SinglePost from "@/components/SinglePost.vue";
import CreatePost from "@/views/CreatePost.vue";
import PostView from "@/views/PostView.vue";


const routes = [
    {
        path: "/",
        name: "Home",
        component: SinglePost,
        meta: { requiresAuth: true }
    },
    {
        path: "/login",
        name: "login",
        component: LoginView
    },
    {
        path: "/register",
        component: RegisterView
    },
    {
        path: "/createPost",
        name: "CreatePost",
        component: CreatePost,
        meta: { requiresAuth: true }

    },
    {
        path: "/posts/:id",
        name: "PostView",
        component: PostView,
        meta: { requiresAuth: true }

    },
    {
        path: '/404',
        name: '404',
        component: () => '',
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },

]

const router = createRouter({
    routes,
    history: createWebHashHistory(process.env.BASE_URL)
})

router.beforeEach((to, from, next) => {
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = localStorage.getItem('auth') !== null ;

    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else
    {
        next();
    }
});











export default router;