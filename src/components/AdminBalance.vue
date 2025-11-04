<script setup>
import { ref, defineProps, computed, defineEmits } from "vue";

const today = new Date().toISOString().split("T")[0];
const from = ref(today);
const to = ref(today);

const props = defineProps({
  cashflow: Array,
});

const totals = computed(() => {
  const result = props.cashflow.reduce(
    (acc, curr) => {
      acc.total_deposit += curr.total_deposit;
      acc.total_withdrawal += curr.total_withdrawal;
      acc.game_income += curr.game_income;
      acc.bonus_given += curr.bonus_given;
      acc.referrals_bonus += curr.referrals.bonus;
      return acc;
    },
    {
      total_deposit: 0,
      total_withdrawal: 0,
      game_income: 0,
      bonus_given: 0,
      referrals_bonus: 0,
    }
  );

  result.net_profit =
    result.total_deposit +
    result.game_income -
    result.total_withdrawal -
    result.bonus_given -
    result.referrals_bonus;

  result.gameflow =
    result.game_income - result.bonus_given - result.referrals_bonus;

  result.net_cashflow = result.total_deposit - result.total_withdrawal;

  return result;
});

// Helper to color numbers
function profitColor(value) {
  return value > 0
    ? "text-green-500"
    : value < 0
    ? "text-red-500"
    : "text-gray-100";
}

const emit = defineEmits(["get_cashflow_custom"]);

function emitRange() {
  if (from.value > to.value) {
    from.value = to.value;
  }
  emit("get_cashflow_custom", from.value, to.value);
}
</script>

<template>
  <div class="px-4 my-2">
    <div class="flex flex-col justify-center items-center gap-5">
      <div
        class="bg-[#746186] w-full rounded-lg shadow-lg shadow-gray-600 flex justify-center items-center flex-col py-2 tracking-wider text-base px-2 text-white"
      >
        <div class="mb-1 tracking-widest font-bold">Admin Dashboard</div>

        <div
          class="flex flex-row md:flex-row gap-4 items-center w-full py-4 px-2 mb-2 rounded-xl shadow-md border border-teal-200"
        >
          <div class="flex flex-col md:w-1/2 w-full">
            <label class="text-white font-semibold text-sm mb-1"
              >From Date</label
            >
            <input
              v-model="from"
              type="date"
              :max="to"
              :min="'2023-01-01'"
              class="border border-teal-300 text-black rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              @change="emitRange"
            />
          </div>
          <div class="flex flex-col md:w-1/2 w-full">
            <label class="text-white font-semibold text-sm mb-1">To Date</label>
            <input
              v-model="to"
              type="date"
              :min="from"
              :max="today"
              class="border border-teal-300 text-black rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              @change="emitRange"
            />
          </div>
        </div>

        <div
          class="w-full border border-teal-400 px-1 py-2 rounded-lg shadow-md mb-2 text-sm tracking-widest"
        >
          <div class="text-center mb-2 tracking-wider font-semibold text-lg">
            Summary
          </div>
          <div
            :class="`p-2 rounded-lg w-[90%] mx-auto my-2 text-center text-white shadow-md border-b-2 border-gray-300 ${
              totals.net_profit > 0 ? 'bg-teal-600' : 'bg-red-500'
            }`"
          >
            Net Profit : ETB {{ totals.net_profit }}
          </div>
          <div class="flex justify-center items-center gap-6">
            <!-- Profit Column -->
            <div
              class="border-r-4 border-gray-300 shadow-md px-4 py-2 rounded-lg"
            >
              <div class="text-center">
                <span class="font-bold text-gray-100">Game Income</span> <br />
                <span class="text-white tracking-widest"
                  >ETB {{ totals.game_income }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Player Bonuses</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ totals.bonus_given }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Referral Bonuses</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ totals.referrals_bonus }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Net Profit</span> <br />
                <span :class="profitColor(totals.net_profit)"
                  >ETB {{ totals.gameflow }}</span
                >
              </div>
            </div>

            <!-- Cashflow Column -->
            <div
              class="border-l-4 border-gray-300 shadow-md px-4 py-2 rounded-lg"
            >
              <div class="text-center">
                <span class="font-bold text-gray-100">Total Deposits</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ totals.total_deposit }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Total Withdrawals</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ totals.total_withdrawal }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Net Cashflow</span><br />
                <span :class="profitColor(totals.net_cashflow)"
                  >ETB {{ totals.net_cashflow }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown -->
        <div
          v-for="c in cashflow.slice().reverse()"
          :key="c.date"
          class="w-full border border-gray-400 px-1 py-2 rounded-lg shadow-md mb-2 text-sm tracking-widest"
        >
          <div
            class="text-center mb-2 tracking-wider font-semibold text-base text-yellow-500"
          >
            {{ c.date }}
          </div>
          <div class="flex justify-center items-center gap-6">
            <!-- Daily Profit -->
            <div
              class="border-r-4 border-gray-300 shadow-md px-4 py-2 rounded-lg"
            >
              <div class="text-center">
                <span class="font-bold text-gray-100">Game Income</span> <br />
                <span class="text-white tracking-widest"
                  >ETB {{ c.game_income }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Player Bonuses</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ c.bonus_given }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Referral Bonuses</span
                ><br />
                <span class="text-white tracking-widest"
                  >ETB {{ c.referrals.bonus }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Daily Profit</span><br />
                <span
                  :class="
                    profitColor(
                      c.game_income - c.bonus_given - c.referrals.bonus
                    )
                  "
                >
                  ETB {{ c.game_income - c.bonus_given - c.referrals.bonus }}
                </span>
              </div>
            </div>

            <!-- Daily Cashflow -->
            <div
              class="border-l-4 border-gray-300 shadow-md px-4 py-2 rounded-lg"
            >
              <div class="text-center">
                <span class="font-bold text-gray-100">Deposits</span><br />
                <span class="text-white tracking-widest"
                  >ETB {{ c.total_deposit }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Withdrawals</span><br />
                <span class="text-white tracking-widest"
                  >ETB {{ c.total_withdrawal }}</span
                >
              </div>
              <div class="text-center">
                <span class="font-bold text-gray-100">Net Cashflow</span><br />
                <span
                  :class="profitColor(c.total_deposit - c.total_withdrawal)"
                >
                  ETB {{ c.total_deposit - c.total_withdrawal }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
