<script setup>
defineProps({
  game: Object,
  stake: Number,
});
</script>

<template>
  <div class="flex justify-between items-center gap-1">
    <div
      class="bg-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg font-bold text-teal-500"
    >
      <span class="font-bold">Derash</span>
      <span>
        {{
          (game?.players || []).reduce(
            (total, p) =>
              p.is_active && Array.isArray(p.cartela_number)
                ? total + p.cartela_number.length
                : total,
            0
          ) *
            game?.value *
            0.8 || 0
        }}
      </span>
    </div>
    <div
      class="bg-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg text-teal-500"
    >
      <span class="font-bold">Players</span>
      <span>
        {{
          (game?.players || []).reduce(
            (total, p) =>
              p.is_active ? total + p.cartela_number.length : total,
            0
          )
        }}</span
      >
    </div>
    <div
      class="bg-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg text-teal-500"
    >
      <span class="font-bold">Bet</span>
      <span>{{ stake }}</span>
    </div>
    <div
      class="bg-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex flex-col justify-center items-center text-lg text-teal-500"
    >
      <span class="font-bold">Call</span>
      <span>
        {{ game?.counter }}
      </span>
    </div>
  </div>
</template>
