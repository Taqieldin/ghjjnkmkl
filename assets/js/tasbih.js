(function(){
 const root=document.getElementById('screen-tasbih');if(!root)return;
 const countEl=root.querySelector('#tasbih-count'),targetEl=root.querySelector('#tasbih-target'),bar=root.querySelector('#tasbih-progress-bar'),label=root.querySelector('#tasbih-progress-label'),selected=root.querySelector('#tasbih-selected');
 let count=0,dhikr='سبحان الله';try{count=Number(localStorage.getItem('local-tasbih-count')||0)||0;dhikr=localStorage.getItem('local-tasbih-dhikr')||dhikr;}catch(e){}
 const digits=n=>String(n).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]);
 function save(){try{localStorage.setItem('local-tasbih-count',String(count));localStorage.setItem('local-tasbih-dhikr',dhikr);}catch(e){}}
 function render(){const target=Number(targetEl.value)||33;countEl.textContent=digits(count);label.textContent=digits(count)+' من '+digits(target);bar.style.width=Math.min(100,count/target*100)+'%';selected.textContent='الذكر المختار: '+dhikr;save();}
 root.querySelector('#tasbih-add').addEventListener('click',()=>{count++;render();});root.querySelector('#tasbih-reset').addEventListener('click',()=>{count=0;render();});targetEl.addEventListener('change',render);root.querySelectorAll('[data-tasbih-dhikr]').forEach(b=>b.addEventListener('click',()=>{dhikr=b.dataset.tasbihDhikr;render();}));render();
})();
