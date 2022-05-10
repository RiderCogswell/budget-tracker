// create variable db
let db;

// estsablish connection to IndexedDB db, set to version 1
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create object store(table in sequelize), give it an auto incrementing key
    db.createObjectStore('new_budget', { autoIncrement: true });
};

// if success
request.onsuccess = function(event) {
    // when db is created, save result to db global variable
    db = event.target.result;

    // if app online, send all local data to API
    if (navigator.onLine) {
        uploadInfo();
    };
};

// on error
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// when we submit without internet connection, save data
function saveRecord(record) {
    // open new transaction named new_budget in db with readwrite permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access object store
    const budgetObjectStore = transaction.objectStore('new_budget');

    // use .add() object store method to push the record into the OS
    budgetObjectStore.add(record);
};

function uploadInfo() {
    // open transaction
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access object store 
    const budgetObjectStore = transaction.objectStore('new_budget');

    // get all records from the object store, store in a variable
    const getAll = budgetObjectStore.getAll();

    // upon successful .getAll() execution, submit data to the DB
    getAll.onsuccess = function() {
        // if data in indexedDB's object store, send to API server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open another transaction
                const transaction = db.transaction(['new_budget'], 'readwrite');
                // access transactions object store
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear items from object store!
                budgetObjectStore.clear();

                alert('All saved data has been submitted!');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
};

window.addEventListener('online', uploadInfo);