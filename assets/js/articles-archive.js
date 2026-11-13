(function(){
  const root=document.getElementById('screen-articles'); if(!root)return;
  const cards=Array.from(root.querySelectorAll('.article-card-v2'));
  const search=root.querySelector('#articles-search');
  const categoryButtons=Array.from(root.querySelectorAll('[data-article-category]'));
  const sort=root.querySelector('#articles-sort');
  const grid=root.querySelector('#articles-grid-v2');
  const empty=root.querySelector('#articles-no-results');
  const label=root.querySelector('#articles-results-label');
  let activeCategory='all';
  function normalize(s){return (s||'').toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').trim();}
  function apply(){
    const term=normalize(search&&search.value);
    let visible=cards.filter(card=>{
      const categoryOk=activeCategory==='all'||card.dataset.category===activeCategory;
      const textOk=!term||normalize((card.dataset.search||'')+' '+card.textContent).includes(term);
      return categoryOk&&textOk;
    });
    if(sort&&sort.value==='short')visible.sort((a,b)=>Number(a.dataset.readingMinutes)-Number(b.dataset.readingMinutes));
    if(sort&&sort.value==='long')visible.sort((a,b)=>Number(b.dataset.readingMinutes)-Number(a.dataset.readingMinutes));
    if(sort&&sort.value==='title')visible.sort((a,b)=>a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent,'ar'));
    cards.forEach(c=>c.hidden=true); visible.forEach(c=>{c.hidden=false;grid.appendChild(c);});
    if(empty)empty.hidden=visible.length>0;
    if(label)label.textContent='عدد المقالات المعروضة: '+new Intl.NumberFormat('ar-EG').format(visible.length);
    categoryButtons.forEach(b=>b.classList.toggle('is-active',b.dataset.articleCategory===activeCategory));
  }
  categoryButtons.forEach(b=>b.addEventListener('click',()=>{activeCategory=b.dataset.articleCategory;apply();}));
  if(search)search.addEventListener('input',apply);
  if(sort)sort.addEventListener('change',apply);
  const clear=root.querySelector('#articles-search-clear'); if(clear)clear.addEventListener('click',()=>{if(search)search.value='';activeCategory='all';apply();if(search)search.focus();});
  const reset=root.querySelector('#articles-reset'); if(reset)reset.addEventListener('click',()=>{activeCategory='all';if(search)search.value='';if(sort)sort.value='recommended';apply();});
  root.querySelectorAll('[data-open-article]').forEach(b=>b.addEventListener('click',()=>window.openArticleBySlug&&window.openArticleBySlug(b.dataset.openArticle)));
  apply();
})();
