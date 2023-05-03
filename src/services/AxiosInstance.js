import axios from "axios";
//axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With']='XMLHttpRequest';
const instance = axios.create({
    baseURL: 'http://localhost:86/api',
    headers:{'Content-Type': 'multipart/form-data'},
    //headers: {'Content-Type': 'application/json'}
});


const token = localStorage.getItem('token');
if (token) {
    instance.interceptors.request.use((config) => {
        if (token){
            config.headers["Authorization"] = "Bearer " + token
        }
        return config
    })
    //instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
/*
const xsrfToken = localStorage.getItem('XSRF-TOKEN');

if (xsrfToken) {
    instance.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken;
}

 */
export default instance;
