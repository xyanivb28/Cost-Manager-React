let idb = {};
let db = {};

db.addCost = async function (costData) {
  return new Promise((resolve, reject) => {
    const transaction = db.database.transaction('costs', 'readwrite');
    const objectStore = transaction.objectStore('costs');

    // Add the new cost record to the store
    const request = objectStore.add(costData);

    // If the add operation is successful
    request.onsuccess = () => {
      resolve(true);
    };

    // If there's an error during the add operation
    request.onerror = () => {
      reject('Error adding cost');
    };
  });
};

// Function to open the IndexedDB database
idb.openCostsDB = async function (dbName, version) {
  return new Promise((resolve, reject) => {
    // Open the IndexedDB database with the given name and version
    const request = indexedDB.open(dbName, version);

    // If the database is successfully opened
    request.onsuccess = (event) => {
      db.database = event.target.result;
      resolve(db);
    };

    // If there's an error opening the database
    request.onerror = () => {
      reject(null);
    };

    // If the database schema needs to be updated (e.g., creating an object store)
    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create an object store for costs with auto-incrementing keys
      if (!database.objectStoreNames.contains('costs')) {
        database.createObjectStore('costs', { keyPath: "id", autoIncrement: true });
      }
    };
  });
};