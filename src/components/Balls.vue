<script setup>
import { defineProps } from "vue";

const props = defineProps({
  numbers: Array,
  game: Object,
});

const columns = Array.from({ length: 5 }, (_, colIndex) =>
  props.numbers.slice(colIndex * 15, (colIndex + 1) * 15)
);

const headers = ["B", "I", "N", "G", "O"];
</script>

<template>
  <div class="h-full">
    <div class="w-[100%] rounded mt-1">
      <div class="grid grid-cols-5 gap-2 text-center p-1">
        <!-- Headers -->
        <div
          v-for="(header, i) in headers"
          :key="'header-' + i"
          class="font-bold text-xl text-[#fff] rounded"
          :class="`${
            header === 'B'
              ? 'bg-[#E33739]'
              : header === 'I'
              ? 'bg-[#FDB300]'
              : header === 'N'
              ? 'bg-[#4BA04D]'
              : header === 'G'
              ? 'bg-[#1D8AEB]'
              : header === 'O'
              ? 'bg-[#7E3098]'
              : 'bg-white'
          }`"
        >
          {{ header }}
        </div>

        <!-- Grid Columns -->
        <div
          v-for="(column, colIndex) in columns"
          :key="'col-' + colIndex"
          class="flex flex-col gap-2"
        >
          <div
            v-for="number in column"
            :key="number"
            class="transition-color duration-200"
            :class="`${
              number === (game?.current_number || 0)
                ? ' animate-ping text-black'
                : game?.drawn_numbers.includes(number)
                ? 'bg-yellow-500 text-white'
                : ' '
            }
                text-center  font-bold rounded flex items-center justify-center text-lg h-8 text-black bg-gray-100 bg-opacity-80 border-2 border-white`"
          >
            {{ number }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
