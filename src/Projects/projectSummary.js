const projectTopics = [
    {
        match: /\b(half adder|full adder|adder|ripple carry)\b/i,
        en: "demonstrates how logic gates add binary values and produce sum and carry outputs",
        ar: "استخدام البوابات المنطقية لجمع القيم الثنائية وإظهار ناتج الجمع والحمل",
    },
    {
        match: /\b(half subtractor|full subtractor|subtractor)\b/i,
        en: "explores binary subtraction and how a digital circuit represents the difference and borrow",
        ar: "عملية الطرح الثنائي وتمثيل الفرق والاستلاف في الدائرة الرقمية",
    },
    {
        match: /\b(comparator)\b/i,
        en: "compares digital values and indicates whether they are equal or which one is greater",
        ar: "مقارنة القيم الرقمية وتحديد تساويها أو الأكبر بينها",
    },
    {
        match: /\b(parity|error detection)\b/i,
        en: "uses parity logic to check binary data and flag a possible transmission error",
        ar: "فحص البيانات الثنائية باستخدام منطق التكافؤ والتنبيه للأخطاء المحتملة",
    },
    {
        match: /\b(encoder|decoder|mux|multiplexer|demultiplexer)\b/i,
        en: "shows how digital logic selects, routes, or converts signals between inputs and outputs",
        ar: "اختيار الإشارات الرقمية وتوجيهها وتحويلها بين المداخل والمخارج",
    },
    {
        match: /\b(counter|digital clock|stopwatch|timer)\b/i,
        en: "uses counting and timing logic to track sequence or elapsed time and present the result",
        ar: "توظيف العد والتوقيت لمتابعة التسلسل أو الزمن المنقضي وعرض النتيجة",
    },
    {
        match: /\b(traffic light|signal controller)\b/i,
        en: "models a timed signal sequence and the control logic behind changing its states",
        ar: "تسلسل الإشارات المحدد بالوقت ومنطق التحكم في الانتقال بين حالاته",
    },
    {
        match: /\b(shift register|flip.?flop|sequential circuit)\b/i,
        en: "explores how sequential logic stores, shifts, or updates digital states over clock cycles",
        ar: "تخزين الحالات الرقمية أو إزاحتها أو تحديثها باستخدام المنطق التتابعي",
    },
    {
        match: /\b(alu|arithmetic logic)\b/i,
        en: "combines arithmetic and logic operations into a digital unit that processes input values",
        ar: "تنفيذ العمليات الحسابية والمنطقية على القيم المدخلة",
    },
    {
        match: /\b(solar|photovoltaic|pv panel)\b/i,
        en: "explores a solar-energy system, its main components, and how sunlight is converted or used",
        ar: "تحويل ضوء الشمس إلى طاقة والاستفادة منها ضمن نظام شمسي",
    },
    {
        match: /\b(forklift|collision|impact monitor)\b/i,
        en: "focuses on monitoring vehicle impacts or nearby hazards to improve awareness during operation",
        ar: "مراقبة اصطدامات المركبات أو المخاطر المحيطة لتحسين الوعي أثناء التشغيل",
    },
    {
        match: /\b(tracker|tracking)\b/i,
        en: "focuses on tracking movement or changing conditions and using that information to guide a response",
        ar: "تتبع الحركة أو تغير الظروف واستخدام البيانات لتوجيه الاستجابة",
    },
    {
        match: /\b(robot|robotic arm|agv)\b/i,
        en: "explores a robotic system that combines sensing, control, and motion to perform a defined task",
        ar: "تكامل الاستشعار والتحكم والحركة لتنفيذ مهمة روبوتية محددة",
    },
    {
        match: /\b(cnc|tool wear|bearing fault|fault detector|predictive maintenance|jam detector|feeder jam)\b/i,
        en: "focuses on monitoring machine condition to identify wear, blockage, or abnormal behavior and support maintenance decisions",
        ar: "مراقبة حالة المعدة واكتشاف التآكل أو الانسداد أو السلوك غير الطبيعي لدعم الصيانة",
    },
    {
        match: /\b(industrial oven|oven profiler|thermal profiler|temperature profile)\b/i,
        en: "tracks temperature changes through an industrial heating process to help assess its operating profile",
        ar: "متابعة تغير درجات الحرارة خلال عملية تسخين صناعية لتقييم ظروف التشغيل",
    },
    {
        match: /\b(plc|conveyor|bottling|sorting|assembly line|production line|smt feeder)\b/i,
        en: "presents an industrial automation process, coordinating equipment and control steps to complete a task",
        ar: "تنسيق المعدات وخطوات التحكم ضمن عملية أتمتة صناعية",
    },
    {
        match: /\b(gas|leak|smoke|fire|hazard|safety|impact monitor)\b/i,
        en: "explores a monitoring and alert system that detects a potential hazard and helps people respond",
        ar: "رصد المخاطر المحتملة وإطلاق تنبيهات تساعد على الاستجابة",
    },
    {
        match: /\b(energy|power meter|sub.?meter|electricity meter)\b/i,
        en: "examines how electrical energy use can be measured, monitored, and reported",
        ar: "قياس استهلاك الطاقة الكهربائية ومراقبته وعرض بياناته",
    },
    {
        match: /\b(power supply|voltage regulator|inverter|charger|battery)\b/i,
        en: "explores an electrical power circuit and how it converts, regulates, or delivers energy to a load",
        ar: "تحويل الطاقة الكهربائية أو تنظيمها وتوصيلها إلى الحمل",
    },
    {
        match: /\b(amplifier|audio|speaker|microphone)\b/i,
        en: "demonstrates how an electronic circuit handles or amplifies audio signals",
        ar: "التعامل مع الإشارات الصوتية أو تضخيمها داخل دائرة إلكترونية",
    },
    {
        match: /\b(temperature|humidity|weather|environment|air quality)\b/i,
        en: "uses environmental measurements to observe changing conditions and present useful readings",
        ar: "قياس الظروف البيئية ومتابعة تغيرها وعرض قراءات مفيدة",
    },
    {
        match: /\b(smart home|home automation|iot|internet of things)\b/i,
        en: "connects devices or sensors so a system can monitor conditions and automate a response",
        ar: "ربط الأجهزة والحساسات لمراقبة الظروف وتنفيذ استجابة تلقائية",
    },
    {
        match: /\b(ai|machine learning|neural|computer vision|image recognition|classification)\b/i,
        en: "explores how data or images can be analyzed to recognize patterns and produce a useful prediction or result",
        ar: "تحليل البيانات أو الصور لاكتشاف الأنماط واستخلاص نتيجة أو توقع مفيد",
    },
    {
        match: /\b(web|website|e.?commerce|dashboard|management system|application|app)\b/i,
        en: "outlines a software application, the problem it addresses, and how its main features support users",
        ar: "معالجة حاجة للمستخدم من خلال تطبيق برمجي ووظائفه الأساسية",
    },
    {
        match: /\b(beam|truss|frame|shaft|gear|stress|strength of materials|mechanical design)\b/i,
        en: "examines a mechanical design or structure and the forces, materials, or motion that affect its behavior",
        ar: "تحليل أداء تصميم ميكانيكي تحت تأثير القوى والمواد والحركة",
    },
];

const categoryTopics = {
    "embedded-iot": {
        en: "a connected-device project involving embedded control and practical sensing",
        ar: "مشروع أجهزة متصلة يجمع التحكم المدمج والاستشعار العملي",
    },
    "digital-logic": {
        en: "a digital-logic project built around binary inputs, logic operations, and circuit outputs",
        ar: "مشروع منطق رقمي يعتمد على المداخل الثنائية والعمليات المنطقية ومخرجات الدائرة",
    },
    electronics: {
        en: "an electronics project focused on circuit behavior, components, and measurable outputs",
        ar: "مشروع إلكترونيات يركز على سلوك الدائرة ومكوناتها ومخرجاتها القابلة للقياس",
    },
    "mechanical-design": {
        en: "a mechanical-design project focused on how a component or structure performs under real conditions",
        ar: "مشروع تصميم ميكانيكي يركز على أداء مكون أو منشأ في ظروف التشغيل",
    },
    "industrial-automation": {
        en: "an industrial-control project that coordinates equipment, signals, and operating steps",
        ar: "مشروع تحكم صناعي ينسق المعدات والإشارات وخطوات التشغيل",
    },
    "embedded-systems": {
        en: "an embedded-systems project combining a microcontroller, inputs, and a defined control task",
        ar: "مشروع أنظمة مدمجة يجمع متحكمًا دقيقًا ومدخلات ومهمة تحكم محددة",
    },
    "software-ai": {
        en: "a software project that applies computing to a practical problem or user need",
        ar: "مشروع برمجي يوظف الحوسبة لمعالجة مشكلة عملية أو تلبية حاجة للمستخدم",
    },
};

function getProjectTopic(title) {
    return projectTopics.find(({ match }) => match.test(title));
}

export function projectDescription(project, isEnglish) {
    const localized = isEnglish ? project.public_description_en : project.public_description_ar;
    const otherLanguage = isEnglish ? project.public_description_ar : project.public_description_en;
    if (localized?.trim()) return localized;
    if (otherLanguage?.trim()) return otherLanguage;

    const title = (isEnglish ? project.title_en : project.title_ar)
        || project.title_en
        || project.title_ar
        || (isEnglish ? "This project" : "هذا المشروع");
    const topic = getProjectTopic(`${project.title_en || ""} ${project.title_ar || ""}`);
    const categoryTopic = categoryTopics[project.category_slug || project.categorySlug];
    if (isEnglish) {
        return topic
            ? `This project, ${title}, ${topic.en}.`
            : `${title} explores ${categoryTopic?.en || "a practical engineering concept"}, its purpose, and how its main elements work together.`;
    }
    return topic
        ? `يستعرض مشروع ${title}، الذي يركز على ${topic.ar}.`
        : `يستعرض مشروع ${title}، وهو ${categoryTopic?.ar || "مشروع هندسي عملي"}، ويوضح هدفه وكيفية تكامل عناصره الأساسية.`;
}
