/* V33 — Quran reader polish and safe local reading-position persistence. */
(function () {
  'use strict';
  var root = document.getElementById('screen-quran');
  if (!root || root.dataset.quranV33Bound === '1') return;
  root.dataset.quranV33Bound = '1';

  var positionKey = 'islamic-platform-quran-position-v1';
  var toast = function (message) {
    if (typeof window.v13Toast === 'function') window.v13Toast(message);
    else {
      var note = document.getElementById('quran-last-position');
      if (note) note.textContent = message;
    }
  };
  var arabicNumber = function (value) {
    return new Intl.NumberFormat('ar-EG').format(Number(value) || 0);
  };
  var safeRead = function () {
    try { return JSON.parse(localStorage.getItem(positionKey) || 'null'); }
    catch (error) { return null; }
  };
  var safeWrite = function (value) {
    try { localStorage.setItem(positionKey, JSON.stringify(value)); return true; }
    catch (error) { return false; }
  };
  var activeAyah = function () {
    var selected = root.querySelector('.quran-ayah.is-active');
    return selected ? Number(selected.dataset.ayah) || 1 : 1;
  };
  var pageInput = root.querySelector('#quran-page-input');
  var positionLabel = root.querySelector('#quran-last-position');
  var saveButtons = [root.querySelector('#quran-save-position'), root.querySelector('#quran-save-position-drawer')].filter(Boolean);

  function refreshSavedLabel(position) {
    if (!positionLabel) return;
    if (!position) {
      positionLabel.textContent = 'لم يُحفظ بعد';
      return;
    }
    positionLabel.textContent = 'مريم · آية ' + arabicNumber(position.ayah) + ' · ص ' + arabicNumber(position.page);
  }
  function capturePosition() {
    return {
      surah: 'مريم',
      surahNumber: 19,
      ayah: activeAyah(),
      page: Math.max(1, Math.min(604, Number(pageInput && pageInput.value) || 305)),
      savedAt: new Date().toISOString()
    };
  }
  function savePosition(showToast) {
    var position = capturePosition();
    var saved = safeWrite(position);
    refreshSavedLabel(position);
    saveButtons.forEach(function (button) {
      button.classList.add('is-saved');
      button.setAttribute('aria-pressed', 'true');
      if (button.id === 'quran-save-position') button.innerHTML = '<span class="ui-icon" data-icon="check"></span> تم حفظ الموضع';
    });
    if (typeof window.renderUiIcons === 'function') window.renderUiIcons(root);
    if (showToast) toast(saved ? 'تم حفظ موضع القراءة على هذا الجهاز.' : 'تعذر التخزين الدائم في هذا المتصفح؛ سيظل الموضع متاحًا أثناء الجلسة فقط.');
  }
  function restorePosition() {
    var position = safeRead();
    if (!position || position.surah !== 'مريم') {
      refreshSavedLabel(null);
      return;
    }
    if (pageInput) {
      var restoredPage = Math.max(1, Math.min(604, Number(position.page) || 305));
      pageInput.value = String(restoredPage);
      root.querySelectorAll('.quran-page-label').forEach(function (label) { label.textContent = 'صفحة ' + arabicNumber(restoredPage); });
      var sessionLabel = root.querySelector('#quran-session-label');
      if (sessionLabel) sessionLabel.textContent = 'صفحة ' + arabicNumber(restoredPage) + ' من ٦٠٤';
      var progress = root.querySelector('#quran-progress-fill');
      if (progress) progress.style.width = (restoredPage / 604 * 100) + '%';
      var pageNote = root.querySelector('#quran-page-navigation-note');
      if (pageNote) pageNote.textContent = 'آخر رقم صفحة محفوظ: ' + arabicNumber(restoredPage) + ' — محتوى الصفحات الكاملة لم يُربط بعد.';
    }
    var verse = root.querySelector('.quran-ayah[data-ayah="' + Math.max(1, Math.min(8, Number(position.ayah) || 1)) + '"]');
    if (verse) verse.click();
    refreshSavedLabel(position);
    saveButtons.forEach(function (button) { button.classList.add('is-saved'); button.setAttribute('aria-pressed', 'true'); if (button.id === 'quran-save-position') button.innerHTML = '<span class="ui-icon" data-icon="check"></span> تم حفظ الموضع'; });
    if (typeof window.renderUiIcons === 'function') window.renderUiIcons(root);
  }
  saveButtons.forEach(function (button) {
    button.addEventListener('click', function () { savePosition(true); });
  });

  // Autosave the current sample verse/page locally. This is device-local, not account sync.
  root.querySelectorAll('.quran-ayah').forEach(function (verse) {
    verse.addEventListener('click', function () { window.setTimeout(function () { savePosition(false); }, 0); });
  });
  ['quran-go-page', 'quran-prev-page', 'quran-next-page'].forEach(function (id) {
    var button = root.querySelector('#' + id);
    if (button) button.addEventListener('click', function () { window.setTimeout(function () { savePosition(false); }, 0); });
  });
  if (pageInput) pageInput.addEventListener('change', function () { window.setTimeout(function () { savePosition(false); }, 0); });

  // A complete index is available, but only the current sample surah has verse text bundled here.
  var index = root.querySelector('#quran-index-items');
  if (index) {
    index.addEventListener('click', function (event) {
      var row = event.target.closest('.quran-surah-row');
      if (!row || !index.contains(row)) return;
      var number = Number(row.dataset.surahNumber);
      if (number === 19) {
        index.querySelectorAll('.quran-surah-row').forEach(function (item) { item.classList.toggle('is-current', item === row); });
        closeQuranDrawerIfAvailable();
        return;
      }
      toast('السورة موجودة في الفهرس، لكن نصها الكامل غير مربوط في هذه المعاينة. المتاح حاليًا نموذج من سورة مريم.');
    });
  }
  function closeQuranDrawerIfAvailable() {
    if (typeof window.closeQuranSidebars === 'function') window.closeQuranSidebars();
    else {
      var button = document.getElementById('btn-toggle-right');
      if (button && button.getAttribute('aria-expanded') === 'true') button.click();
    }
  }

  // Persist the preferred reciter label in the player; actual playback awaits approved audio assets.
  var reciter = root.querySelector('#quran-reciter-select');
  var reciterName = root.querySelector('.quran-player-reciter');
  if (reciter) {
    reciter.addEventListener('change', function () {
      if (reciterName) reciterName.textContent = 'القارئ المفضل: ' + reciter.options[reciter.selectedIndex].textContent;
      try { localStorage.setItem('islamic-platform-quran-reciter-v1', reciter.value); } catch (error) { /* local preference is optional */ }
      toast('تم تغيير القارئ في إعدادات المعاينة؛ لا يوجد تشغيل صوتي قبل ربط ملفات التلاوة.');
    });
    try {
      var savedReciter = localStorage.getItem('islamic-platform-quran-reciter-v1');
      if (savedReciter) {
        reciter.value = savedReciter;
        if (reciter.selectedIndex >= 0 && reciterName) reciterName.textContent = 'القارئ المفضل: ' + reciter.options[reciter.selectedIndex].textContent;
      }
    } catch (error) { /* default reciter remains */ }
  }

  // Give the surah list a clear, searchable active state.
  var indexSearch = root.querySelector('#quran-right-sidebar .sidebar-content input');
  if (indexSearch) {
    indexSearch.setAttribute('aria-label', 'ابحث في أسماء السور');
    indexSearch.addEventListener('input', function () {
      var query = indexSearch.value.trim().replace(/[أإآٱ]/g, 'ا').toLowerCase();
      root.querySelectorAll('#quran-index-items .quran-surah-row').forEach(function (row) {
        var haystack = (row.dataset.surahName + ' ' + row.dataset.surahNumber).replace(/[أإآٱ]/g, 'ا').toLowerCase();
        row.hidden = !!query && !haystack.includes(query);
      });
    });
  }

  // Keep reader panes mutually clear and ensure the Mushaf opens as the default view.
  var singleButton = root.querySelector('#layout-btn-single');
  var splitButton = root.querySelector('#layout-btn-split');
  if (singleButton && splitButton) {
    singleButton.addEventListener('click', function () {
      singleButton.classList.add('is-active'); splitButton.classList.remove('is-active');
      singleButton.setAttribute('aria-pressed', 'true'); splitButton.setAttribute('aria-pressed', 'false');
    });
    splitButton.addEventListener('click', function () {
      splitButton.classList.add('is-active'); singleButton.classList.remove('is-active');
      splitButton.setAttribute('aria-pressed', 'true'); singleButton.setAttribute('aria-pressed', 'false');
    });
  }

  // Preserve reading preferences on this device, independently from account sync.
  var preferencesKey = 'islamic-platform-quran-preferences-v1';
  var preferenceStore = {};
  try { preferenceStore = JSON.parse(localStorage.getItem(preferencesKey) || '{}') || {}; } catch (error) { preferenceStore = {}; }
  var frame = root.querySelector('.mushaf-page-frame');
  var surahHeader = root.querySelector('#mushaf-surah-header');
  var ayahList = root.querySelector('#quran-ayah-list');
  var fontLabel = Array.from(root.querySelectorAll('#quran-left-sidebar .sidebar-content span')).find(function (node) { return /كبير|px/.test(node.textContent); });
  var themeChoices = Array.from(root.querySelectorAll('#quran-left-sidebar .sidebar-content [data-quran-theme]'));
  var themeClasses = ['theme-warm', 'theme-ivory', 'theme-night'];
  var repeatButtons = Array.from(root.querySelectorAll('#quran-left-sidebar button')).filter(function (button) { return ['٣ مرات', '٥ مرات', 'تكرار مستمر'].includes(button.textContent.trim()); });
  var autoScrollToggle = root.querySelector('#quran-auto-scroll');
  function persistPreferences() {
    var size = ayahList ? parseFloat(ayahList.style.fontSize || getComputedStyle(ayahList).fontSize) : null;
    var activeTheme = frame ? themeClasses.find(function (name) { return frame.classList.contains(name); }) || 'theme-warm' : 'theme-warm';
    var repeat = root.querySelector('#quran-repeat-status');
    var settings = { fontSize: size, theme: activeTheme, repeat: repeat ? repeat.textContent.trim() : '٣ مرات', autoScroll: !!(autoScrollToggle && autoScrollToggle.checked) };
    try { localStorage.setItem(preferencesKey, JSON.stringify(settings)); } catch (error) { /* Local preferences are optional. */ }
  }
  if (frame) {
    var selectedTheme = themeClasses.includes(preferenceStore.theme) ? preferenceStore.theme : 'theme-warm';
    themeClasses.forEach(function (name) { frame.classList.remove(name); if (surahHeader) surahHeader.classList.remove(name); });
    frame.classList.add(selectedTheme);
    if (surahHeader) surahHeader.classList.add(selectedTheme);
    themeChoices.forEach(function (choice) {
      var active = choice.dataset.quranTheme === selectedTheme;
      choice.classList.toggle('quran-theme-active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
  }
  if (ayahList && Number.isFinite(Number(preferenceStore.fontSize))) {
    var restoredSize = Math.max(22, Math.min(42, Number(preferenceStore.fontSize)));
    ayahList.style.fontSize = restoredSize + 'px';
    if (fontLabel) fontLabel.textContent = 'كبير (' + Math.round(restoredSize) + 'px)';
  }
  if (autoScrollToggle) autoScrollToggle.checked = !!preferenceStore.autoScroll;
  if (preferenceStore.repeat && repeatButtons.length) {
    var repeatChoice = repeatButtons.find(function (button) { return button.textContent.trim() === preferenceStore.repeat; });
    if (repeatChoice) {
      repeatChoice.classList.add('is-repeat-active');
      var repeatStatus = root.querySelector('#quran-repeat-status');
      if (repeatStatus) repeatStatus.textContent = repeatChoice.textContent.trim();
    }
  }
  root.addEventListener('click', function (event) {
    var target = event.target.closest('button, .grid > div');
    if (!target || !root.contains(target)) return;
    window.setTimeout(function () {
      if (target.textContent.includes('تصغير') || target.textContent.includes('تكبير') || themeChoices.includes(target) || repeatButtons.includes(target)) persistPreferences();
    }, 0);
  });
  if (autoScrollToggle) autoScrollToggle.addEventListener('change', persistPreferences);
  root.querySelectorAll('.quran-ayah').forEach(function (verse) {
    verse.addEventListener('click', function () {
      if (autoScrollToggle && autoScrollToggle.checked) window.setTimeout(function () { verse.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
    });
  });
  // Restore the saved reading position only after the Quran controls are initialized.
  restorePosition();
})();
