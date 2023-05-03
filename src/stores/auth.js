import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";
import instance from "@/services/AxiosInstance";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {},
        token: localStorage.getItem("token"),
    }),
    getters: {
        loggedIn: (state) => state.token !== null,
    },
    actions: {
        loginUser(data) {
            AxiosInstance.get('/sanctum/csrf-cookie')

          return   AxiosInstance.post('/login', {
                ...data
            }).then((response) => {
                this.token = response.data.token;
                this.user= response.data.user;
                localStorage.setItem('token', this.token);
                instance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                console.log(response)
            })

        },
        logout() {
            this.user = {};
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
            delete AxiosInstance.defaults.headers.common['Authorization'];
            AxiosInstance.post('/logout')
                .then(() => {
                })

        },
        registerUser(data) {
         return    AxiosInstance.post('/register', {
                ...data
            }).then((response) => {
                this.token = response.data.token;
                this.user= response.data.user;
                localStorage.setItem('token', this.token);
                AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            })
        },
    },
    persist: true,
})