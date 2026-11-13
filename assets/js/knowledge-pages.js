(()=>{
  const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();
  document.querySelectorAll('[data-knowledge-search]').forEach(input=>{
    const target=input.dataset.target;
    input.addEventListener('input',()=>{
      const q=norm(input.value);
      document.querySelectorAll(target||'[data-knowledge-card]').forEach(card=>{
        const hay=norm((card.dataset.search||'')+' '+card.textContent);
        card.hidden=!!q&&!hay.includes(q);
      });
    });
  });
  const tafsirBtn=document.getElementById('tafsir-preview-btn');
  if(tafsirBtn) tafsirBtn.addEventListener('click',()=>{
    const surah=document.getElementById('tafsir-surah')?.value||'الفاتحة';
    const ayah=document.getElementById('tafsir-ayah')?.value||'1';
    const source=document.getElementById('tafsir-source')?.value||'التفسير الميسر';
    const title=document.getElementById('tafsir-reader-title');
    const sourceLine=document.getElementById('tafsir-reader-source');
    const feedback=document.getElementById('tafsir-feedback');
    if(title)title.textContent=surah+' · الآية '+ayah;
    if(sourceLine)sourceLine.textContent='مصدر العرض: '+source;
    if(feedback)feedback.textContent='تم تحديد '+surah+'، الآية '+ayah+'، من '+source+'. لا يظهر نص التفسير حتى يتم ربط النسخة الرقمية المعتمدة.';
  });
  const translationBtn=document.getElementById('translation-preview-btn');
  if(translationBtn) translationBtn.addEventListener('click',()=>{
    const language=document.getElementById('translation-language')?.value||'اللغة المختارة';
    const size=document.getElementById('translation-font-size')?.value||'medium';
    const mode=document.getElementById('translation-display-mode')?.value||'both';
    const preview=document.querySelector('.translation-preview');
    if(preview){preview.style.gridTemplateColumns=mode==='both'?'1fr 1fr':'1fr';preview.children[0].hidden=mode==='translation';preview.children[1].hidden=mode==='arabic';preview.querySelectorAll('p').forEach(p=>p.style.fontSize=size==='large'?'22px':size==='small'?'15px':'18px');}
    const note=document.getElementById('translation-feedback');
    if(note)note.textContent='إعدادات المعاينة: '+language+'، حجم '+(size==='large'?'كبير':size==='small'?'صغير':'متوسط')+'، '+(mode==='both'?'العربية والترجمة معاً':mode==='translation'?'الترجمة فقط':'العربية فقط')+'. لا يتم تحميل ترجمة فعلية أو نص محمي في هذه النسخة.';
  });
  const adhanBtn=document.getElementById('adhan-save-btn');
  if(adhanBtn) adhanBtn.addEventListener('click',()=>{
    const count=[...document.querySelectorAll('.adhan-settings-list input[type=checkbox]')].filter(x=>x.checked).length;
    const type=document.getElementById('adhan-notification-type')?.value||'إشعار فقط';
    const reminder=document.getElementById('adhan-reminder-time')?.value||'بدون تذكير مسبق';
    const note=document.getElementById('adhan-feedback');
    if(note)note.textContent='تم تحديث المعاينة: '+count+' صلوات مفعّل لها التنبيه، نوعه '+type+'، والتذكير '+reminder+'. لا تُرسل إشعارات فعلية قبل ربط التطبيق بخدمة التنبيهات.';
  });
  const imsak=document.getElementById('imsak-city');
  if(imsak) imsak.addEventListener('change',()=>{
    const feedback=document.getElementById('imsak-feedback');
    if(feedback)feedback.textContent='تم اختيار '+imsak.value+'. لا يوجد جدول توقيت فعلي محمل في هذه النسخة؛ لا تعتمد عليها لتحديد الإمساك أو الإفطار.';
  });
})();
