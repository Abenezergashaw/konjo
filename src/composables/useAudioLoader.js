// // composables/useAudioLoader.js
// import { openDB, saveAudio } from "@/utils/indexeddb";

// const loading_audio = ref(false)

// export async function loadAllAudios() {
//   const db = await openDB();

//   for (let i = 1; i <= 75; i++) {
//     const response = await fetch(`http://localhost:5000/audio/${i}.m4a`);
//     const blob = await response.blob();

//     await saveAudio(db, "audios", {
//       id: i,
//       name: `Audio ${i}`,
//       blob,
//     });
//   }

//   console.log("All 75 audios loaded to IndexedDB.");
// }

// composables/useAudioLoader.js
// composables/useAudioLoader.js
import { ref } from "vue";
import { openDB, saveAudio } from "@/utils/indexeddb";

export const loading_audio = ref(false);
export const loaded_count = ref(0);

export async function loadAllAudios() {
  loading_audio.value = true;
  loaded_count.value = 0;
  try {
    const db = await openDB();

    for (let i = 1; i <= 75; i++) {
      const response = await fetch(`http://localhost:3020/audio/${i}.m4a`);
      if (!response.ok) throw new Error(`Failed to fetch audio ${i}`);

      const blob = await response.blob();

      await saveAudio(db, "audios", {
        id: i,
        name: `Audio ${i}`,
        blob,
      });

      loaded_count.value = i; // update progress
    }
  } catch (error) {
    console.error("Error loading audios:", error);
  } finally {
    loading_audio.value = false;
  }
}
