(function(){
  function topbarSafeToast(message){ window.v13Toast(message); }
  function v13Toast(message){
    let toast=document.getElementById('prototype-toast');
    if(!toast){toast=document.createElement('div');toast.id='prototype-toast';toast.className='prototype-toast';toast.setAttribute('role','status');document.body.appendChild(toast);}
    toast.textContent=message;toast.classList.add('is-visible');clearTimeout(window.__v13ToastTimer);
    window.__v13ToastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2800);
  }
  window.v13Toast=v13Toast;window.topbarSafeToast=topbarSafeToast;
    const ICON_PATHS = {
      'alert-circle':'<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
      'bell-ring':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/><path d="M2 8a10 10 0 0 1 2-5m18 5a10 10 0 0 0-2-5"/>',
      'check-circle-2':'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/>',
      'clipboard-check':'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 12h7m-7 4 2 2 4-4"/>',
      'external-link':'<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
      'heart-handshake':'<path d="M20.8 8.8c0 5.3-8.8 11-8.8 11s-8.8-5.7-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/><path d="m8 12 2 1 2-1 2 1 2-1"/>',
      'map':'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/>',
      'route':'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h2a4 4 0 0 0 4-4v-4a4 4 0 0 1 4-4"/>',
      'calendar-days':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
      'search':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', 'shopping-cart':'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l2.3 11.2a2 2 0 0 0 2 1.6h9.9a2 2 0 0 0 2-1.6L22 7H5"/>', 'book-open':'<path d="M12 7v14m0-14C10.5 5.9 8.5 5 6 5a3 3 0 0 0-3 3v10a3 3 0 0 0 3-3c2.5 0 4.5.9 6 2m0-10c1.5-1.1 3.5-2 6-2a3 3 0 0 1 3 3v10a3 3 0 0 1-3-3c-2.5 0-4.5.9-6 2"/>',
      'bookmark':'<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
      'clock-3':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      'arrow-left':'<path d="M19 12H5m7 7-7-7 7-7"/>', 'chevron-left':'<path d="m14 18-6-6 6-6"/>',
      'scroll-text':'<path d="M8 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8"/><path d="M4 3h4v18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M11 8h7M11 12h7M11 16h5"/>',
      'library':'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8M8 10h7"/>',
      'sparkles':'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
      'book-text':'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8M8 10h8M8 14h5"/>',
      'newspaper':'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h4"/><path d="M2 7v11a2 2 0 0 0 2 2"/>',
      'lock':'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3"/>',
      'shield-check':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
      'user-round':'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      'layout-grid':'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',
      'notebook-pen':'<path d="M12 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M8 6h5M8 10h4M8 14h3"/><path d="m16 5 3-3 3 3-8 8-4 1 1-4 5-5Z"/>',
      'chart-no-axes-combined':'<path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/><path d="M17 6h4v4"/>',
      'moon':'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
      'circle-dot':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/>',
      'radio':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="m7 7 10-4M7 12h.01M11 12h.01M15 12h.01M7 17h10"/>',
      'volume-2':'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 5a9 9 0 0 1 0 14"/>',
      'map-pin':'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
      'medal':'<circle cx="12" cy="8" r="5"/><path d="m8.2 12-1.2 9 5-3 5 3-1.2-9"/>',
      'book-check':'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M8 7h7M8 11h5m-4 5 2 2 4-4"/>',
      'calendar-check':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18m4 10 2 2 4-4"/>',
      'pencil':'<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',
      'settings':'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z"/>',
      'headphones':'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="5" height="8" rx="2"/><rect x="17" y="13" width="5" height="8" rx="2"/>',
      'list-plus':'<path d="M10 6h11M10 12h11M10 18h6M3 6h.01M3 12h.01M3 18h.01M19 16v6M16 19h6"/>',
      'camera':'<path d="M14 5 15.5 7H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4.5L10 5z"/><circle cx="12" cy="13" r="3.5"/>',
      'activity':'<path d="M3 12h4l3-8 4 16 3-8h4"/>', 'target':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      'lightbulb':'<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 .8-1.5 1.7-1.5 3h-5C9.5 15.7 9 14.8 8 14Z"/>',
      'badge-check':'<path d="M12 3 14 5l3-.2.8 2.9L20 10l-1 2.8 1 2.8-2.2 2.3L17 21l-3-.2-2 2-2-2-3 .2-.8-2.9L4 15.6l1-2.8-1-2.8 2.2-2.3L7 4.8 10 5z"/><path d="m9 12 2 2 4-4"/>',
      'heart':'<path d="M20.8 8.8c0 5.3-8.8 11-8.8 11s-8.8-5.7-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>',
      'message-circle':'<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4.4A8.5 8.5 0 1 1 21 11.5Z"/>',
      'share-2':'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 9.4 6.6 2.6"/>',
      'plus':'<path d="M12 5v14M5 12h14"/>', 'arrow-up-left':'<path d="M7 17 17 7M7 7h10v10"/>',
      'sliders-horizontal':'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
      'trending-up':'<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
      'check':'<path d="m5 12 4 4L19 6"/>', 'star':'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
      'flame':'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-1 2-2 3-2 5-2-1-3-3-3-5-3 3-5 6-5 10a7 7 0 0 0 7 7Z"/>',
      'graduation-cap':'<path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c4 3 8 3 12 0v-5m4-2v7"/>',
      'x':'<path d="m6 6 12 12M18 6 6 18"/>',
      'book-open-check':'<path d="M12 7v14m0-14C10.5 5.9 8.5 5 6 5a3 3 0 0 0-3 3v10a3 3 0 0 0 3-3c2.5 0 4.5.9 6 2m0-10c1.5-1.1 3.5-2 6-2a3 3 0 0 1 3 3v5"/><path d="m16 19 2 2 4-4"/>',
      'chevron-down':'<path d="m6 9 6 6 6-6"/>',
      'calculator':'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
      'kaaba':'<path d="m3 7 9-4 9 4v11l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v11M3 12l9 4 9-4"/><path d="M8 9.2v2.1m8-2.1v2.1"/>',
      'sunrise':'<path d="M12 2v5m-7.1-.1 3.5 3.5M2 17h20M4 13h2m12 0h2M7 21h10"/><path d="M5 17a7 7 0 0 1 14 0"/>',
      'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
      'sunset':'<path d="M12 10V2m-7.1 3.1 3.5 3.5M2 17h20M4 13h2m12 0h2M7 21h10"/><path d="M5 17a7 7 0 0 1 14 0"/>',
      'info':'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
      'grid-2x2':'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
      'search-x':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4m-7-8 4 4m0-4-4 4"/>',
      'scale':'<path d="m16 16 3-8 3 8a5 5 0 0 1-6 0Zm-14 0 3-8 3 8a5 5 0 0 1-6 0ZM12 3v18m-7 0h14M5 8h14"/>',
      'arrow-right':'<path d="M5 12h14m-7-7 7 7-7 7"/>',
      'list':'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'
    };
    Object.assign(ICON_PATHS, {
      'landmark':'<path d="M3 21h18M5 21V9m14 12V9M3 9l9-6 9 6M9 21v-8h6v8"/>',
      'columns':'<path d="M4 4h6v16H4zM14 4h6v16h-6zM2 21h20"/>',
      'coins':'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3 1.1 0 2.1-.2 3-.4M3 12v5c0 1.7 2.7 3 6 3 1.7 0 3.2-.4 4.2-1M15 10c3.3 0 6 1.3 6 3s-2.7 3-6 3-6-1.3-6-3 2.7-3 6-3Z"/><path d="M9 13v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
      'swords':'<path d="m14.5 5.5 4-4 4 4-4 4M2 22l8-8m-3-3 3 3m2-2 3 3M3 3l8 8m-5-8 8 8"/>',
      'git-branch':'<circle cx="6" cy="4" r="2"/><circle cx="18" cy="20" r="2"/><circle cx="18" cy="4" r="2"/><path d="M6 6v7a5 5 0 0 0 5 5h5m-2-3 3 3-3 3M8 4h7a3 3 0 0 1 3 3v11"/>',
      'map-pinned':'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/><path d="m2 5 3-2 4 2m6 0 4-2 3 2v13l-3 2-4-2m-6 0-4 2-3-2"/>',
      'flag':'<path d="M5 22V4m0 0c6-4 9 4 15 0v11c-6 4-9-4-15 0"/>',
      'compass':'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z"/>',
      'archive':'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9m-9 4h4"/>',
      'graduation-cap':'<path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c4 3 8 3 12 0v-5m4-2v7"/>'
    });
    Object.assign(ICON_PATHS, {
      'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      'music':'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      'file-check':'<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v6h5m-10 6 2 2 4-4"/>',
      'languages':'<path d="M4 6h12M10 4v2m-6 0c.6 4 3.2 7 7 9m-5-5c-1 2-3 3.5-5 4m10 6 4-10 4 10m-6.5-3h5"/>'
    });
    Object.assign(ICON_PATHS, {'moon-star':ICON_PATHS['moon'],'plane':ICON_PATHS['route'],'hand-heart':ICON_PATHS['heart-handshake'],'utensils':ICON_PATHS['book-open'],'sprout':ICON_PATHS['book-open'],'ship':ICON_PATHS['landmark'],'waves':ICON_PATHS['sunrise'],'book-marked':ICON_PATHS['bookmark'],'audio-lines':ICON_PATHS['volume-2'],'book-open-text':ICON_PATHS['book-text'],'message-square-warning':ICON_PATHS['alert-circle'],'file-plus':ICON_PATHS['clipboard-check'],'pen-tool':ICON_PATHS['pencil'],'gift':ICON_PATHS['star'],'mail':ICON_PATHS['message-circle'],'hand':ICON_PATHS['heart'],'inbox':ICON_PATHS['archive'],'chart-no-axes-column':ICON_PATHS['chart-no-axes-combined'],'building-2':ICON_PATHS['landmark'],'shield':ICON_PATHS['shield-check'],'key-round':ICON_PATHS['lock'],'timer':ICON_PATHS['clock-3'],'radio-tower':ICON_PATHS['radio'],'user-plus':ICON_PATHS['user-round'],'user-x':ICON_PATHS['user-round'],'file-text':ICON_PATHS['book-text'],'download':ICON_PATHS['archive'],'clipboard-list':ICON_PATHS['clipboard-check'],'file-check':ICON_PATHS['book-check'],'layout-dashboard':ICON_PATHS['layout-grid'],'accessibility':ICON_PATHS['user-round'],'copyright':ICON_PATHS['info'],'book':ICON_PATHS['book-open'],'check-circle':ICON_PATHS['check-circle-2'],'calendar-range':ICON_PATHS['calendar-days'],'headphones':ICON_PATHS['headphones']});
    function renderUiIcons(root) {
      (root || document).querySelectorAll('[data-icon]').forEach(function(el) {
        if (el.dataset.iconReady === '1') return;
        var name = el.getAttribute('data-icon');
        var path = ICON_PATHS[name] || ICON_PATHS['star'];
        el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + '</svg>';
        el.dataset.iconReady = '1';
      });
    }

  window.renderUiIcons=renderUiIcons;

  let activeMegaMenu=null,activeMegaTrigger=null,pendingAccountDestination='profile',pendingAccountQuery='';
  let accountSessionActive=false;
  try{accountSessionActive=sessionStorage.getItem('platform-demo-account')==='active';}catch(e){}
  function toggleTopbarSearch(force){
    const panel=document.getElementById('topbar-search-panel'),btn=document.getElementById('topbar-search-toggle'),input=document.getElementById('topbar-search-input');
    if(!panel||!btn)return;
    const open=typeof force==='boolean'?force:!panel.classList.contains('is-open');
    if(open){panel.hidden=false;requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('is-open')));btn.setAttribute('aria-expanded','true');if(input)setTimeout(()=>input.focus(),170);}
    else{panel.classList.remove('is-open');btn.setAttribute('aria-expanded','false');setTimeout(()=>{if(!panel.classList.contains('is-open'))panel.hidden=true;},230);const results=document.getElementById('topbar-search-results');if(results)results.innerHTML='<span>اكتب كلمة للبحث في محتوى المنصة.</span>';}
  }
  function toggleTopbarLanguage(force){
    const menu=document.getElementById('topbar-language-menu'),btn=document.getElementById('topbar-language-toggle');if(!menu||!btn)return;
    const open=typeof force==='boolean'?force:menu.hidden;menu.hidden=!open;btn.setAttribute('aria-expanded',String(open));
    if(open){const current=menu.querySelector('[aria-current="true"]');if(current)current.focus({preventScroll:true});}
  }
  function applySiteTheme(dark){
    document.documentElement.classList.toggle('dark',!!dark);document.documentElement.classList.toggle('light',!dark);document.body.classList.toggle('site-theme-dark',!!dark);
    const btn=document.getElementById('topbar-theme-toggle');if(btn){btn.setAttribute('aria-pressed',String(!!dark));btn.title=dark?'التبديل إلى الوضع الفاتح':'التبديل إلى الوضع الداكن';btn.setAttribute('aria-label',dark?'الوضع الداكن مفعّل، اضغط للوضع الفاتح':'الوضع الفاتح مفعّل، اضغط للوضع الداكن');const icon=btn.querySelector('.topbar-theme-icon');if(icon){icon.setAttribute('data-icon',dark?'sun':'moon');icon.dataset.iconReady='';renderUiIcons(btn);}}
    try{localStorage.setItem('platform-theme',dark?'dark':'light');}catch(e){}
  }
  function toggleSiteTheme(){applySiteTheme(!document.documentElement.classList.contains('dark'));}
  function initTopbarControls(){
    let saved='light';try{saved=localStorage.getItem('platform-theme')||'light';}catch(e){}applySiteTheme(saved==='dark');
    const input=document.getElementById('topbar-search-input');if(input)input.addEventListener('input',()=>{if(input.value.trim().length>=2&&typeof window.runTopbarSearch==='function')window.runTopbarSearch();else{const r=document.getElementById('topbar-search-results');if(r)r.innerHTML='<span>اكتب كلمتين على الأقل لعرض النتائج.</span>';}});
    document.addEventListener('click',e=>{
      const sw=document.getElementById('topbar-search-wrap'),sp=document.getElementById('topbar-search-panel');if(sw&&sp&&!sp.hidden&&!sw.contains(e.target))toggleTopbarSearch(false);
      const lw=document.getElementById('topbar-language-wrap'),lm=document.getElementById('topbar-language-menu');if(lw&&lm&&!lm.hidden&&!lw.contains(e.target))toggleTopbarLanguage(false);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){
      const panel=document.getElementById('topbar-search-panel');if(panel&&!panel.hidden){toggleTopbarSearch(false);document.getElementById('topbar-search-toggle')?.focus();}
      const lang=document.getElementById('topbar-language-menu');if(lang&&!lang.hidden){toggleTopbarLanguage(false);document.getElementById('topbar-language-toggle')?.focus();}
      if(activeMegaMenu)closeMegaMenu(true);
      const modal=document.getElementById('account-access-modal');if(modal&&!modal.hidden)closeAccountGate();
    }});
  }
  const megaMeta={
    sunnah:['الحديث والسنة','الأحاديث النبوية والقدسية وكتب السنة والطب النبوي.','hadith'],
    library:['المعرفة الإسلامية','الكتب والمقالات والمعاجم والقواميس وقصص الأنبياء في مكان واحد.','library'],
    worship:['العبادات والأدوات','الخدمات اليومية والعبادات والأدوات المساندة.','tools'],
    quran:['المصحف وعلومه','المصحف الشريف والتفسير وعلوم القرآن والحفظ والتلاوات.','quran']
  };
  function toggleMegaMenu(menuId,trigger){
    const layer=document.getElementById('mega-menu-panel');if(!layer)return;
    if(activeMegaMenu===menuId&&!layer.hidden){closeMegaMenu(true);return;}
    activeMegaMenu=menuId;activeMegaTrigger=trigger||document.querySelector('[data-mega-trigger="'+menuId+'"]');const headerRect=document.querySelector('.site-header')?.getBoundingClientRect();if(headerRect)layer.style.setProperty('--mega-menu-top',Math.max(0,Math.round(headerRect.bottom))+'px');layer.hidden=false;
    document.querySelectorAll('[data-mega-trigger]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.megaTrigger===menuId)));
    document.querySelectorAll('[data-mega-content]').forEach(p=>p.hidden=p.dataset.megaContent!==menuId);
    const meta=megaMeta[menuId]||megaMeta.knowledge;
    const title=document.getElementById('mega-menu-title'),desc=document.getElementById('mega-menu-description'),all=document.getElementById('mega-menu-all');
    if(title)title.textContent=meta[0];if(desc)desc.textContent=meta[1];if(all)all.onclick=()=>window.megaGo(meta[2]);
    if(trigger&&matchMedia('(max-width:760px)').matches)trigger.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
    renderUiIcons(layer);
  }
  function closeMegaMenu(restoreFocus){const layer=document.getElementById('mega-menu-panel');if(layer)layer.hidden=true;activeMegaMenu=null;const prev=activeMegaTrigger;activeMegaTrigger=null;document.querySelectorAll('[data-mega-trigger]').forEach(b=>b.setAttribute('aria-expanded','false'));if(restoreFocus&&prev)prev.focus({preventScroll:true});}
  function megaGo(screenId){closeMegaMenu(false);if(typeof window.navigateToPage==='function')window.navigateToPage(screenId);else if(typeof window.showScreen==='function')window.showScreen(screenId);}
  function syncAccountHeader(){let active=false,name='';try{active=sessionStorage.getItem('platform-demo-account')==='active';name=sessionStorage.getItem('platform-demo-name')||'';}catch(e){}const bell=document.getElementById('adhan-account-shortcut');if(bell){bell.hidden=!active;bell.setAttribute('aria-hidden',String(!active));}const label=document.getElementById('site-account-label'),avatar=document.getElementById('site-account-avatar');if(label)label.textContent=active?(name||'حسابي'):'حسابي';if(avatar)avatar.textContent=active&&name?name.trim().charAt(0):'ع';renderUiIcons(document.querySelector('.site-header')||document);}
  function openAdhanAccountSettings(){let active=false;try{active=sessionStorage.getItem('platform-demo-account')==='active';}catch(e){}pendingAccountDestination='settings';pendingAccountQuery='section=adhan';if(active){window.navigateToPage?.('settings','section=adhan');return;}closeMegaMenu(false);const modal=document.getElementById('account-access-modal');if(modal){modal.hidden=false;document.body.classList.add('account-modal-open');switchAccountMode('register');}}
  function openAccountGate(destination){pendingAccountDestination=['feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material'].includes(destination)?destination:'profile';pendingAccountQuery=(pendingAccountDestination==='settings'&&new URLSearchParams(location.search).get('section')==='adhan')?'section=adhan':'';let active=false;try{active=sessionStorage.getItem('platform-demo-account')==='active';}catch(e){}if(active){window.navigateToPage?.(pendingAccountDestination,pendingAccountQuery);return;}closeMegaMenu(false);const modal=document.getElementById('account-access-modal');if(modal){modal.hidden=false;document.body.classList.add('account-modal-open');switchAccountMode('register');}}
  function closeAccountGate(){const modal=document.getElementById('account-access-modal');if(modal)modal.hidden=true;document.body.classList.remove('account-modal-open');}
  function switchAccountMode(mode){const reg=mode!=='login';const field=document.getElementById('account-name-field'),name=document.getElementById('account-demo-name'),title=document.getElementById('account-access-title'),submit=document.getElementById('account-access-submit');if(field)field.hidden=!reg;if(name)name.required=reg;if(title)title.textContent=reg?'أنشئ حسابك للمتابعة':'تسجيل الدخول إلى حسابك';if(submit)submit.textContent=reg?'إنشاء حساب تجريبي':'متابعة إلى حسابي';document.getElementById('account-mode-register')?.classList.toggle('active',reg);document.getElementById('account-mode-login')?.classList.toggle('active',!reg);}
  function completeAccountPreview(event){event?.preventDefault();const form=document.getElementById('account-access-form');if(!form||!form.reportValidity())return;try{sessionStorage.setItem('platform-demo-account','active');}catch(e){}const name=document.getElementById('account-demo-name')?.value||'';try{if(name.trim())sessionStorage.setItem('platform-demo-name',name.trim());}catch(e){}window.syncAccountHeader?.();const avatar=document.querySelector('#screen-profile .profile-avatar-v3');if(avatar&&name.trim())avatar.textContent=name.trim().charAt(0);closeAccountGate();syncAccountHeader();v13Toast('تم فتح معاينة المساحة الخاصة. إنشاء الحساب الفعلي وربط بياناته يتطلب خدمة الحسابات.');const target=pendingAccountDestination,query=pendingAccountQuery;pendingAccountDestination='profile';pendingAccountQuery='';window.navigateToPage?.(target,query);}
  function signOutAccountPreview(){try{sessionStorage.removeItem('platform-demo-account');sessionStorage.removeItem('platform-demo-name');}catch(e){}syncAccountHeader();v13Toast('تم الخروج من معاينة الحساب.');window.navigateToPage?.('home');}
  document.addEventListener('click',e=>{const layer=document.getElementById('mega-menu-panel');if(!layer||layer.hidden)return;if((layer.contains(e.target)&&e.target!==layer)||e.target.closest('[data-mega-trigger]'))return;closeMegaMenu(false);});
  window.toggleTopbarSearch=toggleTopbarSearch;window.toggleTopbarLanguage=toggleTopbarLanguage;window.applySiteTheme=applySiteTheme;window.toggleSiteTheme=toggleSiteTheme;
  window.toggleMegaMenu=toggleMegaMenu;window.closeMegaMenu=closeMegaMenu;window.megaGo=megaGo;window.openAccountGate=openAccountGate;window.openAdhanAccountSettings=openAdhanAccountSettings;window.syncAccountHeader=syncAccountHeader;window.closeAccountGate=closeAccountGate;window.switchAccountMode=switchAccountMode;window.completeAccountPreview=completeAccountPreview;window.signOutAccountPreview=signOutAccountPreview;
  function init(){renderUiIcons(document);syncAccountHeader();initTopbarControls();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
