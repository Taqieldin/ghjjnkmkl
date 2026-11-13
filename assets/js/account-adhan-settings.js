(function(){
  const KEY='islamic-platform-adhan-preferences-v1';
  const root=document.getElementById('adhan-settings');
  if(!root)return;
  const master=root.querySelector('#adhan-master-enabled');
  const prayerInputs=[...root.querySelectorAll('[data-adhan-prayer]')];
  const type=root.querySelector('#adhan-notification-type');
  const reminder=root.querySelector('#adhan-reminder-time');
  const vibration=root.querySelector('#adhan-vibration');
  const quiet=root.querySelector('#adhan-quiet-hours');
  const feedback=root.querySelector('#adhan-account-feedback');
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return {};}}
  function write(value){try{localStorage.setItem(KEY,JSON.stringify(value));return true;}catch(e){return false;}}
  function apply(data){
    if(master)master.checked=data.enabled!==false;
    prayerInputs.forEach(input=>{input.checked=data.prayers?data.prayers[input.dataset.adhanPrayer]!==false:true;});
    if(type&&data.type)type.value=data.type;
    if(reminder&&data.reminder!==undefined)reminder.value=String(data.reminder);
    if(vibration)vibration.checked=!!data.vibration;
    if(quiet)quiet.checked=!!data.quietHours;
    syncDisabled();
  }
  function syncDisabled(){
    const enabled=!!(master&&master.checked);
    prayerInputs.forEach(input=>{input.disabled=!enabled;input.closest('.account-prayer-toggle')?.classList.toggle('is-disabled',!enabled);});
  }
  function snapshot(){
    return {enabled:!!master?.checked,prayers:Object.fromEntries(prayerInputs.map(x=>[x.dataset.adhanPrayer,!!x.checked])),type:type?.value||'notice',reminder:Number(reminder?.value||0),vibration:!!vibration?.checked,quietHours:!!quiet?.checked,updatedAt:new Date().toISOString()};
  }
  master?.addEventListener('change',syncDisabled);
  root.querySelector('#adhan-account-save')?.addEventListener('click',()=>{
    const saved=write(snapshot());
    if(feedback)feedback.textContent=saved?'تم حفظ تفضيلات الأذان على هذا الجهاز.':'تعذر الحفظ الدائم في هذا المتصفح؛ قد تبقى التغييرات لهذه الجلسة فقط.';
    if(typeof window.v13Toast==='function')window.v13Toast(saved?'تم حفظ إعدادات الأذان.':'تعذر حفظ الإعدادات محليًا.');
  });
  apply(read());
  const params=new URLSearchParams(location.search);
  if(params.get('section')==='adhan')requestAnimationFrame(()=>root.scrollIntoView({behavior:'smooth',block:'start'}));
})();
