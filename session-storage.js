// Shared Supabase auth storage adapter.
// If "Remember me" was left checked at sign-in (the default), the session
// is kept in localStorage and survives closing the browser.
// If unchecked, the session is kept in sessionStorage only — it disappears
// as soon as the tab/browser closes. Every page on the site must use this
// same adapter, otherwise a session started on one page could look "logged
// out" on another.
window.REEDEFINED_AUTH_STORAGE = {
  getItem: (key) => {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  },
  setItem: (key, value) => {
    const remember = localStorage.getItem('reedefined_remember') !== 'false';
    if (remember) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};
