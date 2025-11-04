<script setup>
import { defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  winnersData: Array,
  counter: Number,
});

const emit = defineEmits();

const columns = ["b", "i", "n", "g", "o"];

function getNumber(row, col, index) {
  const key = `${columns[col]}${row + 1}`;
  const val = props.winnersData[index].card[key];
  return val === null ? "★" : Number(val);
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-gray-800 bg-opacity-90 z-50 overflow-y-auto">
      <div
        class="bg-gray-300 bg-opacity-100 w-[90%] max-h-screen mx-auto mt-32 p-4 rounded-lg overflow-y-auto"
        style="height: 500px"
      >
        <div class="text-center text-lg tracking-wider my-1 text-teal-500">
          {{ winnersData.length }} Winners
        </div>
        <div
          v-for="(win_card, index) in winnersData"
          :key="index"
          class="w-[90%] sm:w-[60%] mx-auto mb-2 bg-amber-300 p-4 rounded-lg shadow-lg"
        >
          <div class="text-lg font-bold text-center text-white mb-2 gap-2">
            <div class="text-black">🏆 {{ win_card.username }} Won!! 🏆</div>
            <div class="text-black text-sm">
              Cartela #{{ win_card.card.id }}
            </div>
          </div>

          <!-- Header Row -->
          <div
            class="grid grid-cols-5 gap-1 text-center font-bold text-white text-lg mb-2"
          >
            <div
              class="border-1 rounded-xl py-1"
              v-for="h in ['B', 'I', 'N', 'G', 'O']"
              :key="h"
              :class="`${
                h === 'B'
                  ? 'bg-[#E33739]'
                  : h === 'I'
                  ? 'bg-[#FDB300]'
                  : h === 'N'
                  ? 'bg-[#4BA04D]'
                  : h === 'G'
                  ? 'bg-[#1D8AEB]'
                  : h === 'O'
                  ? 'bg-[#7E3098]'
                  : 'bg-white'
              }`"
            >
              {{ h }}
            </div>
          </div>

          <!-- Bingo numbers -->
          <div class="grid grid-cols-5 gap-1 text-center">
            <div v-for="(row, rowIndex) in 5" :key="rowIndex" class="contents">
              <div
                v-for="(col, colIndex) in 5"
                :key="colIndex"
                :class="[
                  'aspect-square', // Makes it a square
                  'w-full', // Take full width in grid cell
                  'rounded-2xl',
                  'border-4',
                  ' font-semibold flex items-center justify-center',
                  getNumber(rowIndex, colIndex, index) === '★'
                    ? 'border-0 bg-gray-500 text-white'
                    : win_card.c === getNumber(rowIndex, colIndex, index)
                    ? 'bg-green-500 text-white text-2xl tracking-wider border-yellow-500 animate-pulse'
                    : win_card.unique.includes(
                        getNumber(rowIndex, colIndex, index)
                      )
                    ? 'border-yellow-600 bg-green-500 text-white text-lg tracking-wider'
                    : !win_card.unique.includes(
                        getNumber(rowIndex, colIndex, index)
                      ) &&
                      win_card.d.includes(getNumber(rowIndex, colIndex, index))
                    ? 'border-yellow-600 bg-gray-500 text-black text-lg tracking-wider'
                    : 'border-0 bg-gray-500 text-white',
                ]"
              >
                {{ getNumber(rowIndex, colIndex, index) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        class="w-[90%] mx-auto py-4 bg-amber-300 rounded-xl my-2 text-black text-2xl font-extrabold tracking-wider border border-white flex justify-center items-center"
      >
        {{ counter }}
      </button>
    </div>
  </Teleport>
</template>
