let idb = {};
let db = {};

db.addCost = async function(costData) {
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

db.getAllCostItemsByMonthAndYear = async function(month, year) {
  return new Promise((resolve, reject) => {
    if (!db.database) {
      reject('Database not initialized.');
      return;
    }

    const transaction = db.database.transaction('costs', 'readonly');
    const store = transaction.objectStore('costs');
    const request = store.getAll();

    request.onsuccess = () => {
      const allItems = request.result;

      // Filter items by month and year
      const validCostItems = allItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      });

      console.log(validCostItems);
      resolve(validCostItems);
    };

    request.onerror = () => {
      reject('Error retrieving costs.');
    };
  });
};

db.deleteCostItem = async function (costItemId) {
  return new Promise((resolve, reject) => {
    if (!db.database) {
      reject("Database not initialized.");
      return;
    }

    const transaction = db.database.transaction("costs", "readwrite");
    const store = transaction.objectStore("costs");

    const request = store.delete(costItemId);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject("Error deleting cost item.");
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
        database.createObjectStore('costs', {keyPath: "id", autoIncrement: true});
      }
    };
  });
};


// Export the functions so they can be used in the HTML file
export {idb, db};
