import { defineStore } from "pinia";

export const useUrl = defineStore("url", {
  state: () => ({
    url: "http://localhost:3020",
    // url: "https://konjo.gondarmenu.com",
  }),
});
