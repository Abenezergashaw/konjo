const DB_NAME = "audioCacheDB";
const STORE_NAME = "audios";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function storeAudioBlob(db, key, blob) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function getAudioBlob(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function unlockAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      console.log("✅ AudioContext resumed");
    });
  }
}

async function preloadAllAudios() {
  const db = await openDB();
  const modal = document.getElementById("loadingModal");
  const loadingText = document.getElementById("loadingText");

  if (modal) modal.classList.remove("hidden");

  for (let i = 1; i <= 75; i++) {
    const key = `sound${i}`;
    const cachedBlob = await getAudioBlob(db, key);

    if (!cachedBlob) {
      try {
        const response = await fetch(`http://localhost:3000/audio/${i}.m4a`);
        if (!response.ok) throw new Error(`Fetch failed: ${i}.m4a`);
        const blob = await response.blob();
        await storeAudioBlob(db, key, blob);
        console.log(`✅ Cached: ${key}`);
      } catch (e) {
        console.warn(`❌ Failed to cache ${key}:`, e);
      }
    } else {
      console.log(`📦 Already cached: ${key}`);
    }

    if (loadingText) loadingText.textContent = `Loading ${i}/75`;
  }

  if (modal) modal.classList.add("hidden");
  console.log("✅ All 75 audios cached");
}

async function playCachedAudio(key) {
  const db = await openDB();
  const blob = await getAudioBlob(db, key);
  if (!blob) return console.error("❌ Not cached:", key);

  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
  console.log(`🔊 Playing ${key}`);
}

export {
  openDB,
  getAudioBlob,
  storeAudioBlob,
  preloadAllAudios,
  playCachedAudio,
  unlockAudio,
};
