// composables/useAudioPlayer.js
import { openDB, getAudioById } from "@/utils/indexeddb";
import { useAudioContext } from "./useAudioContext";
import { ref } from "vue";
let currentSource = null; // Track global source

export const state = ref("Idle");

export async function playAudio(id) {
  const db = await openDB();
  const audioEntry = await getAudioById(db, "audios", id);
  const { audioCtx, unlock } = useAudioContext();

  await unlock(); // ensure context is resumed

  if (!audioEntry?.blob) {
    console.error("Missing audio blob");
    return;
  }

  try {
    const arrayBuffer = await audioEntry.blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    if (currentSource) {
      currentSource.stop();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    source.onended = () => {
      state.value = "Stopped";
    };

    source.start();
    state.value = "Playing";
    currentSource = source;
  } catch (err) {
    console.warn("Playback failed", err);
    state.value = "Not Playing";
  }
}

export function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      console.warn("Audio already stopped");
    }
    currentSource = null;
  }
}
