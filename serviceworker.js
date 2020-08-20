const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html', 'background.jpg'];

const self = this;
//Install SW
self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log("opened cache");
            return cache.addAll(urlsToCache);
        })
    )
})

//Listen Request
self.addEventListener('fetch', (e)=>{
    e.respondWith(
        caches.match(e.request)
        .then(() => {
            return fetch(e.request)
                .catch(() => {
                    return caches.match('offline.html');
                })
        })
    )
})

//Activate SW
self.addEventListener('activate', (e)=>{
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    e.waitUntil(
        caches.keys()
        .then((cacheNames) => Promise.all(
            cacheNames.map(cacheName => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})