from pathlib import Path
import re

root = Path('/mnt/data/v40work')
quran = root/'pages/quran.html'
s = quran.read_text(encoding='utf-8')

# Remove the duplicate hero search; the searchable surah index remains in the right sidebar.
start = s.find('    <div class="quran-hero-search-wrap">')
if start == -1:
    raise SystemExit('hero search block not found')
# Count nested div tags so only the search wrapper is removed.
pos = start
level = 0
end = None
for m in re.finditer(r'<div\b[^>]*>|</div\s*>', s[start:], re.I):
    token = m.group(0)
    if token.lower().startswith('<div'):
        level += 1
    else:
        level -= 1
        if level == 0:
            end = start + m.end()
            break
if end is None:
    raise SystemExit('could not find end of hero search wrapper')
s = s[:start] + s[end:]
s = s.replace('<!-- Quran entry banner: focused heading and search; reader tools live in compact side rails. -->', '<!-- Quran entry banner: focused heading only. Search remains inside the surah index sidebar. -->')

# Replace the full tafsir panel with a cleaner, structured reading panel while preserving the IDs used by the reader logic.
panel_start = s.find('<div class="calm-card rounded-3xl p-6 bg-white border border-[#132e25]/10 space-y-5" id="quran-tafsir-pane">')
if panel_start == -1:
    raise SystemExit('tafsir panel start not found')
level = 0
panel_end = None
for m in re.finditer(r'<div\b[^>]*>|</div\s*>', s[panel_start:], re.I):
    token = m.group(0)
    if token.lower().startswith('<div'):
        level += 1
    else:
        level -= 1
        if level == 0:
            panel_end = panel_start + m.end()
            break
if panel_end is None:
    raise SystemExit('could not find end of tafsir panel')

panel = r'''<section class="quran-tafsir-panel" id="quran-tafsir-pane" aria-label="تفسير الآية المختارة" aria-hidden="true">
  <header class="quran-tafsir-header">
    <div class="quran-tafsir-title-block">
      <span class="quran-tafsir-eyebrow"><span class="quran-tafsir-eyebrow-dot"></span> مساحة التفسير</span>
      <h3>تفسير الآية</h3>
      <p id="quran-tafsir-reference">سورة مريم • الآية ٤</p>
    </div>
    <div class="quran-tafsir-source-area">
      <span class="quran-tafsir-source-label">مصادر التفسير</span>
      <div class="quran-tafsir-source-switch border-b" role="group" aria-label="اختيار مصدر التفسير">
        <button class="quran-tafsir-source active quran-index-tab-active" data-tafsir-source="moyassar" aria-pressed="true" type="button">التفسير الميسر</button>
        <button class="quran-tafsir-source" data-tafsir-source="saadi" aria-pressed="false" type="button">السعدي</button>
        <button class="quran-tafsir-source" data-tafsir-source="katheer" aria-pressed="false" type="button">ابن كثير</button>
      </div>
    </div>
  </header>

  <section class="quran-tafsir-verse-card" aria-label="نص الآية المحددة">
    <div class="quran-tafsir-card-label"><span class="ui-icon" data-icon="quote" aria-hidden="true"></span> الآية المحددة</div>
    <blockquote class="quran-tafsir-verse-text" id="quran-tafsir-verse">﴿قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا﴾</blockquote>
  </section>

  <div class="quran-tafsir-coverage" id="quran-tafsir-coverage" role="note">
    هذا شرح توضيحي تجريبي للآية ٤. النصوص الكاملة للتفاسير المعتمدة تحتاج إلى ربط مصادرها قبل النشر.
  </div>

  <div class="quran-tafsir-unavailable" id="quran-tafsir-empty" hidden>
    <span class="ui-icon" data-icon="book-open-check" aria-hidden="true"></span>
    <div><strong>لا يتوفر شرح لهذه الآية في المعاينة الحالية</strong><p>نص الآية محدد بالأعلى، وسيظهر التفسير هنا بعد ربط النص المعتمد للمصدر المختار.</p></div>
  </div>

  <div class="quran-tafsir-editorial" id="quran-tafsir-explanation">
    <section class="quran-tafsir-section">
      <div class="quran-tafsir-section-heading"><span class="quran-tafsir-section-index">١</span><h4>بيان المعنى الإجمالي</h4></div>
      <p class="quran-tafsir-body" id="quran-tafsir-body">قال زكريا عليه السلام متضرعًا خاشعًا لربه في دعائه الخفي: يا رب، إني كبرت سني، وضعف عظمي الذي هو عماد الجسد، وانتشر الشيب في رأسي انتشار النار في الحطب، ولم أعهد منك إلا إجابة الدعاء وسعة الفضل، فلم أكن خائبًا ولا محرومًا في أي دعاء سألتك إياه فيما مضى.</p>
    </section>

    <aside class="quran-tafsir-reflection">
      <div class="quran-tafsir-reflection-icon"><span class="ui-icon" data-icon="lightbulb" aria-hidden="true"></span></div>
      <div><strong>فائدة تدبرية</strong><p>التوسل إلى الله بضعف الحال والافتقار التام من أعظم أسباب إجابة الدعاء وقبول الرجاء.</p></div>
    </aside>

    <section class="quran-tafsir-section quran-tafsir-vocabulary-section">
      <div class="quran-tafsir-section-heading"><span class="quran-tafsir-section-index">٢</span><h4>غريب الكلمات</h4></div>
      <div class="quran-tafsir-vocabulary-grid">
        <article class="quran-tafsir-word-card"><strong>وَهَنَ</strong><span>ضعف ورقَّ.</span></article>
        <article class="quran-tafsir-word-card"><strong>اشْتَعَلَ</strong><span>انتشر وغلب، وشُبّه انتشار الشيب باشتعال النار.</span></article>
      </div>
    </section>
  </div>

  <footer class="quran-tafsir-footer">
    <div class="quran-tafsir-font-tools" aria-label="حجم خط التفسير">
      <span>حجم النص</span>
      <button id="quran-tafsir-font-down" type="button" aria-label="تصغير خط التفسير">A−</button>
      <strong id="quran-tafsir-font-size">١٥</strong>
      <button id="quran-tafsir-font-up" type="button" aria-label="تكبير خط التفسير">A+</button>
    </div>
    <div class="quran-tafsir-actions">
      <button id="quran-tafsir-copy" type="button"><span class="ui-icon" data-icon="copy" aria-hidden="true"></span> نسخ الآية</button>
      <button id="quran-tafsir-note" type="button"><span class="ui-icon" data-icon="notebook-pen" aria-hidden="true"></span> تدوين ملاحظة</button>
    </div>
  </footer>
  <p class="quran-tafsir-source-disclaimer">تنبيه: النص المعروض هنا نموذج توضيحي وليس نقلًا حرفيًا من كتاب تفسير. يجب مراجعة وربط النصوص بالمصادر المعتمدة قبل إتاحتها.</p>
</section>'''

s = s[:panel_start] + panel + s[panel_end:]

# Remove obsolete duplicated hero-search styling from active page by appending overrides in a dedicated stylesheet.
quran.write_text(s, encoding='utf-8')

# Improve Quran interactions: correct the selected verse state, honest unavailable state, and functional Tafsir tools.
app = root/'assets/js/app.js'
a = app.read_text(encoding='utf-8')
old = """        if(coverage){coverage.textContent=activeAyah===4?'يعرض هذا النموذج نصاً تفسيرياً توضيحياً للآية ٤. يلزم ربط مصدر التفسير الموثق لعرض بقية الآيات.':'لا تتضمن هذه المعاينة نص تفسير موثقاً لهذه الآية بعد؛ النص القرآني المحدد أعلاه فقط هو المعروض.';coverage.classList.toggle('is-sample',activeAyah!==4);}
        if(player)player.textContent='الموضع المحدد: سورة مريم — الآية '+arabicNum(activeAyah);"""
new = """        if(coverage){coverage.textContent=activeAyah===4?'هذا شرح توضيحي تجريبي للآية ٤. النصوص الكاملة للتفاسير المعتمدة تحتاج إلى ربط مصادرها قبل النشر.':'لا يتوفر شرح موثق لهذه الآية في المعاينة الحالية.';coverage.classList.toggle('is-sample',activeAyah!==4);}
        var tafsirExplanation=$('#quran-tafsir-explanation'), tafsirEmpty=$('#quran-tafsir-empty');
        if(tafsirExplanation)tafsirExplanation.hidden=activeAyah!==4;
        if(tafsirEmpty)tafsirEmpty.hidden=activeAyah===4;
        if(player)player.textContent='الموضع المحدد: سورة مريم — الآية '+arabicNum(activeAyah);"""
if old not in a:
    raise SystemExit('selectAyah coverage code not found')
a = a.replace(old, new, 1)

old = """      var tafsirButtons=root.querySelectorAll('#quran-tafsir-pane button');tafsirButtons.forEach(function(btn){if(['التفسير الميسر','السعدي','ابن كثير'].includes(btn.textContent.trim()))btn.addEventListener('click',function(){v13SetActive(btn,'#quran-tafsir-pane .border-b');v13Toast('تم اختيار مصدر التفسير في المعاينة؛ محتوى المصادر يحتاج ربط النصوص الموثقة.');});});
      selectAyah(4,false,false);"""
new = """      var tafsirButtons=root.querySelectorAll('#quran-tafsir-pane [data-tafsir-source]');tafsirButtons.forEach(function(btn){btn.addEventListener('click',function(){v13SetActive(btn,'#quran-tafsir-pane .quran-tafsir-source-switch');tafsirButtons.forEach(function(item){item.classList.toggle('is-source-active',item===btn);});v13Toast('تم اختيار '+btn.textContent.trim()+' في المعاينة؛ يلزم ربط النص الكامل للمصدر قبل عرضه.');});});
      var tafsirCopy=$('#quran-tafsir-copy');if(tafsirCopy)tafsirCopy.addEventListener('click',function(){copyText(currentText());});
      var tafsirNote=$('#quran-tafsir-note');if(tafsirNote)tafsirNote.addEventListener('click',openNote);
      var tafsirBody=$('#quran-tafsir-body'), tafsirFontLabel=$('#quran-tafsir-font-size');
      var tafsirFontSize=15;
      try{var storedTafsirFont=Number(localStorage.getItem('islamic-platform-quran-tafsir-font-v1'));if(storedTafsirFont>=14&&storedTafsirFont<=21)tafsirFontSize=storedTafsirFont;}catch(e){}
      function applyTafsirFont(){if(tafsirBody)tafsirBody.style.fontSize=tafsirFontSize+'px';if(tafsirFontLabel)tafsirFontLabel.textContent=arabicNum(tafsirFontSize);try{localStorage.setItem('islamic-platform-quran-tafsir-font-v1',String(tafsirFontSize));}catch(e){}}
      var tafsirFontDown=$('#quran-tafsir-font-down'), tafsirFontUp=$('#quran-tafsir-font-up');
      if(tafsirFontDown)tafsirFontDown.addEventListener('click',function(){tafsirFontSize=Math.max(14,tafsirFontSize-1);applyTafsirFont();});
      if(tafsirFontUp)tafsirFontUp.addEventListener('click',function(){tafsirFontSize=Math.min(21,tafsirFontSize+1);applyTafsirFont();});
      applyTafsirFont();
      selectAyah(4,false,false);"""
if old not in a:
    raise SystemExit('tafsir button binding code not found')
a = a.replace(old, new, 1)
# The old hero search no longer exists. Scope the reader query explicitly so sidebar search is never captured as verse search.
a = a.replace("      var mainSearch=$('.page-search-shell input'),submit=$('.page-search-submit');", "      var mainSearch=$('#quran-main-search'),submit=$('#quran-main-search-submit');", 1)
app.write_text(a, encoding='utf-8')

# Add a polished, page-scoped stylesheet after all legacy Quran styles. This prevents old utility classes from washing out text.
css = root/'assets/css/quran-v41-detail-polish.css'
css.write_text(r'''/* V41 — focused Quran and Tafsir finish. Keep green as identity, black as reading ink. */
#screen-quran .quran-hero-inner {
  display:flex !important;
  align-items:center !important;
  justify-content:flex-start !important;
  min-height:104px !important;
  max-width:none !important;
}
#screen-quran .quran-hero-heading {max-width:760px !important;}
#screen-quran .quran-page-hero {padding-block:24px !important;}
#screen-quran .quran-hero-search-wrap,
#screen-quran .quran-hero-search,
#screen-quran .quran-search-note {display:none !important;}

/* Tafsir becomes a composed reading surface, not a loose collection of utilities. */
#screen-quran #quran-tafsir-pane.quran-tafsir-panel {
  display:flex !important;
  flex-direction:column !important;
  align-self:stretch !important;
  min-width:0 !important;
  gap:18px !important;
  padding:clamp(17px,2vw,26px) !important;
  border:1px solid #dce5d9 !important;
  border-radius:22px !important;
  background:#fff !important;
  box-shadow:0 10px 30px rgba(24,47,29,.055) !important;
  color:#171a17 !important;
}
#screen-quran #quran-tafsir-pane [hidden] {display:none !important;}
#screen-quran #quran-tafsir-pane :where(*) {color:#171a17 !important;}
#screen-quran #quran-tafsir-pane :where(svg,svg *) {color:inherit !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-header {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:18px !important;
  flex-wrap:wrap !important;
  padding:0 0 16px !important;
  border-bottom:1px solid #e6ebe3 !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-title-block {display:flex !important;flex-direction:column !important;gap:5px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-eyebrow {
  display:inline-flex !important;align-items:center !important;gap:7px !important;
  color:#526352 !important;font:700 10px Alexandria,sans-serif !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-eyebrow-dot {width:7px;height:7px;border-radius:50%;background:#47734c;display:inline-block;}
#screen-quran #quran-tafsir-pane .quran-tafsir-title-block h3 {margin:0 !important;color:#111 !important;font:800 21px Alexandria,sans-serif !important;line-height:1.5 !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-title-block p {margin:0 !important;color:#4b554c !important;font:600 11px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-source-area {display:flex !important;flex-direction:column !important;align-items:flex-start !important;gap:7px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-source-label {font:700 10px Alexandria,sans-serif !important;color:#4a554a !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-source-switch {
  display:flex !important;align-items:center !important;gap:4px !important;
  padding:4px !important;border:1px solid #e1e7de !important;border-radius:12px !important;
  background:#f5f7f3 !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-source {
  min-height:34px !important;padding:0 12px !important;border:1px solid transparent !important;
  border-radius:8px !important;background:transparent !important;color:#333b33 !important;
  font:700 10px Alexandria,sans-serif !important;white-space:nowrap !important;box-shadow:none !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-source.active,
#screen-quran #quran-tafsir-pane .quran-tafsir-source.is-source-active {
  background:#285238 !important;border-color:#285238 !important;color:#fff !important;
  box-shadow:0 2px 6px rgba(25,60,36,.14) !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-source.active *,
#screen-quran #quran-tafsir-pane .quran-tafsir-source.is-source-active * {color:#fff !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-verse-card {
  padding:15px 17px !important;border:1px solid #e1e8dc !important;border-radius:16px !important;
  background:linear-gradient(145deg,#f7f9f5,#f0f4ed) !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-card-label {display:flex !important;align-items:center !important;gap:7px !important;margin-bottom:9px !important;color:#465748 !important;font:700 10px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-card-label .ui-icon {width:15px;height:15px;color:#376343 !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-verse-text {
  margin:0 !important;color:#101510 !important;font:700 clamp(19px,1.45vw,23px) Amiri,"Noto Naskh Arabic",serif !important;
  line-height:2 !important;text-align:justify !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-coverage {
  margin:0 !important;padding:10px 13px !important;border:1px solid #e7e9df !important;
  border-inline-start:3px solid #9aa88e !important;border-radius:10px !important;
  background:#fafaf6 !important;color:#424a42 !important;font:500 10px/1.9 Alexandria,sans-serif !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-editorial {display:flex !important;flex-direction:column !important;gap:17px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-section {display:flex !important;flex-direction:column !important;gap:9px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-section-heading {display:flex !important;align-items:center !important;gap:9px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-section-index {
  display:grid !important;place-items:center !important;width:25px !important;height:25px !important;
  border-radius:8px !important;background:#eaf0e6 !important;color:#294f32 !important;
  font:800 11px Alexandria,sans-serif !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-section-heading h4 {margin:0 !important;color:#111 !important;font:800 13px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-body {
  margin:0 !important;color:#171a17 !important;font:400 15px/2.05 Alexandria,sans-serif !important;
  text-align:justify !important;max-width:76ch !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-reflection {
  display:flex !important;align-items:flex-start !important;gap:11px !important;
  padding:13px 14px !important;border:1px solid #e2e9db !important;border-radius:14px !important;
  background:#f3f6ef !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-reflection-icon {
  display:grid !important;place-items:center !important;flex:0 0 32px !important;width:32px !important;height:32px !important;
  border-radius:10px !important;background:#e2ebdc !important;color:#315c39 !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-reflection strong {display:block !important;margin-bottom:4px !important;color:#1a211a !important;font:800 11px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-reflection p {margin:0 !important;color:#252c25 !important;font:500 12px/1.9 Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-vocabulary-grid {display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:9px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-word-card {
  display:flex !important;flex-direction:column !important;gap:5px !important;padding:12px 13px !important;
  border:1px solid #e6eae2 !important;border-radius:12px !important;background:#fbfcfa !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-word-card strong {color:#1b241c !important;font:800 13px Amiri,serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-word-card span {color:#3e473f !important;font:500 11px/1.8 Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-unavailable {
  display:flex !important;align-items:flex-start !important;gap:12px !important;padding:18px !important;
  border:1px dashed #cbd7c6 !important;border-radius:15px !important;background:#f7f9f5 !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-unavailable[hidden] {display:none !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-unavailable > .ui-icon {width:22px;height:22px;color:#47734c !important;flex:0 0 auto;}
#screen-quran #quran-tafsir-pane .quran-tafsir-unavailable strong {display:block;color:#182019 !important;font:800 13px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-unavailable p {margin:5px 0 0;color:#4a554a !important;font:500 11px/1.9 Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-footer {
  display:flex !important;align-items:center !important;justify-content:space-between !important;gap:12px !important;flex-wrap:wrap !important;
  padding-top:14px !important;border-top:1px solid #e7ebe4 !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-font-tools,
#screen-quran #quran-tafsir-pane .quran-tafsir-actions {display:flex !important;align-items:center !important;gap:6px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-font-tools > span {color:#535c53 !important;font:700 10px Alexandria,sans-serif !important;margin-inline-end:4px !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-font-tools strong {min-width:22px;text-align:center;color:#171a17 !important;font:700 11px Alexandria,sans-serif !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-font-tools button,
#screen-quran #quran-tafsir-pane .quran-tafsir-actions button {
  display:inline-flex !important;align-items:center !important;justify-content:center !important;gap:6px !important;
  min-height:34px !important;padding:0 11px !important;border:1px solid #e0e6dc !important;border-radius:9px !important;
  background:#f7f9f5 !important;color:#202820 !important;font:700 10px Alexandria,sans-serif !important;
}
#screen-quran #quran-tafsir-pane .quran-tafsir-actions button:hover,
#screen-quran #quran-tafsir-pane .quran-tafsir-font-tools button:hover {background:#eaf1e6 !important;border-color:#cad9c4 !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-actions .ui-icon {width:14px;height:14px;color:#315e3a !important;}
#screen-quran #quran-tafsir-pane .quran-tafsir-source-disclaimer {margin:0 !important;color:#5b625b !important;font:500 9px/1.8 Alexandria,sans-serif !important;}

@media (max-width:900px) {
  #screen-quran #quran-tafsir-pane .quran-tafsir-header {flex-direction:column !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-source-area,
  #screen-quran #quran-tafsir-pane .quran-tafsir-source-switch {width:100% !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-source {flex:1 1 0 !important;padding-inline:6px !important;font-size:9px !important;}
}
@media (max-width:520px) {
  #screen-quran .quran-hero-inner {min-height:82px !important;}
  #screen-quran #quran-tafsir-pane.quran-tafsir-panel {padding:15px !important;border-radius:17px !important;gap:14px !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-vocabulary-grid {grid-template-columns:1fr !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-footer {align-items:stretch !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-actions {width:100% !important;}
  #screen-quran #quran-tafsir-pane .quran-tafsir-actions button {flex:1 1 0 !important;}
}
@media (prefers-reduced-motion:reduce) {
  #screen-quran #quran-tafsir-pane * {scroll-behavior:auto !important;transition:none !important;}
}
''', encoding='utf-8')

# Load the precise, last-in-cascade stylesheet on the Quran page only.
s = quran.read_text(encoding='utf-8')
needle = '<link href="../assets/css/quran-v40-position-layout.css" rel="stylesheet"/>'
if needle not in s:
    raise SystemExit('quran v40 stylesheet reference not found')
s = s.replace(needle, needle + '<link href="../assets/css/quran-v41-detail-polish.css" rel="stylesheet"/>', 1)
quran.write_text(s, encoding='utf-8')

# Append a concise change note.
readme = root/'README.md'
r = readme.read_text(encoding='utf-8') if readme.exists() else '# Islamic Platform Preview\n'
r += '''\n\n## V41 — Quran & Tafsir refinement\n- Removed the redundant search control from the Quran hero; the Surah index sidebar retains search.\n- Rebuilt the Tafsir pane with a clear header, source selector, verse card, readable explanation, reflection, vocabulary, and footer actions.\n- Enforced near-black reading text and neutral secondary copy across all Tafsir descendants.\n- Added local Tafsir font-size controls, copy-verse and note actions.\n- Tafsir explanation is shown only for the one sample verse with explanatory content; other selected verses show a clear unavailable state rather than reusing the wrong explanation.\n- Quran text, full Tafsir sources, and audio remain sample/unlinked data and are clearly labeled.\n'''
readme.write_text(r, encoding='utf-8')

print('Patched quran page, app.js, new stylesheet, README')
