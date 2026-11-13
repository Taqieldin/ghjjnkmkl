/* V32 — local, accessible adhkar reader. Editorial verification is required before publication. */
(function(){
'use strict';
const KEY='platform-adhkar-v32';
const DATA={
 morning:{title:'أذكار الصباح',eyebrow:'ورد الصباح',items:[
  ['أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.','مرة واحدة','صحيح مسلم، من أذكار الصباح والمساء'],
  ['اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.','مرة واحدة','أبو داود والترمذي'],
  ['رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.','ثلاث مرات','أبو داود والترمذي'],
  ['اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.','مرة واحدة','صحيح البخاري — سيد الاستغفار'],
  ['سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.','مائة مرة','صحيح البخاري وصحيح مسلم'] ]},
 evening:{title:'أذكار المساء',eyebrow:'ورد المساء',items:[
  ['أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.','مرة واحدة','صحيح مسلم، من أذكار الصباح والمساء'],
  ['اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.','مرة واحدة','أبو داود والترمذي'],
  ['رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.','ثلاث مرات','أبو داود والترمذي'],
  ['أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.','ثلاث مرات','صحيح مسلم'] ]},
 prayer:{title:'أذكار بعد الصلاة',eyebrow:'عقب الصلاة',items:[
  ['أَسْتَغْفِرُ اللَّهَ.','ثلاث مرات','صحيح مسلم'],
  ['اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.','مرة واحدة','صحيح مسلم'],
  ['سُبْحَانَ اللَّهِ.','ثلاث وثلاثون مرة','صحيح مسلم — من صيغ الذكر دبر الصلاة'],
  ['الْحَمْدُ لِلَّهِ.','ثلاث وثلاثون مرة','صحيح مسلم — من صيغ الذكر دبر الصلاة'],
  ['اللَّهُ أَكْبَرُ.','ثلاث وثلاثون مرة','صحيح مسلم — من صيغ الذكر دبر الصلاة'] ]},
 sleep:{title:'أذكار النوم',eyebrow:'قبل النوم',items:[
  ['بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.','مرة واحدة','صحيح البخاري'],
  ['اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.','ثلاث مرات','أبو داود والترمذي'],
  ['قراءة آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...','مرة واحدة','صحيح البخاري — فضل آية الكرسي عند النوم'],
  ['قراءة آخر آيتين من سورة البقرة.','مرة واحدة','صحيح البخاري وصحيح مسلم'] ]},
 travel:{title:'أدعية السفر',eyebrow:'في السفر',items:[
  ['اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.','عند الركوب','صحيح مسلم'],
  ['اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.','في السفر','صحيح مسلم'],
  ['اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا، وَاطْوِ عَنَّا بُعْدَهُ.','في السفر','صحيح مسلم'],
  ['آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ.','عند الرجوع','صحيح مسلم'] ]}
};
const $=id=>document.getElementById(id);let category='morning',fontSize=28;let state={};
function load(){try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){state={};}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){toast('تعذر الحفظ في مساحة المتصفح.');}}
function dayKey(){return new Date().toLocaleDateString('en-CA');}
function dayState(){const day=dayKey();if(!state[day])state[day]={done:{}};if(!Array.isArray(state.favorites))state.favorites=[];return state[day];}
function favorites(){if(!Array.isArray(state.favorites))state.favorites=[];return state.favorites;}
function toast(msg){const n=$('adhkar-v32-toast');if(!n)return;n.textContent=msg;n.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>n.classList.remove('show'),2200);}
function allEntries(){return Object.entries(DATA).flatMap(([cat,obj])=>obj.items.map((x,i)=>({id:cat+'-'+i,cat,text:x[0],count:x[1],source:x[2],title:obj.title})));}
function isFav(id){return favorites().includes(id);}
function renderFavorites(){const root=$('adhkar-v32-favorites');if(!root)return;root.replaceChildren();const fav=allEntries().filter(x=>isFav(x.id));if(!fav.length){const p=document.createElement('p');p.className='adhkar-favorites-empty';p.textContent='لم تحفظ أي ذكر بعد. اضغط علامة القلب على الذكر لإضافته هنا.';root.append(p);return;}fav.slice(0,6).forEach(x=>{const b=document.createElement('button');b.className='adhkar-favorite-link';b.textContent=x.text;b.addEventListener('click',()=>{category=x.cat;render();});root.append(b);});}
function render(){const root=$('adhkar-v32-list');if(!root)return;root.replaceChildren();const ds=dayState();let arr=category==='favorites'?allEntries().filter(x=>isFav(x.id)):DATA[category].items.map((x,i)=>({id:category+'-'+i,cat:category,text:x[0],count:x[1],source:x[2]}));const q=($('adhkar-v32-search')?.value||'').trim();if(q)arr=arr.filter(x=>(x.text+' '+x.source).includes(q));const sort=$('adhkar-v32-sort')?.value;if(sort==='remaining')arr.sort((a,b)=>(!!ds.done[a.id])-(!!ds.done[b.id]));if(sort==='favorites')arr.sort((a,b)=>Number(isFav(b.id))-Number(isFav(a.id)));$('adhkar-v32-category-eyebrow').textContent=category==='favorites'?'محفوظاتك':DATA[category].eyebrow;$('adhkar-v32-category-title').textContent=category==='favorites'?'الأذكار المفضلة':DATA[category].title;let done=0;arr.forEach((x,i)=>{if(ds.done[x.id])done++;const card=document.createElement('article');card.className='adhkar-v32-card'+(ds.done[x.id]?' is-done':'');card.innerHTML='<div class="adhkar-card-top"><span class="adhkar-card-index">'+String(i+1).padStart(2,'0')+'</span><span class="adhkar-card-source"></span><button class="adhkar-fav-btn" type="button" aria-label="حفظ في المفضلة">♡</button></div><p class="adhkar-card-text"></p><div class="adhkar-card-footer"><span class="adhkar-card-count"></span><div class="adhkar-card-actions"><button type="button" class="adhkar-copy-btn"><span class="ui-icon" data-icon="copy"></span> نسخ</button><button type="button" class="adhkar-done-btn"><span class="ui-icon" data-icon="check"></span> أتممت الذكر</button></div></div>';card.querySelector('.adhkar-card-source').textContent=x.source;card.querySelector('.adhkar-card-text').textContent=x.text;card.querySelector('.adhkar-card-text').style.fontSize=fontSize+'px';card.querySelector('.adhkar-card-count').textContent='التكرار: '+(x.count||'حسب الحاجة');const fav=card.querySelector('.adhkar-fav-btn');fav.classList.toggle('is-fav',isFav(x.id));fav.textContent=isFav(x.id)?'♥':'♡';fav.onclick=()=>{const f=favorites();state.favorites=f.includes(x.id)?f.filter(v=>v!==x.id):[...f,x.id];save();render();};card.querySelector('.adhkar-copy-btn').onclick=()=>{if(navigator.clipboard?.writeText)navigator.clipboard.writeText(x.text).then(()=>toast('تم نسخ الذكر')).catch(()=>toast('تعذر النسخ من المتصفح'));else toast('خاصية النسخ غير متاحة في هذا المتصفح');};card.querySelector('.adhkar-done-btn').onclick=()=>{const d=dayState().done; if(d[x.id])delete d[x.id];else d[x.id]=true;save();render();};root.append(card);});const total=arr.length;const pct=total?Math.round(done/total*100):0;$('adhkar-v32-progress-count').textContent=done+' / '+total;$('adhkar-v32-progress-text').textContent=total?(done===total?'أكملت هذا القسم، تقبل الله منك.':'أنجزت '+done+' من '+total+' أذكار في هذا القسم.'):'لا توجد نتائج في هذا القسم.';$('adhkar-v32-ring').style.setProperty('--progress',pct+'%');$('adhkar-v32-empty').hidden=total>0;const dayTotal=allEntries().length;const dayDone=Object.keys(ds.done).filter(id=>allEntries().some(x=>x.id===id)).length;$('adhkar-v32-today-done').textContent=dayDone;$('adhkar-v32-today-total').textContent=dayTotal;renderFavorites();window.renderUiIcons?.(root);}
function choose(cat){if(!DATA[cat]&&cat!=='favorites')return;category=cat;document.querySelectorAll('[data-adhkar-category]').forEach(b=>b.classList.toggle('is-active',b.dataset.adhkarCategory===cat));if($('adhkar-v32-search'))$('adhkar-v32-search').value='';render();}
window.adhkarSearch=()=>render();
document.addEventListener('DOMContentLoaded',()=>{load();document.querySelectorAll('[data-adhkar-category]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.adhkarCategory)));$('adhkar-v32-search')?.addEventListener('input',render);$('adhkar-v32-sort')?.addEventListener('change',render);$('adhkar-v32-reset')?.addEventListener('click',()=>{if(!confirm('هل تريد إعادة ضبط تقدم الأذكار لهذا اليوم؟'))return;dayState().done={};save();render();toast('تمت إعادة ضبط تقدم اليوم');});document.querySelectorAll('[data-adhkar-font]').forEach(b=>b.addEventListener('click',()=>{fontSize=Math.max(22,Math.min(40,fontSize+(b.dataset.adhkarFont==='up'?2:-2)));render();}));render();});
})();