// Importing dependencies from local, in case the conference wifi sucks.
importScripts('workbox-v4.2.0/workbox-sw.js', 'idb/idb-keyval-iife.min.js');

workbox.setConfig({ modulePathPrefix: 'workbox-v4.2.0/', debug: true });

// 0. Force skip waiting... ¯\_(ツ)_/¯
self.skipWaiting();

// 1. Precaching... (-_-)

// 2. Runtime routing... (◉‿◉)

// 3. Exception handling... \(^-^)/

// 4. Background Sync... (⌐■_■)

// 5. Offline streams... (ノಠ益ಠ)ノ彡┻━┻
