/* In case the conference wifi sucks :) */
importScripts('workbox-v3.6.3/workbox-sw.js', 'idb/idb-keyval-iife.min.js');

workbox.setConfig({ modulePathPrefix: 'workbox-v3.6.3/', debug: true });
// wat

// Skip waiting.
self.skipWaiting();

// Precaching
const precacheManifest = [];
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest);

// Runtime routing
const dataCacheConfig = {
  cacheName: 'meme-data'
};

workbox.routing.registerRoute(
  /.*categories/,
  workbox.strategies.cacheFirst(dataCacheConfig),
  'GET'
);
workbox.routing.registerRoute(
  /.*templates/,
  workbox.strategies.cacheFirst(dataCacheConfig),
  'GET'
);

workbox.routing.registerRoute(
  /.*.(?:png|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'meme-images'
  }),
  'GET'
);

// Exception handling
workbox.routing.setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'image':
      return caches.match('/images/facepalm.jpg');
    default:
      return Response.error();
  }
});

// Background Sync
const queue = new workbox.backgroundSync.Queue('memes-to-be-saved', {
  callbacks: {
    queueDidReplay: () => clear()
  }
});

self.addEventListener('fetch', event => {
  if (event.request.url.match(/.*memes/) && event.request.method === 'POST') {
    let response = fetch(event.request.clone()).catch(() =>
      queueChange(event.request.clone())
    );

    event.respondWith(response);
  }
});

async function queueChange(request) {
  await queue.addRequest(request.clone());

  const meme = await request.clone().json();
  meme.offline = true;

  let memes = (await idbKeyval.get('memes')) || [];
  idbKeyval.set('memes', [...memes, meme]);

  return new Response('', { status: 200 });
}

// Offline streams
const apiStrategy = async ({ event }) => {
  try {
    return await workbox.strategies
      .staleWhileRevalidate(dataCacheConfig)
      .handle({ event });
  } catch (error) {
    const fake = {
      id: 0,
      top: 'memes',
      bottom: 'not found',
      template: 'notfound.jpg'
    };
    return new Response(JSON.stringify([fake]));

    // const fakeResponse = new Response(JSON.stringify([fake]), { status: 200 });
    // return Promise.resolve(fakeResponse);
  }
};

const streamStrategy = workbox.streams.strategy([
  () => '[',
  async () => {
    const data = await idbKeyval.get('memes');
    return stringify(data, ',');
  },
  async e => {
    const response = await apiStrategy(e);
    const data = await response.json();
    return stringify(data);
  },
  () => ']'
]);

workbox.routing.registerRoute(/.*memes\/.\w+/, streamStrategy, 'GET');

// helpers.js
async function clear() {
  // Clear store
  await idbKeyval.del('memes');

  // Clear cache
  let cache = await caches.open('meme-data');
  let keys = await cache.keys();

  for (let key of keys) {
    if (/.*memes\/.\w+/.test(key.url)) {
      cache.delete(key);
    }
  }
}

function stringify(data, suffix) {
  if (!data || !data.length) {
    return '';
  }

  let result = data.map(item => JSON.stringify(item)).join(',');

  if (suffix) {
    result += suffix;
  }

  return result;
}
