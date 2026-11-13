(function(){
  const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();
  function render(){
    const root=document.getElementById('screen-search');if(!root)return;
    const params=new URLSearchParams(location.search);const q=params.get('q')||'';
    const input=document.getElementById('search-page-input');if(input)input.value=q;
    const title=document.getElementById('search-results-title');const subtitle=document.getElementById('search-results-subtitle');
    const grid=document.getElementById('search-results-grid');const empty=document.getElementById('search-no-results');
    if(!grid)return;
    const privateSearchIds=new Set(['profile','feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material']);const publicIndex=(window.PLATFORM_SEARCH_INDEX||[]).filter(item=>!privateSearchIds.has(item.id));const index=[...new Map(publicIndex.map(item=>[item.id+'|'+(item.query||''),item])).values()];const terms=norm(q);
    const words=terms.split(/\s+/).filter(Boolean);
    let hits=index.map(item=>{const hay=norm([item.title,item.terms,item.kind].join(' '));let score=0;if(!terms)return 0;if(hay.includes(terms))score+=5;words.forEach(w=>{if(w.length>1&&hay.includes(w))score+=1;});if(norm(item.title).includes(terms))score+=5;return {item,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,40);
    if(title)title.textContent=terms?'نتائج البحث عن «'+q+'»':'ابدأ البحث في المنصة';
    if(subtitle)subtitle.textContent=terms?('عُثر على '+hits.length+' نتيجة مطابقة من فهرس أقسام المنصة.'): 'اكتب كلمة أو عبارة للبحث في المحتوى المتاح.';
    grid.innerHTML=hits.map(({item})=>`<article class="search-result-card"><span>${item.kindLabel||'قسم من المنصة'}</span><h2>${item.title}</h2><p>${item.description||item.terms||'افتح القسم لاستكشاف المحتوى المتاح.'}</p><button type="button" data-search-id="${item.id}" data-search-query="${item.query||''}">فتح النتيجة <span class="ui-icon" data-icon="arrow-left"></span></button></article>`).join('');
    grid.querySelectorAll('[data-search-id]').forEach(b=>b.addEventListener('click',()=>window.navigateToPage?.(b.dataset.searchId,b.dataset.searchQuery||'')));
    if(empty)empty.hidden=hits.length>0||!terms;
    if(window.renderUiIcons)window.renderUiIcons(grid);
  }
  window.performPageSearch=function(){const q=document.getElementById('search-page-input')?.value||'';const url=new URL(location.href);url.searchParams.set('q',q);history.replaceState({},'',url);render();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
