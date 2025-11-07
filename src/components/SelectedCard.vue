<script setup>
import { watch } from "vue";

const props = defineProps({
  card: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="flex gap-1">
    <div
      v-for="c in card"
      class="flex flex-col justify-center items-center mx-auto mt-4 p-2 border rounded-xl shadow-md"
    >
      <div class="text-lg text-gray-200 text-center tracking-wider">
        Cartela {{ c?.id }}
      </div>
      <div
        v-if="true"
        class="grid grid-cols-5 gap-1 text-center font-bold text-xl mb-2"
      >
        <div
          v-for="letter in ['B', 'I', 'N', 'G', 'O']"
          class="bingo-head"
          :key="letter"
          :class="`${
            letter === 'B'
              ? 'bg-[#E33739]'
              : letter === 'I'
              ? 'bg-[#FDB300]'
              : letter === 'N'
              ? 'bg-[#4BA04D]'
              : letter === 'G'
              ? 'bg-[#1D8AEB]'
              : letter === 'O'
              ? 'bg-[#7E3098]'
              : 'bg-white'
          }`"
        >
          {{ letter }}
        </div>
      </div>
      <div class="grid grid-cols-5 gap-1">
        <div
          v-for="key in ['b1', 'i1', 'n1', 'g1', 'o1']"
          :key="key"
          class="bingo-cell"
        >
          {{ c[key] }}
        </div>

        <div
          v-for="key in ['b2', 'i2', 'n2', 'g2', 'o2']"
          :key="key"
          class="bingo-cell"
        >
          {{ c[key] }}
        </div>

        <div
          v-for="key in ['b3', 'i3', 'n3', 'g3', 'o3']"
          :key="key"
          class="bingo-cell"
        >
          <span v-if="key === 'n3'" class="text-gray-500 font-medium">★ </span>
          <span class="text-lg font-semibold text-gray-800" v-else>{{
            c[key]
          }}</span>
        </div>

        <div
          v-for="key in ['b4', 'i4', 'n4', 'g4', 'o4']"
          :key="key"
          class="bingo-cell"
        >
          {{ c[key] }}
        </div>

        <div
          v-for="key in ['b5', 'i5', 'n5', 'g5', 'o5']"
          :key="key"
          class="bingo-cell"
        >
          {{ c[key] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bingo-cell {
  @apply flex items-center justify-center text-center w-8 h-8 text-lg font-semibold text-gray-800 bg-gray-200 border-2 border-white rounded-lg;
}
.bingo-head {
  @apply flex items-center justify-center text-center w-8 h-8 text-lg font-semibold text-gray-200  rounded-lg;
}
</style>
