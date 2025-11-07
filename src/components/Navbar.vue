<script setup>
defineProps({
  wallet: Number,
  game: Object,
  stake: Number,
});
</script>

<template>
  <div class="flex justify-between items-center gap-1">
    <div
      class="text-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex justify-center items-center text-2xl font-extrabold bg-[#2C2304]"
    >
      {{ game?.count || 0 }}
    </div>
    <div
      class="text-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg font-bold bg-[#2C2304]"
    >
      <span class="font-bold">Wallet</span>
      <span>{{ wallet }}</span>
    </div>
    <div
      class="text-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg bg-[#2C2304]"
    >
      <span class="font-bold">Stake</span>
      <span>{{ stake }}</span>
    </div>
  </div>
</template>
