import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CategoryView from "@/views/CategoryView.vue";
import TagsView from "@/views/TagsView.vue";
import SinglePost from "@/components/SinglePost.vue";
import CreatePost from "@/views/CreatePost.vue";

const routes = [
    {
        path: "/",
        component: SinglePost
    },
    {
        path: "/login",
        component: LoginView
    },
    {
        path: "/register",
        component: RegisterView
    },
    {
        path: "/category",
        component: CategoryView
    },
    {
        path: "/tags",
        component: TagsView
    },
    {
        path: "/posts",
        component: SinglePost
    },
    {
        path: "/createPost",
        component: CreatePost
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(process.env.BASE_URL)
})

export default router;