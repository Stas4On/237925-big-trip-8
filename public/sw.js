const CACHE_NAME = `BIG_TRIP`;

self.addEventListener(`install`, (evt) => {
  console.log(`sw, install`, {evt});
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `./`,
          `./index.html`,
          `./trip.html`,
          `./statistic.html`,
          `./bundle.js`,
          `./css/normalize.css`,
          `./css/main.css`,
          `./css/flatpickr.min.css`,
          `./img/star.svg`,
          `./img/star--check.svg`,
        ]);
      }),
  );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error({err});
        throw err;
      })
  );
});
