// Dummy Service Worker to satisfy Chrome's PWA requirements
self.addEventListener('fetch', function (event) {
    // Does nothing, just tells Chrome we are a real PWA
});