<script setup>
import AdminBalance from "@/components/AdminBalance.vue";
import { onMounted, ref } from "vue";
import { useAdminBalance } from "@/composables/useAdminBalance";

const { get_cashflow } = useAdminBalance();

const user = ref(null);
const isAdmin = ref(false);
const cashflow = ref([]);

const handle_get_cashflow = async (from, to) => {
  if (user.value === "353008986") {
    cashflow.value = await get_cashflow(user.value, from, to);
  }
  //   console.log(from, to);
};

async function getTelegramId(retries = 5, delay = 500) {
  for (let i = 0; i < retries; i++) {
    const tg = window.Telegram?.WebApp;

    const id = tg.initDataUnsafe?.user?.id;
    if (id) {
      return id; // ✅ got it
    }

    // wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Unable to fetch Telegram ID after retries");
}

onMounted(async () => {
  const id = await getTelegramId();

  if (id == "353008986" || id == "8276444233") {
    isAdmin.value = true;
    user.value = id;
    cashflow.value = await get_cashflow(user.value);
  }
  //   cashflow.value = await get_cashflow("934596919");
});
</script>

<template>
  <div
    v-if="!isAdmin"
    class="fixed inset-0 w-full h-full bg-black bg-opacity-50"
  >
    <div
      class="absolute top-1/3 left-1/2 w-16 h-16 border-8 border-amber-300 border-t-amber-500 animate-spin rounded-full"
    ></div>
  </div>

  <AdminBalance
    v-if="isAdmin"
    :cashflow="cashflow"
    @get_cashflow_custom="handle_get_cashflow"
  />
</template>
