
    function topbarSafeToast(message) {
      if (typeof v13Toast === 'function') v13Toast(message);
      else { var live=document.getElementById('topbar-search-results'); if(live) live.textContent=message; }
    }
    
    function normalizeHadithSearch(value) {
      return String(value||'').normalize('NFKC').toLocaleLowerCase('ar')
        .replace(/[\u064B-\u065F\u0670\u0640]/g,'')
        .replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي');
    }
    function filterHadithResults() {
      const typeFilter=document.getElementById('hadith-type-filter')?.value||'all';
      var screen=document.getElementById('screen-hadith');
      if(!screen)return;
      var q=normalizeHadithSearch(screen.querySelector('#hadith-search-input')?.value||'').trim();
      var source=screen.querySelector('#hadith-source-filter')?.value||'all';
      var grade=screen.querySelector('#hadith-grade-filter')?.value||'all';
      var cards=Array.from(screen.querySelectorAll('#hadith-results-list [data-hadith-source]'));
      var visible=0;
      cards.forEach(function(card){
        var sourceOk=source==='all'||card.dataset.hadithSource===source;
        var gradeOk=grade==='all'||card.dataset.hadithGrade===grade;
        var text=normalizeHadithSearch(card.innerText||'');
        var queryOk=!q||text.includes(q);
        var show=sourceOk&&gradeOk&&queryOk;
        card.hidden=!show;
        if(show)visible++;
      });
      var count=screen.querySelector('#hadith-result-count');
      if(count)count.textContent=visible?('عدد النتائج: '+visible):'لا توجد نتائج';
      var empty=screen.querySelector('#hadith-empty-state');
      if(empty)empty.hidden=visible>0;
    }

function toggleTopbarSearch(force) {
      var panel=document.getElementById('topbar-search-panel');
      var btn=document.getElementById('topbar-search-toggle');
      var input=document.getElementById('topbar-search-input');
      if(!panel||!btn)return;
      var currentlyOpen=panel.classList.contains('is-open');
      var open=typeof force==='boolean'?force:!currentlyOpen;
      if(open){
        panel.hidden=false;
        requestAnimationFrame(function(){requestAnimationFrame(function(){panel.classList.add('is-open');});});
        btn.setAttribute('aria-expanded','true');
        if(input)setTimeout(function(){input.focus();},170);
      } else {
        panel.classList.remove('is-open');
        btn.setAttribute('aria-expanded','false');
        setTimeout(function(){if(!panel.classList.contains('is-open'))panel.hidden=true;},230);
        var results=document.getElementById('topbar-search-results');
        if(results)results.innerHTML='<span>اكتب كلمة للبحث في محتوى المنصة.</span>';
      }
    }
    function toggleTopbarLanguage(force) {
      var menu=document.getElementById('topbar-language-menu');
      var btn=document.getElementById('topbar-language-toggle');
      if(!menu||!btn)return;
      var open=typeof force==='boolean'?force:menu.hidden;
      menu.hidden=!open;
      btn.setAttribute('aria-expanded',open?'true':'false');
      if(open){var current=menu.querySelector('[aria-current="true"]');if(current)current.focus({preventScroll:true});}
    }
    function runTopbarSearch(event) {
      if(event)event.preventDefault();
      var input=document.getElementById('topbar-search-input');
      var results=document.getElementById('topbar-search-results');
      if(!input||!results)return;
      var q=(input.value||'').trim().toLocaleLowerCase('ar');
      if(!q){results.innerHTML='<span>اكتب كلمة أو عبارة للبحث.</span>';input.focus();return;}
      var labels={home:'الرئيسية',quran:'المصحف الشريف',hadith:'الحديث الشريف', 'hadith-qudsi':'الأحاديث القدسية',library:'المعرفة الإسلامية','library-tafsir':'كتب التفسير','library-hadith':'كتب الحديث','library-fiqh':'كتب الفقه','library-aqidah':'كتب العقيدة',store:'المتجر',prayer:'مواقيت الصلاة',adhkar:'الأذكار والأدعية',zakat:'حاسبة الزكاة',hajj:'دليل الحج والعمرة',tools:'الأدوات والخدمات',names:'أسماء الله الحسنى',lexicon:'المعجم والقاموس',audio:'التلاوات والاستماع',memorization:'حفظ القرآن',discover:'اكتشف المنصة',articles:'المقالات والبحوث',pathways:'المسارات العلمية',kids:'تعليم الأطفال',calendar:'التقويم الهجري',medicine:'الطب النبوي'};
      var screens=Array.from(document.querySelectorAll('main .screen-view'));
      var matches=[];
      screens.forEach(function(el){
        var id=(el.id||'').replace(/^screen-/,'');if(!id||id==='feed'||id==='profile')return;
        var title=labels[id]||(el.querySelector('h1,h2,h3')?.textContent||id).trim();
        var text=(el.innerText||el.textContent||'').toLocaleLowerCase('ar');
        var titleMatch=title.toLocaleLowerCase('ar').includes(q);
        var index=text.indexOf(q);
        if(titleMatch||index>=0)matches.push({id:id,title:title,score:titleMatch?0:1,index:index});
      });
      matches.sort(function(a,b){return a.score-b.score||a.index-b.index;});
      matches=matches.slice(0,7);
      if(!matches.length){results.innerHTML='<span>لا توجد نتائج مطابقة في صفحات النموذج. جرّب كلمة أخرى.</span>';return;}
      results.innerHTML=matches.map(function(item){return '<button type="button" data-topbar-result="'+item.id.replace(/[^a-z0-9-]/gi,'')+'">'+escapeTopbarText(item.title)+'<small>فتح الصفحة</small></button>';}).join('');
      results.querySelectorAll('[data-topbar-result]').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-topbar-result');toggleTopbarSearch(false);if(typeof showScreen==='function')showScreen(id);});});
    }
    function escapeTopbarText(value) { return String(value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];}); }
    function applySiteTheme(dark) {
      document.documentElement.classList.toggle('dark',!!dark);
      document.documentElement.classList.toggle('light',!dark);
      document.body.classList.toggle('site-theme-dark',!!dark);
      var btn=document.getElementById('topbar-theme-toggle');
      if(btn){btn.setAttribute('aria-pressed',dark?'true':'false');btn.title=dark?'التبديل إلى الوضع الفاتح':'التبديل إلى الوضع الداكن';btn.setAttribute('aria-label',dark?'الوضع الداكن مفعّل، اضغط للوضع الفاتح':'الوضع الفاتح مفعّل، اضغط للوضع الداكن');
        var icon=btn.querySelector('.topbar-theme-icon');if(icon){icon.setAttribute('data-icon',dark?'sun':'moon');if(typeof renderUiIcons==='function')renderUiIcons(btn);}
      }
      try{localStorage.setItem('platform-theme',dark?'dark':'light');}catch(e){}
    }
    function toggleSiteTheme() { applySiteTheme(!document.documentElement.classList.contains('dark')); }
    function initTopbarControls() {
      var saved='light';try{saved=localStorage.getItem('platform-theme')||'light';}catch(e){}
      applySiteTheme(saved==='dark');
      var input=document.getElementById('topbar-search-input');
      if(input)input.addEventListener('input',function(){if(input.value.trim().length>=2)runTopbarSearch();else{var r=document.getElementById('topbar-search-results');if(r)r.innerHTML='<span>اكتب كلمتين على الأقل لعرض النتائج.</span>';}});
      document.addEventListener('click',function(e){
        var searchWrap=document.getElementById('topbar-search-wrap');
        var searchPanel=document.getElementById('topbar-search-panel');
        if(searchWrap&&searchPanel&&!searchPanel.hidden&&!searchWrap.contains(e.target))toggleTopbarSearch(false);
        var languageWrap=document.getElementById('topbar-language-wrap');
        var languageMenu=document.getElementById('topbar-language-menu');
        if(languageWrap&&languageMenu&&!languageMenu.hidden&&!languageWrap.contains(e.target))toggleTopbarLanguage(false);
      });
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){
        var panel=document.getElementById('topbar-search-panel');if(panel&&!panel.hidden){toggleTopbarSearch(false);var b=document.getElementById('topbar-search-toggle');if(b)b.focus();}
        var lang=document.getElementById('topbar-language-menu');if(lang&&!lang.hidden){toggleTopbarLanguage(false);var lb=document.getElementById('topbar-language-toggle');if(lb)lb.focus();}
      }});
    }
        var activeMegaMenu = null;
    var activeMegaTrigger = null;
    function toggleMegaMenu(menuId, trigger) {
      var layer = document.getElementById('mega-menu-panel');
      if (!layer) return;
      if (activeMegaMenu === menuId && !layer.hidden) { closeMegaMenu(true); return; }
      activeMegaMenu = menuId;
      activeMegaTrigger = trigger || document.querySelector('[data-mega-trigger="' + menuId + '"]');
      var headerRect = document.querySelector('.site-header')?.getBoundingClientRect();
      if (headerRect) layer.style.setProperty('--mega-menu-top', Math.max(0, Math.round(headerRect.bottom)) + 'px');
      layer.hidden = false;
      document.querySelectorAll('[data-mega-trigger]').forEach(function(button) {
        var active = button.getAttribute('data-mega-trigger') === menuId;
        button.setAttribute('aria-expanded', active ? 'true' : 'false');
      });
      document.querySelectorAll('[data-mega-content]').forEach(function(panel) {
        panel.hidden = panel.getAttribute('data-mega-content') !== menuId;
      });
      var titleMap = {
        sunnah:['الحديث والسنة','الأحاديث النبوية والقدسية وكتب السنة والطب النبوي.','hadith'],
        library:['المعرفة الإسلامية','الكتب والمقالات والمعاجم والقواميس وقصص الأنبياء في مكان واحد.','library'],
        worship:['العبادات والأدوات','الخدمات اليومية والعبادات والأدوات المساندة.','tools'],
        quran:['المصحف وعلومه','المصحف الشريف والتفسير وعلوم القرآن والحفظ والتلاوات.','quran']
      };
      var meta = titleMap[menuId] || titleMap.knowledge;
      document.getElementById('mega-menu-title').textContent = meta[0];
      document.getElementById('mega-menu-description').textContent = meta[1];
      document.getElementById('mega-menu-all').onclick = function(){ megaGo(meta[2]); };
      if (trigger && window.matchMedia('(max-width: 760px)').matches) {
        trigger.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
      }
      if (typeof renderUiIcons === 'function') renderUiIcons(layer);
    }
    function closeMegaMenu(restoreFocus) {
      var layer = document.getElementById('mega-menu-panel');
      if (layer) layer.hidden = true;
      activeMegaMenu = null;
      var triggerToRestore = activeMegaTrigger;
      activeMegaTrigger = null;
      document.querySelectorAll('[data-mega-trigger]').forEach(function(button) {
        button.setAttribute('aria-expanded','false');
      });
      if (restoreFocus && triggerToRestore) triggerToRestore.focus({preventScroll:true});
    }
    function megaGo(screenId) {
      closeMegaMenu(false);
      showScreen(screenId);
    }
    document.addEventListener('click', function(event) {
      var layer = document.getElementById('mega-menu-panel');
      if (!layer || layer.hidden) return;
      if ((layer.contains(event.target) && event.target !== layer) || event.target.closest('[data-mega-trigger]')) return;
      closeMegaMenu(false);
    });
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && activeMegaMenu) {
        var trigger = document.querySelector('[data-mega-trigger="' + activeMegaMenu + '"]');
        closeMegaMenu(false);
        if (trigger) trigger.focus({preventScroll:true});
      }
    });

    const SCREEN_ROUTES = {
      home:'/', feed:'/feed', tools:'/tools', hadith:'/hadith', profile:'/account', quran:'/quran', store:'/store', names:'/names', 'name-detail':'/names/detail', lexicon:'/lexicon', 'lexicon-detail':'/lexicon/entry',
      prayer:'/tools/prayer-times', adhkar:'/tools/adhkar', zakat:'/tools/zakat', hajj:'/hajj-prep',
      library:'/library', 'library-tafsir':'/library/books?category=tafsir', 'library-hadith':'/library/books?category=hadith', 'library-fiqh':'/library/books?category=fiqh', 'library-aqidah':'/library/books?category=aqidah', 'library-authors':'/library/authors', articles:'/articles', pathways:'/pathways', bibliographies:'/bibliographies', 'fiqh-comparison':'/reference/fiqh-comparison',
      discover:'/discover', 'quran-sciences':'/quran/sciences', 'hadith-qudsi':'/hadith/qudsi', audio:'/audio', memorization:'/quran/memorization', habits:'/worship/tracker', quiz:'/quizzes', kids:'/kids', guidance:'/guidance', medicine:'/prophetic-medicine', calendar:'/calendar', requests:'/support/requests', 'share-cards':'/share-cards',
      'book-detail':'/library/book/preview', 'book-reader':'/library/reader', 'author-detail':'/library/author/preview', 'article-detail':'/articles/preview', 'pathway-detail':'/pathways/preview', 'bibliography-detail':'/bibliographies/preview'
    };
    const ROUTE_SCREENS = Object.keys(SCREEN_ROUTES).reduce(function(acc,key){ acc[SCREEN_ROUTES[key].replace(/^\//,'')] = key; return acc; }, {});
    function screenFromHash() {
      var route = (location.hash || '').replace(/^#\/?/, '');
      if (!route) return null;
      var compact = route.replace(/\/$/, '');
      if (ROUTE_SCREENS[compact]) return ROUTE_SCREENS[compact];
      if (compact.indexOf('library/books?category=') === 0) {
        var cat = compact.split('category=')[1];
        return ({tafsir:'library-tafsir',hadith:'library-hadith',fiqh:'library-fiqh',aqidah:'library-aqidah'})[cat] || 'library';
      }
      return null;
    }
    var accountSessionActive = false;
    try { accountSessionActive = sessionStorage.getItem('platform-demo-account') === 'active'; } catch (e) {}
    var pendingAccountDestination = 'profile';
    var pendingAccountQuery = '';
    var PRIVATE_ACCOUNT_TARGETS = ['profile','feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material'];
    function syncAccountHeader() {
      var active=false, name='';
      try { active=sessionStorage.getItem('platform-demo-account')==='active'; name=sessionStorage.getItem('platform-demo-name')||''; } catch(e) {}
      var shortcut=document.getElementById('adhan-account-shortcut');
      if(shortcut){shortcut.hidden=!active;shortcut.setAttribute('aria-hidden',String(!active));}
      var label=document.getElementById('site-account-label');
      var avatar=document.getElementById('site-account-avatar');
      if(label)label.textContent=active?(name||'حسابي'):'حسابي';
      if(avatar)avatar.textContent=active&&name?name.trim().charAt(0):'ع';
      if(typeof renderUiIcons==='function')renderUiIcons(document.querySelector('.site-header')||document);
    }
    function openAccountGate(destination) {
      pendingAccountDestination = PRIVATE_ACCOUNT_TARGETS.includes(destination) ? destination : 'profile';
      pendingAccountQuery = (pendingAccountDestination === 'settings' && new URLSearchParams(location.search).get('section') === 'adhan') ? 'section=adhan' : '';
      if (accountSessionActive) {
        if (document.getElementById('screen-'+pendingAccountDestination)) showScreen(pendingAccountDestination);
        else if (window.navigateToPage) window.navigateToPage(pendingAccountDestination);
        return;
      }
      if (typeof closeMegaMenu === 'function') closeMegaMenu(false);
      var modal = document.getElementById('account-access-modal');
      if (modal) { modal.hidden = false; document.body.classList.add('account-modal-open'); switchAccountMode('register'); }
    }
    function openAdhanAccountSettings() {
      if (!accountSessionActive) {
        pendingAccountDestination='settings';
        pendingAccountQuery='section=adhan';
        if(typeof closeMegaMenu==='function')closeMegaMenu(false);
        var modal=document.getElementById('account-access-modal');
        if(modal){modal.hidden=false;document.body.classList.add('account-modal-open');switchAccountMode('register');}
        return;
      }
      if(window.navigateToPage)window.navigateToPage('settings','section=adhan');
      else if(document.getElementById('screen-settings'))showScreen('settings');
    }
    window.openAdhanAccountSettings = openAdhanAccountSettings;
    window.syncAccountHeader = syncAccountHeader;
    function closeAccountGate() {
      var modal = document.getElementById('account-access-modal');
      if (modal) modal.hidden = true;
      document.body.classList.remove('account-modal-open');
    }
    function switchAccountMode(mode) {
      var register = mode !== 'login';
      var nameField = document.getElementById('account-name-field');
      var nameInput = document.getElementById('account-demo-name');
      var title = document.getElementById('account-access-title');
      var submit = document.getElementById('account-access-submit');
      var registerTab = document.getElementById('account-mode-register');
      var loginTab = document.getElementById('account-mode-login');
      if (nameField) nameField.hidden = !register;
      if (nameInput) nameInput.required = register;
      if (title) title.textContent = register ? 'أنشئ حسابك للمتابعة' : 'تسجيل الدخول إلى حسابك';
      if (submit) submit.textContent = register ? 'إنشاء حساب تجريبي' : 'متابعة إلى حسابي';
      if (registerTab) registerTab.classList.toggle('active',register);
      if (loginTab) loginTab.classList.toggle('active',!register);
    }
    function completeAccountPreview(event) {
      if (event) event.preventDefault();
      var form=document.getElementById('account-access-form');
      if (!form || !form.reportValidity()) return;
      accountSessionActive=true;
      try { sessionStorage.setItem('platform-demo-account','active'); } catch (e) {}
      var name=(document.getElementById('account-demo-name')||{}).value||'';
      try { if(name.trim())sessionStorage.setItem('platform-demo-name',name.trim()); } catch(e) {}
      var avatar=document.querySelector('#screen-profile .profile-avatar-v3');
      if (avatar && name.trim()) avatar.textContent=name.trim().charAt(0);
      closeAccountGate();
      syncAccountHeader();
      topbarSafeToast('تم فتح معاينة المساحة الخاصة. إنشاء الحساب الفعلي وربط بياناته يتطلب خدمة الحسابات.');
      var target=pendingAccountDestination, query=pendingAccountQuery;
      pendingAccountDestination='profile'; pendingAccountQuery='';
      if(document.getElementById('screen-'+target))showScreen(target);
      else if(window.navigateToPage)window.navigateToPage(target,query);
    }
    function signOutAccountPreview() {
      accountSessionActive=false;
      try { sessionStorage.removeItem('platform-demo-account'); sessionStorage.removeItem('platform-demo-name'); } catch (e) {}
      syncAccountHeader();
      topbarSafeToast('تم الخروج من معاينة الحساب.');
      showScreen('home');
    }
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){var modal=document.getElementById('account-access-modal');if(modal&&!modal.hidden)closeAccountGate();}});

    function showScreen(screenId, skipHistory) {
      if (PRIVATE_ACCOUNT_TARGETS.includes(screenId) && !accountSessionActive) { pendingAccountDestination=screenId; openAccountGate(screenId); return; }
      if (typeof closeMegaMenu === 'function') closeMegaMenu(false);
      var activeEl = document.getElementById('screen-' + screenId);
      if (!activeEl) return;
      document.querySelectorAll('.screen-view').forEach(function(el) { el.classList.add('hidden'); });
      activeEl.classList.remove('hidden');
      document.querySelectorAll('.screen-btn').forEach(function(btn) {
        btn.classList.remove('active-nav-btn');
        btn.classList.add('text-[#a9beb2]');
      });
      var navId = screenId;
      if (screenId === 'name-detail') navId = 'names';
      if (screenId === 'lexicon-detail') navId = 'lexicon';
      if (['prayer','adhkar','zakat','hajj'].includes(screenId)) navId = 'tools';
      if (screenId.indexOf('library') === 0 || screenId === 'articles' || screenId === 'pathways' || screenId === 'bibliographies' || screenId === 'fiqh-comparison') navId = 'library';
      if (['discover','audio','memorization','habits','quiz','kids','guidance','medicine','calendar','requests','share-cards'].includes(screenId)) navId = 'discover';
      if (['quran-sciences','memorization'].includes(screenId)) navId = 'quran';
      if (screenId === 'hadith-qudsi') navId = 'hadith';
      if (['book-detail','book-reader','author-detail','article-detail','pathway-detail','bibliography-detail'].includes(screenId)) navId = 'library';
      var activeBtn = document.getElementById('btn-' + navId);
      if (activeBtn) { activeBtn.classList.add('active-nav-btn'); activeBtn.classList.remove('text-[#a9beb2]'); }
      document.querySelectorAll('.mega-nav-link').forEach(function(nav){nav.classList.remove('is-active');});
      var directMega = document.querySelector('.mega-nav-link[data-screen="' + screenId + '"]') || document.querySelector('.mega-nav-link[data-screen="' + navId + '"]');
      if (directMega) directMega.classList.add('is-active');
      document.querySelectorAll('.mega-nav-link[data-group-items]').forEach(function(nav){
        var members = (nav.getAttribute('data-group-items') || '').split(/\s+/);
        if (members.indexOf(screenId) >= 0 || members.indexOf(navId) >= 0) nav.classList.add('is-active');
      });
      if (!skipHistory && SCREEN_ROUTES[screenId]) {
        var nextHash = '#/' + SCREEN_ROUTES[screenId].replace(/^\//,'');
        if (location.hash !== nextHash) history.pushState({screen:screenId}, '', nextHash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof renderUiIcons === 'function') renderUiIcons(activeEl);
    }
    window.addEventListener('hashchange', function(){ var target = screenFromHash(); if (target) showScreen(target, true); });
    window.addEventListener('popstate', function(){ var target = screenFromHash(); if (target) showScreen(target, true); });


    function filterArchiveCards(input) {
      if (!input) return;
      var term = (input.value || '').trim().toLowerCase();
      var root = input.closest('.archive-screen, .feature-screen') || document;
      root.querySelectorAll('[data-search]').forEach(function(card){
        var hay = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.classList.toggle('hidden', term && hay.indexOf(term) === -1);
      });
    }
    function filterArchiveSection(containerId, category, button) {
      var container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll('[data-category]').forEach(function(card){
        card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
      });
      if (button && button.parentElement) button.parentElement.querySelectorAll('.archive-filter').forEach(function(item){ item.classList.toggle('active', item === button); });
    }
    function showAuthorInfo(button, name) {
      var extra = button.parentElement.querySelector('.author-extra');
      if (!extra) return;
      extra.classList.toggle('hidden');
      button.innerHTML = (extra.classList.contains('hidden') ? 'عرض المؤلفات والتعريف' : 'إخفاء التفاصيل') + ' <span class="ui-icon" data-icon="arrow-left"></span>';
      renderUiIcons(button);
    }
    function toggleFeatureArticle(button) {
      var more = button.parentElement.querySelector('.feature-article-more');
      if (!more) return;
      more.classList.toggle('hidden');
      button.innerHTML = (more.classList.contains('hidden') ? 'معاينة المقال' : 'إخفاء المعاينة') + ' <span class="ui-icon" data-icon="arrow-left"></span>';
      renderUiIcons(button);
    }
    function togglePathway(button) {
      var panel = button.parentElement.querySelector('.pathway-stages');
      if (!panel) return;
      panel.classList.toggle('hidden');
    }
    function toggleCoinInfo(button) {
      var panel = button.parentElement.querySelector('.coin-extra');
      if (panel) panel.classList.toggle('hidden');
    }
    function updateFiqhTopic() {
      var topic = document.getElementById('fiqh-topic');
      var issue = document.getElementById('fiqh-issue');
      var note = document.getElementById('fiqh-topic-note');
      if (!topic || !note) return;
      var names = {purity:'الطهارة',prayer:'الصلاة',fasting:'الصيام',zakat:'الزكاة',hajj:'الحج',transactions:'المعاملات'};
      note.textContent = 'تم اختيار باب ' + (names[topic.value] || 'فقهي') + (issue && issue.selectedIndex ? ' والمسألة المحددة.' : '. ستعرض هنا المسائل بعد تحريرها وتوثيقها في المصادر المعتمدة.');
    }
    function setGraphMode(mode, button) {
      document.querySelectorAll('.graph-filters .archive-filter').forEach(function(item){ item.classList.toggle('active',item === button); });
      var note = document.getElementById('graph-selection');
      var messages = {all:'عرض عام لأنواع العلاقات الممكنة: التلمذة والرواية والطبقات والتصنيف.',scholar:'تم اختيار علاقات العلماء والتلاميذ. لا تظهر علاقة فردية إلا بمصدر موثق.',hadith:'تم اختيار مسار الرواية. يجب ربط كل راوٍ بسند ومصدر محدد.',era:'تم اختيار الطبقات الزمنية. سيعرض المخطط العلاقات بعد التحقق من التواريخ والطبقات.'};
      if (note) note.innerHTML = '<strong>نوع العرض</strong><p>' + (messages[mode] || messages.all) + '</p>';
    }
    function selectGraphNode(button) {
      document.querySelectorAll('.relationship-node').forEach(function(node){ node.classList.remove('selected'); });
      button.classList.add('selected');
      var note = document.getElementById('graph-selection');
      if (note) note.innerHTML = '<strong>' + button.querySelector('strong').textContent + '</strong><p>هذه عقدة تجميعية في نموذج التصميم. ستظهر الأسماء والروابط الفردية بعد إدخال بيانات موثقة مع نوع العلاقة ومصدرها.</p>';
    }
    function selectHistoricalPlace(name, region, description) {
      var box = document.getElementById('map-selection-box');
      if (!box) return;
      box.innerHTML = '<span class="archive-tag">' + region + '</span><strong>' + name + '</strong><p>' + description + '</p><button class="archive-text-link" onclick="showScreen(&#39;history-places&#39;)">فتح صفحة الأماكن <span class="ui-icon" data-icon="arrow-left"></span></button>';
      renderUiIcons(box);
    }
    function toggleMapLayer(layer, input) {
      document.querySelectorAll('.map-marker[data-layer="' + layer + '"]').forEach(function(marker){ marker.classList.toggle('map-marker-hidden', !input.checked); });
    }

    function showHajjPanel(panel, button) {
      ['prepare','umrah','hajj','ihram','duas'].forEach(function(key) {
        var el = document.getElementById('hajj-panel-' + key);
        if (el) el.classList.toggle('hidden', key !== panel);
      });
      document.querySelectorAll('.hajj-tab').forEach(function(tab) {
        var active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
    }


    function filterTools(query) {
      var value = (query || '').trim().toLowerCase();
      var cards = document.querySelectorAll('#tools-grid [data-tool-search]');
      var visible = 0;
      cards.forEach(function(card) {
        var haystack = (card.getAttribute('data-tool-search') + ' ' + card.textContent).toLowerCase();
        var match = !value || haystack.includes(value);
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      var empty = document.getElementById('tools-empty');
      if (empty) empty.classList.toggle('hidden', visible > 0);
    }

    function showPrayerSettingsFeedback() {
      var city = document.getElementById('prayer-city');
      var feedback = document.getElementById('prayer-settings-feedback');
      if (!feedback) return;
      if (!city || !city.value) {
        feedback.textContent = 'اختر المدينة أولاً. وعند ربط خدمة المواقيت سيتم تطبيق الإعدادات على الجدول.';
        return;
      }
      feedback.textContent = 'تم اختيار ' + city.value + ' في هذه المعاينة. حفظ الإعدادات الفعلي يحتاج ربط الحساب والخدمة.';
    }

    var adhkarDoneCounts = {};
    var adhkarCurrentCategory = 'morning';
    var adhkarCategories = {
      morning: {
        title: 'أذكار الصباح', items: [
          { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', source: 'صحيح مسلم', repeat: 'مرة واحدة' },
          { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.', source: 'سنن أبي داود والترمذي', repeat: 'مرة واحدة' },
          { text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.', source: 'سنن أبي داود والترمذي', repeat: '٣ مرات' },
          { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.', source: 'صحيح البخاري وصحيح مسلم', repeat: '١٠٠ مرة' },
          { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ.', source: 'سنن أبي داود', repeat: 'مرة واحدة' }
        ]
      },
      evening: {
        title: 'أذكار المساء', items: [
          { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', source: 'صحيح مسلم', repeat: 'مرة واحدة' },
          { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.', source: 'سنن أبي داود والترمذي', repeat: 'مرة واحدة' },
          { text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.', source: 'سنن أبي داود والترمذي', repeat: '٣ مرات' },
          { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.', source: 'صحيح البخاري وصحيح مسلم', repeat: '١٠٠ مرة' },
          { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ.', source: 'سنن أبي داود', repeat: 'مرة واحدة' }
        ]
      },
      prayer: {
        title: 'أذكار ما بعد الصلاة', items: [
          { text: 'أَسْتَغْفِرُ اللَّهَ.', source: 'صحيح مسلم', repeat: '٣ مرات' },
          { text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ.', source: 'صحيح مسلم', repeat: 'مرة واحدة' },
          { text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.', source: 'سنن أبي داود والنسائي', repeat: 'مرة واحدة' },
          { text: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ.', source: 'صحيح مسلم', repeat: '٣٣ مرة لكل منها، وتتم المائة بالتهليل' }
        ]
      },
      sleep: {
        title: 'أذكار النوم', items: [
          { text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.', source: 'صحيح البخاري', repeat: 'مرة واحدة' },
          { text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.', source: 'سنن أبي داود والترمذي', repeat: '٣ مرات' },
          { text: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ...', source: 'آخر آيتين من سورة البقرة • صحيح البخاري ومسلم في فضلهما ليلاً', repeat: 'مرة واحدة' },
          { text: 'قراءة سورة الإخلاص وسورة الفلق وسورة الناس، ثم النفث في الكفين ومسح ما استطاع من الجسد.', source: 'صحيح البخاري', repeat: '٣ مرات' }
        ]
      },
      duas: {
        title: 'أدعية متنوعة', items: [
          { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.', source: 'سورة البقرة • الآية ٢٠١', repeat: 'دعاء جامع' },
          { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ.', source: 'سنن أبي داود', repeat: 'دعاء' },
          { text: 'رَبِّ زِدْنِي عِلْمًا.', source: 'سورة طه • الآية ١١٤', repeat: 'دعاء' },
          { text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ.', source: 'سورة آل عمران • الآية ٨', repeat: 'دعاء' }
        ]
      }
    };

    function renderAdhkarCategory(category, button) {
      var data = adhkarCategories[category] || adhkarCategories.morning;
      var title = document.getElementById('adhkar-category-title');
      var list = document.getElementById('adhkar-list');
      if (!list) return;
      if (title) title.textContent = data.title;
      adhkarCurrentCategory = category;
      document.querySelectorAll('.adhkar-tab').forEach(function(tab) { tab.classList.toggle('active', tab === button); });
      list.innerHTML = data.items.map(function(item, index) {
        return '<article class="adhkar-item calm-card"><div class="adhkar-item-top"><span class="adhkar-number">' + (index + 1) + '</span><span class="adhkar-source">' + item.source + '</span></div><p class="font-quran text-2xl leading-loose">' + item.text + '</p><div class="adhkar-item-actions"><span class="adhkar-repeat">' + item.repeat + '</span><button type="button" onclick="markDhikrDone(this)"><span class="ui-icon" data-icon="check"></span> تم</button></div></article>';
      }).join('');
      renderUiIcons(list);
      updateAdhkarProgress();
    }

    function updateAdhkarProgress() {
      var label = document.getElementById('adhkar-progress-label');
      var list = document.getElementById('adhkar-list');
      if (!label || !list) return;
      var total = list.querySelectorAll('.adhkar-item').length;
      var done = list.querySelectorAll('.adhkar-item-actions button.done').length;
      label.textContent = 'أنجزت ' + done + ' من ' + total + ' أذكار في هذا القسم.';
    }

    function markDhikrDone(button) {
      if (!button) return;
      button.classList.toggle('done');
      button.innerHTML = button.classList.contains('done') ? '<span class="ui-icon" data-icon="check"></span> تم التسجيل' : '<span class="ui-icon" data-icon="check"></span> تم';
      renderUiIcons(button);
      updateAdhkarProgress();
    }

    var zakatCurrencyOptions = [
      ['EGP','جنيه مصري'],['SAR','ريال سعودي'],['USD','دولار أمريكي'],['AED','درهم إماراتي'],['KWD','دينار كويتي'],['EUR','يورو'],['GBP','جنيه إسترليني'],['QAR','ريال قطري'],['BHD','دينار بحريني'],['OMR','ريال عماني'],['CAD','دولار كندي'],['CHF','فرنك سويسري'],['TRY','ليرة تركية'],['MYR','رينغيت ماليزي']
    ];
    function zakatBaseCurrency() {
      var field = document.getElementById('zakat-base-currency');
      return field ? field.value : 'EGP';
    }
    function zakatFormat(value) {
      var currency = zakatBaseCurrency();
      try { return new Intl.NumberFormat('ar-EG', { style:'currency', currency:currency, maximumFractionDigits:2 }).format(value); }
      catch(e) { return new Intl.NumberFormat('ar-EG', { maximumFractionDigits:2 }).format(value) + ' ' + currency; }
    }
    function zakatNumber(id) {
      var field = document.getElementById(id);
      var value = field ? Number(field.value) : 0;
      return Number.isFinite(value) && value > 0 ? value : 0;
    }
    function zakatCurrencyRowMarkup(selectedCurrency) {
      var options = zakatCurrencyOptions.map(function(item) {
        return '<option value="' + item[0] + '" ' + (item[0] === selectedCurrency ? 'selected' : '') + '>' + item[0] + ' · ' + item[1] + '</option>';
      }).join('');
      var defaultRate = selectedCurrency === zakatBaseCurrency() ? '1' : '';
      return '<div class="zakat-currency-row">' +
        '<select class="tool-input zakat-row-currency" onchange="syncZakatCurrencyRate(this)">' + options + '</select>' +
        '<input class="tool-input zakat-row-amount" type="number" min="0" step="0.01" placeholder="قيمة الرصيد" oninput="calculateZakatAdvanced()">' +
        '<input class="tool-input zakat-row-rate" type="number" min="0" step="0.000001" value="' + defaultRate + '" placeholder="سعر الوحدة" oninput="calculateZakatAdvanced()">' +
        '<button type="button" class="zakat-remove-row" onclick="removeZakatCurrencyRow(this)" aria-label="حذف العملة"><span class="ui-icon" data-icon="x"></span></button></div>';
    }
    function addZakatCurrencyRow() {
      var holder = document.getElementById('zakat-currency-rows');
      if (!holder) return;
      var row = document.createElement('div');
      row.innerHTML = zakatCurrencyRowMarkup('USD');
      holder.appendChild(row.firstElementChild);
      renderUiIcons(holder);
      calculateZakatAdvanced();
    }
    function removeZakatCurrencyRow(button) {
      var row = button && button.closest('.zakat-currency-row');
      var holder = document.getElementById('zakat-currency-rows');
      if (row && holder && holder.children.length > 1) row.remove();
      calculateZakatAdvanced();
    }
    function syncZakatCurrencyRate(select) {
      if (!select) return;
      var row = select.closest('.zakat-currency-row');
      var rate = row ? row.querySelector('.zakat-row-rate') : null;
      if (rate) rate.value = select.value === zakatBaseCurrency() ? '1' : '';
      calculateZakatAdvanced();
    }
    function updateZakatCurrencyBase() {
      var field = document.getElementById('zakat-base-currency');
      var base = zakatBaseCurrency();
      var previousBase = field && field.dataset.previousBase ? field.dataset.previousBase : 'EGP';
      if (field) field.dataset.previousBase = base;
      if (previousBase === base) { calculateZakatAdvanced(); return; }

      // Exchange rates are directional. Values entered in the old base currency
      // must not be silently reinterpreted as the new currency.
      document.querySelectorAll('#zakat-currency-rows .zakat-currency-row').forEach(function(row) {
        var currency = row.querySelector('.zakat-row-currency');
        var rate = row.querySelector('.zakat-row-rate');
        if (!currency || !rate) return;
        if (currency.value === base) rate.value = '1';
        else rate.value = '';
      });
      ['zakat-gold-spot','zakat-silver-spot','zakat-jewelry-value','zakat-trade-stock','zakat-receivables','zakat-investments','zakat-other-assets','zakat-liabilities'].forEach(function(id) {
        var input = document.getElementById(id);
        if (input) input.value = '';
      });
      var note = document.getElementById('zakat-base-change-note');
      if (note) {
        note.textContent = 'تم تغيير عملة الحساب من ' + previousBase + ' إلى ' + base + '. احتفظنا بالأرصدة الأصلية، لكن يجب إدخال أسعار تحويل جديدة وأسعار المعادن والقيم التي كانت بعملة الحساب السابقة.';
        note.classList.remove('hidden');
      }
      calculateZakatAdvanced();
    }
    function toggleZakatJewelryValue() {
      var mode = document.getElementById('zakat-jewelry-mode');
      var value = document.getElementById('zakat-jewelry-value');
      if (!mode || !value) return;
      value.classList.toggle('hidden', mode.value !== 'include');
      calculateZakatAdvanced();
    }
    function calculateZakatAdvanced() {
      var base = zakatBaseCurrency();
      var cash = 0;
      var missingRates = [];
      document.querySelectorAll('#zakat-currency-rows .zakat-currency-row').forEach(function(row, index) {
        var currencyField = row.querySelector('.zakat-row-currency');
        var amountField = row.querySelector('.zakat-row-amount');
        var rateField = row.querySelector('.zakat-row-rate');
        var currency = currencyField ? currencyField.value : base;
        var amount = amountField ? Math.max(0, Number(amountField.value) || 0) : 0;
        var rate = rateField ? Math.max(0, Number(rateField.value) || 0) : 0;
        if (!amount) return;
        if (currency === base) rate = 1;
        if (!rate) { missingRates.push(currency); return; }
        cash += amount * rate;
      });

      var goldGrams = zakatNumber('zakat-gold-grams');
      var goldKaratField = document.getElementById('zakat-gold-karat');
      var goldKarat = goldKaratField ? Number(goldKaratField.value) : 21;
      var goldSpot = zakatNumber('zakat-gold-spot');
      var goldValue = goldGrams * goldSpot * (goldKarat / 24);
      var silverGrams = zakatNumber('zakat-silver-grams');
      var silverSpot = zakatNumber('zakat-silver-spot');
      var silverValue = silverGrams * silverSpot;
      var goldPreview = document.getElementById('zakat-gold-preview');
      var silverPreview = document.getElementById('zakat-silver-preview');
      if (goldPreview) goldPreview.textContent = goldGrams ? (goldSpot ? 'القيمة التقريبية: ' + zakatFormat(goldValue) : 'أدخل سعر جرام الذهب عيار 24 لاستكمال تقدير القيمة.') : 'لم يتم إدخال وزن ذهب.';
      if (silverPreview) silverPreview.textContent = silverGrams ? (silverSpot ? 'القيمة التقريبية: ' + zakatFormat(silverValue) : 'أدخل سعر جرام الفضة النقية لاستكمال تقدير القيمة.') : 'لم يتم إدخال وزن فضة.';

      var jewelryMode = document.getElementById('zakat-jewelry-mode');
      var jewelry = jewelryMode && jewelryMode.value === 'include' ? zakatNumber('zakat-jewelry-value') : 0;
      var trade = zakatNumber('zakat-trade-stock');
      var receivables = zakatNumber('zakat-receivables');
      var investments = zakatNumber('zakat-investments');
      var otherAssets = zakatNumber('zakat-other-assets');
      var liabilities = zakatNumber('zakat-liabilities');
      var assets = cash + goldValue + silverValue + jewelry + trade + receivables + investments + otherAssets;
      var net = Math.max(0, assets - liabilities);
      var basis = document.getElementById('zakat-nisab-basis');
      var basisValue = basis ? basis.value : 'gold';
      var nisab = basisValue === 'silver' ? (silverSpot ? 595 * silverSpot : 0) : (goldSpot ? 85 * goldSpot * (21 / 24) : 0);
      var hawlField = document.getElementById('zakat-hawl');
      var hawlMet = !!(hawlField && hawlField.checked);
      var missingPrices = [];
      if (goldGrams && !goldSpot) missingPrices.push('سعر الذهب');
      if (silverGrams && !silverSpot) missingPrices.push('سعر الفضة');
      if (!nisab) missingPrices.push(basisValue === 'silver' ? 'سعر الفضة لحساب النصاب' : 'سعر الذهب لحساب النصاب');

      var put = function(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; };
      put('zakat-total-cash', zakatFormat(cash));
      put('zakat-total-metals', zakatFormat(goldValue + silverValue + jewelry));
      put('zakat-total-business', zakatFormat(trade + receivables + investments + otherAssets));
      put('zakat-assets-total', zakatFormat(assets));
      put('zakat-liabilities-total', zakatFormat(liabilities));
      put('zakat-net-total', zakatFormat(net));
      put('zakat-nisab-value', nisab ? zakatFormat(nisab) : 'أدخل سعر المعدن');
      put('zakat-result-nisab', nisab ? zakatFormat(nisab) : 'غير متاح');
      put('zakat-breakdown', 'أرصدة: ' + zakatFormat(cash) + ' · معادن: ' + zakatFormat(goldValue + silverValue + jewelry) + ' · تجارة واستثمارات: ' + zakatFormat(trade + receivables + investments + otherAssets) + ' · خصوم: ' + zakatFormat(liabilities));

      var result = document.getElementById('zakat-result-value');
      var status = document.getElementById('zakat-result-status');
      if (missingRates.length || missingPrices.length) {
        if (result) result.textContent = 'غير مكتمل';
        if (status) status.textContent = (missingRates.length ? 'أدخل سعر تحويل العملات: ' + Array.from(new Set(missingRates)).join('، ') + '. ' : '') + (missingPrices.length ? 'استكمل ' + Array.from(new Set(missingPrices)).join('، ') + '.' : '');
        return;
      }
      if (!hawlMet) {
        if (result) result.textContent = '—';
        if (status) status.textContent = 'لم يتم تأكيد اكتمال الحول. راجع حكم الحول بحسب نوع المال قبل اعتماد النتيجة.';
        return;
      }
      if (net >= nisab) {
        if (result) result.textContent = zakatFormat(net * 0.025);
        if (status) status.textContent = 'صافي الوعاء بلغ النصاب والحول محدد كمكتمل. هذا تقدير بنسبة ٢٫٥٪ قبل المراجعة الشرعية.';
      } else {
        if (result) result.textContent = zakatFormat(0);
        if (status) status.textContent = 'صافي الوعاء أقل من النصاب المحدد وفق أسعار المعادن المدخلة.';
      }
    }
    function resetZakatAdvanced() {
      var fields = document.querySelectorAll('#screen-zakat input[type="number"]');
      fields.forEach(function(field) { field.value = ''; });
      var hawl = document.getElementById('zakat-hawl'); if (hawl) hawl.checked = false;
      var base = document.getElementById('zakat-base-currency'); if (base) base.value = 'EGP';
      var rows = document.getElementById('zakat-currency-rows');
      if (rows) { rows.innerHTML = zakatCurrencyRowMarkup('EGP'); renderUiIcons(rows); }
      var nisab = document.getElementById('zakat-nisab-basis'); if (nisab) nisab.value = 'gold';
      var jewelryMode = document.getElementById('zakat-jewelry-mode'); if (jewelryMode) jewelryMode.value = 'exclude';
      toggleZakatJewelryValue();
      calculateZakatAdvanced();
    }

    function quranSidebarElements() {
      return {
        workspace: document.getElementById('quran-workspace'),
        right: document.getElementById('quran-right-sidebar'),
        left: document.getElementById('quran-left-sidebar'),
        rightButton: document.getElementById('btn-toggle-right'),
        leftButton: document.getElementById('btn-toggle-left'),
        backdrop: document.getElementById('quran-drawer-backdrop')
      };
    }

    function updateQuranSidebarUI() {
      var el = quranSidebarElements();
      if (!el.right || !el.left || !el.workspace) return;
      var rightOpen = !el.right.classList.contains('is-collapsed');
      var leftOpen = !el.left.classList.contains('is-collapsed');
      el.workspace.classList.toggle('index-open', rightOpen);
      el.workspace.classList.toggle('tools-open', leftOpen);
      if (el.rightButton) el.rightButton.setAttribute('aria-expanded', String(rightOpen));
      if (el.leftButton) el.leftButton.setAttribute('aria-expanded', String(leftOpen));
      if (el.backdrop) el.backdrop.hidden = !(rightOpen || leftOpen);
      document.documentElement.classList.toggle('quran-drawer-open', rightOpen || leftOpen);
    }

    function toggleQuranSidebar(side) {
      var el = quranSidebarElements();
      var target = side === 'right' ? el.right : el.left;
      if (!target) return;
      var willOpen = target.classList.contains('is-collapsed');
      if (willOpen) {
        var other = side === 'right' ? el.left : el.right;
        if (other) other.classList.add('is-collapsed');
        target.classList.remove('is-collapsed');
      } else {
        target.classList.add('is-collapsed');
      }
      updateQuranSidebarUI();
    }
    function toggleRightSidebar() { toggleQuranSidebar('right'); }
    function toggleLeftSidebar() { toggleQuranSidebar('left'); }
    function closeQuranSidebars() {
      var el = quranSidebarElements();
      if (el.right) el.right.classList.add('is-collapsed');
      if (el.left) el.left.classList.add('is-collapsed');
      updateQuranSidebarUI();
    }

    // Small icon-rail shortcuts open the same accessible panels as the main rail buttons.
    function openQuranToolSection(sectionId) {
      var panel = document.getElementById('quran-left-sidebar');
      if (!panel) return;
      if (panel.classList.contains('is-collapsed')) toggleLeftSidebar();
      window.setTimeout(function () {
        var section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var control = section.querySelector('button, input, select');
          if (control) control.focus({ preventScroll: true });
        }
      }, 90);
    }
    function openQuranBookmarks() {
      var panel = document.getElementById('quran-right-sidebar');
      if (!panel) return;
      if (panel.classList.contains('is-collapsed')) toggleRightSidebar();
      window.setTimeout(function () {
        var saved = panel.querySelector('[data-quran-index-tab="saved"]');
        if (saved) saved.click();
      }, 90);
    }
    function openQuranIndexSections() {
      var panel = document.getElementById('quran-right-sidebar');
      if (!panel) return;
      if (panel.classList.contains('is-collapsed')) toggleRightSidebar();
      window.setTimeout(function () {
        var surahs = panel.querySelector('[data-quran-index-tab="surahs"]');
        if (surahs) surahs.click();
      }, 90);
    }

    function setQuranLayout(layout) {
      var container = document.getElementById('quran-split-container');
      var tafsirPane = document.getElementById('quran-tafsir-pane');
      var btnSingle = document.getElementById('layout-btn-single');
      var btnSplit = document.getElementById('layout-btn-split');
      if (!container || !tafsirPane || !btnSingle || !btnSplit) return;
      var split = layout === 'split';
      container.dataset.layout = split ? 'split' : 'single';
      container.classList.toggle('single-layout', !split);
      container.classList.toggle('split-layout', split);
      tafsirPane.classList.toggle('hidden', !split);
      tafsirPane.setAttribute('aria-hidden', String(!split));
      btnSingle.classList.toggle('is-active', !split);
      btnSplit.classList.toggle('is-active', split);
      btnSingle.setAttribute('aria-pressed', String(!split));
      btnSplit.setAttribute('aria-pressed', String(split));
    }

    function showNameDetail(nameKey) {
      if (window.navigateToPage) window.navigateToPage('name-detail', 'name=' + encodeURIComponent(nameKey || 'rahman'));
    }

    function showLexiconEntry(entryKey) {
      var entries = {
        salam: {
          title: 'سَلِمَ',
          subtitle: 'س — ل — م',
          summary: 'يدور أصل المادة حول السلامة والبراءة من الآفات، وتتفرع منها صيغ واستعمالات متعددة بحسب السياق.',
          meaning: 'الفعل سَلِمَ يدل في أصل الاستعمال على النجاة والسلامة من العيب أو الضرر. ويعرض المدخل الشواهد والفروق بحسب السياقات اللغوية والقرآنية.',
          forms: ['سَلِمَ','سَلَامَة','سَلَام','سَلِيم']
        },
        'salam-word': {
          title: 'سَلَام',
          subtitle: 'س — ل — م',
          summary: 'اسم ومصدر تتنوع دلالاته في العربية، ومن استعمالاته التحية والأمان والسلامة.',
          meaning: 'تُدرس دلالة لفظ سلام بحسب موقعه في الكلام: أهو تحية أم طلب أمان أم وصف للسلامة؟ ويُعرض كل استعمال مع شاهده وسياقه.',
          forms: ['سَلَام','تَسْلِيم','سَلَامَة','السَّلَام']
        },
        islam: {
          title: 'إِسْلَام',
          subtitle: 'س — ل — م',
          summary: 'مصدر الفعل أسلم، ويرتبط في أصل الدلالة بمعنى الانقياد والاستسلام.',
          meaning: 'يعرض المدخل البنية الصرفية للمصدر، واستعمالاته في اللغة والقرآن، مع التفريق بين المعنى اللغوي والاستعمال الاصطلاحي.',
          forms: ['أَسْلَمَ','إِسْلَام','مُسْلِم','اسْتِسْلَام']
        },
        rahm: {
          title: 'رَحِمَ',
          subtitle: 'ر — ح — م',
          summary: 'تدور مادة (رحم) حول معنى الرحمة والرأفة وما يتصل بهما من رقة وإحسان، وتظهر منها صيغ متعددة.',
          meaning: 'يعرض المدخل أصل المادة، وصيغها مثل رحمة ورحيم ورحمن، مع توضيح الفروق الصرفية والدلالية من خلال الشواهد المحققة.',
          forms: ['رَحِمَ','رَحْمَة','رَحِيم','رَحْمَن']
        },
        mulk: {
          title: 'مَلَكَ',
          subtitle: 'م — ل — ك',
          summary: 'تدور مادة (ملك) حول الملك والاختصاص والقدرة على التصرف، وتختلف دلالاتها بحسب الصيغة والسياق.',
          meaning: 'يعرض المدخل صيغ الملك والملكوت والمالك والمَلِك، مع المقارنة بين دلالات الملك والسلطان والامتلاك في الاستعمال.',
          forms: ['مَلَكَ','مُلْك','مَالِك','مَلِك']
        }
      };
      var entry = entries[entryKey] || entries.salam;
      document.getElementById('lexicon-detail-title').textContent = entry.title;
      document.getElementById('lexicon-detail-subtitle').textContent = entry.subtitle;
      document.getElementById('lexicon-detail-summary').textContent = entry.summary;
      document.getElementById('lexicon-detail-meaning').textContent = entry.meaning;
      var forms = document.getElementById('lexicon-detail-forms');
      forms.innerHTML = '';
      entry.forms.forEach(function(form) {
        var chip = document.createElement('span');
        chip.className = 'px-3 py-2 rounded-lg bg-[#faf8f2] text-xs text-[#245241]';
        chip.textContent = form;
        forms.appendChild(chip);
      });
      showScreen('lexicon-detail');
    }

    window.addEventListener('resize', updateQuranSidebarUI);
    updateQuranSidebarUI();
    setQuranLayout('single');

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
    Object.assign(ICON_PATHS, {'moon-star':ICON_PATHS['moon'],'plane':ICON_PATHS['route'],'hand-heart':ICON_PATHS['heart-handshake'],'utensils':ICON_PATHS['book-open'],'sprout':ICON_PATHS['book-open'],'ship':ICON_PATHS['landmark'],'waves':ICON_PATHS['sunrise'],'book-marked':ICON_PATHS['bookmark'],'audio-lines':ICON_PATHS['volume-2'],'book-open-text':ICON_PATHS['book-text'],'message-square-warning':ICON_PATHS['alert-circle'],'file-plus':ICON_PATHS['clipboard-check'],'pen-tool':ICON_PATHS['pencil'],'gift':ICON_PATHS['star'],'mail':ICON_PATHS['message-circle'],'hand':ICON_PATHS['heart'],'inbox':ICON_PATHS['archive'],'chart-no-axes-column':ICON_PATHS['chart-no-axes-combined'],'building-2':ICON_PATHS['landmark'],'shield':ICON_PATHS['shield-check'],'key-round':ICON_PATHS['lock'],'timer':ICON_PATHS['clock-3'],'radio-tower':ICON_PATHS['radio'],'user-plus':ICON_PATHS['user-round'],'user-x':ICON_PATHS['user-round'],'file-text':ICON_PATHS['book-text'],'download':ICON_PATHS['archive'],'clipboard-list':ICON_PATHS['clipboard-check'],'file-check':ICON_PATHS['book-check'],'layout-dashboard':ICON_PATHS['layout-grid'],'accessibility':ICON_PATHS['user-round'],'copyright':ICON_PATHS['info'],'book':ICON_PATHS['book-open'],'check-circle':ICON_PATHS['check-circle-2'],'calendar-range':ICON_PATHS['calendar-days'],'headphones':ICON_PATHS['headphones']});
    Object.assign(ICON_PATHS, {
      'type':'<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
      'palette':'<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.3-3.5 1.8 1.8 0 0 1 1.2-3.1H18a3 3 0 0 0 3-3c0-4.6-4-8.4-9-8.4Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="8" r="1"/>',
      'repeat':'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
      'columns-2':ICON_PATHS['columns'],
      'skip-back':'<path d="M5 5v14M19 6l-9 6 9 6z"/>',
      'skip-forward':'<path d="M19 5v14M5 6l9 6-9 6z"/>',
      'bookmark-check':'<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/><path d="m9 10 2 2 4-4"/>',
      'play':'<path d="m8 5 11 7-11 7z"/>',
      'pause':'<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>'
    });

    function renderUiIcons(root) {
      (root || document).querySelectorAll('[data-icon]').forEach(function(el) {
        if (el.dataset.iconReady === '1') return;
        var name = el.getAttribute('data-icon');
        var path = ICON_PATHS[name] || ICON_PATHS['star'];
        el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + '</svg>';
        el.dataset.iconReady = '1';
      });
    }
    function scrollProfileTo(sectionId, tab) {
      var el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
      document.querySelectorAll('.profile-tab-v3').forEach(function(btn){ btn.classList.remove('active'); });
      if (tab) tab.classList.add('active');
    }
    function saveProfileNote() {
      var field = document.getElementById('profile-note-input');
      var feedback = document.getElementById('profile-note-feedback');
      if (!field || !feedback) return;
      if (!field.value.trim()) { feedback.textContent = 'اكتب ملاحظة أولاً ثم احفظها.'; return; }
      feedback.textContent = 'تمت إضافة الملاحظة إلى دفتر ملاحظاتك في هذا النموذج.';
      field.value = '';
    }
    function toggleFeedAction(button, label) {
      button.classList.toggle('is-active');
      if (button.dataset.originalLabel === undefined) button.dataset.originalLabel = button.innerText.trim();
      if (button.classList.contains('is-active')) button.setAttribute('aria-label', label);
      else button.removeAttribute('aria-label');
    }
    function saveFeedItem(button) {
      button.classList.toggle('saved');
      button.innerHTML = button.classList.contains('saved') ? 'أضيف إلى مكتبتي <span class="ui-icon" data-icon="check"></span>' : 'أضف إلى مكتبتي <span class="ui-icon" data-icon="plus"></span>';
      renderUiIcons(button);
    }
    const extraFeedPosts = [
      {type:'hadith', source:'قسم السنة النبوية', time:'منذ ٤ أيام', title:'من حسن إسلام المرء تركه ما لا يعنيه', text:'تأمل في معنى الحديث وكيف يساعد المسلم على ترتيب أولوياته وحفظ وقته ولسانه.', tag:'شرح حديث', icon:'scroll-text', stats:'٩٦'},
      {type:'tafsir', source:'وحدة التفسير وعلوم القرآن', time:'منذ ٥ أيام', title:'منهج مختصر لفهم معاني السور', text:'خطوات عملية للانتقال من القراءة إلى فهم السياق العام ومقاصد السورة والرجوع إلى كتب التفسير.', tag:'علوم القرآن', icon:'book-open', stats:'٧٣'},
      {type:'fiqh', source:'قسم الفقه', time:'منذ أسبوع', title:'كيف ترتب عباداتك اليومية؟', text:'دليل مبسط يجمع الفرائض والسنن والأوراد في خطة يومية قابلة للمتابعة.', tag:'دليل عملي', icon:'calendar-check', stats:'٥٨'},
      {type:'names', source:'موسوعة أسماء الله الحسنى', time:'منذ أسبوع', title:'التعرف على معنى اسم الله الرحيم', text:'عرض لمعنى الاسم ودلالاته وما ورد فيه من النصوص، مع الانتقال إلى الشرح المفصل والمصادر.', tag:'أسماء الله الحسنى', icon:'sparkles', stats:'١١٤'},
      {type:'learning', source:'قسم التعليم', time:'منذ ٩ أيام', title:'مسار مراجعة وحفظ قصار السور', text:'برنامج قصير يجمع التكرار والمراجعة والاستماع والتثبيت مع سجل تقدم شخصي.', tag:'مسار تعليمي', icon:'graduation-cap', stats:'٦٧'},
      {type:'quran', source:'وحدة علوم القرآن', time:'منذ ١٠ أيام', title:'التعرف على أسباب النزول وأثرها في فهم الآيات', text:'مادة تمهيدية تشرح معنى أسباب النزول وكيفية الاستفادة منها مع مراعاة الروايات ومناهج أهل العلم.', tag:'علوم القرآن', icon:'book-open', stats:'٩١'},
      {type:'hadith', source:'قسم السنة النبوية', time:'منذ ١١ يوماً', title:'آداب طلب العلم في ضوء السنة النبوية', text:'مجموعة من الأحاديث والآثار التي تعين على الإخلاص والتثبت والتدرج وحسن العمل بالعلم.', tag:'السنة النبوية', icon:'scroll-text', stats:'٧٨'},
      {type:'library', source:'مكتبة المنصة', time:'منذ ١٢ يوماً', title:'مختارات في قصص الأنبياء', text:'تعريف بمجموعة كتب تجمع القصص الوارد في القرآن الكريم مع العناية بالمصادر والتحرير.', tag:'كتب ومراجع', icon:'library', stats:'٦٤'},
      {type:'audio', source:'المحراب الصوتي', time:'منذ ١٣ يوماً', title:'قائمة استماع لتلاوات قصيرة للتدبر', text:'قائمة منتقاة من التلاوات القصيرة تساعد على الاستماع والتكرار ومراجعة الآيات.', tag:'التلاوات الصوتية', icon:'headphones', stats:'١٠٢'},
      {type:'lexicon', source:'قسم المعاجم واللغة', time:'منذ أسبوعين', title:'كلمة اليوم: السكينة', text:'مدخل لغوي يعرض أصل الكلمة واستعمالاتها والفروق بينها وبين ألفاظ قريبة في المعنى.', tag:'كلمة اليوم', icon:'book-text', stats:'٥٣'},
      {type:'prayer', source:'قسم العبادات', time:'منذ ١٥ يوماً', title:'دليل مختصر للسنن الرواتب', text:'عرض مرتب للسنن الرواتب وعدد ركعاتها ووقتها مع إحالات إلى الأدلة الحديثية.', tag:'فقه العبادات', icon:'calendar-check', stats:'٨٩'}
    ];
    var feedPageIndex = 0;
    var feedLoading = false;
    function makeFeedPost(post, index) {
      var article = document.createElement('article');
      article.className = 'calm-card feed-post';
      article.innerHTML = '<div class="feed-post-header"><div class="feed-source-avatar sage-avatar"><span class="ui-icon" data-icon="'+post.icon+'"></span></div><div class="feed-source-meta"><strong>'+post.source+'</strong><span>'+post.tag+' · '+post.time+'</span></div><span class="feed-official"><span class="ui-icon" data-icon="badge-check"></span> رسمي</span></div><div class="feed-post-body"><span class="feed-post-kicker">'+post.tag+'</span><h3>'+post.title+'</h3><p>'+post.text+'</p></div><div class="feed-post-actions"><button onclick="toggleFeedAction(this,\'تفاعلت\')"><span class="ui-icon" data-icon="heart"></span> تفاعل <small>'+post.stats+'</small></button><button onclick="toggleFeedAction(this,\'التعليقات\')"><span class="ui-icon" data-icon="message-circle"></span> تعليق</button><button onclick="toggleFeedAction(this,\'تمت المشاركة\')"><span class="ui-icon" data-icon="share-2"></span> مشاركة</button><button onclick="toggleFeedAction(this,\'تم الحفظ\')"><span class="ui-icon" data-icon="bookmark"></span> حفظ</button></div>';
      return article;
    }
    function loadMoreFeedPosts(manual) {
      var list = document.getElementById('feed-post-list');
      var loader = document.getElementById('feed-loader');
      var moreButton = document.getElementById('feed-load-more');
      if (!list || feedLoading) return;
      if (feedPageIndex >= extraFeedPosts.length) {
        if (loader) loader.innerHTML = 'وصلت إلى نهاية المحتوى التجريبي المتاح حالياً.';
        if (moreButton) moreButton.classList.add('hidden');
        return;
      }
      feedLoading = true;
      if (loader) loader.classList.remove('hidden');
      var end = Math.min(feedPageIndex + 2, extraFeedPosts.length);
      for (var i=feedPageIndex;i<end;i++) list.appendChild(makeFeedPost(extraFeedPosts[i], i));
      feedPageIndex = end;
      renderUiIcons(list);
      feedLoading = false;
      if (loader) loader.classList.add('hidden');
      if (moreButton && feedPageIndex >= extraFeedPosts.length) moreButton.textContent = 'تم عرض كل المحتوى التجريبي';
    }
    function initFeedInfiniteScroll() {
      var loader = document.getElementById('feed-loader');
      if (!loader || !('IntersectionObserver' in window) || loader.dataset.observing === '1') return;
      loader.dataset.observing = '1';
      var observer = new IntersectionObserver(function(entries) {
        if (entries.some(function(entry){return entry.isIntersecting;})) loadMoreFeedPosts(false);
      }, { rootMargin:'360px 0px' });
      observer.observe(loader);
    }
    document.querySelectorAll('.feed-filter').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.feed-filter').forEach(function(item){item.classList.remove('active');});
        btn.classList.add('active');
      });
    });

    function filterDiscover(term) {
      var q = String(term || '').trim().toLowerCase();
      var grid = document.getElementById('discover-grid');
      if (!grid) return;
      grid.querySelectorAll('[data-search]').forEach(function(card) {
        card.classList.toggle('hidden', !!q && (card.dataset.search || '').toLowerCase().indexOf(q) === -1);
      });
    }
    function setFeatureTab(button, panelId) {
      var root = button.closest('.feature-screen');
      if (!root) return;
      root.querySelectorAll('.feature-tab-panel').forEach(function(panel){ panel.classList.toggle('hidden', panel.id !== panelId); });
      var tabs = button.parentElement.querySelectorAll('.feature-tab');
      tabs.forEach(function(tab){ tab.classList.toggle('active', tab === button); });
    }
    function selectAudio(reciter, meta) {
      var title = document.getElementById('audio-now-title');
      var detail = document.getElementById('audio-now-meta');
      if (!title || !detail) return;
      title.textContent = reciter + ' · ' + (document.getElementById('audio-surah') ? document.getElementById('audio-surah').value : 'تلاوة مختارة');
      title.dataset.reciter = reciter;
      detail.textContent = meta + ' · تمت الإضافة إلى قائمة التشغيل التجريبية، والتشغيل الفعلي ينتظر ربط ملف مرخص.';
    }
    function setAudioStatus() {
      var detail = document.getElementById('audio-now-meta');
      if (detail) detail.textContent = 'حالة المشغل: واجهة العرض جاهزة، لكن مصدر البث أو الملف الصوتي لم يُربط بعد.';
    }
    function markMemorized() {
      var count = document.getElementById('memorized-count');
      var pct = document.getElementById('memorized-percent');
      var bar = document.getElementById('memorized-bar');
      var feedback = document.getElementById('memorization-feedback');
      if (!count || !pct || !bar) return;
      var n = parseInt(count.textContent.replace(/[^0-9]/g,''),10) || 0;
      n += 1; count.textContent = String(n);
      var value = Math.min(100, 30 + (n - 12) * 2);
      pct.textContent = value + '٪'; bar.style.width = value + '%';
      if (feedback) feedback.textContent = 'تم تسجيل إتمام جلسة: ' + document.getElementById('memorization-selection').value + ' (بيانات تجريبية محلية).';
    }
    function updateHabitProgress() {
      var root = document.getElementById('habit-check-list');
      if (!root) return;
      var checks = Array.from(root.querySelectorAll('input[type="checkbox"]'));
      var done = checks.filter(function(input){return input.checked;}).length;
      var label = document.getElementById('habit-progress-label');
      var bar = document.getElementById('habit-progress-bar');
      if (label) label.textContent = done + ' / ' + checks.length;
      if (bar) bar.style.width = (checks.length ? done / checks.length * 100 : 0) + '%';
    }
    function resetHabitProgress() {
      var root = document.getElementById('habit-check-list');
      if (root) root.querySelectorAll('input[type="checkbox"]').forEach(function(input){input.checked=false;});
      updateHabitProgress();
      var feedback = document.getElementById('habit-feedback'); if (feedback) feedback.textContent = 'تمت إعادة ضبط القائمة في نموذج المعاينة.';
    }
    function saveHabitProgress() {
      updateHabitProgress();
      var feedback = document.getElementById('habit-feedback'); if (feedback) feedback.textContent = 'تم تحديث التقدم في هذه المعاينة. يتطلب الحفظ الدائم ربط حساب المستخدم وقاعدة البيانات.';
    }
    function checkQuizAnswer(button, correct) {
      var root = button.closest('.feature-panel');
      if (!root) return;
      root.querySelectorAll('button.feature-list-row').forEach(function(btn){ btn.disabled = true; btn.style.opacity = '.65'; });
      var feedback = document.getElementById('quiz-answer-feedback');
      button.style.borderColor = correct ? '#9fbe8d' : '#d9b5aa';
      button.style.background = correct ? '#eff7eb' : '#fbf0ed';
      if (feedback) { feedback.className = 'feature-answer ' + (correct ? 'success' : ''); feedback.textContent = correct ? 'إجابة صحيحة. العبرة في المشهور من اصطلاح المكي والمدني هي ما كان قبل الهجرة وما كان بعدها، لا مجرد مكان النزول.' : 'ليست هذه الإجابة المعتمدة في اصطلاح علوم القرآن. جرّب مرة أخرى بعد إعادة تحميل الصفحة.'; }
    }
    function generateQuizRoom() {
      var code = String(Math.floor(10000 + Math.random() * 90000));
      var feedback = document.getElementById('quiz-room-feedback');
      if (feedback) feedback.innerHTML = '<strong>رمز الغرفة التجريبية: ' + code + '</strong><br>هذا الرمز للعرض فقط؛ إنشاء الغرف الحقيقية يتطلب خادم جلسات.';
    }
    function joinQuizRoom() {
      var input = document.getElementById('quiz-room-input');
      var feedback = document.getElementById('quiz-join-feedback');
      var code = input ? input.value.trim() : '';
      if (feedback) feedback.textContent = /^\d{5}$/.test(code) ? 'تم قبول صيغة الرمز. لا توجد غرفة متصلة في نموذج المعاينة.' : 'أدخل رمزاً مكوّناً من خمسة أرقام.';
    }
    function selectKidsAge(age, button) {
      document.querySelectorAll('#screen-kids .feature-card').forEach(function(card){ card.style.borderColor = '#e4ebe3'; });
      button.style.borderColor = '#a8c58d';
      var feedback = document.getElementById('kids-age-feedback');
      if (feedback) feedback.textContent = 'تم اختيار الفئة العمرية: ' + age + '. ستظهر لها دروس وأنشطة بمستوى يناسبها بعد ربط المحتوى.';
    }
    function kidsParentGate() {
      var pin = document.getElementById('kids-parent-pin');
      var feedback = document.getElementById('kids-parent-feedback');
      if (feedback) feedback.textContent = pin && pin.value.length >= 4 ? 'تم قبول الإدخال في المعاينة فقط. يجب استبدال ذلك بمصادقة ولي أمر حقيقية.' : 'أدخل رمزاً تجريبياً مكوّناً من أربعة أرقام على الأقل.';
    }
    function openGuidanceTopic(title, description) {
      var old = document.getElementById('guidance-topic-detail');
      if (!old) {
        old = document.createElement('div'); old.id = 'guidance-topic-detail'; old.className = 'feature-callout mt-5';
        var host = document.querySelector('#screen-guidance .feature-shell'); if (host) host.appendChild(old);
      }
      old.innerHTML = '<strong>' + title + '</strong><br>' + description + '<br>سيُعرض الحكم التفصيلي مع الأدلة ومراجع المذاهب بعد تحرير المادة العلمية.';
      old.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    function changeCalendarMonth(direction) {
      var feedback = document.getElementById('calendar-month-feedback');
      if (feedback) feedback.textContent = direction < 0 ? 'معاينة الشهر السابق. يجب جلب التاريخ الهجري من مصدر تقويم معتمد.' : 'معاينة الشهر التالي. قد تختلف بداية الشهر باختلاف ثبوت الهلال والجهة المعتمدة.';
    }
    function submitFeatureRequest() {
      var title = document.getElementById('request-title');
      var body = document.getElementById('request-description');
      var feedback = document.getElementById('request-feedback');
      if (!title || !body || !feedback) return;
      if (!title.value.trim() || !body.value.trim()) { feedback.textContent = 'أكمل عنوان الطلب والتفاصيل قبل الإرسال.'; return; }
      feedback.textContent = 'تم تسجيل الطلب في نموذج المعاينة فقط. عند ربط نظام الدعم سيُنشأ رقم تذكرة ويمكنك متابعة حالتها.';
      title.value=''; body.value='';
    }
    function updateShareCard() {
      var type = document.getElementById('share-card-type');
      var txt = document.getElementById('share-card-text');
      var src = document.getElementById('share-card-source');
      var previewType = document.querySelector('#share-card-preview .preview-kicker');
      var previewText = document.getElementById('share-preview-text');
      var previewSource = document.getElementById('share-preview-source');
      if (previewType) previewType.textContent = type ? type.value : '';
      if (previewText) previewText.textContent = txt ? txt.value : '';
      if (previewSource) previewSource.textContent = src ? src.value : '';
    }
    function resetShareCard() {
      var type=document.getElementById('share-card-type'), txt=document.getElementById('share-card-text'), src=document.getElementById('share-card-source');
      if(type) type.selectedIndex=0; if(txt) txt.value='﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾'; if(src) src.value='سورة الشرح · الآية ٥'; updateShareCard();
    }
    function copyShareCardText() {
      var txt=document.getElementById('share-card-text'), src=document.getElementById('share-card-source'), feedback=document.getElementById('share-card-feedback');
      var combined=(txt?txt.value:'')+'\n'+(src?src.value:'');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(combined).then(function(){if(feedback)feedback.textContent='تم نسخ النص والمرجع.';}).catch(function(){if(feedback)feedback.textContent='تعذر النسخ تلقائياً؛ انسخ النص من الحقول.';});
      else if(feedback) feedback.textContent='انسخ النص والمرجع من الحقول يدوياً.';
    }




    function setDetailText(id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value || '';
    }
    function openContentDetail(screenId, card, type) {
      var titleEl = card.querySelector('h3, h2, .book-cover-title');
      var title = titleEl ? titleEl.textContent.trim() : 'تفاصيل المحتوى';
      var descEl = card.querySelector('p:not(.book-author)') || card.querySelector('p');
      var description = descEl ? descEl.textContent.trim() : 'لا يتوفر وصف تفصيلي في المعاينة.';
      var categoryEl = card.querySelector('.archive-tag');
      var category = categoryEl ? categoryEl.textContent.trim() : 'المكتبة الموحدة';
      var authorEl = card.querySelector('.book-author, .book-cover-author');
      var author = authorEl ? authorEl.textContent.trim() : 'بيانات المؤلف تظهر بعد توثيق السجل';
      if (type === 'book') {
        ['detail-book-title','detail-book-cover-title','detail-book-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-book-description',description);
        setDetailText('detail-book-category',category);
        setDetailText('detail-book-cover-author',author);
        setDetailText('reader-title',title);
      } else if (type === 'author') {
        ['detail-author-title','detail-author-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-author-description',description);
      } else if (type === 'article') {
        ['detail-article-title','detail-article-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-article-description',description);
        setDetailText('detail-article-category',category);
      } else if (type === 'pathway') {
        ['detail-pathway-title','detail-pathway-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-pathway-description',description);
      } else if (type === 'bibliography') {
        ['detail-bibliography-title','detail-bibliography-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-bibliography-description',description);
      } else if (type === 'event') {
        ['detail-event-title','detail-event-cover-title','detail-event-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-event-description',description);
        setDetailText('detail-event-category',category);
      } else if (type === 'person') {
        ['detail-person-title','detail-person-cover-title','detail-person-hero-title'].forEach(function(id){setDetailText(id,title);});
        setDetailText('detail-person-description',description);
        setDetailText('detail-person-category',category);
      }
      showScreen(screenId);
    }
    function addDetailActions(selector, screenId, type, label) {
      document.querySelectorAll(selector).forEach(function(card) {
        if (card.querySelector(':scope > .detail-open-btn')) return;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'detail-open-btn';
        button.innerHTML = '<span>' + label + '</span><span class="ui-icon" data-icon="arrow-left"></span>';
        button.addEventListener('click', function(ev) {
          ev.stopPropagation();
          openContentDetail(screenId, card, type);
        });
        card.appendChild(button);
      });
    }
    function enhanceDetailLinks() {
      addDetailActions('#screen-library-tafsir .book-record, #screen-library-hadith .book-record, #screen-library-fiqh .book-record, #screen-library-aqidah .book-record', 'book-detail', 'book', 'تفاصيل الكتاب');
      addDetailActions('#screen-library-authors .author-record', 'author-detail', 'author', 'صفحة المؤلف');
      addDetailActions('#screen-articles .editorial-card', 'article-detail', 'article', 'قراءة المقال');
      addDetailActions('#screen-pathways .pathway-card', 'pathway-detail', 'pathway', 'عرض المسار');
      addDetailActions('#screen-bibliographies .bibliography-card', 'bibliography-detail', 'bibliography', 'تفاصيل القائمة');
      addDetailActions('#screen-history-battles .event-row, #screen-history-timeline .seerah-milestone, #screen-history-places .place-record, #screen-history-currencies .coin-record', 'history-event-detail', 'event', 'التفاصيل والمصادر');
      addDetailActions('#screen-history-prophets .biography-card, #screen-history-companions .biography-card, #screen-history-scholars .biography-card', 'history-person-detail', 'person', 'عرض الترجمة');
      renderUiIcons(document);
    }
    var readerFontSize = 22;
    function readerChangeFont(delta) {
      readerFontSize = Math.max(16, Math.min(34, readerFontSize + delta * 2));
      var content = document.querySelector('.reader-content');
      if (content) content.style.fontSize = readerFontSize + 'px';
      var label = document.getElementById('reader-font-label');
      if (label) label.textContent = 'حجم القراءة: ' + readerFontSize + 'px';
    }
    function toggleReaderContents() {
      var panel = document.getElementById('reader-contents');
      if (panel) panel.classList.toggle('hidden');
    }
    function togglePathwayDetailStages(button) {
      var feedback = document.getElementById('pathway-detail-feedback');
      if (feedback) feedback.textContent = 'تم فتح الوحدة الأولى في نموذج المعاينة. تسجيل التقدم والاختبارات يحتاج ربط حساب المستخدم ومحتوى الوحدة.';
      button.textContent = 'الوحدة الأولى مفتوحة';
    }



    /* V13: actionable prototype controls for the main reading and discovery flows. */
    function v13Toast(message) {
      var toast = document.getElementById('prototype-toast');
      if (!toast) { toast = document.createElement('div'); toast.id = 'prototype-toast'; toast.className = 'prototype-toast'; toast.setAttribute('role','status'); document.body.appendChild(toast); }
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(window.__v13ToastTimer);
      window.__v13ToastTimer = setTimeout(function(){ toast.classList.remove('is-visible'); }, 2800);
    }
    function v13InlineFeedback(host, message, className) {
      if (!host) return;
      var box = host.querySelector(':scope > .prototype-inline-feedback');
      if (!box) { box = document.createElement('div'); box.className = 'prototype-inline-feedback'; host.appendChild(box); }
      if (className) box.classList.add(className);
      box.textContent = message;
      return box;
    }
    function v13SaveState(key, value) {
      try { localStorage.setItem('islamic-platform-preview:' + key, JSON.stringify(value)); } catch (e) { /* local preview may restrict storage */ }
    }
    function v13ReadState(key, fallback) {
      try { var raw = localStorage.getItem('islamic-platform-preview:' + key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
    }
    function v13SetActive(button, groupSelector) {
      var group = button.closest(groupSelector);
      if (group) group.querySelectorAll('button').forEach(function(item){ item.classList.toggle('active', item === button); item.classList.toggle('quran-index-tab-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    }
    function v13NormalizeSearch(value) {
      return String(value || '').toLocaleLowerCase('ar')
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
        .replace(/[٠-٩]/g, function(d){ return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); })
        .replace(/[۰-۹]/g, function(d){ return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
        .replace(/\s+/g, ' ').trim();
    }
    function v13Filter(root, selector, query) {
      if (!root) return 0;
      var q = v13NormalizeSearch(query);
      var count = 0;
      var items = selector.indexOf('>') === 0 ? Array.from(root.querySelectorAll(selector.split(',').map(function(part){return ':scope ' + part.trim();}).join(', '))) : Array.from(root.querySelectorAll(selector));
      items.forEach(function(item){
        var hay = v13NormalizeSearch((item.getAttribute('data-search') || '') + ' ' + (item.textContent || ''));
        var match = !q || hay.includes(q);
        item.classList.toggle('prototype-hidden', !match);
        if (match) count++;
      });
      return count;
    }
    function v13RunPageSearch(screenId) {
      var root = document.getElementById('screen-' + screenId);
      if (!root) return;
      var input = root.querySelector('.page-search-shell input, .archive-search input, input[type="search"]');
      if (!input) return;
      var selectorMap = {
        'hadith':'article.calm-card', 'feed':'.feed-post', 'names':'.name-card', 'name-detail':'.name-detail-content',
        'lexicon':'.lexicon-result', 'lexicon-detail':'.detail-panel p', 'library':'.archive-card',
        'library-tafsir':'.book-record', 'library-hadith':'.book-record', 'library-fiqh':'.book-record', 'library-aqidah':'.book-record',
        'library-authors':'.author-record', 'articles':'.editorial-card', 'pathways':'.pathway-card', 'bibliographies':'.bibliography-card',
        'history-prophets':'.biography-card', 'history-companions':'.biography-card', 'history-scholars':'.biography-card',
        'history-battles':'.event-row', 'history-places':'.place-record', 'history-currencies':'.coin-record'
      };
      var selector = selectorMap[screenId];
      var count = selector ? v13Filter(root, selector, input.value) : 0;
      if (screenId === 'quran') {
        var idx = document.getElementById('quran-index-items');
        count = idx ? v13Filter(idx, '> div', input.value) : 0;
      }
      if (screenId === 'discover') { filterDiscover(input.value); count = root.querySelectorAll('#discover-grid [data-search]:not(.hidden)').length; }
      if (screenId === 'tools') { filterTools(input.value); count = root.querySelectorAll('#tools-grid [data-tool-search]:not(.hidden)').length; }
      v13Toast(input.value.trim() ? ('نتائج البحث المطابقة: ' + count) : 'تم عرض المحتوى بالكامل.');
    }
    function v13OpenBookFromRow(row) {
      var title = row.querySelector('.profile-book-info strong, strong');
      var author = row.querySelector('.profile-book-info small, small');
      var name = title ? title.textContent.trim() : 'كتاب من مكتبتي';
      ['detail-book-title','detail-book-cover-title','detail-book-hero-title','reader-title'].forEach(function(id){ setDetailText(id,name); });
      setDetailText('detail-book-description', author ? author.textContent.trim() : 'كتاب من قائمتك الشخصية.');
      showScreen('book-detail');
    }
    function v13OpenProfileEditor() {
      var identity = document.querySelector('#screen-profile .profile-identity-copy');
      if (!identity) return;
      var title = identity.querySelector('h2'); var desc = identity.querySelector('p');
      v13ShowDialog('تعديل المساحة الشخصية','حدّث اسم المساحة والوصف الظاهرين لك في هذه المعاينة.',[
        {label:'اسم المساحة',value:title ? title.textContent.trim() : 'مساحتي الشخصية',id:'v13-profile-name'},
        {label:'نبذة قصيرة',value:desc ? desc.textContent.trim() : '',id:'v13-profile-bio',textarea:true}
      ],function(values){ if(title) title.textContent=values[0]; if(desc) desc.textContent=values[1]; v13SaveState('profile',{name:values[0],bio:values[1]}); v13Toast('تم تحديث بيانات المساحة في هذه المعاينة.'); });
    }
    function v13ShowDialog(title, description, fields, onSave) {
      var old = document.getElementById('prototype-dialog-backdrop'); if (old) old.remove();
      var backdrop = document.createElement('div'); backdrop.id='prototype-dialog-backdrop'; backdrop.className='prototype-dialog-backdrop';
      var dialog = document.createElement('div'); dialog.className='prototype-dialog'; dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true');
      var markup = '<h3>' + title + '</h3><p>' + description + '</p>';
      fields.forEach(function(field){ markup += '<label for="'+field.id+'">'+field.label+'</label>' + (field.textarea ? '<textarea id="'+field.id+'">'+field.value+'</textarea>' : '<input id="'+field.id+'" value="'+String(field.value).replace(/"/g,'&quot;')+'">'); });
      markup += '<div class="prototype-dialog-actions"><button type="button" class="prototype-dialog-primary" data-save>حفظ التغييرات</button><button type="button" class="prototype-dialog-secondary" data-close>إلغاء</button></div>';
      dialog.innerHTML=markup; backdrop.appendChild(dialog); document.body.appendChild(backdrop);
      dialog.querySelector('[data-close]').addEventListener('click',function(){backdrop.remove();});
      dialog.querySelector('[data-save]').addEventListener('click',function(){var values=fields.map(function(f){var el=dialog.querySelector('#'+f.id);return el?el.value.trim():'';}); if(onSave) onSave(values); backdrop.remove();});
      backdrop.addEventListener('click',function(ev){if(ev.target===backdrop)backdrop.remove();});
      var first=dialog.querySelector('input,textarea'); if(first) first.focus();
    }
    function v13InitHadith() {
      var root=document.getElementById('screen-hadith'); if(!root || root.dataset.v13Bound) return; root.dataset.v13Bound='1';
      var input=root.querySelector('.page-search-shell input');
      var run=function(){ v13Filter(root,'article.calm-card',input ? input.value : ''); };
      var submit=root.querySelector('.page-search-submit'); if(submit) submit.addEventListener('click',function(){run();v13Toast('تم تحديث نتائج الحديث وفق عبارة البحث.');});
      if(input) input.addEventListener('keydown',function(e){if(e.key==='Enter')run();});
      var categoryButtons=root.querySelectorAll('.page-search-shell + div button');
      categoryButtons.forEach(function(btn){btn.addEventListener('click',function(){v13SetActive(btn,'.page-search-shell + div'); var val=btn.textContent.trim(); var article=root.querySelector('article.calm-card'); if(article){var text=article.textContent; var match=val.includes('الكل') || text.includes(val.replace('صحيح ','').replace('سنن ','').replace('جامع ','')); article.classList.toggle('prototype-hidden',!match);} v13Toast('تم تطبيق تصنيف: '+val);});});
      var article=root.querySelector('article.calm-card');
      if(article){
        var actions=article.querySelectorAll('.border-t button');
        actions.forEach(function(btn){btn.addEventListener('click',function(){
          var label=btn.textContent.trim();
          if(label.includes('شرح')){
            var panel=article.querySelector('.hadith-explainer'); if(!panel){panel=document.createElement('div');panel.className='hadith-explainer';panel.textContent='تظهر هنا فوائد الحديث ومعاني ألفاظه وأقوال الشراح، على أن تُربط كل فائدة بمرجعها من كتب الشروح قبل النشر.'; article.appendChild(panel);} else panel.classList.toggle('hidden');
          } else if(label.includes('حفظ')) { btn.classList.toggle('prototype-active'); btn.textContent=btn.classList.contains('prototype-active')?'تم الحفظ':'حفظ في المفضلة'; v13Toast(btn.classList.contains('prototype-active')?'أضيف الحديث إلى محفوظات المعاينة.':'أزيل الحديث من محفوظات المعاينة.'); }
          else { v13Toast('لا يوجد ملف صوتي مربوط بهذا الحديث في المعاينة.'); }
        });});
      }
    }
    function v13InitFeed() {
      var root=document.getElementById('screen-feed'); if(!root || root.dataset.v13Bound) return; root.dataset.v13Bound='1';
      var categoryFor=function(post){ var t=(post.textContent||'').toLowerCase(); if(t.includes('حديث')||t.includes('السنة'))return 'hadith'; if(t.includes('كتاب')||t.includes('مكتبة')||t.includes('إصدار'))return 'library'; if(t.includes('مسار')||t.includes('درس')||t.includes('فقه'))return 'learning'; if(t.includes('إعلان'))return 'announcements'; return 'quran'; };
      var apply=function(category){
        root.querySelectorAll('.feed-post').forEach(function(post){
          var type=post.dataset.feedCategory || categoryFor(post); post.dataset.feedCategory=type;
          var ok=category==='all' || (category==='quran' && ['quran','tafsir'].includes(type)) || (category==='hadith' && type==='hadith') || (category==='learning' && ['learning','fiqh'].includes(type)) || (category==='library' && type==='library') || (category==='announcements' && type==='announcements');
          post.classList.toggle('prototype-hidden',!ok);
        });
      };
      root.querySelectorAll('.feed-filter').forEach(function(btn){btn.addEventListener('click',function(){root.querySelectorAll('.feed-filter').forEach(function(b){b.classList.toggle('active',b===btn);});var label=btn.textContent.trim(); var map={'لك':'all','القرآن والتدبر':'quran','الحديث':'hadith','مقالات ودروس':'learning','المكتبة':'library','إعلانات المنصة':'announcements'};apply(map[label]||'all');});});
      var sideButtons=root.querySelectorAll('.feed-side-card:first-child > button');
      sideButtons.forEach(function(btn){btn.addEventListener('click',function(){var label=btn.textContent.trim();var map=label.includes('القرآن')?'quran':label.includes('الحديث')?'hadith':label.includes('المكتبة')?'library':label.includes('الدروس')?'learning':'quran';apply(map);root.querySelectorAll('.feed-filter').forEach(function(b){b.classList.toggle('active',b.textContent.trim()===(map==='quran'?'القرآن والتدبر':map==='hadith'?'الحديث':map==='library'?'المكتبة':'مقالات ودروس'));});});});
      var input=root.querySelector('.page-search-shell input');
      var search=function(){var count=v13Filter(root,'.feed-post',input?input.value:'');v13Toast(input&&input.value.trim()?'منشورات مطابقة: '+count:'تم إظهار جميع المنشورات.');};
      if(input){input.addEventListener('input',search);input.addEventListener('keydown',function(e){if(e.key==='Enter')search();});}
      var submit=root.querySelector('.page-search-submit'); if(submit)submit.addEventListener('click',search);
      root.querySelectorAll('.feed-post-actions button').forEach(function(btn){
        var text=btn.textContent.trim();
        if(text.includes('تعليق'))btn.addEventListener('click',function(){var post=btn.closest('.feed-post');var panel=post.querySelector('.feed-comment-composer');if(!panel){panel=document.createElement('div');panel.className='feed-comment-composer prototype-inline-feedback';panel.innerHTML='<textarea aria-label="اكتب تعليقك" placeholder="اكتب تعليقاً على محتوى المنصة" style="width:100%;min-height:66px;padding:9px;border:1px solid #dfe8dc;border-radius:10px;background:#fff"></textarea><button type="button" style="margin-top:8px;font-weight:700">إضافة التعليق</button>';post.appendChild(panel);panel.querySelector('button').addEventListener('click',function(){var value=panel.querySelector('textarea').value.trim();if(!value){v13Toast('اكتب التعليق أولاً.');return;}var posted=document.createElement('p');posted.textContent='تعليقك: '+value;posted.className='prototype-inline-feedback';panel.appendChild(posted);panel.querySelector('textarea').value='';v13Toast('تمت إضافة تعليق تجريبي داخل المعاينة.');});}else panel.classList.toggle('prototype-hidden');});
        if(text.includes('مشاركة'))btn.addEventListener('click',function(){var post=btn.closest('.feed-post');var title=post.querySelector('h3');var shareText=title?title.textContent:'محتوى من المنصة'; if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(shareText).then(function(){v13Toast('تم نسخ عنوان المنشور للمشاركة.');}).catch(function(){v13Toast(shareText);});else v13Toast(shareText);});
      });
    }
    function v13InitProfile() {
      var root=document.getElementById('screen-profile'); if(!root || root.dataset.v13Bound) return; root.dataset.v13Bound='1';
      var coverEdit=root.querySelector('.profile-cover-edit');
      if(coverEdit){coverEdit.addEventListener('click',function(){var input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=function(){if(input.files&&input.files[0]){var url=URL.createObjectURL(input.files[0]);var cover=root.querySelector('.profile-cover-v3');cover.style.backgroundImage='linear-gradient(90deg,rgba(17,55,42,.2),rgba(17,55,42,.2)),url("'+url+'")';cover.style.backgroundSize='cover';cover.style.backgroundPosition='center';v13Toast('تم تحديث غلاف المعاينة من جهازك.');}};input.click();});}
      var edit=root.querySelector('.profile-edit-button'); if(edit)edit.addEventListener('click',v13OpenProfileEditor);
      var settings=root.querySelector('.profile-settings-button'); if(settings)settings.addEventListener('click',function(){v13ShowDialog('إعدادات الخصوصية','المساحة الشخصية خاصة بصاحب الحساب؛ لن تظهر مكتبتك أو محفوظاتك للأصدقاء.',[{label:'نطاق المساحة',value:'خاصة بي فقط',id:'v13-privacy'}],function(){v13Toast('إعداد الخصوصية في هذه المعاينة ثابت على الوضع الخاص.');});});
      var listen=root.querySelector('button:not([onclick])');
      root.querySelectorAll('button').forEach(function(btn){var t=btn.textContent.trim();if(t.includes('قوائم الاستماع'))btn.addEventListener('click',function(){showScreen('audio');});if(t.includes('عرض المكتبة كاملة'))btn.addEventListener('click',function(){showScreen('library');});if(t.includes('إدارة أهدافي'))btn.addEventListener('click',function(){showScreen('habits');});if(t==='متابعة'||t==='ابدأ القراءة'){btn.addEventListener('click',function(){var row=btn.closest('.profile-book-row,.wishlist-list > div');if(row){v13OpenBookFromRow(row);}else{showScreen('library');}});}});
    }
    function v13InitQuran() {
      var root=document.getElementById('screen-quran');
      if(!root || root.dataset.v15Bound) return;
      root.dataset.v15Bound='1';
      var $=function(sel){return root.querySelector(sel);};
      var ayahs=Array.from(root.querySelectorAll('.quran-ayah'));
      var activeAyah=4, page=305, repeatMode='٣ مرات', isPlaying=false, focusMode=false;
      var noteModal=$('#quran-note-modal'), noteText=$('#quran-note-text');
      var bookmarkKey='islamic-prototype-quran-bookmarks-v1', noteKey='islamic-prototype-quran-notes-v1';
      // File previews and privacy-restricted browsers may block localStorage; keep a safe in-memory fallback.
      var quranMemoryStore=window.__quranMemoryStore||(window.__quranMemoryStore={});
      function readStore(key){
        try{var store=window.localStorage;var raw=store&&store.getItem(key);if(raw!==null&&raw!==undefined)return JSON.parse(raw||'[]');}catch(e){}
        try{return JSON.parse(quranMemoryStore[key]||'[]');}catch(e){return [];}
      }
      function writeStore(key,val){
        var raw=JSON.stringify(val);
        try{var store=window.localStorage;if(store){store.setItem(key,raw);return 'persistent';}}catch(e){}
        quranMemoryStore[key]=raw;return 'temporary';
      }
      function currentAyah(){return ayahs.find(function(a){return Number(a.dataset.ayah)===activeAyah;})||ayahs[0]||null;}
      function currentText(){var a=currentAyah();return a?(a.dataset.verse||'').trim():'';}
      function arabicNum(n){return new Intl.NumberFormat('ar-EG').format(n);}
      function positionVerseActions(){
        var popover=$('#quran-selected-verse-tools'),target=currentAyah(),frame=$('.mushaf-page-frame');
        if(!popover||!target||!frame)return;
        popover.hidden=false;
        var targetRect=target.getBoundingClientRect(),frameRect=frame.getBoundingClientRect();
        var top=targetRect.bottom-frameRect.top+frame.scrollTop+8;
        var estimatedHeight=popover.offsetHeight||52;
        if(top+estimatedHeight>frame.clientHeight-46)top=Math.max(12,targetRect.top-frameRect.top+frame.scrollTop-estimatedHeight-8);
        popover.style.top=Math.round(top)+'px';
      }
      function hideVerseActions(){var popover=$('#quran-selected-verse-tools');if(popover)popover.hidden=true;}
      function selectAyah(num,scroll,showActions){
        activeAyah=Math.max(1,Math.min(ayahs.length||1,Number(num)||1));
        ayahs.forEach(function(a){var on=Number(a.dataset.ayah)===activeAyah;a.classList.toggle('is-active',on);a.setAttribute('aria-pressed',String(on));if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
        var ref='مريم · الآية '+arabicNum(activeAyah);
        var selected=$('#quran-selected-reference'), tafsirRef=$('#quran-tafsir-reference'), tafsirVerse=$('#quran-tafsir-verse'), coverage=$('#quran-tafsir-coverage'), player=$('#quran-player-current');
        if(selected)selected.textContent=ref;
        if(tafsirRef)tafsirRef.textContent='سورة مريم • الآية '+arabicNum(activeAyah);
        if(tafsirVerse)tafsirVerse.textContent='﴿'+currentText()+'﴾';
        if(coverage){coverage.textContent=activeAyah===4?'هذا شرح توضيحي تجريبي للآية ٤. النصوص الكاملة للتفاسير المعتمدة تحتاج إلى ربط مصادرها قبل النشر.':'لا يتوفر شرح موثق لهذه الآية في المعاينة الحالية.';coverage.classList.toggle('is-sample',activeAyah!==4);}
        var tafsirExplanation=$('#quran-tafsir-explanation'), tafsirEmpty=$('#quran-tafsir-empty');
        if(tafsirExplanation)tafsirExplanation.hidden=activeAyah!==4;
        if(tafsirEmpty)tafsirEmpty.hidden=activeAyah===4;
        if(player)player.textContent='الموضع المحدد: سورة مريم — الآية '+arabicNum(activeAyah);
        var bookmarkBtn=$('#quran-bookmark-btn');if(bookmarkBtn)bookmarkBtn.setAttribute('aria-pressed',String(hasBookmark()));var selectedBookmark=$('#quran-selected-bookmark');if(selectedBookmark){var saved=hasBookmark();selectedBookmark.setAttribute('aria-pressed',String(saved));selectedBookmark.classList.toggle('is-bookmarked',saved);var label=selectedBookmark.querySelector('.quran-action-label');if(label)label.textContent=saved?'إزالة الحفظ':'حفظ الآية';}
        if(scroll){var frame=currentAyah();if(frame)frame.scrollIntoView({behavior:'smooth',block:'nearest'});}
        if(showActions){requestAnimationFrame(positionVerseActions);}else{hideVerseActions();}
      }
      function hasBookmark(){return readStore(bookmarkKey).some(function(x){return x.surah==='مريم'&&Number(x.ayah)===activeAyah;});}
      function renderBookmarks(){
        var host=$('#quran-index-items');if(!host)return;
        var saved=readStore(bookmarkKey);
        host.innerHTML='';
        if(!saved.length){host.innerHTML='<div class="quran-empty-state">لا توجد علامات محفوظة بعد. حدّد آية ثم اضغط «حفظ الآية».</div>';return;}
        saved.forEach(function(item){
          var b=document.createElement('button');b.type='button';b.className='quran-saved-row';
          var copy=document.createElement('span');var title=document.createElement('strong');var excerpt=document.createElement('small');var action=document.createElement('span');
          title.textContent='سورة '+String(item.surah||'مريم')+' · الآية '+arabicNum(item.ayah);
          excerpt.textContent=String(item.text||'').slice(0,74);action.textContent='فتح';
          copy.appendChild(title);copy.appendChild(excerpt);b.appendChild(copy);b.appendChild(action);
          b.addEventListener('click',function(){selectAyah(item.ayah,true);v13Toast('تم فتح العلامة المحفوظة في الصفحة التجريبية.');});host.appendChild(b);
        });
      }
      function saveBookmark(){
        var saved=readStore(bookmarkKey), idx=saved.findIndex(function(x){return x.surah==='مريم'&&Number(x.ayah)===activeAyah;});
        if(idx>=0){saved.splice(idx,1);writeStore(bookmarkKey,saved);v13Toast('أزيلت العلامة من المحفوظات.');}
        else{saved.unshift({surah:'مريم',ayah:activeAyah,text:currentText(),page:page,createdAt:new Date().toISOString()});var mode=writeStore(bookmarkKey,saved);v13Toast(mode==='persistent'?'حُفظت الآية في محفوظاتك على هذا المتصفح.':'حُفظت الآية مؤقتاً في جلسة المعاينة؛ قد تختفي عند تحديث الصفحة.');}
        var b=$('#quran-bookmark-btn');if(b)b.setAttribute('aria-pressed',String(hasBookmark()));
        var selected=$('#quran-selected-bookmark');if(selected){selected.setAttribute('aria-pressed',String(hasBookmark()));selected.classList.toggle('is-bookmarked',hasBookmark());var label=selected.querySelector('.quran-action-label');if(label)label.textContent=hasBookmark()?'إزالة الحفظ':'حفظ الآية';}
        if((window.quranIndexMode||'').includes('محفوظاتي'))renderBookmarks();
      }
      function openNote(){
        if(!noteModal)return;var notes=readStore(noteKey);var entry=notes.find(function(x){return x.surah==='مريم'&&Number(x.ayah)===activeAyah;});
        if(noteText)noteText.value=entry?entry.note:'';
        var ctx=$('#quran-note-context');if(ctx)ctx.textContent='سورة مريم · الآية '+arabicNum(activeAyah);
        noteModal.classList.remove('hidden');setTimeout(function(){if(noteText)noteText.focus();},40);
      }
      function closeNote(){if(noteModal)noteModal.classList.add('hidden');}
      function saveNote(){
        var value=(noteText&&noteText.value||'').trim();if(!value){v13Toast('اكتب الملاحظة أولاً ثم احفظها.');return;}
        var notes=readStore(noteKey),idx=notes.findIndex(function(x){return x.surah==='مريم'&&Number(x.ayah)===activeAyah;});
        var record={surah:'مريم',ayah:activeAyah,note:value,updatedAt:new Date().toISOString()};if(idx>=0)notes[idx]=record;else notes.unshift(record);
        var mode=writeStore(noteKey,notes);closeNote();v13Toast(mode==='persistent'?'حُفظت ملاحظتك على هذا المتصفح.':'حُفظت الملاحظة مؤقتاً في جلسة المعاينة؛ قد تختفي عند تحديث الصفحة.');
      }
      function copyText(value){
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(value).then(function(){v13Toast('تم نسخ نص الآية المحددة.');}).catch(function(){v13Toast('تعذر النسخ التلقائي في هذا المتصفح.');});}
        else {var ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');v13Toast('تم نسخ نص الآية المحددة.');}catch(e){v13Toast('تعذر النسخ في هذا المتصفح.');}ta.remove();}
      }
      function updatePage(next,quiet){
        page=Math.max(1,Math.min(604,Number(next)||1));var input=$('#quran-page-input');if(input)input.value=page;
        var labels=root.querySelectorAll('.quran-page-label');labels.forEach(function(el){el.textContent='صفحة '+arabicNum(page);});
        var current=$('#quran-session-label');if(current)current.textContent='صفحة '+arabicNum(page)+' من ٦٠٤';
        var fill=$('#quran-progress-fill');if(fill)fill.style.width=(page/604*100)+'%';
        var topLabel=$('#quran-page-input');if(topLabel)topLabel.setAttribute('aria-label','رقم الصفحة المحدد في المعاينة '+page);var note=$('#quran-page-navigation-note');if(note)note.textContent='تم تحديد الصفحة '+arabicNum(page)+' في المعاينة؛ النص لا يتغير حتى ربط صفحات المصحف المعتمدة.';
        if(!quiet)v13Toast('تم تحديث رقم الصفحة في المعاينة. عرض نص الصفحة يتطلب ربط صفحات المصحف المعتمدة.');
      }
      function setPlaying(on){isPlaying=!!on;var button=$('#quran-play-toggle');if(button){button.setAttribute('aria-pressed',String(isPlaying));button.setAttribute('aria-label',isPlaying?'إيقاف المعاينة':'تشغيل المعاينة');button.innerHTML=isPlaying?'<span class="ui-icon" data-icon="pause" aria-hidden="true"></span>':'<span class="ui-icon" data-icon="play" aria-hidden="true"></span>';renderUiIcons(button);}var disclaimer=$('.quran-player-disclaimer');if(disclaimer)disclaimer.textContent=isPlaying?'وضع التشغيل التجريبي — لا يوجد صوت حتى ربط ملفات التلاوة':'مشغل واجهة تجريبية — لم تُربط ملفات التلاوة بعد';}
      var focusPreviousLayout='single';
      function setFocus(on){
        if(on){var container=$('#quran-split-container');focusPreviousLayout=container&&container.classList.contains('single-layout')?'single':'split';}
        focusMode=!!on;root.classList.toggle('quran-focus-mode',focusMode);
        if(focusMode)closeQuranSidebars();
        var btn=$('#quran-focus-btn');if(btn)btn.textContent=focusMode?'إنهاء وضع التركيز':'وضع التركيز';
        setQuranLayout(focusMode?'single':focusPreviousLayout);
        v13Toast(focusMode?'تم تفعيل وضع التركيز وإخفاء الجوانب الجانبية.':'تمت استعادة تخطيط القراءة السابق.');
      }
      function setIndexMode(label,btn){
        window.quranIndexMode=label;var tabs=root.querySelectorAll('#quran-right-sidebar [data-quran-index-tab]');
        tabs.forEach(function(b){var on=b===btn;b.classList.toggle('quran-index-tab-active',on);b.setAttribute('aria-pressed',String(on));});
        var index=$('#quran-index-items');if(!index)return;
        if(label.includes('محفوظاتي')){renderBookmarks();return;}
        index.innerHTML='';
        if(label.includes('الأجزاء')){for(var i=1;i<=30;i++){var row=document.createElement('button');row.type='button';row.className='quran-saved-row';row.innerHTML='<span><strong>الجزء '+arabicNum(i)+'</strong><small>انتقال إلى موضع الجزء في الفهرس الكامل</small></span><span>›</span>';row.addEventListener('click',function(){v13Toast('سيتم الانتقال إلى بداية الجزء عند ربط فهرس المصحف الكامل.');});index.appendChild(row);}}
        else{surahItems.forEach(function(node){index.appendChild(node.cloneNode(true));});}
      }
      var index=$('#quran-index-items');var surahItems=index?Array.from(index.children).map(function(node){return node.cloneNode(true);}):[];
      surahItems.forEach(function(node){node.classList.toggle('is-current',Number(node.dataset.surahNumber)===19);});
      var tabs=Array.from(root.querySelectorAll('#quran-right-sidebar [data-quran-index-tab]'));
      tabs.forEach(function(btn){btn.addEventListener('click',function(){setIndexMode(btn.textContent.trim(),btn);});});
      var indexSearch=root.querySelector('#quran-right-sidebar input');if(indexSearch)indexSearch.addEventListener('input',function(){var rows=Array.from(root.querySelectorAll('#quran-index-items > *'));rows.forEach(function(row){row.style.display=row.textContent.toLocaleLowerCase('ar').includes(indexSearch.value.trim().toLocaleLowerCase('ar'))?'':'none';});});
      ayahs.forEach(function(a){a.addEventListener('click',function(){selectAyah(a.dataset.ayah,false,true);});});
      var mainSearch=$('#quran-main-search'),submit=$('#quran-main-search-submit');
      function runSearch(){
        var q=(mainSearch&&mainSearch.value||'').trim();
        if(!q){v13Toast('اكتب رقم الآية أو كلمة من النص المعروض.');return;}
        var normalizeArabic=function(value){return String(value||'').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/[\sـ،؛:,.!؟(){}\[\]]/g,'').toLowerCase();};
        var digits=q.replace(/[٠-٩]/g,function(d){return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));}).replace(/^(?:الآية|آية|رقم)\s*/,'').trim();
        var normalized=normalizeArabic(q);
        var match=ayahs.find(function(a){return (normalized&&normalizeArabic(a.dataset.verse).includes(normalized))||(/^\d+$/.test(digits)&&Number(a.dataset.ayah)===Number(digits));});
        if(match){selectAyah(match.dataset.ayah,true,true);v13Toast('عُثر على التطابق داخل الآيات المتاحة في هذه المعاينة.');}
        else{if(indexSearch){indexSearch.value=q;indexSearch.dispatchEvent(new Event('input'));}v13Toast('لم يظهر تطابق في الآيات المعروضة. البحث في كامل القرآن يحتاج ربط قاعدة النص القرآني المعتمدة.');}
      }
      if(submit)submit.addEventListener('click',runSearch);if(mainSearch)mainSearch.addEventListener('keydown',function(e){if(e.key==='Enter')runSearch();});
      var bookmark=$('#quran-bookmark-btn');if(bookmark)bookmark.addEventListener('click',saveBookmark);var selectedBookmark=$('#quran-selected-bookmark');if(selectedBookmark)selectedBookmark.addEventListener('click',saveBookmark);
      var copy=$('#quran-copy-btn');if(copy)copy.addEventListener('click',function(){copyText(currentText());});
      var note=$('#quran-note-btn');if(note)note.addEventListener('click',openNote);var selectedNote=$('#quran-selected-note');if(selectedNote)selectedNote.addEventListener('click',openNote);
      var noteOpen=$('#quran-open-notes');if(noteOpen)noteOpen.addEventListener('click',function(){var notes=readStore(noteKey);if(!notes.length){v13Toast('لا توجد ملاحظات محفوظة بعد.');return;}var latest=notes[0];selectAyah(latest.ayah,true);openNote();});
      var noteClose=$('#quran-note-close'),noteCancel=$('#quran-note-cancel'),noteSave=$('#quran-note-save');if(noteClose)noteClose.addEventListener('click',closeNote);if(noteCancel)noteCancel.addEventListener('click',closeNote);if(noteSave)noteSave.addEventListener('click',saveNote);if(noteModal)noteModal.addEventListener('click',function(e){if(e.target===noteModal)closeNote();});
      var share=$('#quran-share-btn');if(share)share.addEventListener('click',function(){var value='سورة مريم، الآية '+arabicNum(activeAyah)+'\n﴿'+currentText()+'﴾';if(navigator.share){navigator.share({title:'آية من القرآن الكريم',text:value}).catch(function(){});}else{copyText(value);v13Toast('تم نسخ الآية لتتمكن من مشاركتها.');}});
      var showTafsir=$('#quran-selected-tafsir');if(showTafsir)showTafsir.addEventListener('click',function(){setQuranLayout('split');var pane=$('#quran-tafsir-pane');if(pane)pane.scrollIntoView({behavior:'smooth',block:'start'});});
      var prev=$('#quran-prev-ayah'),next=$('#quran-next-ayah');if(prev)prev.addEventListener('click',function(){selectAyah(activeAyah-1,true);});if(next)next.addEventListener('click',function(){selectAyah(activeAyah+1,true);});
      var play=$('#quran-play-toggle');if(play)play.addEventListener('click',function(){setPlaying(!isPlaying);});
      var pageInput=$('#quran-page-input'),go=$('#quran-go-page'),prevPage=$('#quran-prev-page'),nextPage=$('#quran-next-page');if(go)go.addEventListener('click',function(){updatePage(pageInput.value);});if(pageInput)pageInput.addEventListener('keydown',function(e){if(e.key==='Enter')updatePage(pageInput.value);});if(prevPage)prevPage.addEventListener('click',function(){updatePage(page-1);});if(nextPage)nextPage.addEventListener('click',function(){updatePage(page+1);});
      var focus=$('#quran-focus-btn');if(focus)focus.addEventListener('click',function(){setFocus(!focusMode);});
      var fontButtons=Array.from(root.querySelectorAll('#quran-left-sidebar button')).filter(function(b){return b.textContent.includes('تصغير')||b.textContent.includes('تكبير');});fontButtons.forEach(function(btn){btn.addEventListener('click',function(){var list=$('#quran-ayah-list');if(!list)return;var size=parseFloat(getComputedStyle(list).fontSize)||25;size=Math.max(18,Math.min(42,size+(btn.textContent.includes('تكبير')?2:-2)));list.style.fontSize=size+'px';var label=Array.from(root.querySelectorAll('#quran-left-sidebar .sidebar-content span')).find(function(x){return x.textContent.includes('px')||x.textContent.includes('كبير');});if(label)label.textContent=Math.round(size)+'px';});});
      var themeChoices=Array.from(root.querySelectorAll('#quran-left-sidebar .sidebar-content [data-quran-theme]'));themeChoices.forEach(function(choice){choice.addEventListener('click',function(){themeChoices.forEach(function(c){c.classList.remove('quran-theme-active');c.setAttribute('aria-pressed','false');});choice.classList.add('quran-theme-active');choice.setAttribute('aria-pressed','true');var frame=$('.mushaf-page-frame');if(frame){frame.classList.remove('theme-warm','theme-ivory','theme-night');frame.classList.add(choice.dataset.quranTheme);}var surahHeader=$('#mushaf-surah-header');if(surahHeader){surahHeader.classList.remove('theme-warm','theme-ivory','theme-night');surahHeader.classList.add(choice.dataset.quranTheme);}v13Toast('تم تطبيق سمة ورق المصحف.');});});
      var repeatButtons=Array.from(root.querySelectorAll('#quran-left-sidebar button')).filter(function(b){return ['٣ مرات','٥ مرات','تكرار مستمر'].includes(b.textContent.trim());});repeatButtons.forEach(function(btn){btn.addEventListener('click',function(){repeatMode=btn.textContent.trim();repeatButtons.forEach(function(b){b.classList.toggle('is-repeat-active',b===btn);});var status=$('#quran-repeat-status');if(status)status.textContent=repeatMode;v13Toast('تم حفظ تفضيل التكرار. سيُطبق التشغيل المتكرر عند ربط ملفات التلاوة.');});});
      var toggles=Array.from(root.querySelectorAll('#quran-left-sidebar input[type="checkbox"]'));toggles.forEach(function(toggle){toggle.addEventListener('change',function(){var name=toggle.closest('label')?.querySelector('span')?.textContent.trim()||'إعداد القراءة';v13Toast(toggle.checked?'تم تفعيل: '+name:'تم إيقاف: '+name);});});
      var tafsirButtons=root.querySelectorAll('#quran-tafsir-pane [data-tafsir-source]');tafsirButtons.forEach(function(btn){btn.addEventListener('click',function(){v13SetActive(btn,'#quran-tafsir-pane .quran-tafsir-source-switch');tafsirButtons.forEach(function(item){item.classList.toggle('is-source-active',item===btn);});v13Toast('تم اختيار '+btn.textContent.trim()+' في المعاينة؛ يلزم ربط النص الكامل للمصدر قبل عرضه.');});});
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
      selectAyah(4,false,false);
      document.addEventListener('click',function(e){var menu=$('#quran-selected-verse-tools');if(!menu||menu.hidden)return;if(menu.contains(e.target)||e.target.closest('.quran-ayah'))return;hideVerseActions();});
      window.addEventListener('resize',function(){var menu=$('#quran-selected-verse-tools');if(menu&&!menu.hidden)positionVerseActions();});
      if(hasBookmark())bookmark&&bookmark.setAttribute('aria-pressed','true');
      var savedMode=tabs.find(function(b){return b.textContent.includes('محفوظاتي');});if(savedMode){};
      document.addEventListener('keydown',function(e){if(!root.classList.contains('hidden')){if(e.key==='Escape'){closeNote();hideVerseActions();if(focusMode)setFocus(false);}else if(e.key==='ArrowLeft'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){selectAyah(activeAyah+1,false,true);}else if(e.key==='ArrowRight'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){selectAyah(activeAyah-1,false,true);}}});
    }
    function v13InitNamesLexicon() {
      var lex=document.getElementById('screen-lexicon');if(lex&&!lex.dataset.v13Bound){lex.dataset.v13Bound='1';var input2=lex.querySelector('.page-search-shell input');var run2=function(){var n=v13Filter(lex,'.lexicon-result',input2?input2.value:'');v13Toast('المداخل المطابقة: '+n);};var button2=lex.querySelector('.page-search-submit');if(button2)button2.addEventListener('click',run2);if(input2)input2.addEventListener('input',function(){v13Filter(lex,'.lexicon-result',input2.value);});}
      var detail=document.getElementById('screen-lexicon-detail');if(detail&&!detail.dataset.v13Bound){detail.dataset.v13Bound='1';var save=Array.from(detail.querySelectorAll('button')).find(function(b){return b.textContent.includes('إضافة إلى محفوظاتي');});if(save)save.addEventListener('click',function(){save.classList.toggle('prototype-active');save.textContent=save.classList.contains('prototype-active')?'تمت الإضافة إلى محفوظاتي':'إضافة إلى محفوظاتي';v13Toast(save.classList.contains('prototype-active')?'تم حفظ المدخل في المعاينة.':'تمت إزالة المدخل من المحفوظات.');});}
    }
    function v13InitHistoryFilters() {
      document.querySelectorAll('.archive-screen .archive-filter-row').forEach(function(row){if(row.dataset.v13Bound)return;row.dataset.v13Bound='1';var buttons=row.querySelectorAll('.archive-filter');buttons.forEach(function(btn){btn.addEventListener('click',function(){buttons.forEach(function(b){b.classList.toggle('active',b===btn);});var cards=Array.from(row.parentElement.querySelectorAll('.biography-card'));if(!cards.length)return;var mode=btn.textContent.trim();var grid=cards[0].parentElement;var sorted=cards.slice();if(mode==='حسب الاسم')sorted.sort(function(a,b){return (a.querySelector('h3')?.textContent||'').localeCompare((b.querySelector('h3')?.textContent||''),'ar');});else if(mode==='حسب الطبقة')sorted.sort(function(a,b){return (a.querySelector('.archive-tag')?.textContent||'').localeCompare((b.querySelector('.archive-tag')?.textContent||''),'ar');});else if(mode==='حسب المجال')sorted.sort(function(a,b){return (a.dataset.search||'').localeCompare((b.dataset.search||''),'ar');});else sorted.sort(function(a,b){return Number(a.dataset.originalOrder||0)-Number(b.dataset.originalOrder||0);});cards.forEach(function(card,i){if(card.dataset.originalOrder===undefined)card.dataset.originalOrder=String(i);});sorted.forEach(function(card){grid.appendChild(card);});v13Toast('تم ترتيب التراجم '+(mode==='كل التراجم'?'بالترتيب الأصلي':mode)+'.');});});});
    }
    function v13MobileActive(screenId) {
      var group=document.querySelector('.mobile-bottom-nav');if(!group)return;
      var main=screenId;
      if(screenId.indexOf('library')===0||['articles','pathways','bibliographies','fiqh-comparison','book-detail','book-reader','author-detail','article-detail','pathway-detail','bibliography-detail'].includes(screenId))main='library';
      else if(screenId.indexOf('history')===0)main='history';
      else if(['prayer','adhkar','zakat','hajj'].includes(screenId))main='tools';
      else if(['profile'].includes(screenId))main='profile';
      else if(screenId==='feed')main='feed';
      else if(['hadith','quran','names','lexicon','name-detail','lexicon-detail'].includes(screenId))main='home';
      group.querySelectorAll('button').forEach(function(btn){btn.classList.toggle('is-active',btn.dataset.screen===main);});
    }
    (function v13WrapShowScreen(){var original=window.showScreen;if(typeof original==='function'&&!original.__v13Wrapped){var wrapped=function(id,skip){original(id,skip);v13MobileActive(id);};wrapped.__v13Wrapped=true;window.showScreen=wrapped;}})();
    function v13InitPageSearches() {
      ['hadith','names','name-detail','lexicon','lexicon-detail','library','library-tafsir','library-hadith','library-fiqh','library-aqidah','library-authors','articles','pathways','bibliographies','discover','tools'].forEach(function(id){
        var root=document.getElementById('screen-'+id);if(!root||root.dataset.v13SearchBound)return;root.dataset.v13SearchBound='1';
        var button=root.querySelector('.page-search-submit');if(button&&id!=='hadith'&&id!=='names'&&id!=='lexicon'){button.addEventListener('click',function(){v13RunPageSearch(id);});}
        var input=root.querySelector('.page-search-shell input');if(input&&id!=='hadith'&&id!=='names'&&id!=='lexicon'){input.addEventListener('keydown',function(e){if(e.key==='Enter')v13RunPageSearch(id);});}
      });
    }
    function v13BindProfileBookNavigation() { /* handled by v13InitProfile */ }

    v13InitHadith();
    v13InitFeed();
    v13InitProfile();
    v13InitQuran();
    v13InitNamesLexicon();
    v13InitHistoryFilters();
    v13InitPageSearches();
    v13MobileActive((screenFromHash && screenFromHash()) || 'home');
    renderUiIcons(document.querySelector('.mobile-bottom-nav') || document);
    document.addEventListener('DOMContentLoaded', function(){ var mobileNav=document.querySelector('.mobile-bottom-nav'); if(mobileNav) renderUiIcons(mobileNav); v13MobileActive((screenFromHash && screenFromHash()) || 'home'); });


    renderUiIcons(document);
    syncAccountHeader();
    initTopbarControls();
    enhanceDetailLinks();
    calculateZakatAdvanced();
    updateAdhkarProgress();
    renderAdhkarCategory('morning', document.querySelector('.adhkar-tab[data-category="morning"]'));
    initFeedInfiniteScroll();
    var initialArchiveScreen = screenFromHash();
    if (initialArchiveScreen) showScreen(initialArchiveScreen, true);

  
// V25: unified prophetic and qudsi hadith search/filter
window.filterHadithResults = function(){
 const q=(document.getElementById('hadith-search-input')?.value||'').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').toLowerCase();
 const grade=document.getElementById('hadith-grade-filter')?.value||'all';
 const source=document.getElementById('hadith-source-filter')?.value||'all';
 const type=document.getElementById('hadith-type-filter')?.value||'all';
 const cards=[...document.querySelectorAll('#hadith-results-list [data-hadith-source],#hadith-qudsi-results [data-hadith-source]')];let count=0;
 cards.forEach(card=>{const text=(card.innerText+' '+(card.dataset.search||'')).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').toLowerCase();const ok=(!q||text.includes(q))&&(grade==='all'||card.dataset.hadithGrade===grade)&&(source==='all'||card.dataset.hadithSource===source)&&(type==='all'||(type==='qudsi'?card.dataset.hadithType==='qudsi':card.dataset.hadithType!=='qudsi'));card.hidden=!ok;if(ok)count++;});
 const summary=document.getElementById('hadith-result-count');if(summary)summary.textContent='عدد النتائج: '+count;
};
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('#hadith-results-list [data-hadith-source]').forEach(x=>{if(!x.dataset.hadithType)x.dataset.hadithType='nabawi';});});
