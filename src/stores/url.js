import { defineStore } from "pinia";

export const useUrl = defineStore("url", {
  state: () => ({
    url: "http://localhost:3010",
    // url: "https://kidus.gondarmenu.com",
  }),
});
