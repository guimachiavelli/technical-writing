self.addEventListener("install", handleInstall);
self.addEventListener("fetch", handleFetch);

function handleInstall(event) {
  event.waitUntil(
    caches.open("v1").then(function (cache) {
      return cache.addAll(["./", "./index.html", "./main.js", "./strings.txt"]);
    })
  );
}

function handleFetch(event) {
  event.respondWith(caches.match(event.request));
}
