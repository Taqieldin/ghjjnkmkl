(function(){
  const PAGE_SLUGS = {"home":"index","hadith":"hadith","profile":"account","feed":"feed","quran":"quran","names":"names","name-detail":"name-detail","lexicon":"lexicon","lexicon-detail":"lexicon-entry","hajj":"hajj-umrah","prayer":"prayer-times","adhkar":"adhkar","zakat":"zakat-calculator","library":"library","books":"books","library-tafsir":"library-tafsir","library-hadith":"library-sunnah","library-fiqh":"library-fiqh","library-aqidah":"library-aqidah","library-authors":"authors","articles":"articles","pathways":"learning-pathways","bibliographies":"bibliographies","fiqh-comparison":"fiqh-comparison","discover":"discover","quran-sciences":"quran-sciences","tafsir":"tafsir","asbab-alnuzul":"asbab-alnuzul","surah-virtues":"surah-virtues","quran-translations":"quran-translations","adhan":"adhan","imsakiyah":"imsakiyah","pillars":"pillars","word-of-day":"word-of-day","hadith-qudsi":"hadith-qudsi","audio":"recitations","memorization":"quran-memorization","habits":"worship-tracker","quiz":"quizzes","guidance":"muslim-guide","medicine":"prophetic-medicine","calendar":"hijri-calendar","requests":"feature-requests","share-cards":"share-cards","book-detail":"book-detail","book-reader":"book-reader","author-detail":"author-detail","article-detail":"article-detail","pathway-detail":"pathway-detail","bibliography-detail":"bibliography-detail","store":"store","search":"search","duas":"duas","sunnahs":"sunnahs","rulings":"rulings","madhhab-hanafi":"madhhab-hanafi","madhhab-maliki":"madhhab-maliki","madhhab-shafii":"madhhab-shafii","madhhab-hanbali":"madhhab-hanbali","sirah":"sirah","prophets":"prophets","companions":"companions","islamic-history":"islamic-history","afterlife":"afterlife","dreams":"dreams","quiz-rooms":"quiz-rooms","friends-challenges":"friends-challenges","quran-wird":"quran-wird","khatma":"khatma","notifications":"account-notifications","downloads":"account-downloads","my-library":"account-library","privacy":"account-privacy","submissions":"account-submissions","family":"account-family","settings":"account-settings","submit-material":"submit-material","studio":"studio","about":"about","contact":"contact","privacy-policy":"privacy-policy","terms":"terms","content-policy":"content-policy","children-safety":"children-safety","pricing":"pricing","support":"support","qiraat":"qiraat","shamail":"shamail"};
  const SCREEN_TO_ID = Object.keys(PAGE_SLUGS).reduce((a,k)=>{a[PAGE_SLUGS[k]]=k;return a;},{});
  const currentFile = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i,'');
  const inPagesFolder = /\/pages\//.test(location.pathname);
  const pageToScreen = SCREEN_TO_ID[currentFile] || (currentFile === 'index' ? 'home' : 'home');
  function pageUrl(screenId, query){
    const slug = PAGE_SLUGS[screenId];
    if (!slug) return null;
    let url;
    if (screenId === 'home') url = inPagesFolder ? '../index.html' : 'index.html';
    else url = (inPagesFolder ? '' : 'pages/') + slug + '.html';
    if (query) url += (query[0] === '?' ? query : '?' + query);
    return url;
  }
  const LEGACY_SCREEN_ALIASES = {'adhan':'settings','quran-stories':'prophets','nasheeds':'audio','hadith-topics':'hadith','quran-radio':'audio','tools':'discover'};
  function navigate(screenId, query){
    screenId = LEGACY_SCREEN_ALIASES[screenId] || screenId;
    if (screenId === 'kids' || screenId === 'tasbih') screenId = screenId === 'tasbih' ? 'adhkar' : 'discover';
    if ((['profile','feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material'].includes(screenId)) && typeof window.openAccountGate === 'function') {
      let active=false; try{active=sessionStorage.getItem('platform-demo-account')==='active';}catch(e){}
      if(!active){window.openAccountGate(screenId);return;}
    }
    const url=pageUrl(screenId,query);
    if(url) location.href=url;
  }
  window.openArticleBySlug = function(slug){ window.navigateToPage('article-detail','slug='+encodeURIComponent(slug||'tafsir-reading')); };
  const GLOBAL_SEARCH_INDEX = [
    {id:'quran',title:'المصحف الشريف',terms:'القرآن الكريم السور الآيات الصفحات التلاوة الحفظ التفسير'},
    {id:'quran-sciences',title:'علوم القرآن',terms:'علوم القرآن'},
    {id:'tafsir',title:'التفسير',terms:'تفسير القرآن تفسير الطبري ابن كثير السعدي القرطبي'},
    {id:'asbab-alnuzul',title:'أسباب النزول',terms:'أسباب النزول الروايات سياق الآيات'},
    {id:'surah-virtues',title:'فضائل السور والآيات',terms:'فضائل السور القرآن فضائل الآيات روايات'},
    {id:'quran-translations',title:'ترجمات معاني القرآن',terms:'الترجمة الإنجليزية الفرنسية الأوردية التركية'},
    {id:'word-of-day',title:'كلمة اليوم',terms:'مفردات قرآنية كلمة اليوم معنى جذر لغوي'},
    {id:'hadith',title:'موسوعة الحديث النبوي',terms:'السنة الحديث صحيح البخاري مسلم السنن التخريج'},
    {id:'hadith',title:'الأحاديث القدسية',terms:'حديث قدسي',query:'type=qudsi'},
    {id:'library',title:'المعرفة الإسلامية',terms:'المعرفة الإسلامية الكتب المقالات المعاجم القواميس قصص الأنبياء'},
    {id:'books',title:'الكتب الإسلامية',terms:'الكتب الإسلامية كتب تفسير حديث فقه عقيدة سيرة نبوية كتب قراءة كتاب مؤلف'},
    {id:'articles',title:'المقالات والبحوث',terms:'مقالات بحوث تحرير علوم القرآن السنة الفقه'},
    {id:'article-detail',title:'مدخل إلى أسباب النزول',terms:'أسباب النزول الروايات السياق',query:'slug=asbab-alnuzul'},
    {id:'article-detail',title:'منهج قراءة الحديث',terms:'قراءة الحديث المتن السند الراوي التخريج',query:'slug=reading-hadith'},
    {id:'store',title:'المتجر',terms:'متجر منتجات كتب أدوات هدايا'},
    {id:'names',title:'أسماء الله الحسنى',terms:'أسماء الله الحسنى معاني شرح'},
    {id:'lexicon',title:'المعجم والقاموس',terms:'معجم قاموس جذور مفردات لغة القرآن'},
    {id:'adhkar',title:'الأدعية والأذكار',terms:'أذكار الصباح المساء الدعاء ذكر'},
    {id:'prayer',title:'مواقيت الصلاة',terms:'مواقيت الصلاة الفجر الظهر العصر المغرب العشاء'},
    {id:'zakat',title:'حاسبة الزكاة',terms:'زكاة مال ذهب فضة تجارة نصاب'},
    {id:'hajj',title:'دليل الحج والعمرة',terms:'الحج العمرة المناسك الإحرام'},
    {id:'medicine',title:'الطب النبوي',terms:'الطب النبوي السنة'},
    {id:'pathways',title:'مسارات التعلم',terms:'مسارات تعلم خطة تعليم'},
    {id:'audio',title:'الصوتيات والمدائح النبوية',terms:'تلاوات القرآن قراء إذاعة قرآن مدائح نبوية أناشيد صوتيات استماع'},
    {id:'imsakiyah',title:'إمساكية رمضان',terms:'إمساكية رمضان الإمساك الإفطار'},
    {id:'pillars',title:'أركان الإسلام والإيمان',terms:'أركان الإسلام الخمسة أركان الإيمان الستة العقيدة'},
    {id:'memorization',title:'حفظ القرآن الكريم',terms:'حفظ مراجعة ورد تسميع'},
    {id:'calendar',title:'التقويم الهجري',terms:'التقويم الهجري التاريخ الأشهر'},
    {id:'guidance',title:'الدليل الإسلامي',terms:'إرشاد المسلم دليل'}
,
    {id:"home",title:"مساحة هادئة للقراءة والتدبر",terms:"مساحة هادئة للقراءة والتدبر مساحة هادئة للقراءة والتدبر",description:"مساحة هادئة للقراءة والتدبر",kindLabel:"قسم من المنصة"},
    {id:"profile",title:"مساحتي الشخصية",terms:"مساحتي الشخصية مساحتي الشخصية",description:"مساحتي الشخصية",kindLabel:"قسم من المنصة"},
    {id:"author-detail",title:"سيرة المؤلف",terms:"سيرة المؤلف سيرة المؤلف",description:"سيرة المؤلف",kindLabel:"قسم من المنصة"},
    {id:"library-authors",title:"تراجم الأئمة والمؤلفين",terms:"تراجم الأئمة والمؤلفين تراجم الأئمة والمؤلفين",description:"تراجم الأئمة والمؤلفين",kindLabel:"قسم من المنصة"},
    {id:"bibliographies",title:"أدلة القراءة والمصادر",terms:"أدلة القراءة والمصادر قوائم كتب ومصادر مرتبة حسب الموضوع لمساعدة القارئ على اختيار مراجع مناسبة.",description:"قوائم كتب ومصادر مرتبة حسب الموضوع لمساعدة القارئ على اختيار مراجع مناسبة.",kindLabel:"قسم من المنصة"},
    {id:"bibliography-detail",title:"قائمة المراجع",terms:"قائمة المراجع قائمة المراجع",description:"قائمة المراجع",kindLabel:"قسم من المنصة"},
    {id:"book-detail",title:"صفحة الكتاب",terms:"صفحة الكتاب صفحة الكتاب",description:"صفحة الكتاب",kindLabel:"قسم من المنصة"},
    {id:"book-reader",title:"قارئ الكتاب",terms:"قارئ الكتاب قارئ الكتاب",description:"قارئ الكتاب",kindLabel:"قسم من المنصة"},
    {id:"discover",title:"استكشف كل أبواب المعرفة والعبادة",terms:"استكشف كل أبواب المعرفة والعبادة استكشف كل أبواب المعرفة والعبادة",description:"استكشف كل أبواب المعرفة والعبادة",kindLabel:"قسم من المنصة"},
    {id:"requests",title:"الدعم واقتراح ميزة",terms:"الدعم واقتراح ميزة الدعم واقتراح ميزة",description:"الدعم واقتراح ميزة",kindLabel:"قسم من المنصة"},
    {id:"feed",title:"الفيد المعرفي",terms:"الفيد المعرفي الفيد المعرفي",description:"الفيد المعرفي",kindLabel:"قسم من المنصة"},
    {id:"fiqh-comparison",title:"مقارنة المذاهب الأربعة",terms:"مقارنة المذاهب الأربعة مقارنة المذاهب الأربعة",description:"مقارنة المذاهب الأربعة",kindLabel:"قسم من المنصة"},
    {id:"lexicon-detail",title:"سَلِمَ",terms:"سَلِمَ سَلِمَ",description:"سَلِمَ",kindLabel:"قسم من المنصة"},
    {id:"library-aqidah",title:"العقيدة وإصلاح القلب",terms:"العقيدة وإصلاح القلب العقيدة وإصلاح القلب",description:"العقيدة وإصلاح القلب",kindLabel:"قسم من المنصة"},
    {id:"library-fiqh",title:"فقه العبادات والمعاملات",terms:"فقه العبادات والمعاملات فقه العبادات والمعاملات",description:"فقه العبادات والمعاملات",kindLabel:"قسم من المنصة"},
    {id:"library-hadith",title:"السنة النبوية ومصنفاتها",terms:"السنة النبوية ومصنفاتها السنة النبوية ومصنفاتها",description:"السنة النبوية ومصنفاتها",kindLabel:"قسم من المنصة"},
    {id:"library-tafsir",title:"تفسير القرآن وعلومه",terms:"تفسير القرآن وعلومه تفسير القرآن وعلومه",description:"تفسير القرآن وعلومه",kindLabel:"قسم من المنصة"},
    {id:"name-detail",title:"شرح أسماء الله الحسنى",terms:"شرح أسماء الله الحسنى شرح أسماء الله الحسنى",description:"شرح أسماء الله الحسنى",kindLabel:"قسم من المنصة"},
    {id:"pathway-detail",title:"مسار التعلم",terms:"مسار التعلم مسار التعلم",description:"مسار التعلم",kindLabel:"قسم من المنصة"},
    {id:"quiz",title:"الاختبارات والمسابقات",terms:"الاختبارات والمسابقات الاختبارات والمسابقات",description:"الاختبارات والمسابقات",kindLabel:"قسم من المنصة"},
    {id:"share-cards",title:"بطاقات معرفية قابلة للمشاركة",terms:"بطاقات معرفية قابلة للمشاركة بطاقات معرفية قابلة للمشاركة",description:"بطاقات معرفية قابلة للمشاركة",kindLabel:"قسم من المنصة"},
    {id:"discover",title:"العبادات والأدوات",terms:"أدوات العبادة اليومية مواقيت الصلاة الأذكار الزكاة الحج التقويم الإسلامي",description:"استكشف أدوات العبادة والخدمات اليومية",kindLabel:"قسم من المنصة"},
    {id:"habits",title:"متابعة العبادات والعادات",terms:"متابعة العبادات والعادات متابعة العبادات والعادات",description:"متابعة العبادات والعادات",kindLabel:"قسم من المنصة"},
    {id:"search",title:"نتائج البحث",terms:"نتائج البحث نتائج البحث في المنصة الإسلامية",description:"نتائج البحث في المنصة الإسلامية",kindLabel:"قسم من المنصة"},
    {id:"duas",title:"الأدعية المأثورة",terms:"الأدعية المأثورة الأدعية القرآنية والنبوية حسب الموضوع",description:"الأدعية القرآنية والنبوية حسب الموضوع",kindLabel:"الفقه والعبادات"},
    {id:"sunnahs",title:"السنن والآداب",terms:"السنن والآداب السنن اليومية والآداب النبوية",description:"السنن اليومية والآداب النبوية",kindLabel:"الفقه والعبادات"},
    {id:"rulings",title:"الأحكام والمسائل الفقهية",terms:"الأحكام والمسائل الفقهية فهرس الأحكام الشرعية حسب أبواب الفقه",description:"فهرس الأحكام الشرعية حسب أبواب الفقه",kindLabel:"الفقه والعبادات"},
    {id:"madhhab-hanafi",title:"المذهب الحنفي",terms:"المذهب الحنفي المذهب الحنفي: أبوابه ومصادره",description:"المذهب الحنفي: أبوابه ومصادره",kindLabel:"الفقه والعبادات"},
    {id:"madhhab-maliki",title:"المذهب المالكي",terms:"المذهب المالكي المذهب المالكي: أبوابه ومصادره",description:"المذهب المالكي: أبوابه ومصادره",kindLabel:"الفقه والعبادات"},
    {id:"madhhab-shafii",title:"المذهب الشافعي",terms:"المذهب الشافعي المذهب الشافعي: أبوابه ومصادره",description:"المذهب الشافعي: أبوابه ومصادره",kindLabel:"الفقه والعبادات"},
    {id:"madhhab-hanbali",title:"المذهب الحنبلي",terms:"المذهب الحنبلي المذهب الحنبلي: أبوابه ومصادره",description:"المذهب الحنبلي: أبوابه ومصادره",kindLabel:"الفقه والعبادات"},
    {id:"sirah",title:"السيرة النبوية",terms:"السيرة النبوية السيرة النبوية وأحداثها ومصادرها",description:"السيرة النبوية وأحداثها ومصادرها",kindLabel:"السيرة والقصص"},
    {id:"prophets",title:"قصص الأنبياء",terms:"قصص الأنبياء قصص الأنبياء في القرآن الكريم",description:"قصص الأنبياء في القرآن الكريم",kindLabel:"المعرفة الإسلامية"},
    {id:"companions",title:"الصحابة رضي الله عنهم",terms:"الصحابة رضي الله عنهم الصحابة وتراجمهم ومصادرهم",description:"الصحابة وتراجمهم ومصادرهم",kindLabel:"السيرة والقصص"},
    {id:"islamic-history",title:"التاريخ الإسلامي",terms:"التاريخ الإسلامي التاريخ الإسلامي والغزوات والفتوحات",description:"التاريخ الإسلامي والغزوات والفتوحات",kindLabel:"السيرة والقصص"},
    {id:"afterlife",title:"اليوم الآخر وأشراط الساعة",terms:"اليوم الآخر وأشراط الساعة اليوم الآخر وأشراط الساعة في مصادر العقيدة",description:"اليوم الآخر وأشراط الساعة في مصادر العقيدة",kindLabel:"السيرة والقصص"},
    {id:"dreams",title:"كتب تعبير الرؤى",terms:"كتب تعبير الرؤى كتب تعبير الرؤى وحدود تفسير الأحلام",description:"كتب تعبير الرؤى وحدود تفسير الأحلام",kindLabel:"السيرة والقصص"},
    {id:"quiz-rooms",title:"غرف المسابقات الجماعية",terms:"غرف المسابقات الجماعية غرف مسابقات إسلامية خاصة للأصدقاء",description:"غرف مسابقات إسلامية خاصة للأصدقاء",kindLabel:"التعلم التفاعلي"},
    {id:"friends-challenges",title:"تحديات الأصدقاء",terms:"تحديات الأصدقاء تحديات ومسابقات خاصة بين الأصدقاء",description:"تحديات ومسابقات خاصة بين الأصدقاء",kindLabel:"التعلم التفاعلي"},
    {id:"quran-wird",title:"الورد القرآني اليومي",terms:"الورد القرآني اليومي الورد القرآني اليومي — مساحة خاصة",description:"الورد القرآني اليومي — مساحة خاصة",kindLabel:"مساحة شخصية"},
    {id:"khatma",title:"خطة ختمة القرآن",terms:"خطة ختمة القرآن خطة ختمة القرآن الكريم — مساحة خاصة",description:"خطة ختمة القرآن الكريم — مساحة خاصة",kindLabel:"مساحة شخصية"},
    {id:"notifications",title:"الإشعارات",terms:"الإشعارات سجل الإشعارات وتفضيلاتها",description:"سجل الإشعارات وتفضيلاتها",kindLabel:"مساحة شخصية"},
    {id:"downloads",title:"التنزيلات",terms:"التنزيلات إدارة التنزيلات والمواد المحفوظة",description:"إدارة التنزيلات والمواد المحفوظة",kindLabel:"مساحة شخصية"},
    {id:"my-library",title:"مكتبتي الخاصة",terms:"مكتبتي الخاصة مكتبتي ومحفوظاتي الخاصة",description:"مكتبتي ومحفوظاتي الخاصة",kindLabel:"مساحة شخصية"},
    {id:"privacy",title:"الخصوصية وبيانات الحساب",terms:"الخصوصية وبيانات الحساب إعدادات الخصوصية وطلبات البيانات",description:"إعدادات الخصوصية وطلبات البيانات",kindLabel:"مساحة شخصية"},
    {id:"submissions",title:"مساهماتي وطلباتي",terms:"مساهماتي وطلباتي متابعة المساهمات والطلبات الخاصة",description:"متابعة المساهمات والطلبات الخاصة",kindLabel:"مساحة شخصية"},
    {id:"family",title:"العائلة ووضع الأطفال",terms:"العائلة ووضع الأطفال إدارة العائلة وملفات الأطفال",description:"إدارة العائلة وملفات الأطفال",kindLabel:"مساحة شخصية"},
    {id:"settings",title:"إعدادات الحساب",terms:"إعدادات الحساب إعدادات الحساب والتخصيص",description:"إعدادات الحساب والتخصيص",kindLabel:"مساحة شخصية"},
    {id:"submit-material",title:"إرسال كتاب أو مادة للمراجعة",terms:"إرسال كتاب أو مادة للمراجعة إرسال الكتب والمواد الإسلامية للمراجعة",description:"إرسال الكتب والمواد الإسلامية للمراجعة",kindLabel:"مساحة شخصية"},
    {id:"studio",title:"انشر علمًا نافعًا",terms:"انشر علمًا نافعًا النشر وصناعة المحتوى الإسلامي",description:"النشر وصناعة المحتوى الإسلامي",kindLabel:"المنصة والسياسات"},
    {id:"about",title:"عن المنصة",terms:"عن المنصة عن المنصة الإسلامية ورسالتها",description:"عن المنصة الإسلامية ورسالتها",kindLabel:"المنصة والسياسات"},
    {id:"contact",title:"تواصل معنا",terms:"تواصل معنا التواصل والدعم والإبلاغ عن مشكلة",description:"التواصل والدعم والإبلاغ عن مشكلة",kindLabel:"المنصة والسياسات"},
    {id:"privacy-policy",title:"سياسة الخصوصية",terms:"سياسة الخصوصية توضح هذه الصفحة مبادئ جمع البيانات واستخدامها وحقوق المستخدم وطلبات التصدير والحذف.",description:"توضح هذه الصفحة مبادئ جمع البيانات واستخدامها وحقوق المستخدم وطلبات التصدير والحذف.",kindLabel:"المنصة والسياسات"},
    {id:"terms",title:"شروط الاستخدام",terms:"شروط الاستخدام تحدد شروط الاستخدام حدود إتاحة المحتوى والخدمات والحسابات والمشتريات والمساهمات.",description:"تحدد شروط الاستخدام حدود إتاحة المحتوى والخدمات والحسابات والمشتريات والمساهمات.",kindLabel:"المنصة والسياسات"},
    {id:"content-policy",title:"سياسة المحتوى والمراجعة",terms:"سياسة المحتوى والمراجعة تشرح معايير استقبال المواد الإسلامية ومراجعتها ونشرها وتصحيحها أو إيقافها.",description:"تشرح معايير استقبال المواد الإسلامية ومراجعتها ونشرها وتصحيحها أو إيقافها.",kindLabel:"المنصة والسياسات"},
    {id:"children-safety",title:"سلامة الأطفال",terms:"سلامة الأطفال توضح مبادئ وضع الأطفال وحماية بياناتهم وإدارة ملفاتهم بواسطة ولي الأمر.",description:"توضح مبادئ وضع الأطفال وحماية بياناتهم وإدارة ملفاتهم بواسطة ولي الأمر.",kindLabel:"المنصة والسياسات"},
    {id:"library-tafsir",title:"كتب التفسير",terms:"التفسير كتب المفسرين تفسير الطبري ابن كثير السعدي القرطبي",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"library-fiqh",title:"كتب الفقه",terms:"الفقه المذهب الحنفي المالكي الشافعي الحنبلي فقه العبادات",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"library-aqidah",title:"كتب العقيدة",terms:"العقيدة الإيمان التوحيد التزكية",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"library-authors",title:"المؤلفون",terms:"المؤلفون العلماء تراجم المصنفات",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"share-cards",title:"بطاقات المشاركة",terms:"تصميم آية حديث دعاء بطاقة مشاركة",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"fiqh-comparison",title:"مقارنة المذاهب",terms:"مقارنة المذاهب الأربعة",description:"تصفح المواد والصفحات المرتبطة بهذا القسم.",kindLabel:"المكتبة الإسلامية"},
    {id:"books",title:"الكتب الإسلامية",terms:"كتب إسلامية تفسير حديث فقه عقيدة قراءة كتاب مؤلف",description:"فهرس الكتب الإسلامية حسب المجال.",kindLabel:"المعرفة الإسلامية"},
    {id:'pricing',title:'الأسعار والاشتراكات',terms:'السعر الاشتراك مجاني Plus Family جنيه تجربة مجانية 30 يوم',description:'خطط العضوية المجانية وPlus وFamily.',kindLabel:'المنصة'},
    {id:'support',title:'مركز المساعدة والدعم',terms:'الدعم المساعدة بلاغ مشكلة اقتراح ميزة التواصل الناشرون',description:'مسارات المساعدة والبلاغات والتواصل.',kindLabel:'المنصة'},
    {id:'qiraat',title:'القراءات والروايات',terms:'قراءات القرآن القراءة الرواية الطريق ضبط المصحف',description:'مدخل إلى مراتب القراءة والرواية وضوابط نسخ المصحف.',kindLabel:'علوم القرآن'},
    {id:'shamail',title:'الشمائل النبوية',terms:'الشمائل صفات النبي اخلاق النبي هدي النبي كتب الشمائل',description:'أبواب الشمائل والهدي النبوي ومصادرها.',kindLabel:'السنة النبوية'},
  ];
  window.PLATFORM_SEARCH_INDEX = GLOBAL_SEARCH_INDEX;
  function normalizeSearch(value){return String(value||'').normalize('NFKC').toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();}
  window.runTopbarSearch = function(event){
    if(event)event.preventDefault();
    const input=document.getElementById('topbar-search-input');
    const results=document.getElementById('topbar-search-results');
    if(!input||!results)return;
    const q=normalizeSearch(input.value);
    if(!q){results.innerHTML='<span>اكتب كلمة أو عبارة للبحث.</span>';input.focus();return;}
    const words=q.split(/\s+/).filter(Boolean);
    const privateSearchIds=new Set(['profile','feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material']);
    const searchable=GLOBAL_SEARCH_INDEX.filter(item=>!privateSearchIds.has(item.id));
    const deduped=[...new Map(searchable.map(item=>[item.id+'|'+(item.query||''),item])).values()];
    const matches=deduped.map(item=>{const hay=normalizeSearch(item.title+' '+item.terms);let score=hay.includes(q)?5:0;words.forEach(w=>{if(w.length>1&&hay.includes(w))score++;});return {item,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8).map(x=>x.item);
    if(!matches.length){results.innerHTML='<span>لا توجد نتائج مطابقة. جرّب كلمة أخرى أو افتح أحد الأقسام الرئيسية.</span>';return;}
    results.innerHTML=matches.map((item,i)=>'<button type="button" data-global-search-index="'+i+'">'+item.title+'<small>فتح الصفحة</small></button>').join('');
    results.querySelectorAll('[data-global-search-index]').forEach(button=>button.addEventListener('click',()=>{
      const item=matches[Number(button.dataset.globalSearchIndex)];
      if(typeof window.toggleTopbarSearch==='function')window.toggleTopbarSearch(false);
      window.navigateToPage(item.id,item.query||'');
    }));
  };
  window.openSearchResults = function(query){const value=String(query||'').trim();navigate('search','q='+encodeURIComponent(value));};
  window.navigateToPage = navigate;
  window.showScreen = function(screenId){ navigate(screenId); };
  window.megaGo = function(screenId){ if(typeof window.closeMegaMenu==='function')window.closeMegaMenu(false); navigate(screenId); };

  // Carry content details to the corresponding independent detail page.
  window.openContentDetail = function(screenId, card, type){
    const titleEl=card && card.querySelector('h3,h2,.book-cover-title');
    const descEl=card && card.querySelector('p:not(.book-author),p');
    const catEl=card && card.querySelector('.archive-tag,.article-category-label');
    const authorEl=card && card.querySelector('.book-author,.book-cover-author');
    const payload={type:type||'',title:titleEl?titleEl.textContent.trim():'تفاصيل المحتوى',description:descEl?descEl.textContent.trim():'',category:catEl?catEl.textContent.trim():'',author:authorEl?authorEl.textContent.trim():'',slug:card&&card.dataset?card.dataset.articleSlug||'':''};
    try{sessionStorage.setItem('platform-detail-payload',JSON.stringify(payload));}catch(e){}
    if(type==='article' && payload.slug){window.navigateToPage('article-detail','slug='+encodeURIComponent(payload.slug));return;}
    navigate(screenId);
  };

  function setActiveNavigation(){
    document.querySelectorAll('.mega-nav-link').forEach(b=>b.classList.remove('is-active'));
    let active=document.querySelector('.mega-nav-link[data-screen="'+pageToScreen+'"]');
    if(!active){
      const parent = (['books','articles','article-detail','lexicon','lexicon-detail','pathways','bibliographies','fiqh-comparison','book-detail','book-reader','author-detail','pathway-detail','bibliography-detail','sirah','prophets','companions','islamic-history','afterlife','dreams','rulings','madhhab-hanafi','madhhab-maliki','madhhab-shafii','madhhab-hanbali','my-library','downloads','submissions'].includes(pageToScreen) || pageToScreen.startsWith('library'))?'library':
        (['hadith','hadith-qudsi','medicine','shamail'].includes(pageToScreen))?'hadith':
        (['quran','quran-sciences','tafsir','asbab-alnuzul','surah-virtues','quran-translations','word-of-day','qiraat','memorization','audio','share-cards'].includes(pageToScreen))?'quran':
        (['prayer','adhkar','duas','sunnahs','zakat','hajj','habits','calendar','imsakiyah','quiz','quiz-rooms','friends-challenges','guidance','pillars','names','name-detail','tools','requests','notifications','privacy','family','settings','quran-wird','khatma','submit-material'].includes(pageToScreen))?'tools':'home';
      active=document.querySelector('.mega-nav-link[data-screen="'+parent+'"]');
    }
    if(active)active.classList.add('is-active');
    const mobileSection=(pageToScreen.startsWith('library')||['books','articles','pathways','bibliographies','fiqh-comparison','book-detail','book-reader','author-detail','article-detail','lexicon','lexicon-detail','sirah','prophets','companions','islamic-history','afterlife','dreams','rulings','madhhab-hanafi','madhhab-maliki','madhhab-shafii','madhhab-hanbali','hadith','hadith-qudsi','shamail','medicine'].includes(pageToScreen))?'library':(['prayer','adhkar','duas','sunnahs','zakat','hajj','imsakiyah','calendar','quiz','quiz-rooms','friends-challenges','guidance','pillars','names','name-detail','tools','requests','habits','notifications','privacy','family','settings','quran-wird','khatma','submit-material'].includes(pageToScreen)?'tools':(['store'].includes(pageToScreen)?'store':(['quran','quran-sciences','tafsir','asbab-alnuzul','surah-virtues','quran-translations','word-of-day','qiraat','memorization','audio','share-cards'].includes(pageToScreen)?'quran':'home')));
    document.querySelectorAll('.mobile-bottom-nav button').forEach(b=>b.classList.toggle('is-active',b.dataset.screen===mobileSection));
  }
  function applyDetailPayload(){
    let payload=null;try{payload=JSON.parse(sessionStorage.getItem('platform-detail-payload')||'null');}catch(e){}
    if(!payload)return;
    const map={
      'book-detail':[['detail-book-title','detail-book-cover-title','detail-book-hero-title'], 'detail-book-description','detail-book-category','detail-book-cover-author'],
      'author-detail':[['detail-author-title','detail-author-hero-title'],'detail-author-description',null,null],
      'pathway-detail':[['detail-pathway-title','detail-pathway-hero-title'],'detail-pathway-description',null,null],
      'bibliography-detail':[['detail-bibliography-title','detail-bibliography-hero-title'],'detail-bibliography-description',null,null]
    };
    const cfg=map[pageToScreen];if(!cfg)return;
    (cfg[0]||[]).forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=payload.title||e.textContent;});
    if(cfg[1]){const e=document.getElementById(cfg[1]);if(e)e.textContent=payload.description||e.textContent;}
    if(cfg[2]){const e=document.getElementById(cfg[2]);if(e)e.textContent=payload.category||e.textContent;}
    if(cfg[3]){const e=document.getElementById(cfg[3]);if(e)e.textContent=payload.author||e.textContent;}
  }
  function guardPrivatePages(){
    if(!['profile','feed','memorization','habits','notifications','downloads','my-library','privacy','submissions','family','settings','quran-wird','khatma','submit-material'].includes(pageToScreen))return;
    let active=false;try{active=sessionStorage.getItem('platform-demo-account')==='active';}catch(e){}
    if(!active && typeof window.openAccountGate==='function')window.openAccountGate(pageToScreen);
  }
  document.addEventListener('DOMContentLoaded',function(){setActiveNavigation();applyDetailPayload();guardPrivatePages();if(pageToScreen==='hadith'&&new URLSearchParams(location.search).get('type')==='qudsi'){const t=document.getElementById('hadith-type-filter');if(t){t.value='qudsi';window.filterHadithResults?.();}}});
  if(document.readyState!=='loading'){setActiveNavigation();applyDetailPayload();guardPrivatePages();}
})();
