import axios from "axios";
let baseUrl;
if (process.env.VUE_APP_NODE_ENV === "production") {
  baseUrl = process.env.VUE_APP_SERVER;
} else {
  baseUrl = process.env.VUE_APP_BASE_URL;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default {
  Login(data) {
    return api.post("/users/login", data);
  },
  Logout() {
    return api.post("/users/logout");
  },
  Register(data) {
    return api.post("/users/register", data);
  },
  getUser() {
    return api.get("/users");
  },
  getGeneratorData() {
    return api.get("/generator");
  },
  getPLTSData() {
    return api.get("/plts");
  },
  getGeneratorDataLast() {
    return api.get("/generator/last");
  },
  getPLTSDataLast() {
    return api.get("/plts/last");
  },
  getHistoryData(type, date) {
    return api.get(`/history/${type}?date=${encodeURIComponent(date)}`);
  },
  GetStatus() {
    return api.get("/status");
  },
  CreatePanen(data) {
    return api.post("/hasilpanen", data);
  },
  GetAllPanen(params) {
    return api.get("/hasilpanen", { params });
  },
  GetPanenByid(id) {
    return api.get(`/hasilpanen/${id}`);
  },
  DeletePanen(id) {
    return api.delete(`/hasilpanen/${id}`);
  },
  UpdatePanen(id, data) {
    return api.put(`/hasilpanen/${id}`, data);
  },
};
