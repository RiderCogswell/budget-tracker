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

