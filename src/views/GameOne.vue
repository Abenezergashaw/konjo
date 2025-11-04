<script setup>
import Cards from "@/components/Cards.vue";
import Navbar from "@/components/Navbar.vue";
import SelectedCard from "@/components/SelectedCard.vue";
import Balls from "@/components/Balls.vue";
import CurrentBall from "@/components/CurrentBall.vue";
import GameNavbar from "@/components/GameNavbar.vue";
import LastThreeBalls from "@/components/LastThreeBalls.vue";
import PlayingCard from "@/components/PlayingCard.vue";
import WinModal from "@/components/WinModal.vue";
import { io } from "socket.io-client";
import { compile, computed, onMounted, ref } from "vue";
import axios from "axios";
import useCard from "@/composables/useCard";
import { useUrl } from "@/stores/url";
import { useRouter } from "vue-router";
import PlaceholderCard from "@/components/PlaceholderCard.vue";

const { get_card } = useCard();
const url = useUrl();

const router = useRouter();

const socket = io(`${url?.url}`);

const realBalance = ref(0);
const bonusBalance = ref(0);
const phone = ref(null);
const telegarmId = ref(null);
const stake = 20;
const game = ref(null);
const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
const winnersData = ref([]);
const winnersLine = ref(null);
const winnerModal = ref(false);
const gameEndCounter = ref(8);
let gameEndInterval = null;
const errorMessage = ref(null);
const errorCarNumber = ref(null);

const userHasSelectedCartela = computed(() => {
  if (game.value) {
    const match = game?.value?.players.find((p) => p.user_id === phone.value);

    if (match) {
      const cards = [];
      match.cartela_number.forEach((c) => {
        cards.push(get_card(c));
      });
      return {
        status: true,
        card: cards,
      };
    }
    return {
      status: false,
      card: 0,
    };
  }
  return {
    status: false,
    card: 0,
  };
});

socket.on("user joined", ({ id, data, g }) => {
  realBalance.value = data.balance;
  bonusBalance.value = data.bonus;
  phone.value = data.phone;
  telegarmId.value = data.telegram_id;
  game.value = JSON.parse(g);
});

socket.on(`timer_${stake}`, (g) => {
  game.value = JSON.parse(g);
});

socket.on(`game_ended_${stake}`, (g) => {
  game.value = JSON.parse(g);
});

socket.on(`selected_card_respose_${stake}`, (games) => {
  game.value = JSON.parse(games);
});

socket.on(`drawing_numbers_${stake}`, (g) => {
  game.value = JSON.parse(g);
});

socket.on(`bingo_${stake}`, (g) => {
  game.value = JSON.parse(g);
  const winners = game.value.winners;
  gameEndCounter.value = 8;
  winnerModal.value = true;

  // if (gameEndInterval) clearInterval(gameEndInterval);
  // gameEndInterval = setInterval(() => {
  //   gameEndCounter.value--;
  //   if (gameEndCounter.value <= 0) {
  //     winnersData.value = [];
  //     winnerModal.value = false;
  //     clearInterval(gameEndInterval);
  //   }
  // }, 1000);

  if (gameEndInterval) clearInterval(gameEndInterval);

  const duration = 6000; // 6 seconds
  const endTime = Date.now() + duration;

  gameEndInterval = setInterval(() => {
    const remaining = Math.max(0, endTime - Date.now());
    gameEndCounter.value = Math.ceil(remaining / 1000);

    if (remaining <= 0) {
      winnersData.value = [];
      winnerModal.value = false;
      clearInterval(gameEndInterval);
    }
  }, 200);

  winners.forEach((w) => {
    const n = w.c;
    const card = get_card(n);
    winnersData.value.push({
      card: card,
      username: w.name,
      d: game.value.drawn_numbers,
      c: game.value.current_number,
      unique: w.unique,
    });
  });

  socket.emit("getBalance", phone.value);
});

socket.on("getBalance", (data) => {
  realBalance.value = data.balance;
  bonusBalance.value = data.bonus;
});

socket.on(`blockUser_${stake}`, (g) => {
  game.value = JSON.parse(g);
});

socket.on("errorMessage", (msg, n) => {
  errorMessage.value = msg;
  errorCarNumber.value = n;
  setTimeout(() => {
    errorMessage.value = null;
    errorCarNumber.value = null;
  }, 5000);
});

function handleCardSelect(n) {
  const card = get_card(n);
  card.value = card;
  socket.emit("cartela_selected", n, stake, phone.value);
}

function handleBingo(cartelaNumber) {
  socket.emit("checkBingo", phone.value, cartelaNumber, stake);
}

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
  // const id = "353008986";

  socket.emit("set username", id, stake);
});
</script>

<template>
  <div
    class="text-3xl text-white text-center tracking-wider my-2 animate-bounce"
  >
    ሙሉ ዝግ ሁሌም 1 ሰአት ላይ
  </div>

  <div v-if="!game?.active">
    <Navbar :wallet="realBalance + bonusBalance" :game="game" :stake="20" />

    <Cards :game="game" :phone="phone" @selectCard="handleCardSelect" />
    <SelectedCard
      v-if="userHasSelectedCartela.status"
      :card="userHasSelectedCartela.card"
    />
  </div>
  <div v-if="game?.active">
    <GameNavbar :game="game" :stake="stake" />
    <div class="flex h-[100%] justify-center mt-2 gap-1 py-2">
      <div class="flex-1 flex flex-col gap-1">
        <CurrentBall :game="game" />
        <LastThreeBalls :game="game" />
        <Balls :numbers="numbers" :game="game" />
      </div>
      <div class="flex-1">
        <div
          class="bg-white rounded-lg border-2 border-gray-300 flex-1 h-14 flex justify-start items-center text-lg font-bold text-red-500 bg-opacity-50 px-2 uppercase tracking-wider"
        >
          <span class="font-bold">Started</span>
        </div>
        <!-- 
        <CurrentBall :game="game" />
        <LastThreeBalls :game="game" /> -->
        <PlayingCard
          v-if="userHasSelectedCartela.status"
          :card="userHasSelectedCartela.card"
          :game="game"
          :phone="phone"
          :errorMessage="errorMessage"
          :errorCard="errorCarNumber"
          @handleBingo="handleBingo"
        />
        <PlaceholderCard v-if="!userHasSelectedCartela.status" />
      </div>
    </div>
  </div>
  <WinModal
    v-if="winnerModal"
    :winnersData="winnersData"
    :counter="gameEndCounter"
  />
</template>
