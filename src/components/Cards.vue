<script setup>
const props = defineProps({
  game: Object,
  phone: String,
});

const emit = defineEmits();

const getNumberColor = (number) => {
  const match = props.game?.players.find(
    (p) => Array.isArray(p.cartela_number) && p.cartela_number.includes(number)
  );

  if (!match) return "bg-gray-200 opacity-85 rounded"; // Not selected
  return match.user_id === props.phone
    ? "bg-yellow-500 opacity-100 rounded-xl"
    : "bg-gray-700 bg-opacity-80 rounded-xl text-white";
};
</script>

<template>
  <div
    class="flex justify-center py-2 px-2 flex-wrap overflow-y-scroll border-4 mt-2 rounded-lg"
    style="height: 400px"
  >
    <div
      v-for="n in 400"
      :key="n"
      @click="$emit('selectCard', n)"
      class="flex items-center justify-center w-8 h-8 m-1 text-sm font-semibold rounded-lg text-black"
      :class="getNumberColor(n)"
    >
      {{ n }}
    </div>
  </div>
</template>

<style scoped>
/* Optional scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: teal; /* Tailwind blue-300 */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: teal; /* Tailwind blue-400 */
}
</style>
