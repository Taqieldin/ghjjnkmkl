(function(){
  function norm(value){return String(value||'').normalize('NFKC').toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();}
  window.filterCatalogPage=function(input){
    const root=input?.closest('[data-catalog-page]')||document.querySelector('[data-catalog-page]');
    if(!root)return;
    const q=norm(input?.value||'');
    let shown=0;
    root.querySelectorAll('[data-catalog-card]').forEach(card=>{const ok=!q||norm((card.dataset.search||'')+' '+card.textContent).includes(q);card.hidden=!ok;if(ok)shown++;});
    let empty=root.querySelector('.catalog-filter-empty');
    if(!empty){empty=document.createElement('div');empty.className='catalog-empty catalog-filter-empty';empty.innerHTML='<strong>لا توجد نتائج مطابقة</strong><p>جرّب كلمة أخرى أو امسح البحث.</p>';root.querySelector('.catalog-grid')?.append(empty);}
    empty.hidden=shown>0;
  };
  window.showCatalogNotice=function(control,message){
    const root=control?.closest('.catalog-interaction-panel')||control?.parentElement;
    const feedback=root?.querySelector('.catalog-feedback');
    if(feedback)feedback.textContent=message;
  };
  function initTafsir(){
    const btn=document.getElementById('tafsir-preview-btn');if(!btn||btn.dataset.ready)return;btn.dataset.ready='1';
    const surahEl=document.getElementById('tafsir-surah');
    const ayahEl=document.getElementById('tafsir-ayah');
    const sourceEl=document.getElementById('tafsir-source');
    const title=document.getElementById('tafsir-reader-title');
    const sourceLine=document.getElementById('tafsir-reader-source');
    const feedback=document.getElementById('tafsir-feedback');
    const verse=document.querySelector('.tafsir-verse-paper p');
    const maxForSurah=()=>Number(surahEl?.selectedOptions?.[0]?.dataset.verses||7);
    const digits=value=>String(value).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    function clampAyah(){const max=maxForSurah();ayahEl.max=String(max);let n=parseInt(ayahEl.value,10)||1;n=Math.min(max,Math.max(1,n));ayahEl.value=String(n);return {n,max};}
    function render(){
      const surah=surahEl?.value||'الفاتحة';const source=sourceEl?.value||'التفسير الميسر';const {n,max}=clampAyah();
      if(title)title.textContent=surah+' · الآية '+digits(n);
      if(sourceLine)sourceLine.textContent='المصدر المختار: '+source;
      if(feedback)feedback.textContent='تم تحديد '+surah+'، الآية '+digits(n)+'، من '+source+'. لم يتم ربط نص التفسير الرقمي بعد؛ لن نعرض شرحًا منسوبًا إلى مصدر قبل إضافة نسخته ومراجعته.';
      if(verse){verse.textContent=(surah==='الفاتحة'&&n===1)?'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ':'نص الآية المحددة سيظهر هنا بعد ربط قاعدة المصحف المعتمدة.';verse.setAttribute('aria-label','موضع الآية المحدد: '+surah+'، الآية '+n);}
      const prev=document.getElementById('tafsir-prev-ayah');const next=document.getElementById('tafsir-next-ayah');
      if(prev)prev.disabled=(surahEl.selectedIndex===0&&n===1);if(next)next.disabled=(surahEl.selectedIndex===surahEl.options.length-1&&n===max);
    }
    surahEl?.addEventListener('change',()=>{ayahEl.value='1';render();});
    sourceEl?.addEventListener('change',render);
    ayahEl?.addEventListener('change',render);
    btn.addEventListener('click',render);
    document.getElementById('tafsir-prev-ayah')?.addEventListener('click',()=>{let {n}=clampAyah();if(n>1)ayahEl.value=String(n-1);else if(surahEl.selectedIndex>0){surahEl.selectedIndex--;ayahEl.value=String(maxForSurah());}render();});
    document.getElementById('tafsir-next-ayah')?.addEventListener('click',()=>{let {n,max}=clampAyah();if(n<max)ayahEl.value=String(n+1);else if(surahEl.selectedIndex<surahEl.options.length-1){surahEl.selectedIndex++;ayahEl.value='1';}render();});
    render();
  }

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-catalog-search]').forEach(input=>input.addEventListener('input',()=>window.filterCatalogPage(input)));
    initTafsir();
  });
  if(document.readyState!=='loading')initTafsir();
})();
