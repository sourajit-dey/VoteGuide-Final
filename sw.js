/**
 * @file sw.js
 * @description Service Worker for VoteGuide India.
 *              Cache-first for static assets.
 *              Network-first for HTML documents.
 *              Enables offline capability and PWA installation.
 * @author VoteGuide India
 * @version 1.0.0
 */

const CACHE_NAME = 'voteguide-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/components.css',
  '/css/animations.css',
  '/js/utils.js',
  '/js/analytics.js',
  '/js/firebase.js',
  '/js/charts.js',
  '/js/data.js',
  '/js/timeline.js',
  '/js/eligibility.js',
  '/js/glossary.js',
  '/js/main.js',
  '/js/chatbot.js',
  '/js/tests.js',
  '/assets/chakra.svg',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function() { return self.skipWaiting(); })
      .catch(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names
          .filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(c) { c.put(event.request, clone); });
          return response;
        })
        .catch(function() {
          return caches.match('/index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME)
          .then(function(c) { c.put(event.request, clone); });
        return response;
      }).catch(function() {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
