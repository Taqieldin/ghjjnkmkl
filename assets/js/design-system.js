/* Shared theme bootstrap / fallback. app.js remains the primary implementation where present. */
(function () {
  'use strict';
  function applyTheme(dark) {
    var isDark = !!dark;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    if (document.body) document.body.classList.toggle('site-theme-dark', isDark);
    var button = document.getElementById('topbar-theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('aria-label', isDark ? 'الوضع الداكن مفعّل، اضغط للوضع الفاتح' : 'الوضع الفاتح مفعّل، اضغط للوضع الداكن');
      button.title = isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';
      var icon = button.querySelector('.topbar-theme-icon');
      if (icon) {
        icon.setAttribute('data-icon', isDark ? 'sun' : 'moon');
        if (typeof window.renderUiIcons === 'function') window.renderUiIcons(button);
      }
    }
    try { localStorage.setItem('platform-theme', isDark ? 'dark' : 'light'); } catch (error) { /* storage may be unavailable */ }
  }
  if (typeof window.applySiteTheme !== 'function') window.applySiteTheme = applyTheme;
  if (typeof window.toggleSiteTheme !== 'function') {
    window.toggleSiteTheme = function () { applyTheme(!document.documentElement.classList.contains('dark')); };
  }
  function initialize() {
    var saved = 'light';
    try { saved = localStorage.getItem('platform-theme') || 'light'; } catch (error) { /* use light */ }
    if (typeof window.applySiteTheme === 'function') window.applySiteTheme(saved === 'dark');
    else applyTheme(saved === 'dark');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
