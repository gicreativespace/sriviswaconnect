const CACHE_NAME = 'sri-viswa-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/global.css',
  './assets/js/main.js',
  './assets/js/firebase-config.js',
  './sections/auth/role-selection.html',
  './sections/auth/role-selection.css',
  './sections/auth/role-selection.js',
  './sections/auth/school-login.html',
  './sections/auth/school-login.css',
  './sections/auth/school-login.js',
  './sections/admin/principal-dashboard.html',
  './sections/admin/principal-dashboard.css',
  './sections/admin/principal-dashboard.js',
  './sections/incharge/attendance.html',
  './sections/incharge/attendance.css',
  './sections/incharge/attendance.js',
  './sections/incharge/e-diary.html',
  './sections/incharge/e-diary.css',
  './sections/incharge/e-diary.js',
  './sections/parent/link-child.html',
  './sections/parent/link-child.css',
  './sections/parent/link-child.js',
  './sections/parent/parent-dashboard.html',
  './sections/parent/parent-dashboard.css',
  './sections/parent/parent-dashboard.js',
  './sections/shared/poster-generator.html',
  './sections/shared/poster-generator.css',
  './sections/shared/poster-generator.js',
  './assets/images/logo.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
