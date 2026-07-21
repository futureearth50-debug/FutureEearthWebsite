// =============================================================================
// Future Earth Energy Systems — Content dictionary (EN + AR)
// Single source of truth: public/content/english.md + public/content/arabic.md
// Copy is transcribed verbatim from those files. Do not paraphrase.
// =============================================================================

export type Locale = "en" | "ar";

// -----------------------------------------------------------------------------
// Navigation + brand + contact identity
// -----------------------------------------------------------------------------

export const nav = {
  en: [
    { to: "/en", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/solar-solutions", label: "Solar Solutions" },
    { to: "/products", label: "Products" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact Us" },
  ],
  ar: [
    { to: "/ar", label: "الرئيسية" },
    { to: "/ar/about", label: "من نحن" },
    { to: "/ar/solar-solutions", label: "حلول الطاقة الشمسية" },
    { to: "/ar/products", label: "المنتجات" },
    { to: "/ar/services", label: "الخدمات" },
    { to: "/ar/contact", label: "تواصل معنا" },
  ],
};

export const brand = {
  en: { name: "Future Earth", tag: "Energy Systems" },
  ar: { name: "فيوتشر إيرث", tag: "لأنظمة الطاقة" },
};

export const contactInfo = {
  address: {
    en: "Office 40 View Square, Abi Bakr As Siddiq Road, Al Yasmeen, Riyadh 13326, Kingdom of Saudi Arabia",
    ar: "مكتب 40، فيو سكوير، طريق أبي بكر الصديق، الياسمين، الرياض 13326، المملكة العربية السعودية",
  },
  phone: "+966118108828",
  phoneDisplay: "+966 11 810 8828",
  email: "contact@fe-ksa.com",
  whatsapp: "966118108828",
  hours: {
    en: "Sunday to Thursday · 09:00 AM to 05:00 PM · Friday and Saturday Closed",
    ar: "من الأحد إلى الخميس · 09:00 صباحاً حتى 05:00 مساءً · الجمعة والسبت مغلق",
  },
  mapsQuery: "View Square, Abi Bakr As Siddiq Road, Al Yasmeen, Riyadh 13326, Saudi Arabia",
};

// Shared labels used around the site
export const ui = {
  en: {
    getConsultation: "Request Technical Consultation",
    trustedBy: "Trusted by",
    scroll: "Scroll",
    switch: "العربية",
    switchTo: "/ar",
    clientsTitle: "Clients & References",
    partnersTitle: "Technology Partners & Suppliers",
    logosLead:
      "A verified network of enterprise clients, government entities and Tier-1 global manufacturers.",
  },
  ar: {
    getConsultation: "طلب استشارة فنية",
    trustedBy: "موثوقون من",
    scroll: "مرّر",
    switch: "English",
    switchTo: "/en",
    clientsTitle: "العملاء والمشاريع المرجعية",
    partnersTitle: "الشركاء التقنيون والموردون",
    logosLead:
      "شبكة موثوقة من العملاء المؤسسيين والجهات الحكومية والمصنّعين العالميين من الفئة الأولى.",
  },
};

// -----------------------------------------------------------------------------
// HOME
// -----------------------------------------------------------------------------

export const home = {
  en: {
    eyebrow: "Certified EPC Contractor · Kingdom of Saudi Arabia",
    heroTitle:
      "Turnkey Solar Infrastructure and Advanced Energy Storage Systems Across Saudi Arabia",
    heroSub:
      "Future Earth is a certified contractor engineering utility scale solar networks and industrial lithium battery storage compliant with Ministry of Energy and SEC regulations. Backed by over 100 Megawatts of verified regional execution we manage the complete project lifecycle from technical energy analysis to grid interconnection for major factories commercial complexes and developments.",
    ctaPrimary: "Request Technical Consultation",
    ctaSecondary: "View Our Mega Projects",
    heroStats: [
      { value: 100, suffix: "+", unit: "MW", label: "Verified Regional Execution" },
      { value: 2, suffix: "", unit: "MW", label: "Ministry of Energy Qualification" },
      { value: 280, suffix: "+", unit: "", label: "Delivered Energy Projects" },
    ],

    sectorsEyebrow: "Engineering Sectors",
    sectorsTitle: "Five engineering sectors. One certified contractor.",
    sectors: [
      "Commercial and Industrial Rooftop Solar",
      "Ground Mounted Solar Fields",
      "Hybrid Solutions and Microgrids",
      "Lithium Battery Energy Storage",
      "Energy Infrastructure Financing Models",
    ],

    trackEyebrow: "Verified Track Record",
    trackTitle: "Utility Scale Solar Infrastructure Deployed Across the GCC",
    trackLeadValue: 100,
    trackLeadLabel: "Total Megawatts Deployed",
    trackLeadBody:
      "Over 100 Megawatts of verified solar networks executing seamless grid connection globally and regionally.",
    projects: [
      {
        capacity: "1.7 MW",
        kwp: "1702 kWp",
        title: "The Village Mall — Jeddah",
        kicker: "Mega Project",
        body: "Engineering supply and full commissioning of a 1702 kWp rooftop solar infrastructure.",
      },
      {
        capacity: "1.3 MW",
        kwp: "1358 kWp",
        title: "Al Munajem Foods — Riyadh",
        kicker: "Industrial Project",
        body: "Complete execution of a 1358 kWp rooftop solar network for industrial cold storage.",
      },
      {
        capacity: "262 kWp",
        kwp: "262 kWp",
        title: "DEWA & Alfanar — Dubai",
        kicker: "Regional Substation Interconnection",
        body: "Delivering a 262 kWp engineered solar integration for the Dubai Shamal Substation.",
      },
    ],
    trackCta: "Request Your Facility Survey",

    valueEyebrow: "Strategic Value & Certifications",
    valueTitle: "Engineered for High Yield Operational and Financial Return",
    features: [
      {
        t: "Maximized Financial ROI",
        d: "Engineered setups delivering up to 6 times the initial capital investment with a 30 year operational lifespan.",
        metric: "6×",
        metricLabel: "Return on capital · 30-year lifespan",
      },
      {
        t: "Ministry of Energy Certified",
        d: "Fully qualified by the Saudi Ministry of Energy contractor committee for solar photovoltaic networks up to 2 Megawatts.",
        metric: "2 MW",
        metricLabel: "Certified PV network qualification",
      },
      {
        t: "Tier 1 Regulatory Compliance",
        d: "Backed by triple ISO certifications ISO 9001 Quality ISO 45001 Safety ISO 14001 Environment and certified SEC installers.",
        metric: "ISO ×3",
        metricLabel: "9001 · 45001 · 14001 + SEC",
      },
      {
        t: "Full Lifecycle Ownership",
        d: "Total control over engineering workflow and direct procurement management from global factories to local site deployment.",
        metric: "EPC",
        metricLabel: "Engineering to site deployment",
      },
    ],

    ribbonTitle: "Transition Your Facility to Renewable Infrastructure Today",
    ribbonSub:
      "Initiate a comprehensive energy consumption analysis and engineering survey with our certified team to optimize operational expenditures",
    ribbonCta: "Request Customized Energy Analysis",
  },
  ar: {
    eyebrow: "مقاول EPC معتمد · المملكة العربية السعودية",
    heroTitle:
      "بنية تحتية متكاملة للطاقة الشمسية وأنظمة متطورة لتخزين الطاقة في جميع أنحاء المملكة العربية السعودية",
    heroSub:
      "فيوتشر إيرث هي مقاول معتمد يتولى هندسة شبكات الطاقة الشمسية للمشاريع الكبرى وأنظمة تخزين الطاقة الصناعية ببطاريات الليثيوم، بالتوافق التام مع لوائح وزارة الطاقة والشركة السعودية للكهرباء. بالاستناد إلى سجل إنجازات إقليمي موثق يتجاوز 100 ميجاواط، ندير الدورة الكاملة لحياة المشاريع بدءاً من التحليل الفني للطاقة ووصولاً إلى ربط الشبكة للمصانع الكبرى، المجمعات التجارية، والمشاريع التطويرية.",
    ctaPrimary: "طلب استشارة فنية",
    ctaSecondary: "استعراض مشاريعنا الكبرى",
    heroStats: [
      { value: 100, suffix: "+", unit: "ميجاواط", label: "سجل إنجازات إقليمي موثق" },
      { value: 2, suffix: "", unit: "ميجاواط", label: "تأهيل وزارة الطاقة" },
      { value: 280, suffix: "+", unit: "", label: "مشروع طاقة منجز" },
    ],

    sectorsEyebrow: "القطاعات الهندسية",
    sectorsTitle: "خمسة قطاعات هندسية. مقاول معتمد واحد.",
    sectors: [
      "الطاقة الشمسية لأسطح المباني التجارية والصناعية",
      "المحطات الأرضية للطاقة الشمسية",
      "الأنظمة الهجينة والشبكات الذكية",
      "تخزين الطاقة ببطاريات الليثيوم",
      "نماذج تمويل البنية التحتية للطاقة",
    ],

    trackEyebrow: "سجل إنجازات موثق",
    trackTitle:
      "بنية تحتية للطاقة الشمسية بمقاييس المرافق الخدمية منشورة في دول مجلس التعاون الخليجي",
    trackLeadValue: 100,
    trackLeadLabel: "إجمالي الميجاواط المنفذة",
    trackLeadBody:
      "أكثر من 100 ميجاواط من شبكات الطاقة الشمسية الموثقة التي تنفذ ربطاً سلساً بالشبكة عالمياً وإقليمياً.",
    projects: [
      {
        capacity: "1.7 ميجاواط",
        kwp: "1702 كيلوواط ذروة",
        title: "ذا فيلج مول — جدة",
        kicker: "مشروع عملاق",
        body: "التوريد الهندسي والتشغيل الكامل لبنية تحتية للطاقة الشمسية فوق الأسطح بقدرة 1702 كيلوواط ذروة.",
      },
      {
        capacity: "1.3 ميجاواط",
        kwp: "1358 كيلوواط ذروة",
        title: "المنجم للأغذية — الرياض",
        kicker: "مشروع صناعي",
        body: "التنفيذ الكامل لشبكة طاقة شمسية فوق الأسطح بقدرة 1358 كيلوواط ذروة مخصصة للتبريد الصناعي.",
      },
      {
        capacity: "262 كيلوواط",
        kwp: "262 كيلوواط ذروة",
        title: "ديوا والفنار — دبي",
        kicker: "ربط المحطات الفرعية الإقليمية",
        body: "تقديم تكامل هندسي للطاقة الشمسية بقدرة 262 كيلوواط ذروة لمحطة شمال دبي الفرعية.",
      },
    ],
    trackCta: "طلب معاينة فنية للمنشأة",

    valueEyebrow: "القيمة الاستراتيجية والاعتمادات",
    valueTitle: "هندسة مصممة لتحقيق أعلى العوائد التشغيلية والمالية",
    features: [
      {
        t: "تعظيم العائد الاستثماري المالي",
        d: "أنظمة هندسية توفر عوائد تصل إلى 6 أضعاف رأس المال الأولي مع عمر تشغيلي يمتد لـ 30 عاماً.",
        metric: "6×",
        metricLabel: "عائد على رأس المال · عمر 30 عاماً",
      },
      {
        t: "اعتماد وزارة الطاقة",
        d: "مؤهلون بالكامل من قِبل لجنة تأهيل مطوري ومقاولي أنظمة الطاقة الشمسية الكهروضوئية بوزارة الطاقة السعودية للشبكات حتى 2 ميجاواط.",
        metric: "2 ميجاواط",
        metricLabel: "تأهيل معتمد لشبكات الطاقة الكهروضوئية",
      },
      {
        t: "الامتثال التنظيمي من الفئة الأولى",
        d: "مدعومون بثلاث شهادات آيزو عالمية (ISO 9001 للجودة، ISO 45001 للسلامة، ISO 14001 للبيئة) ومثبتون معتمدون من الشركة السعودية للكهرباء.",
        metric: "ISO ×3",
        metricLabel: "9001 · 45001 · 14001 + الكهرباء",
      },
      {
        t: "ملكية كاملة لدورة حياة المشروع",
        d: "تحكم شامل في تدفق العمل الهندسي وإدارة المشتريات المباشرة من المصانع العالمية إلى التنفيذ على أرض الموقع.",
        metric: "EPC",
        metricLabel: "من الهندسة إلى التنفيذ الموقعي",
      },
    ],

    ribbonTitle: "انقل منشأتك إلى البنية التحتية المتجددة اليوم",
    ribbonSub:
      "ابدأ تحليلاً شاملاً لاستهلاك الطاقة ومعاينة هندسية مع فريقنا المعتمد لتحسين النفقات التشغيلية",
    ribbonCta: "طلب تحليل مخصص",
  },
};

// -----------------------------------------------------------------------------
// HOME — additional landing sections (Solutions · Products · Services · CTA)
// Section-level copy only; product/solution card data is reused from the
// `products` and `solar` dictionaries below so there is a single source of truth.
// -----------------------------------------------------------------------------

export const homeSections = {
  en: {
    solar: {
      eyebrow: "Solar Energy Solutions",
      title: "Solar Solutions Engineered for Every Site",
      lead: "From commercial rooftops to open desert land and intelligent hybrid microgrids — explore the infrastructure we design, build and connect across the Kingdom.",
      explore: "Explore Solution",
      viewAll: "View All Solutions",
    },
    products: {
      eyebrow: "Featured Products",
      title: "Commercial and Industrial Energy Storage",
      lead: "From all-in-one cabinets to stackable modules and fully hybrid architectures — the SAV lithium systems Future Earth engineers and deploys across the Kingdom.",
      learnMore: "Learn More",
      viewAll: "View All Products",
    },
    services: {
      eyebrow: "Our Services",
      title: "Full-Lifecycle Engineering Services",
      lead: "From the first structural survey to decades of monitored operation, Future Earth governs every stage of your energy asset.",
      viewAll: "Explore All Services",
      items: [
        {
          t: "Installation",
          d: "Turnkey EPC installation from structural survey to grid interconnection, delivered by certified crews.",
        },
        {
          t: "Maintenance",
          d: "Scheduled preventative maintenance, professional cleaning cycles and electrical testing to sustain peak yield.",
        },
        {
          t: "Consultation",
          d: "Technical energy consultation and facility assessment to size the right system for your load profile.",
        },
        {
          t: "System Design",
          d: "Precise system modeling with load and wind analysis, and engineered documentation for safe long-term deployment.",
        },
        {
          t: "Monitoring",
          d: "24/7 smart monitoring of every panel and inverter in real time to prevent sudden performance drops.",
        },
        {
          t: "Technical Support",
          d: "Rapid certified field response and warranty management keeping your assets compliant for up to 25 years.",
        },
      ],
    },
    contactCta: {
      eyebrow: "Let's Begin",
      title: "Ready to Start Your Solar Journey?",
      sub: "Connect with our engineering team for a free facility assessment and a proposal tailored to your operation.",
      contact: "Contact Us",
      consult: "Request a Free Consultation",
    },
  },
  ar: {
    solar: {
      eyebrow: "حلول الطاقة الشمسية",
      title: "حلول شمسية مصممة هندسياً لكل موقع",
      lead: "من الأسطح التجارية إلى الأراضي الصحراوية المفتوحة والشبكات الهجينة الذكية — استكشف البنية التحتية التي نصممها وننفذها ونربطها في مختلف أنحاء المملكة.",
      explore: "استكشف الحل",
      viewAll: "استعراض جميع الحلول",
    },
    products: {
      eyebrow: "منتجات مختارة",
      title: "تخزين الطاقة للقطاعين التجاري والصناعي",
      lead: "من الكبائن المتكاملة إلى الوحدات القابلة للتكديس والأنظمة الهجينة بالكامل — أنظمة الليثيوم من SAV التي تهندسها فيوتشر إيرث وتنشرها في مختلف أنحاء المملكة.",
      learnMore: "اعرف المزيد",
      viewAll: "استعراض جميع المنتجات",
    },
    services: {
      eyebrow: "خدماتنا",
      title: "خدمات هندسية لدورة الحياة الكاملة",
      lead: "من أول معاينة إنشائية وحتى عقود من التشغيل المراقَب، تدير فيوتشر إيرث كل مرحلة من مراحل أصل الطاقة الخاص بك.",
      viewAll: "استكشف جميع الخدمات",
      items: [
        {
          t: "التركيب",
          d: "تركيب متكامل بنظام EPC من المعاينة الإنشائية حتى ربط الشبكة، ينفذه فريق معتمد.",
        },
        {
          t: "الصيانة",
          d: "صيانة وقائية مجدولة ودورات تنظيف احترافية واختبارات كهربائية للحفاظ على أعلى إنتاجية.",
        },
        {
          t: "الاستشارات",
          d: "استشارة فنية للطاقة ومعاينة للمنشأة لتحديد النظام الأمثل وفق نمط استهلاكك.",
        },
        {
          t: "تصميم الأنظمة",
          d: "نمذجة دقيقة للأنظمة وتحليل الأحمال والرياح ووثائق هندسية معتمدة للنشر الآمن طويل الأمد.",
        },
        {
          t: "المراقبة",
          d: "مراقبة ذكية على مدار الساعة لكل لوح وعاكس في الوقت الفعلي لمنع أي انخفاض مفاجئ في الأداء.",
        },
        {
          t: "الدعم الفني",
          d: "استجابة ميدانية سريعة معتمدة وإدارة الضمانات للحفاظ على أصولك ممتثلة حتى 25 عاماً.",
        },
      ],
    },
    contactCta: {
      eyebrow: "لنبدأ",
      title: "هل أنت مستعد لبدء رحلتك نحو الطاقة المتجددة؟",
      sub: "تواصل مع فريقنا الهندسي للحصول على معاينة مجانية للمنشأة وعرض مخصص لعملياتك.",
      contact: "تواصل معنا",
      consult: "اطلب استشارة مجانية",
    },
  },
};

// -----------------------------------------------------------------------------
// ABOUT
// -----------------------------------------------------------------------------

export const about = {
  en: {
    eyebrow: "About Us",
    title: "Solar Energy Aligned with Saudi Vision 2030",
    executiveStatement:
      "Our Kingdom has an abundance of sunshine and our primary objective is to deliver advanced solar energy networks that make strong financial sense for enterprise operations the environment and the future. Producing energy from the sun is now highly cost effective delivering immediate predictable utilities savings to commercial and industrial users with short investment payback periods. As the cost of traditional fueled energy sources increases a localized solar infrastructure provides verified energy independence for Saudi Arabia.",
    legacyTitle: "Corporate Legacy & Local Knowledge Transfer",
    legacy:
      "Future Earth is backed by a highly skilled team of engineers and technicians delivering certified expertise to the Saudi renewable energy sector. Fully committed to local knowledge transfer we engineer small and large scale solar configurations and complex hybrid networks using premium components to enforce the highest standards of architectural design and long term system deployment.",
    chairmanRole: "Chairman of the Board · Future Earth Energy Systems",
    vision2030: "In alignment with Saudi Vision 2030",

    accreditationEyebrow: "Certified Accreditations & Compliance",
    accreditationTitle: "Technical Qualifications and Standards",
    accreditationIntro:
      "Future Earth operates as a qualified and registered engineering entity holding official certifications to deploy high performance energy infrastructure within the Kingdom. Our institutional qualification ensures full alignment with the rigorous compliance frameworks of local utilities and commercial licensing codes.",
    standards: [
      {
        t: "Ministry of Energy Qualification",
        d: "Certified contractor qualification for small scale solar photovoltaic networks up to 2 Megawatts.",
        code: "MOE",
      },
      {
        t: "Saudi Electricity Company SEC",
        d: "Approved solar PV installers and certified utility designers.",
        code: "SEC",
      },
      {
        t: "ISO 9001 Certification",
        d: "Quality Management System compliance for renewable energy solutions.",
        code: "9001",
      },
      {
        t: "ISO 45001 Certification",
        d: "Occupational Health and Safety Management System deployment.",
        code: "45001",
      },
      {
        t: "ISO 14001 Certification",
        d: "Environmental Management System engineering execution.",
        code: "14001",
      },
      {
        t: "National Workforce Localization",
        d: "Ministry of Human Resources certified localization compliance.",
        code: "HRSD",
      },
    ],

    valuesEyebrow: "Institutional Core Values",
    valuesTitle: "Operational Values and ROI",
    values: [
      {
        t: "Enterprise Accountability",
        d: "Absolute technical ownership toward our commercial and industrial clients.",
      },
      {
        t: "Flawless Engineering Implementation",
        d: "Precise system modeling simulations and professional execution.",
      },
      {
        t: "Comprehensive Support Infrastructure",
        d: "Data driven lifecycle management and dedicated field maintenance.",
      },
      {
        t: "Sustainable Return on Investment",
        d: "Proven deployment delivering up to 6 times the initial capital layout.",
      },
    ],
  },
  ar: {
    eyebrow: "من نحن",
    title: "طاقة شمسية تتماشى مع رؤية السعودية 2030",
    executiveStatement:
      "تتمتع مملكتنا بوفرة من الإشعاع الشمسي، وهدفنا الأساسي هو تقديم شبكات طاقة شمسية متطورة تحقق جدوى مالية قوية للعمليات المؤسسية، البيئة، والمستقبل. إن إنتاج الطاقة من الشمس أصبح الآن عالي الجدوى الاقتصادية، حيث يوفر وفورات فورية ومتوقعة في التكاليف للمستخدمين التجاريين والصناعيين مع فترات استرداد قصيرة للاستثمار. ومع ارتفاع تكلفة مصادر الطاقة التقليدية المعتمدة على الوقود، فإن البنية التحتية المحلية للطاقة الشمسية توفر استقلالاً موثوقاً للطاقة في المملكة العربية السعودية.",
    legacyTitle: "الإرث المؤسسي ونقل المعرفة المحلية",
    legacy:
      "تعتمد فيوتشر إيرث على فريق رفيع الكفاءة من المهندسين والفنيين الذين يقدمون خبرات معتمدة لقطاع الطاقة المتجددة السعودي. والتزاماً منا بنقل المعرفة المحلية، نقوم بهندسة تركيبات الطاقة الشمسية الصغيرة والكبيرة والشبكات الهجينة المعقدة باستخدام مكونات ممتازة لفرض أعلى معايير التصميم المعماري ونشر الأنظمة على المدى الطويل.",
    chairmanRole: "رئيس مجلس الإدارة · فيوتشر إيرث لأنظمة الطاقة",
    vision2030: "بما يتماشى مع رؤية السعودية 2030",

    accreditationEyebrow: "الاعتمادات والتراخيص الرسمية",
    accreditationTitle: "المؤهلات الفنية والمعايير",
    accreditationIntro:
      "تعمل فيوتشر إيرث ككيان هندسي مؤهل ومسجل يحمل شهادات رسمية لنشر بنية تحتية للطاقة عالية الأداء داخل المملكة. ويضمن تأهيلنا المؤسسي الامتثال الكامل لأطر العمل الصارمة للمرافق المحلية ورموز التراخيص التجارية.",
    standards: [
      {
        t: "تأهيل وزارة الطاقة",
        d: "شهادة مقاول مؤهل لأنظمة الطاقة الشمسية الكهروضوئية الصغيرة حتى 2 ميجاواط.",
        code: "MOE",
      },
      {
        t: "الشركة السعودية للكهرباء SEC",
        d: "مصممون معتمدون للمرافق ومثبتون معتمدون للأنظمة الكهروضوئية.",
        code: "SEC",
      },
      {
        t: "شهادة ISO 9001",
        d: "الامتثال لنظام إدارة الجودة لحلول الطاقة المتجددة.",
        code: "9001",
      },
      { t: "شهادة ISO 45001", d: "تطبيق نظام إدارة السلامة والصحة المهنية.", code: "45001" },
      {
        t: "شهادة ISO 14001",
        d: "تنفيذ الهندسة البيئية المتوافقة مع نظام الإدارة البيئية.",
        code: "14001",
      },
      {
        t: "توطين القوى العاملة الوطنية",
        d: "الامتثال لشهادة التوطين المعتمدة من وزارة الموارد البشرية.",
        code: "HRSD",
      },
    ],

    valuesEyebrow: "القيم المؤسسية",
    valuesTitle: "القيم التشغيلية والعائد على الاستثمار",
    values: [
      { t: "المسؤولية المؤسسية", d: "ملكية فنية مطلقة تجاه عملائنا في القطاعين التجاري والصناعي." },
      {
        t: "التنفيذ الهندسي الخالي من العيوب",
        d: "محاكاة دقيقة للأنظمة وتنفيذ احترافي على أرض الواقع.",
      },
      {
        t: "بنية تحتية شاملة للدعم",
        d: "إدارة دورة حياة الأنظمة بناءً على البيانات وصيانة ميدانية مخصصة.",
      },
      {
        t: "عائد مستدام على الاستثمار",
        d: "تنفيذ موثق يقدم عوائد تصل إلى 6 أضعاف التكلفة الرأسمالية الأولية.",
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// SOLAR SOLUTIONS
// -----------------------------------------------------------------------------

export const solar = {
  en: {
    eyebrow: "Solar Solutions",
    title: "Solar Solutions Engineered for Every Site",
    lead: "Custom-engineered solar infrastructure for rooftops, open land and hybrid microgrids — designed around your load profile, your space and the Kingdom's climate.",
    parts: [
      {
        no: "01",
        slug: "rooftop-solar",
        navLabel: "Rooftop Solar",
        short: "Corrugated and concrete rooftops engineered for zero leaks and verified structural load.",
        headline: "Commercial and Industrial Rooftop Solar",
        subhead:
          "Install Solar on Your Roof Space to Generate Energy and Save Money. If you have space on your roof, no matter how big or small, you can benefit from a solar installation. Future Earth will advise and guide you through the complete process.",
        pillars: [
          {
            t: "Installation on Corrugated Sheet Roofs",
            d: "Future Earth have installed solar panels on many corrugated roofs. We guarantee no leaks or damage to your roof. Future Earth will perform a complete structural analysis to ensure that your roof can safely accommodate the solar panels.",
          },
          {
            t: "Installation on Concrete Roofs",
            d: "Installation of solar panels on concrete roofs is straightforward. Future Earth guarantee no leaks or damage to the concrete roof.",
          },
        ],
        cta: "Request Your Facility Survey",
      },
      {
        no: "02",
        slug: "ground-base-solar",
        navLabel: "Ground Base Solar",
        short: "Desert farms, car-park shade structures and comms sites built across unused open land.",
        headline: "Ground Base Solar Fields",
        subhead:
          "Install Solar on Your Available Land Space to Generate Energy and Save Money. If you have unused land at your commercial or private facility, Future Earth can install solar panels on this land. The energy generated from the Ground Based solar will provide energy to your facility and will proportionately reduce your energy bill.",
        pillars: [
          {
            t: "Desert Farm Installations",
            d: "Farms in the desert tend to have enough spare land to be able to install a solar system. Solar systems can minimise dependency on diesel generators and also grid energy. Future Earth can work with you to design a system that best meets your needs.",
          },
          {
            t: "Car Parking Shade Installations",
            d: "Future Earth can either design the parking shade structures from scratch, or we can retrofit solar panels to existing parking shade structures. We have many options and structure designs to suit all requirements.",
          },
          {
            t: "Comms Site Installations — Commercial and Government",
            d: "Future Earth has a complete package of solutions for all communication site energy requirements. We can integrate solar, diesel and batteries to provide a hybrid system that will guarantee up time 24/7.",
          },
        ],
        cta: "Request Land Suitability Assessment",
      },
      {
        no: "03",
        slug: "hybrid-solutions",
        navLabel: "Hybrid Solutions",
        short: "Solar, diesel, battery and grid combined under one SCADA command-and-control layer.",
        headline: "Solar Hybrid Solutions and Customized Microgrids",
        subhead:
          "Install Solar Hybrid Solutions with Any Combination of Solar, Diesel, Battery and Grid Energy Sources. Hybrid systems are a speciality of Future Earth. We provide a complete solution tailored to site requirements.",
        pillars: [
          {
            t: "Power Off-Grid Sites",
            d: "Future Earth can provide hybrid systems comprising of solar, batteries and diesel generators to enable sites to operate reliably and efficiently 24/7.",
          },
          {
            t: "Reduce Dependency on Diesel",
            d: "Many sites big or small rely on diesel as their main source of energy. By installing a solar system the dependency on diesel can be greatly reduced and in some cases fuel consumption can be reduced by as much as 90 percent.",
          },
          {
            t: "Reduce Dependency on Grid Energy",
            d: "If your facility is grid connected, Future Earth can design and install a solar system that will significantly reduce your energy consumption from the grid provider. The magnitude of the reduction depends on the space that you have available to install solar.",
          },
          {
            t: "Advanced Autonomous Microgrids Overview",
            d: "Microgrids are increasingly becoming the new “norm”. Future Earth have the capability to integrate multiple energy sources and integrate battery storage to provide our users with a sustainable reliable and energy efficient microgrid solution. Future Earth has the complete solution including the command and control and SCADA interfaces.",
          },
        ],
        cta: "Request Hybrid System Optimization",
      },
    ],
    scadaTitle: "Any source, one intelligent grid",
    scadaSub: "Four energy sources integrated through command, control and SCADA interfaces.",
    scadaSources: ["Solar", "Diesel", "Battery", "Grid"],
    scadaHub: "SCADA Command & Control",
    scadaOut: "Facility Load — 24/7",
  },
  ar: {
    eyebrow: "حلول الطاقة الشمسية",
    title: "حلول شمسية مصممة هندسياً لكل موقع",
    lead: "بنية تحتية شمسية مصممة خصيصاً للأسطح والأراضي المفتوحة والشبكات الهجينة الذكية — مصممة وفق نمط استهلاكك، ومساحتك، ومناخ المملكة.",
    parts: [
      {
        no: "01",
        slug: "rooftop-solar",
        navLabel: "الطاقة الشمسية للأسطح",
        short: "أسطح مموجة وخرسانية مصممة هندسياً بدون تسريبات وبتحميل إنشائي موثق.",
        headline: "الطاقة الشمسية لأسطح المباني التجارية والصناعية",
        subhead:
          "قم بتركيب الطاقة الشمسية على مساحة سطحك لتوليد الطاقة وتوفير المال. إذا كانت لديك مساحة على سطحك، بغض النظر عن حجمها كبيراً أو صغيراً، يمكنك الاستفادة من تركيب الطاقة الشمسية. ستتولى فيوتشر إيرث تقديم المشورة وتوجيهك خلال العملية الكاملة.",
        pillars: [
          {
            t: "التركيب على الأسطح ذات الألواح المموجة",
            d: "قامت فيوتشر إيرث بتركيب ألواح طاقة شمسية على العديد من الأسطح المموجة. ونحن نضمن عدم حدوث تسريبات أو أضرار لسطحك. ستجري فيوتشر إيرث تحليلاً إنشائياً كاملاً لضمان قدرة سطحك على استيعاب ألواح الطاقة الشمسية بأمان.",
          },
          {
            t: "التركيب على الأسطح الخرسانية",
            d: "يُعد تركيب ألواح الطاقة الشمسية على الأسطح الخرسانية عملية مباشرة. وتضمن فيوتشر إيرث عدم حدوث تسريبات أو أضرار للسطح الخرساني.",
          },
        ],
        cta: "طلب معاينة فنية للمنشأة",
      },
      {
        no: "02",
        slug: "ground-base-solar",
        navLabel: "المحطات الأرضية",
        short: "مزارع صحراوية ومظلات مواقف ومواقع اتصالات على الأراضي غير المستغلة.",
        headline: "المحطات الأرضية للطاقة الشمسية",
        subhead:
          "قم بتركيب الطاقة الشمسية على مساحة أرضك المتاحة لتوليد الطاقة وتوفير المال. إذا كان لديك أرض غير مستغلة في منشأتك التجارية أو الخاصة، يمكن لـ فيوتشر إيرث تركيب ألواح الطاقة الشمسية عليها. الطاقة المتولدة من المحطة الأرضية ستزود منشأتك بالطاقة وستخفض فاتورة استهلاكك بشكل متناسب.",
        pillars: [
          {
            t: "التركيبات في المزارع الصحراوية",
            d: "تميل المزارع في الصحراء إلى امتلاك مساحات أرضية كافية لتكون قادرة على تركيب نظام طاقة شمسية. يمكن لأنظمة الطاقة الشمسية تقليل الاعتماد على مولدات الديزل وكذلك طاقة الشبكة. تستطيع فيوتشر إيرث العمل معك لتصميم النظام الذي يلبي احتياجاتك على أفضل وجه.",
          },
          {
            t: "تركيبات مظلات مواقف السيارات",
            d: "يمكن لـ فيوتشر إيرث إما تصميم هياكل مظلات السيارات من الصفر، أو يمكننا دمج ألواح الطاقة الشمسية وتعديلها على هياكل المظلات القائمة بالفعل. لدينا العديد من الخيارات وتصاميم الهياكل لتناسب جميع المتطلبات.",
          },
          {
            t: "تركيبات مواقع الاتصالات التجارية والحكومية",
            d: "تمتلك فيوتشر إيرث حزمة متكاملة من الحلول لجميع متطلبات الطاقة الخاصة بمواقع الاتصالات. يمكننا دمج الطاقة الشمسية، الديزل، والبطاريات لتقديم نظام هجين يضمن استمرارية التشغيل على مدار الساعة 24/7.",
          },
        ],
        cta: "طلب تقييم لملائمة الأرض",
      },
      {
        no: "03",
        slug: "hybrid-solutions",
        navLabel: "الأنظمة الهجينة",
        short: "الطاقة الشمسية والديزل والبطاريات والشبكة معاً تحت طبقة تحكم وإشراف SCADA.",
        headline: "حلول الطاقة الشمسية الهجينة والشبكات الذكية المخصصة",
        subhead:
          "قم بتركيب حلول الطاقة الشمسية الهجينة بأي مزيج يجمع بين مصادر الطاقة الشمسية، الديزل، البطاريات، وطاقة الشبكة. تُعد الأنظمة الهجينة تخصصاً دقيقاً لشركة فيوتشر إيرث، حيث نقدم حلاً متكاملاً مصمماً خصيصاً وفقاً لمتطلبات الموقع.",
        pillars: [
          {
            t: "تزويد المواقع غير المربوطة بالشبكة بالطاقة (Off-Grid)",
            d: "يمكن لـ فيوتشر إيرث توفير أنظمة هجينة تتكون من الطاقة الشمسية، البطاريات، ومولدات الديزل لتمكين المواقع من العمل بشكل موثوق وكفء على مدار الساعة 24/7.",
          },
          {
            t: "تقليل الاعتماد على الديزل",
            d: "تعتمد العديد من المواقع، كبيرة كانت أم صغيرة، على الديزل كمصدر رئيسي للطاقة. من خلال تركيب نظام طاقة شمسية، يمكن تقليل الاعتماد على الديزل بشكل كبير، وفي بعض الحالات يمكن خفض استهلاك الوقود بنسبة تصل إلى 90 بالمائة.",
          },
          {
            t: "تقليل الاعتماد على طاقة الشبكة",
            d: "إذا كانت منشأتك متصلة بالشبكة الحكومية، يمكن لـ فيوتشر إيرث تصميم وتركيب نظام طاقة شمسية يقلل بشكل ملحوظ من استهلاكك للطاقة من مزود الشبكة. ويعتمد حجم هذا الخفض على المساحة المتاحة لديك لتركيب النظام.",
          },
          {
            t: "لمحة عامة عن الشبكات الذكية المستقلة المتطورة",
            d: "أصبحت الشبكات الذكية المصغرة (Microgrids) بمثابة “المعيار السائد” الجديد بشكل متزايد. تمتلك فيوتشر إيرث القدرة على دمج مصادر طاقة متعددة وتكامل أنظمة تخزين البطاريات لتزويد مستخدمينا بحل شبكة ذكية مستدام، موثوق، وموفر للطاقة. تمتلك فيوتشر إيرث الحل المتكامل بما في ذلك واجهات التحكم والقيادة وأنظمة الإشراف والتحكم وجمع البيانات (SCADA).",
          },
        ],
        cta: "طلب تحسين وتخصيص النظام الهجين",
      },
    ],
    scadaTitle: "أي مصدر، شبكة ذكية واحدة",
    scadaSub: "أربعة مصادر طاقة مدمجة عبر واجهات التحكم والقيادة وأنظمة SCADA.",
    scadaSources: ["شمسي", "ديزل", "بطاريات", "الشبكة"],
    scadaHub: "تحكم وقيادة SCADA",
    scadaOut: "أحمال المنشأة — 24/7",
  },
};

// -----------------------------------------------------------------------------
// PRODUCTS
// -----------------------------------------------------------------------------

export const products = {
  en: {
    eyebrow: "Products",
    title: "Commercial and Industrial Energy Storage",
    aboutPartnerLabel: "Our Technical Partner",
    aboutPartner:
      "Future Earth partners with Zhejiang Sav Digital Energy Technology Co., Ltd., a specialist in the industrial and commercial digital energy sector. Committed to providing innovative products and intelligent energy solutions, SAV enables every customer to utilize clean energy and achieve energy freedom through advanced energy storage and integrated solar-storage systems.",
    stats: [
      { value: 8, suffix: "%", unit: "", label: "R&D Investment" },
      { value: 45, suffix: "%", unit: "", label: "Proportion of R&D Personnel" },
      { value: 500, suffix: "", unit: "MWh", label: "Total Installed Capacity" },
      { value: 280, suffix: "+", unit: "", label: "Cumulative Delivery Projects" },
    ],
    factoryEyebrow: "Inside SAV Digital Energy",
    factoryTitle: "Engineered in a 500 MWh-scale digital energy facility",
    factoryBody:
      "A look inside the SAV Digital Energy production lines — where every commercial and industrial lithium storage system is assembled, tested, and validated before deployment across the Kingdom.",
    factoryCta: "Watch the factory tour",

    catalogueEyebrow: "Product Catalogue",
    catalogueTitle: "Lithium Battery Storage, by Form Factor",
    catalogueLead:
      "From all-in-one commercial cabinets to stackable, rack-mount, and fully hybrid architectures — the SAV range covers every scale of commercial and industrial energy storage. Filter by category to explore the systems Future Earth engineers and deploys.",
    categories: [
      { id: "all", label: "All Systems" },
      { id: "cabinet", label: "Cabinets" },
      { id: "stackable", label: "Stackable Modules" },
      { id: "rack", label: "Rack-Mount Modules" },
      { id: "hybrid", label: "Hybrid Systems" },
    ],
    catalogueSpecsLabel: "Key specifications",
    catalogueWatch: "Watch product video",
    catalogueSpecSheet: "View full spec sheet",
    catalogueDatasheet: "Download datasheet",
    catalogueQuote: "Request specification",
    catalogueViewDetail: "View system detail",
    catalogue: [
      {
        id: "l1",
        category: "cabinet",
        name: "SAV L1 Series",
        family: "All-in-One C&I Cabinet",
        power: "100 / 50 kW",
        capacity: "114 / 86 kWh",
        tagline: "Compact all-in-one cabinet for commercial rooftops and mid-scale facilities.",
        blurb:
          "An integrated PCS-plus-LFP cabinet engineered for continuous commercial and industrial duty — intelligent air cooling, active fire protection, and seamless solar and grid integration in a single footprint.",
        badges: ["LFP", "IP55", "Air-cooled"],
        specs: [
          { k: "PCS power", v: "100 / 50 kW" },
          { k: "Usable capacity", v: "114 / 86 kWh" },
          { k: "Battery technology", v: "LFP (Lithium Iron Phosphate)" },
          { k: "Cooling", v: "Intelligent air cooling" },
          { k: "Protection", v: "IP55 · active fire suppression" },
          { k: "Communication", v: "RS485 · Ethernet · CAN" },
        ],
        hasVideo: true,
        hasSpecSheet: false,
        datasheet: "/downloads/sav-l1-datasheet.pdf",
      },
      {
        id: "s1",
        category: "cabinet",
        name: "SAV S1 Series",
        family: "High-Capacity C&I Cabinet",
        power: "100 kW",
        capacity: "200 kWh",
        tagline: "High-capacity cabinet for factories, cold storage, and critical-load sites.",
        blurb:
          "A 200 kWh-class lithium cabinet with a 100 kW PCS, 92% round-trip efficiency, and ≥6,000-cycle LFP cells — built for the Kingdom's climate with -30 to 50°C operation and Type II surge protection.",
        badges: ["LFP", "92% efficiency", "IP55"],
        specs: [
          { k: "PCS power", v: "100 kW (110 kVA peak)" },
          { k: "Usable capacity", v: "200 kWh" },
          { k: "Battery technology", v: "LFP · ≥ 6,000 cycles" },
          { k: "Max. efficiency", v: "92%" },
          { k: "Dimensions", v: "1150 × 1280 × 2400 mm" },
          { k: "Weight", v: "≤ 2,100 kg" },
          { k: "Protection", v: "IP55 · Type II SPD" },
          { k: "Certification", v: "CE · IEC 61000 · IEC 62619" },
        ],
        hasVideo: false,
        hasSpecSheet: true,
        datasheet: "/downloads/sav-s1-datasheet.pdf",
      },
      {
        id: "stackable",
        category: "stackable",
        name: "Stackable Modules",
        family: "Modular Tower ESS",
        power: "Scalable",
        capacity: "Expandable in blocks",
        tagline: "Stacked LFP modules that scale capacity block by block.",
        blurb:
          "Modular lithium battery towers that stack to match load — a flexible, expandable format for commercial buildings and distributed storage where capacity grows with demand.",
        badges: ["LFP", "Modular", "Expandable"],
        specs: [
          { k: "Form factor", v: "Stacked battery modules" },
          { k: "Chemistry", v: "LFP (Lithium Iron Phosphate)" },
          { k: "Scaling", v: "Block-by-block expansion" },
          { k: "Application", v: "Commercial & distributed storage" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
      {
        id: "rack",
        category: "rack",
        name: "Rack-Mount Modules",
        family: "19-inch Rack ESS",
        power: "Rack-integrated",
        capacity: "Per-rack scaling",
        tagline: "19-inch rack batteries for data centre and telecom backup.",
        blurb:
          "Standard 19-inch rack-mount LFP modules engineered for IT, server, and telecom environments — clean integration into existing racks for mission-critical backup and UPS duty.",
        badges: ["LFP", "19-inch rack", "UPS-ready"],
        specs: [
          { k: "Form factor", v: "19-inch rack modules" },
          { k: "Chemistry", v: "LFP (Lithium Iron Phosphate)" },
          { k: "Integration", v: "Standard rack cabinets" },
          { k: "Application", v: "Data centre · telecom · IT backup" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
      {
        id: "hybrid",
        category: "hybrid",
        name: "Hybrid Systems",
        family: "Integrated Solar-Storage",
        power: "Site-tailored",
        capacity: "Multi-source",
        tagline: "Solar, battery, grid and generator managed as one system.",
        blurb:
          "Fully integrated architectures combining solar, storage, grid, and generator power — engineered for off-grid and on-grid sites, EV charging support, and 24/7 continuity across commercial and industrial operations.",
        badges: ["Solar + Storage", "Off / On-grid", "EV-ready"],
        specs: [
          { k: "Energy sources", v: "Solar · battery · grid · generator" },
          { k: "Modes", v: "Off-grid & on-grid" },
          { k: "Control", v: "Integrated energy management" },
          { k: "Application", v: "Continuity · UPS · EV charging" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
    ],

    appsTitle: "Product Applications & Spinning Reserve",
    apps: [
      {
        t: "General Building Backup",
        d: "Total infrastructure protection during complete utility grid failure.",
      },
      {
        t: "Critical Load Backup",
        d: "Seamless continuous power for sensitive industrial machinery and critical operations.",
      },
      {
        t: "Spinning Reserve for Entire Building",
        d: "If the main grid power fails, the entire building normally reverts to generator operation. The time taken between the power failing and the generators starting can be disruptive. Our Spinning Reserve solutions utilizing SAV Lithium Battery Systems provide instant power during this period, allowing the building to function normally.",
      },
    ],
    flowTitle: "The Spinning Reserve Power Flow",
    flow: ["Grid Fails", "SAV Lithium Battery System Gives Instant Power", "Generator Starts"],
    storageCta: "Request Storage System Specification",

    invertersEyebrow: "Smart String & Central Inverters",
    invertersTitle: "Smart Solar Inverters and Power Conversion",
    invertersOverview:
      "We supply and integrate heavy-duty string and central inverters from tier-1 global manufacturers including SUNGROW, Huawei, ABB, and Schneider Electric. These smart inverters act as the brain of the solar infrastructure, ensuring maximum power point tracking (MPPT) and flawless grid interconnection compliance.",
    invertersBrands: ["SUNGROW", "Huawei", "ABB", "Schneider Electric"],
    invertersFeatures: [
      {
        t: "High Conversion Efficiency",
        d: "Premium string inverters delivering up to 99 percent efficiency tracking to minimize power loss.",
        metric: "99%",
      },
      {
        t: "Intelligent Grid Support",
        d: "Advanced power control fully compliant with Saudi Electricity Company (SEC) grid codes.",
        metric: "SEC",
      },
      {
        t: "Rugged Environmental Protection",
        d: "Industrial-grade IP66 enclosures engineered to withstand ambient heat and sandstorms.",
        metric: "IP66",
      },
    ],
    invertersCta: "Request Inverter Hardware Catalog",

    resourcesEyebrow: "Download Area & Useful Links",
    resourcesTitle: "Technical Resources and Documentation",
    resources: [
      {
        t: "SAV Official Website",
        meta: "sav-digitalpower.com",
        kind: "link",
        href: "https://sav-digitalpower.com/en-US/",
      },
      {
        t: "SAV Factory Live Video",
        meta: "Factory Tour · Video",
        kind: "video",
        href: "/media/sav-factory-tour.mp4",
      },
      {
        t: "SAV L1 Product Video",
        meta: "L1 Product · Video",
        kind: "video",
        href: "/media/sav-l1-product.mp4",
      },
      {
        t: "SAV L1 Technical Data Sheet",
        meta: "L1 Data Sheet · PDF",
        kind: "pdf",
        href: "/downloads/sav-l1-datasheet.pdf",
      },
      {
        t: "SAV S1 Technical Data Sheet",
        meta: "S1 Data Sheet · PDF",
        kind: "pdf",
        href: "/downloads/sav-s1-datasheet.pdf",
      },
      {
        t: "SAV Global Project References",
        meta: "Project References · PDF",
        kind: "doc",
        href: "/downloads/sav-project-references.pdf",
      },
    ],
  },
  ar: {
    eyebrow: "المنتجات",
    title: "تخزين الطاقة للقطاعين التجاري والصناعي",
    aboutPartnerLabel: "شريكنا الفني",
    aboutPartner:
      "تتشارك فيوتشر إيرث مع شركة جيجيانغ ساف لتكنولوجيا الطاقة الرقمية المحدودة (SAV)، وهي شركة متخصصة في قطاع الطاقة الرقمية الصناعية والتجارية. تلتزم SAV بتقديم منتجات مبتكرة وحلول طاقة ذكية، وتمكن كل عميل من استخدام الطاقة النظيفة وتحقيق استقلال الطاقة من خلال أنظمة تخزين الطاقة المتقدمة وحلول الطاقة الشمسية والتخزين المتكاملة.",
    stats: [
      { value: 8, suffix: "%", unit: "", label: "الاستثمار في البحث والتطوير" },
      { value: 45, suffix: "%", unit: "", label: "نسبة موظفي البحث والتطوير" },
      { value: 500, suffix: "", unit: "ميجاواط ساعة", label: "إجمالي القدرة المركبة" },
      { value: 280, suffix: "+", unit: "", label: "مشاريع التسليم التراكمية" },
    ],
    factoryEyebrow: "داخل SAV للطاقة الرقمية",
    factoryTitle: "تُصنع في منشأة طاقة رقمية بقدرة تتجاوز 500 ميجاواط ساعة",
    factoryBody:
      "نظرة داخل خطوط إنتاج SAV للطاقة الرقمية — حيث يُجمَّع كل نظام تخزين ليثيوم تجاري وصناعي ويُختبر ويُعتمد قبل نشره في مختلف أنحاء المملكة.",
    factoryCta: "شاهد جولة المصنع",

    catalogueEyebrow: "كتالوج المنتجات",
    catalogueTitle: "تخزين بطاريات الليثيوم حسب الشكل الهندسي",
    catalogueLead:
      "من الكبائن التجارية المتكاملة إلى الوحدات القابلة للتكديس، والوحدات المثبتة على الرفوف، والأنظمة الهجينة بالكامل — تغطي مجموعة SAV كل مقياس لتخزين الطاقة التجاري والصناعي. صنّف حسب الفئة لاستكشاف الأنظمة التي تهندسها فيوتشر إيرث وتنفذها.",
    categories: [
      { id: "all", label: "جميع الأنظمة" },
      { id: "cabinet", label: "الكبائن" },
      { id: "stackable", label: "وحدات قابلة للتكديس" },
      { id: "rack", label: "وحدات الرفوف" },
      { id: "hybrid", label: "الأنظمة الهجينة" },
    ],
    catalogueSpecsLabel: "المواصفات الأساسية",
    catalogueWatch: "شاهد فيديو المنتج",
    catalogueSpecSheet: "عرض ورقة المواصفات الكاملة",
    catalogueDatasheet: "تحميل ورقة البيانات",
    catalogueQuote: "طلب المواصفات",
    catalogueViewDetail: "عرض تفاصيل النظام",
    catalogue: [
      {
        id: "l1",
        category: "cabinet",
        name: "سلسلة SAV L1",
        family: "كابينة متكاملة تجارية وصناعية",
        power: "100 / 50 كيلوواط",
        capacity: "114 / 86 كيلوواط ساعة",
        tagline: "كابينة متكاملة مدمجة للأسطح التجارية والمنشآت متوسطة الحجم.",
        blurb:
          "كابينة متكاملة تجمع بين محوّل الطاقة وبطاريات LFP، مصممة للتشغيل التجاري والصناعي المستمر — تبريد هوائي ذكي، وحماية فعّالة من الحرائق، وتكامل سلس مع الطاقة الشمسية والشبكة في مساحة واحدة.",
        badges: ["LFP", "IP55", "تبريد هوائي"],
        specs: [
          { k: "قدرة محوّل الطاقة", v: "100 / 50 كيلوواط" },
          { k: "السعة الاستخدامية", v: "114 / 86 كيلوواط ساعة" },
          { k: "تقنية البطارية", v: "LFP (ليثيوم حديد فوسفات)" },
          { k: "التبريد", v: "تبريد هوائي ذكي" },
          { k: "الحماية", v: "IP55 · إطفاء حريق فعّال" },
          { k: "الاتصال", v: "RS485 · إيثرنت · CAN" },
        ],
        hasVideo: true,
        hasSpecSheet: false,
        datasheet: "/downloads/sav-l1-datasheet.pdf",
      },
      {
        id: "s1",
        category: "cabinet",
        name: "سلسلة SAV S1",
        family: "كابينة عالية السعة تجارية وصناعية",
        power: "100 كيلوواط",
        capacity: "200 كيلوواط ساعة",
        tagline: "كابينة عالية السعة للمصانع والتبريد الصناعي ومواقع الأحمال الحرجة.",
        blurb:
          "كابينة ليثيوم من فئة 200 كيلوواط ساعة مع محوّل طاقة بقدرة 100 كيلوواط، وكفاءة 92%، وخلايا LFP بعمر يتجاوز 6000 دورة — مصممة لمناخ المملكة بتشغيل من -30 إلى 50 درجة مئوية وحماية من الصواعق من النوع الثاني.",
        badges: ["LFP", "كفاءة 92%", "IP55"],
        specs: [
          { k: "قدرة محوّل الطاقة", v: "100 كيلوواط (110 كيلوفولت أمبير)" },
          { k: "السعة الاستخدامية", v: "200 كيلوواط ساعة" },
          { k: "تقنية البطارية", v: "LFP · أكثر من 6000 دورة" },
          { k: "أقصى كفاءة", v: "92%" },
          { k: "الأبعاد", v: "1150 × 1280 × 2400 مم" },
          { k: "الوزن", v: "أقل من 2100 كجم" },
          { k: "الحماية", v: "IP55 · مانع صواعق نوع II" },
          { k: "الاعتماد", v: "CE · IEC 61000 · IEC 62619" },
        ],
        hasVideo: false,
        hasSpecSheet: true,
        datasheet: "/downloads/sav-s1-datasheet.pdf",
      },
      {
        id: "stackable",
        category: "stackable",
        name: "الوحدات القابلة للتكديس",
        family: "نظام تخزين برجي معياري",
        power: "قابل للتوسع",
        capacity: "توسع بالوحدات",
        tagline: "وحدات LFP قابلة للتكديس توسّع السعة وحدة تلو الأخرى.",
        blurb:
          "أبراج بطاريات ليثيوم معيارية تُكدّس لتناسب الأحمال — شكل مرن وقابل للتوسع للمباني التجارية والتخزين الموزّع حيث تنمو السعة مع الطلب.",
        badges: ["LFP", "معياري", "قابل للتوسع"],
        specs: [
          { k: "الشكل الهندسي", v: "وحدات بطارية مكدّسة" },
          { k: "الكيمياء", v: "LFP (ليثيوم حديد فوسفات)" },
          { k: "التوسع", v: "توسع بالوحدات" },
          { k: "التطبيق", v: "التخزين التجاري والموزّع" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
      {
        id: "rack",
        category: "rack",
        name: "وحدات الرفوف",
        family: "نظام تخزين بمقاس 19 بوصة",
        power: "مدمج بالرف",
        capacity: "توسع لكل رف",
        tagline: "بطاريات رفوف مقاس 19 بوصة لدعم مراكز البيانات والاتصالات.",
        blurb:
          "وحدات LFP قياسية مثبتة على رفوف مقاس 19 بوصة مصممة لبيئات تقنية المعلومات والخوادم والاتصالات — تكامل نظيف داخل الرفوف القائمة للدعم الاحتياطي الحرج وأنظمة UPS.",
        badges: ["LFP", "رف 19 بوصة", "جاهز لـ UPS"],
        specs: [
          { k: "الشكل الهندسي", v: "وحدات رفوف 19 بوصة" },
          { k: "الكيمياء", v: "LFP (ليثيوم حديد فوسفات)" },
          { k: "التكامل", v: "خزائن رفوف قياسية" },
          { k: "التطبيق", v: "مراكز البيانات · الاتصالات · الخوادم" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
      {
        id: "hybrid",
        category: "hybrid",
        name: "الأنظمة الهجينة",
        family: "تكامل شمسي وتخزين",
        power: "مخصص للموقع",
        capacity: "متعدد المصادر",
        tagline: "الطاقة الشمسية والبطاريات والشبكة والمولد تُدار كنظام واحد.",
        blurb:
          "أنظمة متكاملة بالكامل تجمع الطاقة الشمسية والتخزين والشبكة والمولد — مصممة للمواقع المعزولة والمتصلة بالشبكة، ودعم شحن المركبات الكهربائية، والاستمرارية على مدار الساعة عبر العمليات التجارية والصناعية.",
        badges: ["شمسي + تخزين", "معزول/متصل", "جاهز للمركبات"],
        specs: [
          { k: "مصادر الطاقة", v: "شمسي · بطارية · شبكة · مولد" },
          { k: "الأوضاع", v: "معزول ومتصل بالشبكة" },
          { k: "التحكم", v: "إدارة طاقة متكاملة" },
          { k: "التطبيق", v: "الاستمرارية · UPS · شحن المركبات" },
        ],
        hasVideo: false,
        hasSpecSheet: false,
        datasheet: "",
      },
    ],

    appsTitle: "تطبيقات المنتجات والاحتياطي الدوار",
    apps: [
      {
        t: "النسخ الاحتياطي العام للمباني",
        d: "حماية كاملة للبنية التحتية أثناء الفشل التام لشبكة المرافق العامة.",
      },
      {
        t: "دعم الأحمال الحساسة",
        d: "طاقة مستمرة سلسة للمعدات الصناعية الحساسة والعمليات الحرجة.",
      },
      {
        t: "الاحتياطي الدوار للمبنى بأكمله",
        d: "إذا تعطلت شبكة الطاقة الرئيسية، فإن المبنى بأكمله يعود عادةً إلى التشغيل بواسطة المولدات. يمكن أن يكون الوقت المستغرق بين انقطاع الطاقة وبدء تشغيل المولدات مربكاً للمبنى بأكمله. توفر حلول “الاحتياطي الدوار” الخاصة بنا باستخدام أنظمة بطاريات الليثيوم من SAV طاقة فورية خلال هذه الفترة، مما يسمح للمبنى بالعمل بشكل طبيعي.",
      },
    ],
    flowTitle: "تدفق طاقة الاحتياطي الدوار",
    flow: ["انقطاع الشبكة", "نظام بطاريات الليثيوم من SAV يمنح طاقة فورية", "بدء تشغيل المولد"],
    storageCta: "طلب مواصفات نظام التخزين",

    invertersEyebrow: "العواكس السلسية والمركزية الذكية",
    invertersTitle: "عواكس الطاقة الشمسية الذكية وتحويل الطاقة",
    invertersOverview:
      "نقوم بتوريد ودمج العواكس السلسية والمركزية المخصصة للخدمة الشاقة من الشركات المصنعة العالمية الرائدة من الفئة الأولى، بما في ذلك صن جرو (SUNGROW)، هواوي (Huawei)، إيه بي بي (ABB)، وشنايدر إلكتريك (Schneider Electric). تعمل هذه العواكس الذكية بمثابة الدماغ للبنية التحتية للطاقة الشمسية، مما يضمن أقصى تتبع لنقاط الطاقة (MPPT) والامتثال التام لربط الشبكة.",
    invertersBrands: ["SUNGROW", "Huawei", "ABB", "Schneider Electric"],
    invertersFeatures: [
      {
        t: "كفاءة تحويل عالية",
        d: "عواكس سلسية ممتازة توفر كفاءة تتبع تصل إلى 99 بالمائة لتقليل فقد الطاقة.",
        metric: "99%",
      },
      {
        t: "دعم الشبكة الذكي",
        d: "تحكم متطور في الطاقة متوافق تماماً مع رموز شبكة الشركة السعودية للكهرباء (SEC).",
        metric: "SEC",
      },
      {
        t: "حماية بيئية قوية",
        d: "حاويات صناعية بمعيار حماية IP66 مصممة هندسياً لتحمل الحرارة المحيطة والعواصف الرملية.",
        metric: "IP66",
      },
    ],
    invertersCta: "طلب كتالوج الأجهزة والعواكس",

    resourcesEyebrow: "منطقة التحميل والروابط المفيدة",
    resourcesTitle: "الموارد الفنية والوثائق",
    resources: [
      {
        t: "الموقع الرسمي لشركة SAV",
        meta: "sav-digitalpower.com",
        kind: "link",
        href: "https://sav-digitalpower.com/en-US/",
      },
      {
        t: "فيديو حي لمصنع SAV",
        meta: "جولة المصنع · فيديو",
        kind: "video",
        href: "/media/sav-factory-tour.mp4",
      },
      {
        t: "فيديو منتج SAV L1",
        meta: "منتج L1 · فيديو",
        kind: "video",
        href: "/media/sav-l1-product.mp4",
      },
      {
        t: "ورقة البيانات الفنية لـ SAV L1",
        meta: "ورقة بيانات L1 · PDF",
        kind: "pdf",
        href: "/downloads/sav-l1-datasheet.pdf",
      },
      {
        t: "ورقة البيانات الفنية لـ SAV S1",
        meta: "ورقة بيانات S1 · PDF",
        kind: "pdf",
        href: "/downloads/sav-s1-datasheet.pdf",
      },
      {
        t: "المراجع العالمية لمشاريع SAV",
        meta: "مراجع المشاريع · PDF",
        kind: "doc",
        href: "/downloads/sav-project-references.pdf",
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// SERVICES
// -----------------------------------------------------------------------------

export const services = {
  en: {
    eyebrow: "Services",
    title: "Full-Lifecycle Engineering Services",
    lead: "From the first structural survey to decades of monitored operation, Future Earth governs every stage of your energy asset.",
    turnkey: {
      no: "01",
      headline: "Turnkey Installation and Engineering Services",
      steps: [
        {
          t: "Expert Design Team",
          d: "Our expert design team holds over 20 years of technical experience in the renewable energy field. We engineer small and large solar configurations, high-efficiency hybrid structures, and bespoke energy architectures, including the landmark solar network for the UAE Pavilion at EXPO 2020.",
        },
        {
          t: "Perform Site Survey and Structural Analysis",
          d: "Every custom infrastructure design undergoes deep technical site analysis. Future Earth utilizes in-house engineering resources to perform comprehensive load testing, wind analysis, and structural evaluations, delivering verified documentation for safe long-term deployment.",
        },
        {
          t: "Obtain MOMRA and SEC Approvals",
          d: "Grid-tied solar networks require strict regulatory clearance. Future Earth manages the complete corporate approval loop with the Saudi Electricity Company (SEC) and the Ministry of Municipalities and Housing (MOMRA) on behalf of our clients, managing all calculations, architectural plans, and structural drawings.",
        },
        {
          t: "Procure, Install & Program Manage",
          d: "We govern the entire lifecycle of your asset from conception to execution. Upon formal engagement, our supply chain team manages the international and local procurement of tier-1 components, delivering proven installation techniques, guaranteed build quality, and Tier-1 manufacturer warranties up to 25 years.",
        },
      ],
      highlights: [
        {
          t: "Proven Installation Techniques & Quality",
          d: "Industry-proven installation methodologies delivering guaranteed engineering quality and flawless system integration.",
        },
        {
          t: "High-Quality Components & Warranties",
          d: "High-quality components from top-tier manufacturers backed by a 25-year performance warranty.",
        },
      ],
      cta: "Request Engineering Capital Proposal",
    },
    support: {
      no: "02",
      headline: "Lifetime Operation and Maintenance Support",
      capabilities: [
        {
          t: "24/7 Smart Monitoring",
          d: "Utilizing advanced data-driven systems to track individual panel and inverter performance in real time to prevent sudden operational drops.",
        },
        {
          t: "Rapid Field Response",
          d: "Deploying certified maintenance crews immediately to the facility location for emergency troubleshooting and swift hardware resolution.",
        },
        {
          t: "Scheduled Preventative Maintenance",
          d: "Conducting regular professional cleaning cycles and thorough electrical testing to sustain optimal high-yield power output.",
        },
        {
          t: "Performance Warranty Security",
          d: "Managing all localized component testing to keep your 25-year manufacturer equipment warranties secure and compliant.",
        },
      ],
      cta: "Request Maintenance SLA Proposal",
    },
    purchasing: {
      no: "03",
      headline: "Flexible Commercial Purchasing Models",
      models: [
        {
          t: "Direct System Purchase",
          d: "Future Earth provides a complete turnkey EPC package under a direct purchase contract. We engineer, procure, and install the entire solar infrastructure, with terms and financial milestones tailored and agreed upon with the client on a case-by-case basis.",
          tag: "Own the asset",
        },
        {
          t: "Solar Power Purchase Agreement (PPA)",
          d: "Future Earth offers strategic PPA structures for qualified commercial and industrial clients. Under this model, we fully finance, design, build, and maintain the solar infrastructure on your premises. Your facility only pays for the actual energy generated by the system over an agreed operational period, with zero upfront capital expenditure.",
          tag: "Zero upfront capex",
        },
      ],
      cta: "Request Financial Model Consultation",
    },
  },
  ar: {
    eyebrow: "الخدمات",
    title: "خدمات هندسية لدورة الحياة الكاملة",
    lead: "من أول معاينة إنشائية وحتى عقود من التشغيل المراقَب، تدير فيوتشر إيرث كل مرحلة من مراحل أصل الطاقة الخاص بك.",
    turnkey: {
      no: "01",
      headline: "خدمات التركيب المتكاملة والهندسة",
      steps: [
        {
          t: "فريق التصميم الخبير",
          d: "يمتلك فريق التصميم الخبير لدينا أكثر من 20 عاماً من الخبرة الفنية في مجال الطاقة المتجددة. لقد قمنا بتصميم أنظمة طاقة شمسية صغيرة وكبيرة، وأنظمة هجينة مع طاقة شمسية، ومولدات ديزل وبطاريات، بالإضافة إلى أنظمة معقدة مصممة حسب الطلب مثل نظام الطاقة الشمسية لجناح الإمارات العربية المتحدة في إكسبو 2020 (EXPO 2020).",
        },
        {
          t: "إجراء معاينة الموقع والتحليل الإنشائي",
          d: "يتطلب أي تصميم لنظام طاقة شمسية تحليلاً مفصلاً لظروف الموقع لتحديد مدى ملاءمته لتركيب النظام. تمتلك فيوتشر إيرث الموارد الداخلية لتحليل ظروف الموقع بما في ذلك التحليل الإنشائي لإعداد كافة الوثائق لدعم تركيب نظام طاقة شمسية آمن وكفء.",
        },
        {
          t: "الحصول على موافقات بلديات الأمانات (MOMRA) وشركة الكهرباء (SEC)",
          d: "يجب اعتماد تركيبات الطاقة الشمسية المربوطة بالشبكة من قِبل الشركة السعودية للكهرباء (SEC) ووزارة الشؤون البلدية والقروية والإسكان (MOMRA). ستدير فيوتشر إيرث عملية الاعتماد والموافقات الكاملة مع كلا الكيانين نيابة عن عملائنا، بما في ذلك تقديم كافة رسومات التصميم والحسابات الفنية بالإضافة إلى الحسابات الإنشائية والرسومات المعمارية.",
        },
        {
          t: "المشتريات، التركيب وإدارة البرامج للمشاريع",
          d: "نحن ندير مشروعك من الفكرة إلى الاكتمال وما بعده. عند توقيع العقد، سندير عملية الشراء الكاملة للمكونات محلياً أو دولياً. وستعمل فرق التركيب لدينا مع مديري البرامج لضمان أن يكون التركيب وفقاً لخطة المشروع المتفق عليها مع عملائنا.",
        },
      ],
      highlights: [
        {
          t: "تقنيات تركيب مجربة وجودة تركيب مضمونة",
          d: "منهجيات تركيب ميكانيكية وكهربائية مجربة في القطاع تقدم جودة هندسية مضمونة وتكاملاً مثالياً للأنظمة.",
        },
        {
          t: "مكونات عالية الجودة وضمان أداء الجهة المصنعة",
          d: "مكونات عالية الجودة من مصنعين من الفئة الأولى مدعومة مباشرة بضمان أداء شامل من الشركة المصنعة يصل إلى 25 عاماً.",
        },
      ],
      cta: "طلب مقترح رأسمالي هندسي للمشروع",
    },
    support: {
      no: "02",
      headline: "دعم التشغيل والصيانة مدى الحياة",
      capabilities: [
        {
          t: "مراقبة ذكية على مدار الساعة 24/7",
          d: "استخدام أنظمة متطورة تعتمد على البيانات لتتبع أداء الألواح والعواكس الفردية في الوقت الفعلي لمنع أي انخفاض مفاجئ في التشغيل.",
        },
        {
          t: "استجابة ميدانية سريعة",
          d: "نشر طواقم صيانة معتمدة فوراً إلى موقع المنشأة لاستكشاف الأخطاء وإصلاحها في حالات الطوارئ والحل السريع للأجهزة والمعدات.",
        },
        {
          t: "صيانة وقائية مجدولة",
          d: "إجراء دورات تنظيف احترافية منتظمة واختبارات كهربائية شاملة للحفاظ على إنتاج طاقة مثالي وعالي العائد.",
        },
        {
          t: "حماية وأمن ضمان الأداء",
          d: "إدارة جميع اختبارات المكونات المحلية للحفاظ على ضمانات معدات الشركة المصنعة لمدة 25 عاماً آمنة وممتثلة.",
        },
      ],
      cta: "طلب مقترح اتفاقية مستوى الخدمة (SLA) للصيانة",
    },
    purchasing: {
      no: "03",
      headline: "نماذج شراء تجارية مرنة",
      models: [
        {
          t: "الشراء المباشر للنظام",
          d: "تقدم فيوتشر إيرث حزمة هندسة ومشتريات وإنشاءات (EPC) متكاملة بنظام تسليم المفتاح بموجب عقد شراء مباشر. نحن نتولى هندسة وتوريد وتركيب البنية التحتية للطاقة الشمسية بأكملها، مع شروط ومعالم مالية مخصصة ومتفق عليها مع العميل على أساس كل حالة على حدة.",
          tag: "ملكية كاملة للأصل",
        },
        {
          t: "اتفاقية شراء الطاقة الشمسية (PPA)",
          d: "تقدم فيوتشر إيرث هياكل اتفاقيات شراء الطاقة (PPA) الاستراتيجية للعملاء المؤهلين في القطاعين التجاري والصناعي. وبموجب هذا النموذج، نقوم بتمويل وتصميم وبناء وصيانة البنية التحتية للطاقة الشمسية بالكامل في منشأتك. وتدفع منشأتك فقط مقابل الطاقة الفعلية المتولدة من النظام خلال فترة تشغيلية متفق عليها، مع صفر نفقات رأسمالية مقدمة.",
          tag: "بدون تكاليف تأسيس",
        },
      ],
      cta: "طلب استشارة بشأن النموذج المالي",
    },
  },
};

// -----------------------------------------------------------------------------
// CONTACT
// -----------------------------------------------------------------------------

export const contact = {
  en: {
    eyebrow: "Contact Us",
    title: "Connect with Our Engineering Office",
    lead: "Reach our engineering office directly, or complete the facility energy assessment below so our technical team can prepare your proposal before we speak.",
    officeLabel: "Office Location & Address",
    emailLabel: "Central Communications Email",
    phoneLabel: "Technical Operations Phone",
    hoursLabel: "Authorized Corporate Operating Hours",
    call: "Call Us",
    whatsapp: "WhatsApp",

    formEyebrow: "Facility Energy Assessment",
    formTitle: "Submit Your Facility for Engineering Review",
    formSub:
      "Share your facility details and our technical or financial department will follow up to prepare a tailored proposal.",
    fields: {
      name: "Full Name & Position",
      entity: "Corporate / Entity Name",
      email: "Official Email Address",
      mobile: "Contact Mobile Number",
      projectType: "Target Project Type",
      roofType: "Existing Roof Type",
      consumption: "Average Monthly Electricity Consumption (SAR)",
      notes: "Additional Technical Notes or Special Project Requirements",
    },
    projectTypeOptions: [
      "Commercial & Industrial Rooftop Solar",
      "Ground Mounted Solar Fields",
      "Hybrid Systems & Energy Storage",
      "Strategic PPA / Financing Request",
    ],
    roofTypeOptions: [
      "Corrugated Metal / Sandwich Panels",
      "Reinforced Concrete Surface",
      "Open Ground Plot / Land Area",
    ],
    submit: "Submit for Engineering Review",
    thanks:
      "Thank you — your facility assessment has been received. Our engineering team will respond within 1 business day.",
    selectPlaceholder: "Select an option",
  },
  ar: {
    eyebrow: "تواصل معنا",
    title: "تواصل مع مكتبنا الهندسي",
    lead: "تواصل مع مكتبنا الهندسي مباشرة، أو أكمل نموذج فحص الطاقة للمنشأة أدناه ليتمكن فريقنا الفني من إعداد عرضك قبل التواصل معك.",
    officeLabel: "موقع المكتب والعنوان",
    emailLabel: "البريد الإلكتروني للاتصالات المركزية",
    phoneLabel: "هاتف العمليات الفنية",
    hoursLabel: "ساعات العمل الرسمية المعتمدة للشركة",
    call: "اتصل بنا",
    whatsapp: "واتساب",

    formEyebrow: "نموذج الفحص والفرز الفني",
    formTitle: "أرسل منشأتك للمراجعة الهندسية",
    formSub: "شارك بيانات منشأتك وسيتواصل معك القسم الفني أو المالي المختص لإعداد عرض مخصص.",
    fields: {
      name: "الاسم الكامل والمسمى الوظيفي",
      entity: "اسم الشركة / الكيان",
      email: "عنوان البريد الإلكتروني الرسمي",
      mobile: "رقم الهاتف المحمول للتواصل",
      projectType: "نوع المشروع المستهدف",
      roofType: "نوع السطح الحالي",
      consumption: "متوسط الاستهلاك الشهري للكهرباء (بالريال السعودي)",
      notes: "ملاحظات فنية إضافية أو متطلبات خاصة للمشروع",
    },
    projectTypeOptions: [
      "الطاقة الشمسية لأسطح المباني التجارية والصناعية",
      "المحطات الأرضية للطاقة الشمسية",
      "الأنظمة الهجينة وتخزين الطاقة",
      "اتفاقية شراء الطاقة الاستراتيجية (PPA) / طلب تمويل",
    ],
    roofTypeOptions: [
      "صاج مموج / ألواح ساندوتش بانل",
      "سطح خرساني مسلح",
      "قطعة أرض مفتوحة / مساحة ترابية",
    ],
    submit: "إرسال للمراجعة الهندسية",
    thanks: "شكراً — تم استلام تقييم منشأتك. سيرد عليك فريقنا الهندسي خلال يوم عمل واحد.",
    selectPlaceholder: "اختر خياراً",
  },
};

// -----------------------------------------------------------------------------
// LEAD ASSISTANT (AI lead qualification chat)
// -----------------------------------------------------------------------------

export const leadAssistant = {
  en: {
    heroLead:
      "Speak with our AI energy consultant. A short, natural conversation helps our engineering team understand your project and prepare the right proposal before we connect you with sales.",
    panelEyebrow: "AI Lead Qualification",
    assistantName: "Energy Consultant",
    statusOnline: "Online · AI-powered",
    statusTyping: "Typing…",
    startHint: "Your answers are reviewed by our engineering team.",
    inputPlaceholder: "Type your answer…",
    send: "Send",
    restart: "Start over",
    disclaimer: "AI assistant · Responses are guidance, not a binding quote.",
    analyzingTitle: "Preparing your assessment",
    analyzingSub: "Our AI is analyzing your project and briefing the sales team…",
    errorMessage: "Something went wrong. Please try again.",
    retry: "Retry",
    tiers: { Hot: "Hot Lead", Warm: "Warm Lead", Cold: "Cold Lead" },
    doneEyebrow: "Qualified",
    doneTitle: "Thank you — your project has been received",
    doneSub:
      "Our engineering and sales team has been briefed and will reach out shortly through your preferred channel.",
    scoreLabel: "Lead Score",
    summaryLabel: "Summary",
    insightsLabel: "Key Insights",
    nextLabel: "Recommended next step",
    notifiedNote: "Your details were shared with our sales team.",
    talkNow: "Talk to us now",
    newChat: "Start a new conversation",
  },
  ar: {
    heroLead:
      "تحدّث مع مستشار الطاقة الذكي لدينا. محادثة قصيرة وطبيعية تساعد فريقنا الهندسي على فهم مشروعك وإعداد العرض المناسب قبل أن نصلك بفريق المبيعات.",
    panelEyebrow: "التأهيل الذكي للعملاء",
    assistantName: "مستشار الطاقة",
    statusOnline: "متصل · مدعوم بالذكاء الاصطناعي",
    statusTyping: "يكتب…",
    startHint: "تتم مراجعة إجاباتك من قبل فريقنا الهندسي.",
    inputPlaceholder: "اكتب إجابتك…",
    send: "إرسال",
    restart: "ابدأ من جديد",
    disclaimer: "مساعد ذكي · الردود إرشادية وليست عرض سعر ملزماً.",
    analyzingTitle: "نُعدّ تقييمك",
    analyzingSub: "يقوم الذكاء الاصطناعي بتحليل مشروعك وتزويد فريق المبيعات بالملخص…",
    errorMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    retry: "إعادة المحاولة",
    tiers: { Hot: "عميل ساخن", Warm: "عميل دافئ", Cold: "عميل بارد" },
    doneEyebrow: "تم التأهيل",
    doneTitle: "شكراً — تم استلام مشروعك",
    doneSub:
      "تم تزويد فريقنا الهندسي وفريق المبيعات بالتفاصيل، وسيتواصلون معك قريباً عبر قناتك المفضّلة.",
    scoreLabel: "درجة العميل",
    summaryLabel: "الملخص",
    insightsLabel: "أبرز الملاحظات",
    nextLabel: "الخطوة التالية الموصى بها",
    notifiedNote: "تمت مشاركة بياناتك مع فريق المبيعات.",
    talkNow: "تحدث معنا الآن",
    newChat: "بدء محادثة جديدة",
  },
};

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------

export const footer = {
  en: {
    description:
      "Future Earth is a certified renewable energy contractor engineering high performance solar networks and advanced lithium energy storage systems compliant with regional utility regulatory codes for industrial commercial and residential developments across the Kingdom of Saudi Arabia",
    quickTitle: "Quick Access",
    quick: [
      { l: "Home", to: "/en" },
      { l: "About Us", to: "/about" },
      { l: "Solar Solutions", to: "/solar-solutions" },
      { l: "Products", to: "/products" },
      { l: "Services", to: "/services" },
    ],
    identityTitle: "Corporate Identification",
    identity: [
      {
        k: "Corporate Identification",
        v: "Company Registration Certificate — Registered under Future Earth Energy Systems",
      },
      {
        k: "Licensed EPC Qualification",
        v: "Small Scale Photovoltaic Grid Interconnection up to 2 Megawatts",
      },
    ],
    contactTitle: "Contact",
    rights: "© " + new Date().getFullYear() + " Future Earth Energy Systems. All rights reserved.",
  },
  ar: {
    description:
      "فيوتشر إيرث هي مقاول معتمد للطاقة المتجددة يتولى هندسة شبكات طاقة شمسية عالية الأداء وأنظمة متطورة لتخزين الطاقة ببطاريات الليثيوم، بالتوافق مع الرموز التنظيمية للمرافق الإقليمية للمشاريع الصناعية، التجارية، والسكنية في جميع أنحاء المملكة العربية السعودية",
    quickTitle: "الوصول السريع",
    quick: [
      { l: "الرئيسية", to: "/ar" },
      { l: "من نحن", to: "/ar/about" },
      { l: "حلول الطاقة الشمسية", to: "/ar/solar-solutions" },
      { l: "المنتجات", to: "/ar/products" },
      { l: "الخدمات", to: "/ar/services" },
    ],
    identityTitle: "الهوية المؤسسية",
    identity: [
      { k: "الهوية المؤسسية", v: "شهادة السجل التجاري — مسجلة باسم أنظمة طاقة الأرض المستقبلية" },
      {
        k: "التأهيل المرخص للـ EPC",
        v: "ربط مشاريع الطاقة الكهروضوئية الصغيرة بالشبكة حتى 2 ميجاواط",
      },
    ],
    contactTitle: "التواصل",
    rights: "© " + new Date().getFullYear() + " فيوتشر إيرث لأنظمة الطاقة. جميع الحقوق محفوظة.",
  },
};
