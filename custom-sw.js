let CACHE_NAME = 'cache-v1';
let urlsToCache = [
    '/',
    '/semantic.min.css',
    '/semantic-light.min.css',
    '/semantic.min.js',
    '/jquery.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    )
});