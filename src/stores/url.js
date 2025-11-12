import { defineStore } from "pinia";

export const useUrl = defineStore("url", {
  state: () => ({
    // url: "http://192.168.1.9:3020",
    url: "https://konjo.gondarmenu.com",
  }),
});
