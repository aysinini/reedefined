// Runs only inside the Capacitor native shell (window.Capacitor is not
// injected on the plain web). Two jobs:
//
// 1. Suppress the PWA "add to home screen" prompt and the offline-caching
//    service worker — both are meaningless (and the service worker's
//    WKWebView support is historically unreliable) once the site is
//    already wrapped as a real app.
//
// 2. Catch the deep-link handoff from the TikTok/Spotify OAuth round trip.
//    That flow necessarily leaves the app (the OAuth provider only
//    accepts a fixed https://reedefined.app/callback.html redirect_uri),
//    so callback.html finishes the token exchange on the *live website's*
//    origin and, when it detects it was launched from the app, redirects
//    to reedefined://oauth-callback?... instead of a normal relative URL.
//    That custom scheme reopens this app and fires appUrlOpen — we turn
//    it right back into the same connections.html?tiktok_token=... shape
//    the web flow already knows how to handle, just now running on the
//    app's own origin (so it saves to Supabase using the app's own
//    session, not a session that only exists on reedefined.app).
if (window.Capacitor && window.Capacitor.isNativePlatform()) {
  window.__IS_NATIVE_APP__ = true;

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('pwa-banner');
    if (banner) banner.style.display = 'none';
  });

  window.Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
    const url = new URL(data.url);
    if (url.protocol !== 'reedefined:' || url.hostname !== 'oauth-callback') return;

    const provider = url.searchParams.get('provider');
    const token = url.searchParams.get('token');
    const openId = url.searchParams.get('open_id');
    const err = url.searchParams.get('error');

    const target = new URL('connections.html', window.location.origin);
    if (err) {
      target.searchParams.set(provider + '_error', '1');
    } else if (provider === 'tiktok') {
      target.searchParams.set('tiktok_token', token || '');
      target.searchParams.set('tiktok_open_id', openId || '');
    } else if (provider === 'spotify') {
      target.searchParams.set('spotify_token', token || '');
    } else {
      return;
    }
    window.location.href = target.toString();
  });
}
