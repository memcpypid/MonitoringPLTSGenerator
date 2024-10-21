import api from "./api";
export default {
    getGeneratorData() {
      return api.get('/generator');
    },
    
    getPLTSData() {
      return api.get('/plts');
    },
  
    getHistoryData(type, date) {
      return api.get(`/history/${type}?date=${encodeURIComponent(date)}`);
    },
  };