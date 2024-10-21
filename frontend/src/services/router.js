import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import History from "../views/History.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import store from "@/services/store";
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            title: "Home",
            authRequired: true,
        },
    },
    {
        path: "/history",
        name: "History",
        component: History,
        meta: {
            title: "History",
            authRequired: true,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            title: "Login",
        },
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: {
            title: "Register",
        },
    },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: () => import("../views/NotFound.vue"),
        meta: {
            title: "404 Not Found",
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (!store.state.isStoreUpdated) {
        await store.dispatch("updateStore");
    }
    
    const isAuthenticated = store.state.userLoggedIn;

    if (!isAuthenticated && to.meta.authRequired) {
        next({ name: "Login" });
    } else if (isAuthenticated && to.meta.authForbidden) {
        next({ name: "Home" });
    } else {
        next();
    }
});

router.afterEach((to) => {
    document.title = to.meta.title || "Default Title"; // Judul default
});

export default router;
