import { publicAsset } from '../utils/publicAsset.js'

const Detalis =
    [
        {
            id: 0,
            name: "Front-End Development",
            nameAr: "تطوير الواجهات الأمامية",
            image: publicAsset('image/frontend.jpg'),
            description: "Learn HTML, CSS, JavaScript, React, and responsive web design.",
            descriptionAr: "تعلم HTML وCSS وJavaScript وReact وتصميم مواقع متوافقة مع مختلف الشاشات.",
            category: "software",
            price: 5500,
            durationMonths: 3,
            curriculum: [
                { title: "HTML and page structure", titleAr: "HTML وبناء صفحات الويب", topics: ["HTML document structure and semantic elements", "Headings, links, lists, images, and tables", "Forms, input types, and basic validation", "Accessibility fundamentals and clean page structure"], topicsAr: ["هيكل مستند HTML والعناصر الدلالية", "العناوين والروابط والقوائم والصور والجداول", "النماذج وأنواع الحقول والتحقق الأساسي", "أساسيات سهولة الوصول وتنظيم الصفحة"] },
                { title: "CSS foundations", titleAr: "أساسيات CSS", topics: ["Selectors, cascade, specificity, and inheritance", "Colors, typography, backgrounds, and units", "Box model, spacing, borders, and shadows", "Flexbox and CSS Grid layouts"], topicsAr: ["المحددات وتسلسل القواعد والأولوية والوراثة", "الألوان والخطوط والخلفيات ووحدات القياس", "نموذج الصندوق والمسافات والحدود والظلال", "تخطيطات Flexbox وCSS Grid"] },
                { title: "Responsive interfaces", titleAr: "تصميم واجهات متجاوبة", topics: ["Mobile-first responsive design", "Media queries and responsive images", "Reusable page sections and navigation", "Cross-browser checks and interface refinement"], topicsAr: ["التصميم المتجاوب بدءًا من الهاتف", "استعلامات الوسائط والصور المتجاوبة", "أقسام الصفحات وعناصر التنقل القابلة لإعادة الاستخدام", "اختبار التوافق وتحسين الواجهة"] },
                { title: "JavaScript essentials", titleAr: "أساسيات JavaScript", topics: ["Variables, data types, operators, and conditions", "Loops, functions, arrays, and objects", "DOM selection, updates, and event handling", "Modules, promises, and asynchronous requests"], topicsAr: ["المتغيرات وأنواع البيانات والمعاملات والشروط", "الحلقات والدوال والمصفوفات والكائنات", "اختيار عناصر الصفحة وتحديثها والتعامل مع الأحداث", "الوحدات والوعود والطلبات غير المتزامنة"] },
                { title: "React development", titleAr: "تطوير الواجهات باستخدام React", topics: ["Components, JSX, props, and component composition", "State, events, and common React hooks", "Rendering lists, forms, and conditional content", "Reusable components and organizing a React project"], topicsAr: ["المكونات وJSX والخصائص وتركيب المكونات", "الحالة والأحداث وأشهر React hooks", "عرض القوائم والنماذج والمحتوى الشرطي", "المكونات القابلة لإعادة الاستخدام وتنظيم مشروع React"] },
                { title: "Final project", titleAr: "المشروع النهائي", topics: ["Plan and build a complete responsive website", "Connect interface interactions and form validation", "Test on different screen sizes and fix issues", "Prepare and publish the finished project"], topicsAr: ["تخطيط وبناء موقع متكامل ومتجاوب", "إضافة التفاعلات والتحقق من النماذج", "اختبار الموقع على أحجام شاشات مختلفة وإصلاح المشكلات", "تجهيز المشروع النهائي ونشره"] }
            ]
        },
        {
            id: 1,
            name: "Back-End Development",
            nameAr: "تطوير الواجهات الخلفية",
            image: publicAsset('image/backend.jpg'),
            description: "Learn Node.js, Express.js, REST APIs, databases, and authentication.",
            descriptionAr: "تعلم Node.js وExpress.js وواجهات REST API وقواعد البيانات والمصادقة.",
            category: "software",
            price: 5200,
            durationMonths: 3,
            curriculum: [
                { title: "JavaScript for backend", titleAr: "JavaScript لتطوير الخادم", topics: ["Modern JavaScript syntax and modules", "Functions, objects, arrays, and error handling", "Asynchronous JavaScript, promises, and async/await", "Working with JSON and environment variables"], topicsAr: ["صياغة JavaScript الحديثة والوحدات", "الدوال والكائنات والمصفوفات ومعالجة الأخطاء", "JavaScript غير المتزامنة والوعود وasync/await", "التعامل مع JSON ومتغيرات البيئة"] },
                { title: "Node.js and HTTP", titleAr: "Node.js وبروتوكول HTTP", topics: ["Node.js runtime, npm, and project setup", "Files, modules, and built-in Node.js APIs", "HTTP methods, status codes, headers, and request flow", "Environment configuration and application logging"], topicsAr: ["بيئة Node.js وnpm وإعداد المشروع", "الملفات والوحدات وواجهات Node.js المدمجة", "طرق HTTP ورموز الحالة والترويسات ومسار الطلب", "إعداد البيئة وتسجيل أحداث التطبيق"] },
                { title: "Express and REST APIs", titleAr: "Express وواجهات REST API", topics: ["Express application setup and route organization", "Request parameters, query strings, and request bodies", "Middleware, validation, and consistent error responses", "Designing and documenting REST endpoints"], topicsAr: ["إعداد تطبيق Express وتنظيم المسارات", "معاملات الطلب والاستعلامات ومحتوى الطلب", "الوسائط البرمجية والتحقق ورسائل الأخطاء الموحدة", "تصميم وتوثيق مسارات REST"] },
                { title: "Databases", titleAr: "قواعد البيانات", topics: ["Relational data, tables, records, and relationships", "Create, read, update, and delete operations", "Queries, filtering, sorting, and pagination", "Connecting the application to a database safely"], topicsAr: ["البيانات العلائقية والجداول والسجلات والعلاقات", "عمليات الإضافة والقراءة والتعديل والحذف", "الاستعلامات والتصفية والترتيب وتقسيم النتائج", "ربط التطبيق بقاعدة البيانات بطريقة آمنة"] },
                { title: "Authentication and security", titleAr: "المصادقة وأساسيات الأمان", topics: ["Registration, login, and password hashing concepts", "Sessions or token-based authentication flow", "Authorization and protecting private endpoints", "Input validation, secrets, and common API risks"], topicsAr: ["التسجيل وتسجيل الدخول ومفاهيم تشفير كلمات المرور", "مسار الجلسات أو المصادقة باستخدام الرموز", "الصلاحيات وحماية المسارات الخاصة", "التحقق من المدخلات والأسرار ومخاطر واجهات API الشائعة"] },
                { title: "Testing and delivery", titleAr: "الاختبار وتسليم المشروع", topics: ["Testing API endpoints and expected responses", "Debugging and handling application errors", "Git workflow and deployment preparation", "Build and document a complete backend API"], topicsAr: ["اختبار مسارات API والاستجابات المتوقعة", "تصحيح الأخطاء والتعامل مع أعطال التطبيق", "سير العمل باستخدام Git والاستعداد للنشر", "بناء وتوثيق واجهة خلفية متكاملة"] }
            ]

        },
        {
            id: 2,
            name: "Full-Stack Development",
            nameAr: "تطوير الواجهات المتكاملة",
            image: publicAsset('image/fullstack.jpg'),
            description: "Build complete web applications using front-end and back-end technologies.",
            descriptionAr: "أنشئ تطبيقات ويب متكاملة باستخدام تقنيات الواجهات الأمامية والخلفية.",
            category: "software",
            price: 11000,
            durationMonths: 5,
            curriculum: [
                { title: "HTML and CSS foundations", titleAr: "أساسيات HTML وCSS", topics: ["Semantic HTML and accessible page structure", "CSS selectors, box model, and typography", "Flexbox, Grid, and responsive layouts", "Build reusable page sections from a design"], topicsAr: ["HTML الدلالي وبناء صفحات سهلة الوصول", "محددات CSS ونموذج الصندوق والخطوط", "Flexbox وGrid والتخطيطات المتجاوبة", "بناء أقسام صفحات قابلة لإعادة الاستخدام من تصميم"] },
                { title: "JavaScript programming", titleAr: "البرمجة باستخدام JavaScript", topics: ["Data types, conditions, loops, and functions", "Arrays, objects, and modern JavaScript syntax", "DOM events, forms, and browser APIs", "Asynchronous code, promises, and API requests"], topicsAr: ["أنواع البيانات والشروط والحلقات والدوال", "المصفوفات والكائنات وصياغة JavaScript الحديثة", "أحداث الصفحة والنماذج وواجهات المتصفح", "البرمجة غير المتزامنة والوعود وطلبات API"] },
                { title: "React frontend", titleAr: "الواجهة الأمامية باستخدام React", topics: ["Components, props, state, and hooks", "Forms, validation, and reusable UI patterns", "Routing and organizing application pages", "Connect the interface to backend endpoints"], topicsAr: ["المكونات والخصائص والحالة وhooks", "النماذج والتحقق وأنماط الواجهات القابلة لإعادة الاستخدام", "التنقل بين الصفحات وتنظيم التطبيق", "ربط الواجهة بمسارات الخادم"] },
                { title: "Node.js and Express backend", titleAr: "الخلفية باستخدام Node.js وExpress", topics: ["Node.js project setup and npm packages", "Express routes, middleware, and controllers", "REST API design and consistent error handling", "Input validation and configuration management"], topicsAr: ["إعداد مشروع Node.js وحزم npm", "مسارات Express والوسائط البرمجية ووحدات التحكم", "تصميم REST API ومعالجة الأخطاء الموحدة", "التحقق من المدخلات وإدارة إعدادات التطبيق"] },
                { title: "Database and authentication", titleAr: "قاعدة البيانات والمصادقة", topics: ["Model application data and relationships", "Create and query persistent records", "Registration, login, and protected user actions", "Connect frontend authentication to backend authorization"], topicsAr: ["تصميم بيانات التطبيق والعلاقات بينها", "إنشاء السجلات الدائمة والاستعلام عنها", "التسجيل والدخول وحماية إجراءات المستخدم", "ربط مصادقة الواجهة بصلاحيات الخادم"] },
                { title: "Integration and quality", titleAr: "الربط وتحسين جودة التطبيق", topics: ["Connect frontend, API, and database end to end", "Loading, success, empty, and error states", "Test key user flows and troubleshoot issues", "Use Git and prepare a production-ready configuration"], topicsAr: ["ربط الواجهة وAPI وقاعدة البيانات من البداية للنهاية", "حالات التحميل والنجاح والنتائج الفارغة والأخطاء", "اختبار مسارات المستخدم الأساسية وحل المشكلات", "استخدام Git وتجهيز إعدادات مناسبة للنشر"] },
                { title: "Full-stack graduation project", titleAr: "مشروع التخرج المتكامل", topics: ["Plan and implement a complete web application", "Build responsive pages and documented API routes", "Add data persistence and user access controls", "Test, deploy, and present the completed project"], topicsAr: ["تخطيط وتنفيذ تطبيق ويب متكامل", "بناء صفحات متجاوبة ومسارات API موثقة", "إضافة حفظ البيانات وضوابط وصول المستخدم", "اختبار المشروع ونشره وعرضه"] }
            ]

        },
        {
            id: 3,
            name: "n8n Automation",
            nameAr: "أتمتة n8n",
            image: publicAsset('image/n8n.jpg'),
            description: "Learn workflow automation, API integrations, and automated business processes.",
            descriptionAr: "تعلم أتمتة سير العمل، وربط واجهات API، وأتمتة العمليات التجارية.",
            category: "software",
            price: 3200,
            durationMonths: 1,
            curriculum: [
                { title: "n8n fundamentals", titleAr: "أساسيات n8n", topics: ["n8n workspace, workflows, and execution history", "Nodes, connections, and workflow data", "Manual runs, testing, and reading node output", "Organizing and naming workflows clearly"], topicsAr: ["واجهة n8n وسير العمل وسجل التنفيذ", "العُقد والروابط والبيانات بين الخطوات", "التشغيل اليدوي والاختبار وقراءة نتائج العُقد", "تنظيم مسارات العمل وتسميتها بوضوح"] },
                { title: "Triggers and core nodes", titleAr: "المشغلات والعُقد الأساسية", topics: ["Schedule, webhook, and app-event triggers", "Transform, filter, and route incoming data", "Conditions, branching, and combining workflow paths", "Working with arrays and structured JSON"], topicsAr: ["مشغلات الجدولة وwebhook وأحداث التطبيقات", "تحويل البيانات الواردة وتصفيتها وتوجيهها", "الشروط والتفرع ودمج مسارات سير العمل", "التعامل مع المصفوفات وبيانات JSON المنظمة"] },
                { title: "APIs and integrations", titleAr: "واجهات API والتكاملات", topics: ["HTTP requests, methods, headers, and parameters", "API credentials and connecting external services", "Send and receive data through webhooks", "Map fields between connected applications"], topicsAr: ["طلبات HTTP والطرق والترويسات والمعاملات", "بيانات اعتماد API وربط الخدمات الخارجية", "إرسال واستقبال البيانات عبر webhooks", "مطابقة الحقول بين التطبيقات المتصلة"] },
                { title: "Reliable automation", titleAr: "أتمتة موثوقة", topics: ["Error branches, retries, and failure notifications", "Prevent duplicate processing and inspect executions", "Protect credentials and minimize shared data", "Document and maintain workflows"], topicsAr: ["مسارات الأخطاء وإعادة المحاولة وإشعارات الفشل", "منع تكرار المعالجة ومراجعة سجلات التنفيذ", "حماية بيانات الاعتماد وتقليل البيانات المشتركة", "توثيق مسارات العمل وصيانتها"] },
                { title: "Practical automation projects", titleAr: "مشروعات أتمتة عملية", topics: ["Automate a form-to-spreadsheet workflow", "Create a notification and approval flow", "Connect multiple services through an API workflow", "Test, activate, and present a finished automation"], topicsAr: ["أتمتة انتقال بيانات نموذج إلى جدول", "إنشاء مسار للإشعارات والموافقة", "ربط عدة خدمات عبر سير عمل يستخدم API", "اختبار الأتمتة وتفعيلها وعرضها"] }
            ]

        },
        {
            id: 4,
            name: "Analog Electronics",
            nameAr: "الإلكترونيات التناظرية",
            image: publicAsset('image/analog.jpg'),
            description: "Understand analog circuits, diodes, transistors, and operational amplifiers.",
            descriptionAr: "تعرف على الدوائر التناظرية والثنائيات والترانزستورات ومضخمات العمليات.",
            category: "electronics",
            price: 4300,
            durationMonths: 2,
            curriculum: [
                { title: "Electrical fundamentals", titleAr: "أساسيات الكهرباء", topics: ["Voltage, current, resistance, and power", "Ohm's law and series and parallel circuits", "Using a multimeter and reading circuit diagrams", "Electrical safety and basic lab practice"], topicsAr: ["الجهد والتيار والمقاومة والقدرة", "قانون أوم والدوائر على التوالي والتوازي", "استخدام الملتيميتر وقراءة مخططات الدوائر", "السلامة الكهربائية وممارسات المعمل الأساسية"] },
                { title: "Passive components", titleAr: "العناصر الإلكترونية السلبية", topics: ["Resistors, capacitors, and inductors", "Component values, markings, and tolerances", "RC circuits and charging and discharging behavior", "Measure and compare practical circuit readings"], topicsAr: ["المقاومات والمكثفات والملفات", "قيم العناصر ورموزها ونسب السماحية", "دوائر RC وسلوك الشحن والتفريغ", "قياس قراءات الدوائر العملية ومقارنتها"] },
                { title: "Diodes and rectifiers", titleAr: "الثنائيات ودوائر التقويم", topics: ["Diode operation and forward and reverse bias", "LEDs, Zener diodes, and protection use cases", "Half-wave and full-wave rectifier circuits", "Filtering and measuring a simple DC power supply"], topicsAr: ["عمل الثنائي والانحياز الأمامي والعكسي", "مصابيح LED وثنائيات زينر واستخدامات الحماية", "دوائر التقويم نصف الموجة وكامل الموجة", "التنعيم وقياس مصدر تغذية مستمر بسيط"] },
                { title: "Transistors", titleAr: "الترانزستورات", topics: ["BJT and MOSFET operating principles", "Transistor as a switch and as an amplifier", "Biasing concepts and reading datasheets", "Build and test a basic transistor circuit"], topicsAr: ["مبادئ عمل BJT وMOSFET", "استخدام الترانزستور كمفتاح ومكبر", "مفاهيم الانحياز وقراءة أوراق البيانات", "تنفيذ واختبار دائرة ترانزستور أساسية"] },
                { title: "Operational amplifiers", titleAr: "مكبرات العمليات", topics: ["Op-amp pins, power, and ideal behavior", "Inverting and non-inverting amplifier circuits", "Comparators and signal conditioning", "Measure circuit behavior and troubleshoot faults"], topicsAr: ["أطراف مكبر العمليات والتغذية وسلوكه المثالي", "دوائر التكبير العاكس وغير العاكس", "المقارنات وتهيئة الإشارات", "قياس سلوك الدائرة وتشخيص الأعطال"] },
                { title: "Analog practical project", titleAr: "مشروع عملي تناظري", topics: ["Choose components for a small analog circuit", "Draw and assemble the circuit safely", "Measure input and output signals", "Document results and explain design choices"], topicsAr: ["اختيار عناصر لدائرة تناظرية صغيرة", "رسم الدائرة وتركيبها بأمان", "قياس إشارات الدخل والخرج", "توثيق النتائج وشرح اختيارات التصميم"] }
            ]

        },
        {
            id: 5,
            name: "Digital Electronics",
            nameAr: "الإلكترونيات الرقمية",
            image: publicAsset('image/digital.jpg'),
            description: "Learn logic gates, Boolean algebra, digital circuits, and sequential systems.",
            descriptionAr: "تعلم البوابات المنطقية والجبر البولياني والدوائر الرقمية والأنظمة التتابعية.",
            category: "electronics",
            price: 4300,
            durationMonths: 2,
            curriculum: [
                { title: "Number systems and digital signals", titleAr: "أنظمة العد والإشارات الرقمية", topics: ["Binary, decimal, and hexadecimal conversion", "Bits, bytes, logic levels, and digital signals", "Signed numbers and binary arithmetic", "Read truth tables and digital timing diagrams"], topicsAr: ["التحويل بين الأنظمة الثنائية والعشرية والسداسية عشرية", "البتات والبايتات ومستويات المنطق والإشارات الرقمية", "الأعداد الموقعة والحساب الثنائي", "قراءة جداول الحقيقة ومخططات التوقيت الرقمية"] },
                { title: "Boolean algebra and logic gates", titleAr: "الجبر البولياني والبوابات المنطقية", topics: ["AND, OR, NOT, NAND, NOR, XOR, and XNOR", "Boolean expressions and truth tables", "Simplification using Boolean laws and Karnaugh maps", "Build and verify gate-level circuits"], topicsAr: ["بوابات AND وOR وNOT وNAND وNOR وXOR وXNOR", "التعبيرات البوليانية وجداول الحقيقة", "التبسيط بقوانين بوليان وخرائط كارنو", "تنفيذ دوائر البوابات واختبارها"] },
                { title: "Combinational circuits", titleAr: "الدوائر التوافقية", topics: ["Adders, subtractors, and arithmetic circuits", "Multiplexers, demultiplexers, and decoders", "Encoders and code conversion", "Design a circuit from a written specification"], topicsAr: ["دوائر الجمع والطرح والعمليات الحسابية", "المبدلات وموزعات الإشارة وفك الترميز", "المرمزات وتحويل الشفرات", "تصميم دائرة انطلاقًا من متطلبات مكتوبة"] },
                { title: "Sequential logic", titleAr: "المنطق التتابعي", topics: ["Latches and flip-flops", "Clock signals, state, and timing", "Counters and shift registers", "Distinguish synchronous and asynchronous behavior"], topicsAr: ["اللاتشات والقلابات", "إشارات الساعة والحالة والتوقيت", "العدادات ومسجلات الإزاحة", "التمييز بين السلوك المتزامن وغير المتزامن"] },
                { title: "Digital system design", titleAr: "تصميم الأنظمة الرقمية", topics: ["Finite-state machine fundamentals", "Combine combinational and sequential blocks", "Simulate and troubleshoot a digital design", "Prepare a clear schematic and test plan"], topicsAr: ["أساسيات آلات الحالات المحدودة", "دمج الكتل التوافقية والتتابعية", "محاكاة التصميم الرقمي وتشخيص أخطائه", "إعداد مخطط واضح وخطة اختبار"] },
                { title: "Practical digital project", titleAr: "مشروع رقمي عملي", topics: ["Define inputs, outputs, and expected behavior", "Design and simulate a complete logic circuit", "Assemble or prototype and verify the results", "Present the truth table and design decisions"], topicsAr: ["تحديد المدخلات والمخرجات والسلوك المتوقع", "تصميم ومحاكاة دائرة منطقية متكاملة", "تنفيذ نموذج أولي والتحقق من النتائج", "عرض جدول الحقيقة وقرارات التصميم"] }
            ]

        },
        {
            id: 6,
            name: "PCB Design",
            nameAr: "تصميم لوحات الدوائر المطبوعة",
            image: publicAsset('image/pcb.jpg'),
            description: "Learn schematic design, PCB layout, routing, and circuit board design.",
            descriptionAr: "تعلم تصميم المخططات وتخطيط لوحات الدوائر المطبوعة والتوصيلات وتصميم اللوحات.",
            category: "electronics",
            price: 1700,
            durationMonths: 1,
            curriculum: [
                { title: "PCB and schematic fundamentals", titleAr: "أساسيات PCB والمخططات", topics: ["PCB layers, copper, solder mask, and silkscreen", "Read component symbols and circuit schematics", "Schematic connectivity, nets, and reference labels", "Plan design constraints before layout"], topicsAr: ["طبقات PCB والنحاس وقناع اللحام والطباعة", "قراءة رموز العناصر والمخططات الإلكترونية", "التوصيلات والشبكات وعلامات تعريف العناصر", "تحديد قيود التصميم قبل تخطيط اللوحة"] },
                { title: "EDA tools and libraries", titleAr: "أدوات التصميم ومكتبات العناصر", topics: ["Create and organize an EDA project", "Select symbols and verify component footprints", "Associate schematic components with board footprints", "Manage libraries and component documentation"], topicsAr: ["إنشاء مشروع EDA وتنظيم ملفاته", "اختيار الرموز والتحقق من بصمات العناصر", "ربط عناصر المخطط ببصمات اللوحة", "إدارة المكتبات وتوثيق العناصر"] },
                { title: "Board layout", titleAr: "تخطيط اللوحة", topics: ["Board outline, dimensions, and design rules", "Component placement and connector positioning", "Trace width, clearance, and copper routing", "Ground planes and practical routing considerations"], topicsAr: ["حدود اللوحة وأبعادها وقواعد التصميم", "توزيع العناصر ومواقع الموصلات", "عرض المسارات والمسافات وتوجيه النحاس", "مستويات الأرضي واعتبارات التوصيل العملية"] },
                { title: "Design checks and manufacturing files", titleAr: "مراجعة التصميم وملفات التصنيع", topics: ["Run electrical and design rule checks", "Resolve unconnected nets and clearance violations", "Review silkscreen, drill, and board layers", "Export and inspect Gerber and drill files"], topicsAr: ["تشغيل فحوصات التوصيل وقواعد التصميم", "معالجة الشبكات غير المتصلة ومشكلات المسافات", "مراجعة الطباعة وطبقات الحفر واللوحة", "تصدير وفحص ملفات Gerber والحفر"] },
                { title: "PCB graduation project", titleAr: "مشروع التخرج للوحة PCB", topics: ["Create a schematic for a small electronic circuit", "Convert the schematic into a routed board", "Validate the design and prepare manufacturing outputs", "Present the board layout and design review"], topicsAr: ["إنشاء مخطط لدائرة إلكترونية صغيرة", "تحويل المخطط إلى لوحة ذات مسارات", "التحقق من التصميم وتجهيز ملفات التصنيع", "عرض تخطيط اللوحة ومراجعة التصميم"] }
            ]

        },
        {
            id: 7,
            name: "Robotics",
            nameAr: "الروبوتات",
            image: publicAsset('image/robitcs.jpg'),
            description: "Explore robotics fundamentals, sensors, actuators, and control systems.",
            descriptionAr: "استكشف أساسيات الروبوتات والمستشعرات والمشغلات وأنظمة التحكم.",
            category: "robotics",
            price: 3800,
            durationMonths: 3,
            curriculum: [
                { title: "Robotics and electronics foundations", titleAr: "أساسيات الروبوتات والإلكترونيات", topics: ["Robot components and basic system architecture", "Voltage, current, circuit connections, and safety", "Microcontroller board setup and digital input/output", "Write and upload a first control program"], topicsAr: ["مكونات الروبوت والبنية الأساسية للنظام", "الجهد والتيار وتوصيل الدوائر والسلامة", "إعداد لوحة المتحكم الدقيق والمداخل والمخارج الرقمية", "كتابة ورفع أول برنامج للتحكم"] },
                { title: "Sensors and input", titleAr: "المستشعرات والمدخلات", topics: ["Digital and analog sensor readings", "Distance, light, and line-detection sensor concepts", "Calibrate readings and handle noisy values", "Use sensor input to make a robot decision"], topicsAr: ["قراءات المستشعرات الرقمية والتناظرية", "مفاهيم مستشعرات المسافة والضوء وتتبع الخط", "معايرة القراءات والتعامل مع القيم المتذبذبة", "استخدام مدخلات المستشعر لاتخاذ قرار"] },
                { title: "Motors and actuators", titleAr: "المحركات والمشغلات", topics: ["DC motors, servos, and actuator use cases", "Motor driver connections and power requirements", "Control direction and speed", "Test movement and diagnose common wiring issues"], topicsAr: ["محركات DC والسيرفو واستخدامات المشغلات", "توصيل مشغل المحرك ومتطلبات التغذية", "التحكم في الاتجاه والسرعة", "اختبار الحركة وتشخيص أخطاء التوصيل الشائعة"] },
                { title: "Robot programming and control", titleAr: "برمجة الروبوت والتحكم", topics: ["Functions, conditions, loops, and state-based behavior", "Combine sensor readings with motor actions", "Timing, calibration, and repeatable movement", "Structure and debug a multi-step robot program"], topicsAr: ["الدوال والشروط والحلقات والسلوك المعتمد على الحالات", "ربط قراءات المستشعر بحركة المحركات", "التوقيت والمعايرة وتكرار الحركة بدقة", "تنظيم وتصحيح برنامج روبوت متعدد الخطوات"] },
                { title: "Autonomous behavior", titleAr: "السلوك المستقل للروبوت", topics: ["Obstacle detection and response logic", "Line following or another guided navigation task", "Test behavior in different conditions", "Improve reliability through iteration"], topicsAr: ["اكتشاف العوائق ومنطق الاستجابة", "تتبع الخط أو مهمة تنقل موجهة مناسبة", "اختبار السلوك في ظروف مختلفة", "تحسين الاعتمادية بالتجربة والتطوير"] },
                { title: "Robotics graduation project", titleAr: "مشروع التخرج للروبوتات", topics: ["Choose a practical robot task and define requirements", "Assemble the robot and connect sensors and actuators", "Program, test, and refine the robot behavior", "Present the build, code, and test results"], topicsAr: ["اختيار مهمة عملية للروبوت وتحديد متطلباتها", "تركيب الروبوت وتوصيل المستشعرات والمشغلات", "برمجة سلوك الروبوت واختباره وتحسينه", "عرض التركيب والبرنامج ونتائج الاختبار"] }
            ]

        },
    ]
export default Detalis