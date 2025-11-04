<script setup>
defineProps({
  game: Object,
});

function get_letter(n) {
  let l = "O";
  let bg = "bg-[#3D75CC]";
  if (n >= 1 && n < 16) {
    l = "B";
    bg = "bg-[#E33739]";
  } else if (n >= 6 && n < 31) {
    l = "I";
    bg = "bg-[#FDB300]";
  } else if (n >= 31 && n < 46) {
    l = "N";
    bg = "bg-[#4BA04D]";
  } else if (n >= 46 && n < 61) {
    l = "G";
    bg = "bg-[#1D8AEB]";
  } else if (n >= 61 && n < 76) {
    l = "O";
    bg = "bg-[#7E3098]";
  } else {
    l = "";
    bg = "bg-[#3D75CC]";
  }
  return { l, bg };
}
</script>
<template>
  <div
    class="bg-teal-500 border-2 border-gray-300 flex-1 h-16 flex justify-between items-center text-sm font-bold text-white px-2 uppercase tracking-wider mt-3 rounded-full"
  >
    <span class="font-bold">Current Call</span>
    <span
      class="font-bold w-12 h-12 flex justify-center items-center rounded-full"
      :class="`${get_letter(game?.current_number).bg}`"
      >{{ get_letter(game?.current_number).l }}-{{ game?.current_number }}</span
    >
  </div>
</template>
