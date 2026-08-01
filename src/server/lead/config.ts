// ═══════════════════════════════════════════════════════════════════════════
//  LEAD QUALIFICATION — CONVERSATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════
//
//  THIS is a file the client edits. It is DATA that drives the AI consultant:
//  the persona, the opener, and the information to gather. The engine
//  (prompts.ts / engine.ts) turns this into system instructions and never needs
//  to change when the script changes.
//
//  To update the conversation:
//    1. Edit `objectives` — add/remove/reorder items, tweak wording.
//    2. For SCORING rules, edit `scoring.ts` (separate, so it can change alone).
//    3. That's it. No component or server logic needs to change.
//
//  Notes:
//    • Every visible string is bilingual ({ en, ar }).
//    • `goal` describes WHAT to find out — the AI phrases the actual question
//      naturally, one at a time, grouping related points. `label` is internal.
//    • `required: true` objectives should be covered before qualifying.
// ═══════════════════════════════════════════════════════════════════════════

export interface Localized {
  en: string;
  ar: string;
}

export interface LeadObjective {
  id: string;
  /** Internal, human-readable name for this data point. */
  label: Localized;
  /** What the assistant needs to learn (guides how it asks). */
  goal: Localized;
  /** Should be gathered before the lead can be qualified. */
  required: boolean;
}

export interface LeadConfig {
  persona: Localized;
  /** First thing the visitor sees — a warm opener + the first question. */
  opening: Localized;
  objectives: LeadObjective[];
  /** How the assistant wraps up once it has what it needs. */
  closing: Localized;
}

export const leadConfig: LeadConfig = {
  persona: {
    en: "You are the AI energy consultant for Future Earth Energy Systems, a certified EPC contractor in Saudi Arabia delivering utility-scale solar and industrial lithium battery storage. You are calm, precise and genuinely consultative — an engineer's advisor, not a support bot. You qualify prospective clients before the human sales team engages.",
    ar: "أنت المستشار الذكي لأنظمة طاقة الأرض المستقبلية (فيوتشر إيرث)، وهي شركة مقاولات EPC معتمدة في المملكة العربية السعودية تنفّذ مشاريع الطاقة الشمسية واسعة النطاق وأنظمة تخزين الطاقة الصناعية ببطاريات الليثيوم. أسلوبك هادئ ودقيق واستشاري بحق — مستشار مهندس لا روبوت دعم. مهمتك تأهيل العملاء المحتملين قبل تواصل فريق المبيعات البشري معهم.",
  },
  opening: {
    en: "Welcome to Future Earth Energy Systems. I'm your energy consultant — I'll ask a few quick questions to understand your project so our engineering team can prepare the right proposal before we speak. To start, who am I speaking with, and which company or entity are you with?",
    ar: "أهلاً بك في أنظمة طاقة الأرض المستقبلية. أنا مستشارك في شؤون الطاقة — سأطرح عليك بعض الأسئلة السريعة لفهم مشروعك حتى يتمكن فريقنا الهندسي من إعداد العرض المناسب قبل تواصلنا معك. لنبدأ: بمن يشرّفني الحديث، ومع أي شركة أو جهة تعمل؟",
  },

  // ── The information to gather ───────────────────────────────────────────────
  // Grouped so the assistant asks efficiently (a few related points per turn),
  // never as a 16-question form. Together these cover the full lead profile.
  objectives: [
    {
      id: "identity",
      label: { en: "Name, role & authority", ar: "الاسم والمسمى والصلاحية" },
      goal: {
        en: "The visitor's full name, their role, and whether they are the decision-maker or influence the decision.",
        ar: "الاسم الكامل للزائر ومسماه الوظيفي، وهل هو متخذ القرار أو يؤثر فيه.",
      },
      required: true,
    },
    {
      id: "organization",
      label: { en: "Company, business type & industry", ar: "الشركة ونوع النشاط والقطاع" },
      goal: {
        en: "The company or entity name, the type of business, and the industry/sector they operate in.",
        ar: "اسم الشركة أو الجهة، ونوع النشاط التجاري، والقطاع/الصناعة التي يعملون بها.",
      },
      required: true,
    },
    {
      id: "location",
      label: { en: "Country & city", ar: "الدولة والمدينة" },
      goal: {
        en: "The country and city of the project site (affects design, regulations and site visits).",
        ar: "دولة ومدينة موقع المشروع (تؤثر على التصميم والأنظمة والمعاينة).",
      },
      required: true,
    },
    {
      id: "projectType",
      label: { en: "Project type", ar: "نوع المشروع" },
      goal: {
        en: "The kind of energy project: commercial/industrial rooftop solar, ground-mounted plant, hybrid + battery storage, or a PPA/financing arrangement.",
        ar: "نوع مشروع الطاقة: طاقة شمسية لأسطح المباني التجارية/الصناعية، محطة أرضية، نظام هجين مع تخزين بالبطاريات، أو اتفاقية شراء طاقة/تمويل.",
      },
      required: true,
    },
    {
      id: "scale",
      label: { en: "Facility, scale & consumption", ar: "المنشأة والحجم والاستهلاك" },
      goal: {
        en: "The facility type and rough scale (roof/land area, number of sites, or kW/MW), and their approximate monthly electricity consumption or bill (SAR).",
        ar: "نوع المنشأة وحجمها التقريبي (مساحة السطح/الأرض، عدد المواقع، أو الكيلوواط/الميجاواط)، ومتوسط استهلاك الكهرباء أو الفاتورة الشهرية تقريباً (بالريال).",
      },
      required: true,
    },
    {
      id: "goals",
      label: { en: "Goals, pain points & current solution", ar: "الأهداف والتحديات والحل الحالي" },
      goal: {
        en: "Their main goals (e.g. cut bills, reliability, sustainability), the pain points driving this, and any current/previous energy solution.",
        ar: "أهدافهم الرئيسية (تقليل الفواتير، الموثوقية، الاستدامة)، والتحديات الدافعة لذلك، وأي حل طاقة حالي أو سابق.",
      },
      required: false,
    },
    {
      id: "timeline",
      label: { en: "Timeline", ar: "الإطار الزمني" },
      goal: {
        en: "How soon they want to move — exploring, planning within a few months, or ready to procure now.",
        ar: "متى يرغبون بالبدء — مرحلة استكشاف، تخطيط خلال أشهر، أو جاهزون للتعاقد الآن.",
      },
      required: true,
    },
    {
      id: "budget",
      label: { en: "Budget / financing", ar: "الميزانية أو التمويل" },
      goal: {
        en: "Whether they have an allocated budget or need financing / a PPA model. Ask tactfully.",
        ar: "هل لديهم ميزانية مخصّصة أم يحتاجون تمويلاً أو نموذج اتفاقية شراء طاقة. اسأل بلباقة.",
      },
      required: false,
    },
    {
      id: "contact",
      label: { en: "Contact details & preference", ar: "بيانات التواصل والتفضيل" },
      goal: {
        en: "The best way to reach them — email and phone/WhatsApp — and their preferred contact method and time.",
        ar: "أفضل وسيلة للتواصل معهم — البريد الإلكتروني ورقم الجوال/الواتساب — وقناتهم ووقتهم المفضّل.",
      },
      required: true,
    },
  ],

  closing: {
    en: "Thank them warmly, confirm that our engineering/sales team will follow up shortly through their preferred channel, and set the expectation that a tailored proposal will be prepared. Keep it to two sentences.",
    ar: "اشكرهم بحرارة، وأكّد أن فريقنا الهندسي/المبيعات سيتواصل معهم قريباً عبر قناتهم المفضّلة، واذكر أنه سيتم إعداد عرض مخصّص لهم. اجعلها في جملتين.",
  },
};
