'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "a16d1b03349b9b477743bf57f6084df8",
"assets/AssetManifest.bin.json": "50bd42b8d7d481ca15ec705112a0241c",
"assets/AssetManifest.json": "1875b2da95bca84859be3f4ccd3a1676",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "aa2fcf9ed9682fb65260d8b607a373d2",
"assets/lib/assets/products_sample_images/product1.png": "1dca69562ff58e9e45049b0e05329839",
"assets/lib/assets/products_sample_images/product10.png": "67b8dfd5821e109f4235a681a759a459",
"assets/lib/assets/products_sample_images/product2.png": "171d07fd84385551fed48213c49ae62a",
"assets/lib/assets/products_sample_images/product3.png": "2c5dae0a12c0777832cd6567b47e7b3b",
"assets/lib/assets/products_sample_images/product4.png": "cd99e98e88b433e67a11f8d54aeb8b78",
"assets/lib/assets/products_sample_images/product5.png": "aa3e149c34e11d22a86e298cbb105c42",
"assets/lib/assets/products_sample_images/product6.png": "e11576f155902573382603e0ed5dc0fc",
"assets/lib/assets/products_sample_images/product7.png": "7100b80d3c4fb9a85748c8697a6a1039",
"assets/lib/assets/products_sample_images/product8.png": "50a9af4bc0e847cb9adef1aa024afee8",
"assets/lib/assets/products_sample_images/product9.png": "028a442fcf463fdfc1ebee74cdb1e05b",
"assets/lib/assets/sample_images/accessories_category.png": "384a8c992e25d1bd62b230a23d21bbc8",
"assets/lib/assets/sample_images/kids_category.png": "80fdffb8bbbcb84fa342f72ec7706e88",
"assets/lib/assets/sample_images/men_category.png": "0f419d9a62ee1dfd1c9dcd07713cf7c2",
"assets/lib/assets/sample_images/sample_herobanner.png": "e5f3a7dba3ef5fe392a7dd3868532814",
"assets/lib/assets/sample_images/sample_image_handbag.png": "5f7410f936b9b21ab6d3de65429c14ca",
"assets/lib/assets/sample_images/sample_image_headphone.png": "835291486406ffb0a331cc081027beb2",
"assets/lib/assets/sample_images/sample_image_sneakers.png": "5ea7618806b65ff399ef28aa14356aac",
"assets/lib/assets/sample_images/sample_image_watch.png": "707e01a4f4373f1ac464749e8c3bb5c9",
"assets/lib/assets/sample_images/shoes_category.png": "35326b2c8a0b910aab095d7d0fc2d77c",
"assets/lib/assets/sample_images/ui_kit_favicon.png": "3a9fc38210fae6ef17b9bf1cf45b77c7",
"assets/lib/assets/sample_images/women_category.png": "6c459a9f3073ff5761bb0131551ffed9",
"assets/NOTICES": "b914f80552090147906b78476d9617c9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "4fbafb27b84974cbf9c37aec5b23dda5",
"index.html": "ce9ef79378e0d6daf554364b6d9aa2d5",
"/": "ce9ef79378e0d6daf554364b6d9aa2d5",
"main.dart.js": "d9396130bc9637a32bdb9b89f1edd028",
"manifest.json": "cb38169ebdd0dc1cc354482a346c5d94",
"ui_kit_favicon.png": "3a9fc38210fae6ef17b9bf1cf45b77c7",
"version.json": "0d850febf162a9f478ec1709a6207eb6"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
