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
    if (url.protocol !== 'reedefined:') return;
    // Non-special schemes like this one don't get authority (//host)
    // parsing in every engine — Android's WebView, for one, leaves
    // hostname empty and puts "oauth-callback" in pathname instead
    // (as "//oauth-callback"). Strip leading slashes so this works
    // the same regardless of how a given engine parses it.
    if (url.pathname.replace(/^\/+/, '') !== 'oauth-callback') return;

    // finishOAuth() in callback.html already built these query params in
    // the exact tiktok_token=.../tiktok_error=1/spotify_token=... shape
    // connections.html's existing handleTikTokCallback()/
    // handleSpotifyCallback() expect — just forward them as-is instead of
    // re-deriving that mapping here (and re-risking getting it wrong).
    const target = new URL('connections.html', window.location.origin);
    url.searchParams.forEach((value, key) => {
      if (key === 'provider') return;
      target.searchParams.set(key, value);
    });
    window.location.href = target.toString();
  });
}
