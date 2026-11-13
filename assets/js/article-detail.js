(function(){
  const root=document.getElementById('screen-article-detail'); if(!root)return;
  const params=new URLSearchParams(location.search); let slug=params.get('slug')||'tafsir-reading';
  const data=window.ARTICLE_DATA&&window.ARTICLE_DATA[slug]||window.ARTICLE_DATA['tafsir-reading'];
  const $=id=>document.getElementById(id);
  function set(id,value){const e=$(id);if(e)e.textContent=value||'';}
  set('article-detail-title',data.title);set('article-detail-lead',data.summary);set('article-detail-author',data.author);set('article-detail-author-bottom',data.author);
  set('article-detail-reading-time',new Intl.NumberFormat('ar-EG').format(data.readingTime)+' دقائق قراءة');set('article-detail-category',data.category);set('article-detail-breadcrumb-category',data.category);
  const categoryEl=$('article-detail-category');if(categoryEl)categoryEl.className='article-category-label '+(data.categoryKey||'quran');
  document.title=data.title+' | المقالات والبحوث — المنصة الإسلامية';
  const content=$('article-content-v2');
  const toc=$('article-toc');
  if(content&&toc){
    content.innerHTML='';toc.innerHTML='';
    data.sections.forEach((section,i)=>{
      const articleSection=document.createElement('section');articleSection.id=section.id;
      const num=document.createElement('span');num.className='article-section-number';num.textContent=new Intl.NumberFormat('ar-EG',{minimumIntegerDigits:2,useGrouping:false}).format(i+1);articleSection.appendChild(num);
      const h=document.createElement('h2');h.textContent=section.title;articleSection.appendChild(h);
      (section.paragraphs||[]).forEach(text=>{const p=document.createElement('p');p.textContent=text;articleSection.appendChild(p);});
      if(section.callout){const box=document.createElement('div');box.className='article-insight-box';const icon=document.createElement('span');icon.className='ui-icon';icon.dataset.icon='lightbulb';const body=document.createElement('div');const strong=document.createElement('strong');strong.textContent='فكرة أساسية';const p=document.createElement('p');p.textContent=section.callout;body.append(strong,p);box.append(icon,body);articleSection.appendChild(box);}
      if(section.bullets){const ul=document.createElement('ul');ul.className='article-check-list';section.bullets.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});articleSection.appendChild(ul);}
      content.appendChild(articleSection);
      const a=document.createElement('a');a.href='#'+section.id;a.textContent=section.title;toc.appendChild(a);
    });
  }
  const refs=document.querySelector('.article-reference-placeholder');
  if(refs){refs.innerHTML='';const ul=document.createElement('ul');ul.className='article-references-list';(data.references||[]).forEach(item=>{const li=document.createElement('li');li.textContent=item;ul.appendChild(li);});refs.appendChild(ul);}
  const related=$('article-related-grid');
  if(related){related.innerHTML='';(data.related||[]).slice(0,3).forEach(key=>{const item=window.ARTICLE_DATA[key];if(!item)return;const card=document.createElement('article');card.className='article-related-card';const tag=document.createElement('span');tag.textContent=item.category;const h=document.createElement('h3');h.textContent=item.title;const p=document.createElement('p');p.textContent=item.summary;const btn=document.createElement('button');btn.type='button';btn.textContent='قراءة المقال';btn.addEventListener('click',()=>window.openArticleBySlug(item.slug));card.append(tag,h,p,btn);related.appendChild(card);});}
  window.openArticleBySlug=function(key){if(window.navigateToPage)window.navigateToPage('article-detail','slug='+encodeURIComponent(key));};
  const bookmarkKey='platform-article-bookmarks-v1';
  function readBookmarks(){try{return JSON.parse(localStorage.getItem(bookmarkKey)||'[]');}catch(e){return window.__articleBookmarks||[];}}
  function writeBookmarks(list){try{localStorage.setItem(bookmarkKey,JSON.stringify(list));}catch(e){window.__articleBookmarks=list;}}
  function isSaved(){return readBookmarks().includes(data.slug);}
  function renderBookmark(){const b=$('article-bookmark-btn'),side=$('article-sidebar-bookmark');const saved=isSaved();if(b){b.setAttribute('aria-pressed',String(saved));b.classList.toggle('is-saved',saved);b.querySelector('span:last-child').textContent=saved?'محفوظ في قائمتك':'حفظ المقال';}if(side)side.textContent=saved?'إزالة من المحفوظات':'إضافة للمحفوظات';}
  function toggleBookmark(){const list=readBookmarks();const i=list.indexOf(data.slug);if(i>=0)list.splice(i,1);else list.unshift(data.slug);writeBookmarks(list);renderBookmark();if(typeof window.v13Toast==='function')window.v13Toast(i>=0?'تمت إزالة المقال من المحفوظات.':'تم حفظ المقال في هذه المتصفّح.');}
  ['article-bookmark-btn','article-sidebar-bookmark'].forEach(id=>{const b=$(id);if(b)b.addEventListener('click',toggleBookmark);});renderBookmark();
  const citationButton=$('article-cite-btn');
  if(citationButton)citationButton.addEventListener('click',async()=>{
    const citation=(data.author||'هيئة التحرير العلمي')+'، «'+data.title+'»، المنصة الإسلامية، مادة معاينة.';
    try{await navigator.clipboard.writeText(citation);if(window.v13Toast)window.v13Toast('تم نسخ إحالة المقال.');}
    catch(e){if(window.v13Toast)window.v13Toast('تعذر النسخ التلقائي في هذا المتصفح.');}
  });
  const noteInput=$('article-personal-note-input'),noteFeedback=$('article-personal-note-feedback');
  const noteKey='platform-article-note:'+data.slug;
  try{if(noteInput)noteInput.value=localStorage.getItem(noteKey)||'';}catch(e){if(noteInput)noteInput.value=window.__articleNotes?.[data.slug]||'';}
  if(noteFeedback&&noteInput&&noteInput.value)noteFeedback.textContent='لديك ملاحظة محفوظة لهذا المقال.';
  const saveNote=$('article-note-save'),clearNote=$('article-note-clear');
  if(saveNote)saveNote.addEventListener('click',()=>{const value=(noteInput?.value||'').trim();if(!value){if(noteFeedback)noteFeedback.textContent='اكتب ملاحظتك أولاً، أو استخدم زر المسح لإزالة الملاحظة الحالية.';return;}try{localStorage.setItem(noteKey,value);}catch(e){window.__articleNotes=window.__articleNotes||{};window.__articleNotes[data.slug]=value;}if(noteFeedback)noteFeedback.textContent='تم حفظ ملاحظتك على هذا الجهاز.';if(window.v13Toast)window.v13Toast('تم حفظ الملاحظة محلياً.');});
  if(clearNote)clearNote.addEventListener('click',()=>{if(noteInput)noteInput.value='';try{localStorage.removeItem(noteKey);}catch(e){if(window.__articleNotes)delete window.__articleNotes[data.slug];}if(noteFeedback)noteFeedback.textContent='تم مسح الملاحظة المحفوظة.';});

  const share=$('article-share-btn');if(share)share.addEventListener('click',async()=>{const url=location.href;try{if(navigator.share)await navigator.share({title:data.title,text:data.summary,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);share.classList.add('is-done');share.querySelector('span:last-child').textContent='تم نسخ الرابط';}else throw new Error('clipboard unavailable');}catch(e){if(e.name!=='AbortError'&&typeof window.v13Toast==='function')window.v13Toast('تعذر المشاركة التلقائية؛ انسخ رابط الصفحة من المتصفح.');}});
  const print=$('article-print-btn');if(print)print.addEventListener('click',()=>window.print());
  let font=18;function setFont(){if(content)content.style.fontSize=font+'px';set('article-font-size-label',new Intl.NumberFormat('ar-EG').format(font));}
  const up=$('article-font-up'),down=$('article-font-down');if(up)up.addEventListener('click',()=>{font=Math.min(24,font+1);setFont();});if(down)down.addEventListener('click',()=>{font=Math.max(15,font-1);setFont();});setFont();
  const progress=$('article-reading-progress-fill');let scheduled=false;
  function updateProgress(){scheduled=false;if(!progress)return;const max=document.documentElement.scrollHeight-window.innerHeight;const value=max>0?Math.max(0,Math.min(100,(window.scrollY/max)*100)):0;progress.style.width=value+'%';}
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}}, {passive:true});updateProgress();
  if(toc){toc.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;toc.querySelectorAll('a').forEach(x=>x.classList.toggle('is-active',x===a));});}
  if('IntersectionObserver' in window && toc){
    const links=Array.from(toc.querySelectorAll('a[href^="#"]'));
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!visible)return;links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+visible.target.id));},{rootMargin:'-15% 0px -70% 0px',threshold:0});
    content?.querySelectorAll('section[id]').forEach(section=>observer.observe(section));
  }
  if(window.renderUiIcons)window.renderUiIcons(root);
})();
