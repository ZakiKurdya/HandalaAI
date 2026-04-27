export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];

export const dictionary = {
  en: {
    brand: "Handala",
    tagline: "A memory that never dies",
    nav: {
      home: "Home",
      chat: "Chat",
      resources: "Resources",
      contribute: "Contribute",
      verification: "Verification",
    },
    landing: {
      eyebrow: "A Palestinian voice · Rooted in evidence",
      heroTitle: "Clear answers about Palestine — anchored in sources you can trace.",
      heroSub:
        "Handala is an open, citation-first AI companion—designed to guide you through Palestinian history, geography, and culture with clarity, not noise.",
      ctaStart: "Begin the conversation",
      ctaResources: "Explore the archive",
      sections: {
        whyTitle: "Why Handala",
        whySub: "Thoughtful, measured, and grounded in evidence — never in slogans.",
        howTitle: "How it works",
        howSub: "Every answer draws from a carefully curated body of books, articles, and primary sources.",
        whyItems: [
          {
            title: "Citation-first",
            body: "",
          },
          {
            title: "Curated corpus",
            body: "",
          },
          {
            title: "Bilingual by design",
            body: "",
          },
          {
            title: "Quiet by intention",
            body: "",
          },
        ],
        howSteps: [
          { n: "01", title: "Ask freely", body: "In Arabic, English, or both—Handala meets your voice where it is." },
          { n: "02", title: "Search the corpus", body: "Intelligent retrieval surfaces the most relevant passages." },
          { n: "03", title: "Answer with sources", body: "Clear [n] markers connect each claim to verifiable references." },
          { n: "04", title: "Acknowledge limits", body: "When evidence is scarce, the answer says so—and invites deeper inquiry." },
        ],
      },
      trust: {
        title: "Signals you can trust",
        body: "Each answer carries visible markers of credibility—evidence-based tags, expandable source references, and a clear \"general knowledge\" label when needed.",
      },
      footer: {
        rights: "Open by design · Crafted with care",
        sources: "Source references",
      },
    },
    chat: {
      newChat: "New chat",
      placeholder: "Ask about Palestinian history, culture, geography…",
      placeholderShort: "Message Handala",
      searchHistory: "Search conversations",
      empty: "No conversations yet.",
      thinking: "Searching",
      typing: "Handala is typing",
      copy: "Copy",
      copied: "Copied",
      share: "Share",
      rename: "Rename",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      confirmDelete: "Delete this conversation?",
      sources: "Sources",
      verified: "Evidence-based",
      generalKnowledge: "From general knowledge",
      welcomeTitle: "How can I help today?",
      welcomeSub: "Try one of these to get started.",
      starters: [
        "Explain the Nakba in 1948 with key dates.",
        "What are the staples of Palestinian cuisine?",
        "Who was Naji al-Ali and why does Handala matter?",
        "Summarize the legal status of East Jerusalem under international law.",
      ],
      send: "Send",
      stop: "Stop",
    },
    resources: {
      title: "Curated resources",
      sub: "Books, articles, archives, and trusted websites that ground every Handala response.",
      search: "Search resources",
      filterAll: "All",
      add: "Add resource",
      addTitle: "Add a new resource",
      titleField: "Title",
      authorField: "Author",
      urlField: "URL",
      typeField: "Type",
      tagsField: "Tags (comma-separated)",
      summaryField: "Short summary",
      submit: "Submit",
      empty: "No resources match your filters.",
      types: { book: "Book", article: "Article", website: "Website", archive: "Archive", video: "Video", image: "Image" },
    },
    contribute: {
      title: "Contribute to the corpus",
      sub: "Help expand and strengthen the knowledge base. Every submission goes through a verification pipeline before publication.",
      guideTitle: "Contribution guide",
      guide: [
        {
          title: "Source credibility",
          body: "Prefer primary sources, peer-reviewed scholarship, and well-established archives. Avoid social media as a sole source.",
        },
        {
          title: "Formatting",
          body: "Provide title, author(s), publication year, and a stable URL or DOI. Add a 1–3 sentence summary in your own words.",
        },
        {
          title: "Metadata",
          body: "Tag with topic (history, culture, politics, geography, biography) and language. Note any access restrictions.",
        },
        {
          title: "Tone",
          body: "Stick to verifiable facts. Do not editorialize within summaries — context belongs in the body, not the metadata.",
        },
      ],
      formTitle: "Submit a resource",
      success: "Thank you. Your submission is queued for review.",
    },
    verification: {
      title: "Verification & truth review",
      sub: "How a submission becomes a citation in a Handala response.",
      steps: [
        {
          n: "01",
          title: "Submission",
          body: "A contributor proposes a new resource via the public form, with required metadata and source URL.",
        },
        {
          n: "02",
          title: "Initial review",
          body: "An editor checks formatting, metadata completeness, and surface credibility (publisher, author, date).",
        },
        {
          n: "03",
          title: "Fact-checking",
          body: "Claims are cross-referenced against existing corpus material and at least one independent source.",
        },
        {
          n: "04",
          title: "Multi-reviewer validation",
          body: "Disputed or sensitive submissions require sign-off from at least two reviewers from different backgrounds.",
        },
        {
          n: "05",
          title: "Publication",
          body: "Approved resources are indexed into the vector store and become available for citation.",
        },
        {
          n: "06",
          title: "Ongoing audit",
          body: "Flags from users trigger re-review. Disputed content is annotated rather than silently removed.",
        },
      ],
      flagsTitle: "When something is disputed",
      flagsBody:
        "Handala does not pretend certainty it does not have. Disputed claims are surfaced with context, and answers prefer named, traceable sources over consensus framing.",
    },
    common: {
      languageToggle: "العربية",
      themeToggle: "Toggle theme",
      back: "Back",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
  },
  ar: {
    brand: "حنظلة",
    tagline: "ذاكرة لا تموت",
    nav: {
      home: "الرئيسية",
      chat: "المحادثة",
      resources: "المصادر",
      contribute: "المساهمة",
      verification: "التحقق",
    },
    landing: {
      eyebrow: "صوتٌ فلسطيني · يستند إلى الدليل",
      heroTitle: "معرفةٌ صادقة عن فلسطين — موثّقة بمصادر يمكنك تتبّعها.",
      heroSub:
        "حنظلة رفيق معرفي مفتوح، يقدّم لك فلسطين كما هي: تاريخًا وجغرافيا وثقافة، بوضوحٍ يعلو على الضجيج.",
      ctaStart: "ابدأ الحوار",
      ctaResources: "استكشف المكتبة",
      sections: {
        whyTitle: "لماذا حنظلة",
        whySub: "متأنٍ، دقيق، ومتجذّر في الدليل — لا في الشعارات.",
        howTitle: "كيف يعمل",
        howSub: "كل إجابة تنبثق من مكتبة منتقاة من كتبٍ ومقالاتٍ ومصادر أولية.",
        whyItems: [
          {
            title: "المصدر أولًا",
            body: "",
          },
          {
            title: "مكتبة منتقاة",
            body: "",
          },
          {
            title: "ثنائي اللغة بطبيعته",
            body: "",
          },
          {
            title: "هدوء التصميم",
            body: "",
          },
        ],
        howSteps: [
          { n: "٠١", title: "اسأل بحرية", body: "بالعربية أو الإنجليزية أو بينهما — حنظلة يلتقي بنبرتك." },
          { n: "٠٢", title: "البحث في المعرفة", body: "يستخرج النظام أدقّ المقاطع صلةً بسؤالك." },
          { n: "٠٣", title: "إجابة موثّقة", body: "إشارات [n] تربطك مباشرةً بالمصادر للتحقّق." },
          { n: "٠٤", title: "الاعتراف بالحدود", body: "حين يقلّ الدليل، يُقال ذلك بوضوح… ويُفتح باب البحث أكثر." },
        ],
      },
      trust: {
        title: "إشارات تثق بها",
        body: "في كل إجابة دلائل واضحة على الموثوقية: وسوم قائمة على الدليل، مراجع قابلة للتوسيع، ووسم صريح «معرفة عامة» عند الحاجة.",
      },
      footer: {
        rights: "مشروعٌ مفتوح · صيغ بعناية",
        sources: "المراجع",
      },
    },
    chat: {
      newChat: "محادثة جديدة",
      placeholder: "اسأل عن تاريخ فلسطين أو ثقافتها أو جغرافيتها…",
      placeholderShort: "راسل حنظلة",
      searchHistory: "ابحث في المحادثات",
      empty: "لا توجد محادثات بعد.",
      thinking: "جارٍ البحث",
      typing: "حنظلة يكتب",
      copy: "نسخ",
      copied: "نُسخ",
      share: "مشاركة",
      rename: "إعادة تسمية",
      delete: "حذف",
      cancel: "إلغاء",
      save: "حفظ",
      confirmDelete: "هل تريد حذف هذه المحادثة؟",
      sources: "المراجع",
      verified: "مبني على دليل",
      generalKnowledge: "من المعرفة العامة",
      welcomeTitle: "كيف يمكنني المساعدة اليوم؟",
      welcomeSub: "جرّب أحد هذه الأسئلة للبدء.",
      starters: [
        "اشرح النكبة عام 1948 بأهم تواريخها.",
        "ما هي أبرز أطباق المطبخ الفلسطيني؟",
        "من هو ناجي العلي ولماذا يهمّ حنظلة؟",
        "لخّص الوضع القانوني للقدس الشرقية وفق القانون الدولي.",
      ],
      send: "إرسال",
      stop: "إيقاف",
    },
    resources: {
      title: "المصادر المنتقاة",
      sub: "كتب ومقالات وأرشيفات ومواقع موثوقة تستند إليها كل إجابة لحنظلة.",
      search: "ابحث في المصادر",
      filterAll: "الكل",
      add: "إضافة مصدر",
      addTitle: "إضافة مصدر جديد",
      titleField: "العنوان",
      authorField: "المؤلف",
      urlField: "الرابط",
      typeField: "النوع",
      tagsField: "الوسوم (مفصولة بفواصل)",
      summaryField: "ملخص قصير",
      submit: "إرسال",
      empty: "لا توجد مصادر مطابقة.",
      types: { book: "كتاب", article: "مقالة", website: "موقع", archive: "أرشيف", video: "فيديو", image: "صورة" },
    },
    contribute: {
      title: "ساهم في المكتبة",
      sub: "ساعد في توسيع المكتبة وتعزيزها. كل مساهمة تمر بمسار تحقّق قبل النشر.",
      guideTitle: "دليل المساهمة",
      guide: [
        {
          title: "موثوقية المصدر",
          body: "فضّل المصادر الأولية والدراسات المحكَّمة والأرشيفات الراسخة. تجنّب الاعتماد على وسائل التواصل وحدها.",
        },
        {
          title: "التنسيق",
          body: "أضف العنوان والمؤلف وسنة النشر ورابطًا مستقرًا أو DOI. ثم ملخصًا من جملة إلى ثلاث.",
        },
        {
          title: "البيانات الوصفية",
          body: "ضع وسومًا للموضوع (تاريخ، ثقافة، سياسة، جغرافيا، سيرة) واللغة. ووثّق أي قيود وصول.",
        },
        {
          title: "الأسلوب",
          body: "التزم بالحقائق القابلة للتحقق. لا تُحرّر الرأي في الملخص — السياق محله المتن.",
        },
      ],
      formTitle: "أرسل مصدرًا",
      success: "شكرًا لك. تم استلام مساهمتك للمراجعة.",
    },
    verification: {
      title: "التحقق ومراجعة الحقيقة",
      sub: "كيف تتحول المساهمة إلى مرجع داخل إجابة لحنظلة.",
      steps: [
        { n: "٠١", title: "تقديم", body: "مساهمٌ يقترح مصدرًا جديدًا عبر النموذج العام مع البيانات الوصفية والرابط." },
        { n: "٠٢", title: "مراجعة أولية", body: "محرّر يفحص التنسيق واكتمال البيانات والمصداقية الظاهرة." },
        { n: "٠٣", title: "تدقيق الحقائق", body: "تُقابَل الادعاءات بمكتبتنا وبمصدر مستقل واحد على الأقل." },
        { n: "٠٤", title: "تحقق متعدد", body: "المساهمات الحساسة تستوجب توقيع مراجعَين على الأقل من خلفيات مختلفة." },
        { n: "٠٥", title: "النشر", body: "تُفهرَس المصادر المعتمدة في المخزن المتجهي لتصبح متاحة للاقتباس." },
        { n: "٠٦", title: "تدقيق مستمر", body: "البلاغات تُعيد فتح المراجعة. والمحتوى المتنازع عليه يُوضَّح لا يُحذف بصمت." },
      ],
      flagsTitle: "حين يكون الأمر متنازعًا عليه",
      flagsBody:
        "لا يدّعي حنظلة يقينًا لا يملكه. الادعاءات المتنازع عليها تُعرض مع سياقها، والإجابات تفضّل المصادر القابلة للتتبّع على إطار 'الإجماع'.",
    },
    common: {
      languageToggle: "English",
      themeToggle: "تبديل السمة",
      back: "رجوع",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
    },
  },
};

export type Dictionary = typeof dictionary.en;
