import axios from "axios";
let baseUrl;
if (process.env.NODE_ENV === "production") {
    baseUrl = process.env.VUE_APP_SERVER || "https://smartsolarlogger.my.id/api";
} else {
    baseUrl = process.env.BASE_URL + "api";
}

const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Credentials": true
    },
    withCredentials: true
});


export default api;