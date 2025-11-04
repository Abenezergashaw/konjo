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
    class="bg-white rounded-lg border-2 border-gray-300 h-14 flex justify-center items-center gap-2 font-bold text-white bg-opacity-50 px-2 uppercase tracking-wider my-2"
  >
    <span
      class="font-bold w-12 h-12 flex justify-center items-center rounded-full"
      :class="`${get_letter(game?.drawn_numbers[game?.counter - 3]).bg}`"
      >{{ get_letter(game?.drawn_numbers[game?.counter - 3]).l }}-{{
        game?.drawn_numbers[game?.counter - 3]
      }}</span
    >
    <span
      class="font-bold w-12 h-12 flex justify-center items-center rounded-full"
      :class="`${get_letter(game?.drawn_numbers[game?.counter - 2]).bg}`"
      >{{ get_letter(game?.drawn_numbers[game?.counter - 2]).l }}-{{
        game?.drawn_numbers[game?.counter - 2]
      }}</span
    >
    <span
      class="font-bold w-12 h-12 flex justify-center items-center rounded-full"
      :class="`${get_letter(game?.drawn_numbers[game?.counter - 1]).bg}`"
      >{{ get_letter(game?.drawn_numbers[game?.counter - 1]).l }}-{{
        game?.drawn_numbers[game?.counter - 1]
      }}</span
    >
  </div>
</template>
