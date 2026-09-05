// 최소 서비스 워커
// - Chrome이 "홈 화면에 추가"를 진짜 설치형 PWA(주소창 없음)로 인식하게 하는 데 필요합니다.
// - 부가 효과로 행사장 와이파이가 불안정해도 이미 방문한 화면은 캐시에서 빠르게 열립니다.

const CACHE_NAME = "gimpo-busking-quiz-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/noto-sans-kr-subset-400.woff2",
  "./fonts/noto-sans-kr-subset-700.woff2",
  "./fonts/jua-subset-400.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          var copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached);
    })
  );
});
