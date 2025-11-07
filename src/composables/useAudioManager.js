const DB_NAME = "audioCacheDB";
const STORE_NAME = "audios";
const DB_VERSION = 1;

const audioList = Array.from({ length: 75 }, (_, i) => ({
  key: `sound${i + 1}`,
  // url: `http://localhost:5000/audio/${i + 1}.m4a`,
  url: `http://localhost:3020/audio/${i + 1}.m4a`,
}));

let db = null;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Open or create the IndexedDB
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Store blob into IndexedDB
 */
function storeAudioBlob(key, blob) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve audio blob from IndexedDB
 */
function getAudioBlob(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Preload all audio files (run on app start)
 */
async function preloadAllAudios(showModal = false) {
  db = db || (await openDB());

  console.log("Preloading audio files...");

  if (showModal) {
    const modal = document.getElementById("loadingModal");
    modal?.classList.remove("hidden");
  }

  for (const { key, url } of audioList) {
    const cached = await getAudioBlob(key);
    if (!cached) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await response.blob();
        await storeAudioBlob(key, blob);
        console.log(`✅ Cached ${key}`);
      } catch (e) {
        console.error(`⚠️ Error caching ${key}:`, e);
      }
    } else {
    }
  }

  if (showModal) {
    const modal = document.getElementById("loadingModal");
    modal?.classList.add("hidden");
  }
}

/**
 * Unlock AudioContext on user interaction (required on mobile)
 */
function unlockAudio() {
  //   audioCtx.resume().then(() => {
  //     console.log("✅ AudioContext resumed (unlocked)");
  //   });

  const silentAudio = new Audio();
  silentAudio.src =
    "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA";
  silentAudio.play().catch(() => {});
  audioCtx.resume().then(() => {});
}

/**
 * Play cached audio file using Web Audio API
 */
async function playCachedAudio(key) {
  db = db || (await openDB());
  const blob = await getAudioBlob(key);
  if (!blob) {
    return;
  }

  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

export { preloadAllAudios, unlockAudio, playCachedAudio };
