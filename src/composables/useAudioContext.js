import { ref } from "vue";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const isUnlocked = ref(false);

export function useAudioContext() {
  const unlock = async () => {
    if (!isUnlocked.value && audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
        console.log("✅ AudioContext resumed");
        isUnlocked.value = true;
      } catch (e) {
        console.warn("❌ Failed to unlock AudioContext", e);
        isUnlocked.value = false;
      }
    }
  };

  return { audioCtx, unlock, isUnlocked };
}
