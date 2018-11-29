# 1. Offline events

> ## \_1

```js
window.addEventListener('online', () => this.online(true));
window.addEventListener('offline', () => this.online(false));
```

> ## \_2

```js
online(online) {
    const showToast = online !== this.state.online;
    if (showToast) {
      setTimeout(() => this.setState({ showToast: null }), 2000);
    }

    const message = online
      ? "Yay, the application is online!"
      : "Oh no, the app seems to be offline... ";

    this.setState({online, toastMessage: message, showToast: "show" });
}
```

> ## \_3

```jsx
<Toast message={this.state.toastMessage} show={this.state.showToast} />
```

# 2. Precaching

> ## \_4

```js
const precacheManifest = [];

workbox.precaching.precacheAndRoute(precacheManifest);
```

# 3. Runtime route caching

> ## \_5

```js
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
  /.*memes\/.\w+/,
  workbox.strategies.staleWhileRevalidate(dataCacheConfig),
  'GET'
);
workbox.routing.registerRoute(
  /.*.(?:png|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({ cacheName: 'meme-images' }),
  'GET'
);
```

# 6. Exception handling

> ## \_6

```js
const apiStrategy = async ({ event }) => {
  try {
  } catch (error) {}
};
```

> ## \_7

```js
return await workbox.strategies
  .staleWhileRevalidate(dataCacheConfig)
  .handle({ event });
```

> ## \_8

```js
const fake = {
  id: 0,
  top: 'memes',
  bottom: 'not found',
  template: 'notfound.jpg'
};
return new Response(JSON.stringify([fake]));
```

> ## \_9

```js
workbox.routing.setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'image':
      return caches.match('/images/facepalm.jpg');
    default:
      return Response.error();
  }
});
```

# 7. Background sync

> ## \_10

```js
const queue = new workbox.backgroundSync.Queue('memes-to-be-saved');
```

> ## \_11

```js
self.addEventListener('fetch', event => {
  if (event.request.url.match(/.*memes/) && event.request.method === 'POST') {
    let response = fetch(event.request.clone()).catch(() =>
      queueChange(event.request.clone())
    );

    event.respondWith(response);
  }
});
```

> ## \_12

```js
async function queueChange(request) {
  await queue.addRequest(request.clone());

  return new Response('', { status: 200 });
}
```

> ## \_13

```js
const meme = await request.clone().json();
meme.offline = true;

let memes = (await idbKeyval.get('memes')) || [];
idbKeyval.set('memes', [...memes, meme]);
```

# 8. Workbox streams

> ## \_14

```js
const streamStrategy = workbox.streams.strategy([
  () => '[',
  async () => {
    /* Return the copied memes */
  },
  async e => {
    /* Return the cached memes */
  },
  () => ']'
]);
```

> ## \_15

```js
const data = await idbKeyval.get('memes');
return stringify(data, ',');
```

> ## \_16

```js
const response = await apiStrategy(e);
const data = await response.json();
return stringify(data);
```

> ## \_17

```js
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
```

## NB: Use the streamStrategy

# 9. Clean up

> ## \_18

```js
{
  callbacks: {
    queueDidReplay: () => clear();
  }
}
```

> ## \_19

```js
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
```
