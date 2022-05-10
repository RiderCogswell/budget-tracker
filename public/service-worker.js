// declare relevant variables
const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version01';
const CACHE_NAME = APP_PREFIX + VERSION;
// must be relative paths
const FILES_TO_CACHE = [
    './public/index.html',
    './public/css/styles.css',
    './public/js/index.js',
    './public/js/idb.js',
    './public/icons/icon-72x72.png',
    './public/icons/icon-96x96.png',
    './public/icons/icon-128x128.png',
    './public/icons/icon-144x144.png',
    './public/icons/icon-152x152.png',
    './public/icons/icon-192x192.png',
    './public/icons/icon-384x384.png',
    './public/icons/icon-512x512.png'
];

// cant use window element because service workers run before window is created
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            // add all files to the cache
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// activate service worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        // .keys() represents all the cache names, which we're calling keyList
        caches.keys().then(function(keyList) {
            let cacheKeeplist = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX)
            })
            // add current cache to the keep list
            cacheKeeplist.push(CACHE_NAME);

            // returns a promise that will not resolve until
            return Promise.all(keyList.map(function(key, i) {
                // all old versions of the cache are deleted 
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

// tell application how to retrieve the info from the cache
self.addEventListener('fetch', function(event) {
    console.log('fetch request : ' + event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(request) {
            return request || fetch(event.request);
        })
    );
});
