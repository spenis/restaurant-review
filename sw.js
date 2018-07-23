'use strict';

var staticCacheName = 'page-cache-1';

let urlToCache = [
	'.',
	'restaurant.html',
	'css/styles.css',
	'data/restaurants.json',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',	
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg',	
	'js/main.js',
	'js/restaurant_info.js',
	'js/dbhelper.js',
];

// cache the app
self.addEventListener('install', function(event) {
	console.log('Installing service worker & cache static');
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache) {
			console.log(cache);
			return cache.addAll(urlToCache);
		}).catch(error => {
			console.log(error);
		})
		);
});

// update cache
self.addEventListener('activate', function(event) {
  console.log('Activate service worker...');
  var cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          //delete old caches
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
        );
     })
     );
});

//respond with files from cache
//self.addEventListener('fetch', function (event) {
//	console.log('fetch event for ', event.request.url);
//	event.respondWidth(
//		caches.match(event.request).then(function (response) {
//			return response || fetch(event.request);
//		})
//		);
//});

self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request);
    })
  );
});