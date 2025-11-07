// utils/indexeddb.js
export function openDB(dbName = "audioDB", storeName = "audios") {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = () => reject("IndexedDB error");

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
  });
}

export function saveAudio(db, storeName, audio) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(audio);
  return tx.done;
}

export function getAudioById(db, storeName, id) {
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
  });
}

export function getAllAudios(db, storeName) {
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
}
