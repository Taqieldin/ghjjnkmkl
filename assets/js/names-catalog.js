(function () {
  'use strict';
  const names = [
    {key:'rahman',name:'الرَّحْمَٰنُ',short:'الرحمن',group:'mercy',groupLabel:'الرحمة',root:'ر ح م',brief:'واسع الرحمة، ورحمته سبحانه عظيمة شاملة.',verse:'الرَّحْمَٰنُ',surah:'الرحمن',ayah:'١',reference:'سورة الرحمن · الآية ١',meaning:'يدل الاسم على سعة رحمة الله تعالى وعظمتها. ويُفهم على الوجه اللائق بجلال الله وكماله، من غير تشبيه برحمة المخلوقين.',reflection:'يستحضر المؤمن سعة رحمة ربه، فيرجو فضله ولا يقنط من رحمته، ويجعل الرحمة خُلُقًا في تعامله مع الناس.',contemplation:'افتتحت سورة الرحمن بهذا الاسم، ثم تتابعت فيها آيات النعم والآلاء؛ فتأمل كيف يربط السياق بين معرفة الرب وشكر نعمه.',related:['rahim','salam']},
    {key:'rahim',name:'الرَّحِيمُ',short:'الرحيم',group:'mercy',groupLabel:'الرحمة',root:'ر ح م',brief:'يدل على رحمة الله بعباده وإحسانه إليهم.',verse:'وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا',surah:'الأحزاب',ayah:'٤٣',reference:'سورة الأحزاب · الآية ٤٣',meaning:'اسم يدل على رحمة الله بعباده. وقد وصف الله نفسه به في سياق إخراج المؤمنين من الظلمات إلى النور وذكر صلاته وملائكته عليهم.',reflection:'يدعو الإيمان بهذا الاسم إلى حسن الرجاء بالله، وشكره على إحسانه، والرفق بالخلق من غير تفريط في الحق.',contemplation:'تأمل ورود الاسم في ختام آية تتحدث عن الهداية والنور؛ فالرحمة من أعظم ما يظهر أثره في هداية العبد.',related:['rahman','salam']},
    {key:'malik',name:'الْمَلِكُ',short:'الملك',group:'majesty',groupLabel:'الملك والعزة',root:'م ل ك',brief:'له الملك المطلق، والأمر والتدبير كله سبحانه.',verse:'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'يدل الاسم على كمال ملك الله تعالى، وأن ملكه شامل لا يحدّه عجز ولا يشاركه فيه أحد، وله الأمر والتدبير.',reflection:'يعلّم هذا الاسم العبد أن يتوكل على الله، وألا يغتر بما في يده من مال أو سلطان، وأن يستعمل ما اؤتمن عليه بالعدل.',contemplation:'تأمل اقتران اسم الملك في الآية بأسماء الكمال بعدها؛ فالملك الحق مقرون بالتنزه عن النقص وبالعزة والحكمة.',related:['quddus','aziz','hakim']},
    {key:'quddus',name:'الْقُدُّوسُ',short:'القدوس',group:'majesty',groupLabel:'الملك والعزة',root:'ق د س',brief:'المنزَّه عن كل نقص وعيب، المتصف بالكمال.',verse:'الْمَلِكُ الْقُدُّوسُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'يدل الاسم على تنزّه الله سبحانه عن كل نقص وعيب، وعلى كماله في أسمائه وصفاته وأفعاله.',reflection:'يعظم في قلب المؤمن تنزيه الله، فينزهه عن الظنون الباطلة، ويعبده على علم وتعظيم.',contemplation:'جاء الاسم بعد «الملك» في الآية؛ فتأمل اجتماع كمال الملك مع التنزه المطلق عن النقائص.',related:['malik','salam']},
    {key:'salam',name:'السَّلَامُ',short:'السلام',group:'majesty',groupLabel:'الملك والعزة',root:'س ل م',brief:'السالم من كل نقص، ومنه السلامة لعباده.',verse:'الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'من معاني الاسم أن الله سبحانه سالم من كل نقص وآفة، وهو الكامل في ذاته وصفاته، ومنه تطلب السلامة.',reflection:'يطلب المؤمن السلامة من ربه، ويحرص على أن يكون مصدر أمن وسلام لمن حوله، من غير اعتداء أو ظلم.',contemplation:'تأمل مجيء اسم السلام بعد القدوس؛ فكلاهما يقرر كمال الله وتنزهه عن العيوب.',related:['quddus','mumin','rahim']},
    {key:'mumin',name:'الْمُؤْمِنُ',short:'المؤمن',group:'majesty',groupLabel:'الملك والعزة',root:'أ م ن',brief:'اسم ورد في سياق الثناء على الله وأسمائه العظيمة.',verse:'السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'ورد الاسم في سياق تعداد أسماء الله الحسنى في سورة الحشر. وتُشرح دلالته في كتب التفسير والأسماء من جهات التصديق والأمن، مع مراعاة تحرير المعنى من مصادره.',reflection:'يرتبط الإيمان بهذا الاسم بالطمأنينة إلى صدق وعد الله، والرجوع إلى الوحي، وطلب الأمن والهداية منه سبحانه.',contemplation:'اقرأ الاسم ضمن سياق الآية كاملًا؛ فالسياق يجمع بين السلامة والإيمان والهيمنة والعزة.',related:['salam','muhaymin']},
    {key:'muhaymin',name:'الْمُهَيْمِنُ',short:'المهيمن',group:'majesty',groupLabel:'الملك والعزة',root:'ه ي م ن',brief:'اسم يدل على كمال إحاطة الله ورقابته وحفظه.',verse:'الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'يُذكر الاسم في الشروح بمعاني الرعاية والرقابة والحفظ والشهادة، وتفصيل دلالاته يرجع فيه إلى كتب التفسير وشروح الأسماء.',reflection:'يستحضر العبد أن الله مطلع عليه، فيحسن عمله في السر والعلن، ويطمئن إلى حفظ الله وتدبيره.',contemplation:'تأمل موقع الاسم بين المؤمن والعزيز في الآية، واقرأه ضمن نسق الأسماء لا بمعزل عن سياقه.',related:['mumin','aziz']},
    {key:'aziz',name:'الْعَزِيزُ',short:'العزيز',group:'majesty',groupLabel:'الملك والعزة',root:'ع ز ز',brief:'الغالب الذي لا يُغلب، وله كمال العزة والقوة.',verse:'الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'يدل الاسم على كمال عزة الله وقوته وغلبته، وأنه سبحانه لا يُعجزه شيء ولا يمتنع عليه أمر.',reflection:'يعتمد المؤمن على ربه، ويطلب العزة في طاعته، ولا يجعل قوته أو مكانته سببًا للكبر أو ظلم الآخرين.',contemplation:'اقترن الاسم في الآية بالمهيمن والجبار؛ فتأمل كمال القدرة مع الإحاطة والتدبير.',related:['muhaymin','jabbar','hakim']},
    {key:'jabbar',name:'الْجَبَّارُ',short:'الجبار',group:'majesty',groupLabel:'الملك والعزة',root:'ج ب ر',brief:'اسم من أسماء العظمة والقهر والكمال الإلهي.',verse:'الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'اسم من أسماء الله العظيمة، ويُحرر معناه في كتب التفسير وشروح الأسماء في ضوء اقترانه بالعزيز والمتكبر، وما يليق بالله من صفات الكمال.',reflection:'يوقن المؤمن أن الخلق لا يخرجون عن سلطان الله، فيلجأ إليه عند الضعف، ولا يتعالى على أحد من عباده.',contemplation:'اقرأ الاسم مع ما قبله وما بعده في الآية؛ فالسياق سياق تعظيم وثناء وتنزيه.',related:['aziz','mutakabbir']},
    {key:'mutakabbir',name:'الْمُتَكَبِّرُ',short:'المتكبر',group:'majesty',groupLabel:'الملك والعزة',root:'ك ب ر',brief:'المتعالي عن كل سوء ونقص، وله الكبرياء والعظمة.',verse:'الْجَبَّارُ الْمُتَكَبِّرُ',surah:'الحشر',ayah:'٢٣',reference:'سورة الحشر · الآية ٢٣',meaning:'يدل الاسم على عظمة الله وكبريائه وتنزهه عن النقائص. والكبرياء والعظمة على وجه الكمال حق لله سبحانه.',reflection:'يعرف العبد قدر نفسه، فيتواضع للحق ولا يتكبر على الخلق، ويعظم ربه الذي له الكبرياء.',contemplation:'ختمت مجموعة الأسماء في الآية بهذا الاسم؛ ثم جاء التنزيه في ختامها: «سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ».',related:['jabbar','aziz']},
    {key:'khaliq',name:'الْخَالِقُ',short:'الخالق',group:'creation',groupLabel:'الخلق والحكمة',root:'خ ل ق',brief:'الذي خلق المخلوقات وأوجدها بتقدير وحكمة.',verse:'هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ',surah:'الحشر',ayah:'٢٤',reference:'سورة الحشر · الآية ٢٤',meaning:'يدل الاسم على أن الله سبحانه خالق كل شيء، أوجد الخلق وقدّرهم بعلمه وحكمته، ولا خالق على الحقيقة سواه.',reflection:'يدعو الإيمان بهذا الاسم إلى شكر نعمة الإيجاد، والتواضع، والتفكر في خلق الله وآياته.',contemplation:'تأمل تعاقب الخالق والبارئ والمصور في الآية، وكيف يوجه السياق النظر إلى آثار الخلق والتقدير والتصوير.',related:['bari','musawwir','hakim']},
    {key:'bari',name:'الْبَارِئُ',short:'البارئ',group:'creation',groupLabel:'الخلق والحكمة',root:'ب ر أ',brief:'الذي برأ خلقه وأوجدهم على ما شاء سبحانه.',verse:'الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ',surah:'الحشر',ayah:'٢٤',reference:'سورة الحشر · الآية ٢٤',meaning:'اسم يدل على برء الخلق وإيجادهم، وهو وارد مع الخالق والمصور في آية واحدة من سورة الحشر.',reflection:'يعيد الاسم إلى القلب معنى الافتقار إلى الله، وأن وجود الإنسان وتكوينه ليسا مستقلين عن خالقه.',contemplation:'تأمل اقتران الاسم بالخالق والمصور، وارجع إلى كتب اللغة والتفسير لفهم الفروق الدقيقة بين هذه الأسماء.',related:['khaliq','musawwir']},
    {key:'musawwir',name:'الْمُصَوِّرُ',short:'المصور',group:'creation',groupLabel:'الخلق والحكمة',root:'ص و ر',brief:'الذي أعطى كل مخلوق صورته وهيئته كما شاء.',verse:'الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ',surah:'الحشر',ayah:'٢٤',reference:'سورة الحشر · الآية ٢٤',meaning:'يدل الاسم على أن الله سبحانه يصور المخلوقات ويمنحها هيئاتها وصورها، على وفق علمه ومشيئته وحكمته.',reflection:'يدعو الاسم إلى شكر الخالق على نعمة الخِلقة، واحترام اختلاف صور الناس وأحوالهم، وترك السخرية والتنقص.',contemplation:'انظر إلى تنوع الخلق وتباين الصور، ثم تذكر أن الآية تختم بذكر الأسماء الحسنى والتسبيح.',related:['khaliq','bari']},
    {key:'hakim',name:'الْحَكِيمُ',short:'الحكيم',group:'creation',groupLabel:'الخلق والحكمة',root:'ح ك م',brief:'ذو الحكمة البالغة، الذي يضع الأمور مواضعها.',verse:'وَهُوَ الْعَزِيزُ الْحَكِيمُ',surah:'الحشر',ayah:'٢٤',reference:'سورة الحشر · الآية ٢٤',meaning:'يدل الاسم على كمال حكمة الله سبحانه في خلقه وأمره وتدبيره، وأن أفعاله لا تكون عبثًا ولا عن عجز أو جهل.',reflection:'يأخذ المؤمن بالأسباب، ويحسن الظن بحكمة الله، ويطلب العلم قبل الحكم على ما يجهل.',contemplation:'جاء الاسم في ختام آية أسماء الله الحسنى؛ فاجمع بين العزة والحكمة عند تدبر تدبير الله وأمره.',related:['aziz','khaliq','malik']}
  ];

  const byKey = Object.fromEntries(names.map((item) => [item.key, item]));
  let activeGroup = 'all';
  const digits = '٠١٢٣٤٥٦٧٨٩';
  function toArabicDigits(value) { return String(value).replace(/\d/g, d => digits[Number(d)]); }
  function normalize(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('ar')
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/\s+/g, ' ').trim();
  }
  function cardMarkup(item, index) {
    return `<button type="button" class="name-card name-catalog-card" data-name-key="${item.key}" data-name-group="${item.group}" data-name-search="${normalize(item.name + ' ' + item.short + ' ' + item.groupLabel + ' ' + item.brief + ' ' + item.root)}" onclick="showNameDetail('${item.key}')" aria-label="قراءة شرح اسم الله ${item.short}">
      <span class="name-card-top"><span class="name-card-index">${toArabicDigits(index + 1)}</span><span class="name-card-group">${item.groupLabel}</span></span>
      <span class="name-card-arabic font-quran">${item.name}</span>
      <span class="name-card-brief">${item.brief}</span>
      <span class="name-card-bottom"><span>${item.reference}</span><strong>اقرأ شرح الاسم <span aria-hidden="true">←</span></strong></span>
    </button>`;
  }
  function renderDirectory() {
    const grid = document.getElementById('names-grid');
    if (!grid) return;
    grid.innerHTML = names.map(cardMarkup).join('');
    const count = document.getElementById('names-count');
    if (count) count.textContent = toArabicDigits(names.length);
    applyFilters();
  }
  function applyFilters() {
    const grid = document.getElementById('names-grid');
    if (!grid) return;
    const query = normalize(document.getElementById('names-search')?.value || '');
    const cards = Array.from(grid.querySelectorAll('.name-catalog-card'));
    let visible = 0;
    cards.forEach((card) => {
      const groupMatch = activeGroup === 'all' || card.dataset.nameGroup === activeGroup;
      const queryMatch = !query || normalize(card.dataset.nameSearch + ' ' + card.textContent).includes(query);
      const show = groupMatch && queryMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    const label = document.getElementById('names-result-count');
    if (label) label.textContent = toArabicDigits(visible) + (visible === 1 ? ' اسم' : ' أسماء');
    const empty = document.getElementById('names-empty-state');
    if (empty) empty.hidden = visible !== 0;
  }
  window.filterNames = function () { applyFilters(); };
  window.filterNameGroup = function (group, button) {
    activeGroup = ['all', 'mercy', 'majesty', 'creation'].includes(group) ? group : 'all';
    document.querySelectorAll('[data-name-filter]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    applyFilters();
  };
  window.showNameDetail = function (key) {
    const item = byKey[key] || byKey.rahman;
    if (typeof window.navigateToPage === 'function') {
      window.navigateToPage('name-detail', 'name=' + encodeURIComponent(item.key));
    } else {
      window.location.href = 'name-detail.html?name=' + encodeURIComponent(item.key);
    }
  };
  function text(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }
  function renderDetail() {
    const host = document.getElementById('screen-name-detail');
    if (!host) return;
    const requested = new URLSearchParams(window.location.search).get('name') || 'rahman';
    const item = byKey[requested] || byKey.rahman;
    const index = names.findIndex(entry => entry.key === item.key);
    document.title = item.short + ' | أسماء الله الحسنى | المنصة الإسلامية';
    text('name-detail-title', item.name);
    text('name-detail-emblem-text', item.name);
    text('name-detail-side-title', item.name);
    text('name-detail-summary', item.brief);
    text('name-detail-group', item.groupLabel);
    text('name-detail-index', 'المدخل ' + toArabicDigits(index + 1) + ' من ' + toArabicDigits(names.length));
    text('name-detail-verse', '﴿ ' + item.verse + ' ﴾');
    text('name-detail-reference', item.reference);
    text('name-detail-meaning', item.meaning);
    text('name-detail-reflection', item.reflection);
    text('name-detail-contemplation', item.contemplation);
    text('name-detail-side-group', item.groupLabel);
    text('name-detail-root', item.root);
    text('name-detail-side-reference', item.surah + ': ' + item.ayah);
    const related = document.getElementById('name-detail-related');
    if (related) {
      related.innerHTML = item.related.map(key => byKey[key]).filter(Boolean).map(entry => `<button type="button" onclick="showNameDetail('${entry.key}')"><span>${entry.name}</span><small>${entry.groupLabel}</small><b aria-hidden="true">←</b></button>`).join('');
    }
  }
  function init() {
    renderDirectory();
    renderDetail();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
