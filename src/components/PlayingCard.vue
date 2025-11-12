<script setup>
import { computed, ref, watch } from "vue";
const props = defineProps({
  card: {
    type: Array,
    required: true,
  },
  game: Object,
  phone: String,
  errorMessage: String,
  errorCard: Number,
});

const userSelectedNumbers = ref({});

watch(
  () => props.card,
  (newCards) => {
    if (Array.isArray(newCards)) {
      newCards.forEach((card) => {
        if (!userSelectedNumbers.value[card.id]) {
          userSelectedNumbers.value[card.id] = [];
        }
      });
    }
  },
  { immediate: true, deep: true } // immediate runs it on mount
);

function handleNumberSelect(n, card) {
  const called = userSelectedNumbers.value[card];

  const index = called.indexOf(n);
  if (index !== -1) {
    called.splice(index, 1);
  } else {
    called.push(n);
  }
}

const getBlockedStatus = (n) => {
  const player = props.game.players.find((p) => p.user_id === props.phone);
  if (player) {
    const blocked = player?.blocked.find((p) => p.num === n);
    // console.log(player, n, blocked);
    // console.log(blocked ? blocked?.status : false);
    return blocked ? blocked?.status : false;
  }
  // return false;
};

const status = computed(() => {
  const player = props.game.players.find((p) => p.user_id === props.phone);
  return player ? player.blocked : false;
});
</script>

<template>
  <div v-for="c in card" class="mt-4 p-2 border rounded-xl shadow-md">
    <div class="text-sm text-gray-100 text-center tracking-wider my-1">
      Cartela {{ c.id }}
    </div>
    <div class="grid grid-cols-5 gap-1 text-center font-bold text-sm mb-2">
      <div
        v-for="letter in ['B', 'I', 'N', 'G', 'O']"
        :key="letter"
        class="rounded-lg text-white font-bold backdrop-blur-lg"
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
        class="flex items-center justify-center w-7 h-7 text-sm font-semibold text-gray-800 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300"
        @click="handleNumberSelect(c[key], c.id)"
        :class="`${
          game?.current_number === c[key]
            ? ' animate-bounce text-white'
            : userSelectedNumbers[c.id].includes(c[key])
            ? 'bg-amber-500 text-white'
            : 'bg-gray-200'
        }`"
      >
        {{ c[key] }}
      </div>

      <div
        v-for="key in ['b2', 'i2', 'n2', 'g2', 'o2']"
        :key="key"
        @click="handleNumberSelect(c[key], c.id)"
        class="flex items-center justify-center w-7 h-7 text-sm font-semibold text-gray-800 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300"
        :class="`${
          game?.current_number === c[key]
            ? ' animate-bounce text-white'
            : userSelectedNumbers[c.id].includes(c[key])
            ? 'bg-amber-500 text-white'
            : 'bg-gray-200'
        }`"
      >
        {{ c[key] }}
      </div>

      <div
        v-for="key in ['b3', 'i3', 'n3', 'g3', 'o3']"
        :key="key"
        @click="handleNumberSelect(c[key], c.id)"
        class="flex items-center justify-center w-7 h-7 text-sm font-semibold text-gray-800 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300"
        :class="`${
          game?.current_number === c[key]
            ? ' animate-bounce text-white'
            : userSelectedNumbers[c.id].includes(c[key])
            ? 'bg-amber-500 text-white'
            : 'bg-gray-200'
        }`"
      >
        <span v-if="key === 'n3'" class="text-gray-500 font-medium">★ </span>
        <span class="text-sm font-semibold" v-else>{{ c[key] }}</span>
      </div>

      <div
        v-for="key in ['b4', 'i4', 'n4', 'g4', 'o4']"
        :key="key"
        @click="handleNumberSelect(c[key], c.id)"
        class="flex items-center justify-center w-7 h-7 text-sm font-semibold text-gray-800 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300"
        :class="`${
          game?.current_number === c[key]
            ? ' animate-bounce text-white'
            : userSelectedNumbers[c.id].includes(c[key])
            ? 'bg-amber-500 text-white'
            : 'bg-gray-200'
        }`"
      >
        {{ c[key] }}
      </div>

      <div
        v-for="key in ['b5', 'i5', 'n5', 'g5', 'o5']"
        :key="key"
        @click="handleNumberSelect(c[key], c.id)"
        class="flex items-center justify-center w-7 h-7 text-sm font-semibold text-gray-800 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300"
        :class="`${
          userSelectedNumbers[c.id].includes(c[key])
            ? 'bg-amber-500 text-white'
            : game?.current_number === c[key]
            ? '    animate-bounce text-white'
            : 'bg-gray-200'
        }`"
      >
        {{ c[key] }}
      </div>
    </div>
    <div
      v-if="errorMessage && c.id === errorCard"
      class="text-center text-white tracking-wide text-sm mt-1"
    >
      {{ errorMessage }}
    </div>
    <button
      @click="$emit('handleBingo', c.id)"
      class="w-full py-4 rounded-xl my-2 text-sm font-bold tracking-wider border border-white flex justify-center items-center"
      :class="`${
        getBlockedStatus(c.id)
          ? 'bg-red-500 text-white'
          : 'bg-amber-300 text-black'
      }`"
    >
      BINGO!
    </button>
  </div>
</template>

<style scoped>
.bingo-cell {
  @apply flex items-center justify-center w-7 h-7 text-lg font-semibold text-gray-800 bg-gray-200 border-2 border-white rounded-lg backdrop-blur-md transition-all duration-300;
}
</style>
