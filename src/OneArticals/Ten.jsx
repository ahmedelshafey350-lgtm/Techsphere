
import { Visibility, CalendarToday, AccountCircle } from '@mui/icons-material';


const articleData = [
    {
        id: 1, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "الوظائف الجديدة التي ظهرت بسبب الذكاء الاصطناعي و AI Automation",
        category1: "الذكاء الاصطناعي",
        category2: "سوق العمل",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "ثورة التوظيف في عصر الذكاء الاصطناعي وأتمتة العمليات",
        introText: "مع التطور الهائل في تقنيات الذكاء الاصطناعي وأتمتة العمليات (AI Automation)، لم يعد الأمر يقتصر فقط على استبدال بعض الوظائف التقليدية، بل فتح باباً واسعاً لظهور مسميات وظيفية جديدة لم تكن موجودة من قبل. الشركات اليوم تبحث بشراهة عن متحدثين وخبراء لتقنيات الـ AI لدمجها في بنيتها التحتية وزيادة الإنتاجية.",

        howToChooseTitle: "أبرز الوظائف الجديدة التي أحدثت ضجة في سوق العمل",
        howToChooseSubtitle: "إذا كنت تطور مهاراتك وترغب في دخول هذا المجال الواعد، فإليك أهم المجالات والوظائف المستحدثة:",
        skillsList: [
            "مهندس مطالبات الذكاء الاصطناعي (Prompt Engineer).",
            "مختص أتمتة العمليات بالذكاء الاصطناعي (AI Workflow Automation Specialist).",
            "مدير تدقيق الأخلاقيات وحوكمة خوارزميات الـ AI.",
            "مطور روبوتات محادثة ونظم دعم العملاء الذكية.",
            "محلل بيانات نماذج التعلم العميق (Deep Learning Data Analyst).",
            "مستشار تكامل الأنظمة السحابية والذكية (AI Integration Consultant)."
        ],
        goldenTip: "نصيحة ذهبية: الدمج بين المعرفة التقنية البرمجية وفهم أدوات الذكاء الاصطناعي يضاعف من قيمتك السوقية ويجعلك المطلوب الأول في كبرى الشركات.",

        projects: [
            {
                id: 1,
                title: "مهندس المطالبات (Prompt Engineer)",
                desc: "المسؤول عن صياغة وتطوير الأوامر والمدخلات بدقة لاستخراج أفضل وأدق نتائج ممكنة من نماذج الـ AI.",
                components: "فهم لغة النماذج الكبيرة (LLMs)، اختبار الاستجابات، تحسين دقة المخرجات.",
                skills: "فهم عميق للذكاء الاصطناعي التوليدي – صياغة المنطق اللغوي والتقني."
            },
            {
                id: 2,
                title: "أتمتة سير العمل (AI Automation Specialist)",
                desc: "الربط بين التطبيقات والأدوات المختلفة باستخدام الذكاء الاصطناعي لتخفيف الجهد البشري في المهام الروتينية.",
                components: "بناء مسارات العمل الآلية، ربط الـ APIs، تقليل الأخطاء التشغيلية.",
                skills: "Make/Zapier – Python – ربط واجهات برمجة التطبيقات APIs."
            },
            {
                id: 3,
                title: "مطور تطبيقات النماذج الذكية (AI App Developer)",
                desc: "دمج الذكاء الاصطناعي داخل تطبيقات الويب والهواتف لتوفير تجارب مستخدم مخصصة وذكية.",
                components: "بناء الواجهات، استدعاء نماذج الـ AI برمجياً، إدارة الحالات والاستجابة السريعة.",
                skills: "React.js – Node.js – OpenAI/Claude APIs."
            },
            {
                id: 4,
                title: "مدير حوكمة وأمان الـ AI",
                desc: "مراقبة الأنظمة الذكية للتأكد من خلو مخرجاتها من التحيز أو اختراق خصوصية المستخدمين.",
                components: "تدقيق الخوارزميات، وضع سياسات الاستخدام الآمن، حماية بيانات العملاء.",
                skills: "أمن المعلومات – سياسات وحوكمة التكنولوجيا – تحليل المخاطر."
            }
        ],

        howToPresentTitle: "كيف تؤهل نفسك لهذه الوظائف المستحدثة؟",
        howToPresentText: "الحصول على وظيفة في مجال AI Automation يتطلب إثبات كفاءة عملية وليس مجرد شهادات نظرية. ركز على الآتي:",
        presentationSteps: [
            "بناء مشروع عملي يدمج أتمتة مهام حقيقية (مثل ربط منصة عملاء بنظام ذكاء اصطناعي).",
            "توثيق الكود وشرح فكرة الأتمتة على منصة GitHub.",
            "صياغة Portfolio يوضح كيف ساهم مشروعك في توفير الوقت أو خفض التكاليف بنسبة مئوية واضحة.",
            "متابعة التحديثات المستمرة لأدوات الأتمتة الحديثة وتجربتها بشكل دوري."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "الذكاء الاصطناعي لن يستبدلك، بل الشخص الذي يتقن استخدام الذكاء الاصطناعي هو من سيستبدل من لا يتقنه. البدء في تعلم مهارات الـ AI Automation وبناء مشاريع حقيقية يضعك في صدارة المنافسة بسوق العمل الحديث."
    }
    , {
        id: 2,
        title: "أفضل مشاريع برمجية للمبتدئين لبناء Portfolio قوي ودخول سوق العمل",
        category1: "الذكاء الاصطناعي",
        category2: "التوجيه المهني",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
        introTitle: "أهمية المشاريع والـ Portfolio لدخول سوق البرمجة",
        introText: "إذا كنت تريد دخول سوق البرمجة، فهناك حقيقة مهمة يجب أن تعرفها: الكورسات وحدها لا تكفي. الكثير من المبتدئين يقضون شهورًا في مشاهدة الدروس، ثم يكتشفون أنهم لا يملكون شيئًا عمليًا يثبت مهاراتهم؛ فالشركات تهتم أكثر بما تستطيع تنفيذه، وليس بعدد الشهادات التي حصلت عليها. هنا تأتي الأهمية الحقيقية للمشاريع والـ Portfolio. وجود Portfolio قوي لا يعني امتلاك عشرات المشاريع، بل يعني وجود مشاريع حقيقية، منظمة، وتوضح قدراتك التقنية بشكل واضح.",

        howToChooseTitle: "كيف تختار مشروعًا برمجياً مناسبًا للـ Portfolio؟",
        howToChooseSubtitle: "قبل أن تبدأ أي مشروع اسأل نفسك: ما المهارة التي ستثبتها؟ المشروع الجيد يجب أن يوضح واحدة أو أكثر من المهارات التالية:",
        skillsList: [
            "بناء واجهات المستخدم (UI/UX).",
            "التعامل مع قواعد البيانات (Databases).",
            "استهلاك واستدعاء الـ APIs.",
            "إنشاء نظام تسجيل دخول وحماية (Authentication).",
            "تحليل البيانات (Data Analysis).",
            "تنظيم الكود وهيكلة المشروع (Clean Code & Architecture)."
        ],
        goldenTip: "نصيحة ذهبية: تجنب تنفيذ مشاريع كثيرة متشابهة بدون هدف، وبدلاً من ذلك ركز على تنفيذ عدد أقل ولكن بجودة أعلى وتفاصيل أعمق.",

        projects: [
            {
                id: 1,
                title: "تطبيق To-Do List متقدم",
                desc: "قد يبدو مشروع To-Do List بسيطا، لكنه من أقوى مشاريع المبتدئين إذا تم تطويره بشكل صحيح.",
                components: "تسجيل الدخول، إنشاء وتصنيف المهام، تحديد موعد نهائي، فلترة المهام، وحفظ البيانات.",
                skills: "إدارة الحالة (State Management) – قواعد البيانات – تصميم الواجهات."
            },
            {
                id: 2,
                title: "موقع Portfolio شخصي",
                desc: "إذا كنت تبحث عن أول وظيفة في البرمجة فهذا المشروع ضروري ولا غنى عنه.",
                components: "نبذة شخصية، المهارات التقنية، المشاريع السابقة، روابط (GitHub و LinkedIn)، ومعلومات التواصل.",
                skills: "تصميم المواقع – بناء الهوية المهنية (Personal Branding). (نصيحة للتصميم: اجعل التصميم بسيطا، سريعًا، ومتوافقًا مع الشاشات المختلفة والهواتف Responsive)."
            },
            {
                id: 3,
                title: "متجر إلكتروني بسيط (E-commerce)",
                desc: "المتجر الإلكتروني يعتبر من المشاريع التي تعطي انطباعًا قويًا لأنه قريب جدًا من المشاريع الواقعية في السوق.",
                components: "عرض المنتجات، البحث والفلاترة، صفحة تفاصيل المنتج، سلة الشراء، وتجربة دفع تجريبية.",
                skills: "Front-End – Back-End – إدارة البيانات والعمليات المعقدة."
            },
            {
                id: 4,
                title: "لوحة تحكم للمبيعات (Sales Dashboard)",
                desc: "إذا كنت تريد إظهار مهاراتك في التعامل مع البيانات وعرضها، فهذا المشروع ممتاز.",
                components: "إجمالي المبيعات، عدد الطلبات، المنتجات الأعلى أداءً، رسوم بيانية تفاعلية، وتقارير مختصرة.",
                skills: "تصور البيانات (Data Visualization) – تحليل البيانات."
            },
            {
                id: 5,
                title: "تطبيق إدارة المصاريف الشخصية",
                desc: "هذا المشروع عملي للغاية ويمكن للمستخدمين الاستفادة منه فعليًا في حياتهم اليومية.",
                components: "إضافة المصروفات، تصنيف الإنفاق، تقارير شهرية، رسوم بيانية توضيحية، وخاصية تصدير البيانات.",
                skills: "التعامل مع البيانات الحسابية وتجربة المستخدم (UX)."
            },
            {
                id: 6,
                title: "نظام حجز مواعيد (Appointment Booking System)",
                desc: "مشروع ممتاز لأنه يحاكِي أنظمة الشركات والعيادات الحقيقية.",
                components: "اختيار الخدمة، اختيار الموعد المتاح، تأكيد الحجز، ولوحة إدارة (Admin Dashboard) للتحكم في المواعيد.",
                skills: "المنطق البرمجي (Business Logic) – تصميم وجدولة قواعد البيانات."
            },
            {
                id: 7,
                title: "تطبيق طقس باستخدام API",
                desc: "من أفضل المشاريع لتعلم كيفية التعامل مع الخدمات الخارجية وجلب البيانات الحية.",
                components: "عرض درجة الحرارة، اسم المدينة، حالة الطقس، التوقعات الأسبوعية، مع معالجة الأخطاء (Error Handling) بشكل ذكي إذا كانت المدينة غير موجودة.",
                skills: "API Integration – التعامل مع البيانات غير المتزامنة (Asynchronous Data)."
            },
            {
                id: 8,
                title: "نظام إدارة محتوى (CMS) بسيط",
                desc: "إذا كان تركيزك منصبا على تطوير مهارات الـ Back-End، فهذا المشروع خيار مثالي.",
                components: "إنشاء المقالات، تعديلها، حذفها (CRUD Operations)، لوحة تحكم، وتحديد صلاحيات المستخدمين & الـ Roles (Permissions).",
                skills: "إدارة المحتوى – حماية البيانات وقواعد البيانات."
            },
            {
                id: 9,
                title: "روبوت محادثة بسيط (Chatbot)",
                desc: "مشروع يواكب متطلبات السوق الحالية في الأتمتة وخدمة العملاء.",
                components: "ردود تلقائية بناءً على كلمات مفتاحية، حفظ سجل المحادثات، أو ربط المشروع بـ API خارجي للذكاء الاصطناعي.",
                skills: "الأتمتة – المنطق البرمجي والتعامل مع النصوص."
            },
            {
                id: 10,
                title: "مشروع تحليل بيانات (Data Analysis Project)",
                desc: "اختر مجموعة بيانات (Dataset) حقيقية من منصات مثل Kaggle وابدأ في استخراج النتائج منها.",
                components: "تنظيف البيانات، استخراج الأنماط، وعرض النتائج داخل Dashboard واضح. (أمثلة للبيانات: بيانات مبيعات، بيانات سلوك العملاء، أو بيانات تسويقية).",
                skills: "تحليل البيانات واستخراج التوصيات والمؤشرات (Insights)."
            }
        ],

        howToPresentTitle: "كيف تعرض مشاريعك بشكل احترافي؟",
        howToPresentText: "حتى المشروع الجيد قد يظهر بشكل ضعيف إذا تم عرضه بطريقة غير منظمة. لكي تبرز قوة عملك، أضف لكل مشروع في الـ Portfolio الخاص بك:",
        presentationSteps: [
            "وصف مختصر: ما هو المشروع باختصار؟",
            "المشكلة والحل: ما هي المشكلة الحقيقية التي يحُلها هذا التطبيق؟",
            "التقنيات المستخدمة: قائمة بالأدوات واللغات (Tech Stack).",
            "العرض المرئي: صور عالية الجودة أو فيديو قصير يوضح طريقة عمل المشروع.",
            "روابط مباشرة: رابط لمعاينة المشروع حيّاً (Live Demo) ورابط الكود على GitHub.",
            "التحديات: ما هي المشاكل التقنية التي واجهتك وكيف نجحت في حلها؟"
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "أفضل مشاريع للمبتدئين ليست المشاريع الأكثر عددًا، بل المشاريع التي تثبت قدرتك على بناء شيء حقيقي من الصفر. إذا نفذت 3 مشاريع فقط، مكتوبة بكود نظيف، وموثقة جيدًا، فستكون فرصتك في دخول سوق العمل واجتياز المقابلات الشخصية أعلى بكثير من شخص قضى وقته في جمع عشرات الشهادات والكورسات بدون تطبيق عملي."
    },
    {
        id: 3, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "رواتب المبرمجين في مصر والدول العربية 2026 وعوامل زيادتها",
        category1: "سوق العمل",
        category2: "التوجيه المهني",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "دليلك الشامل لرواتب المبرمجين في مصر والمنطقة العربية",
        introText: "تختلف رواتب المبرمجين بشكل كبير بناءً على عدة عوامل رئيسية تشمل: مستوى الخبرة، نوع الشركة (محلية، شركات منتجات كبرى أو شركات متعددة الجنسيات، أو العمل عن بُعد بالدولار)، والتخصص التقني. السوق التقني يشهد طفرة مستمرة وتغيرات ملحوظة في هيكل الأجور.",

        howToChooseTitle: "متوسطات الرواتب حسب الدولة ومستويات الخبرة",
        howToChooseSubtitle: "تتفاوت الرواتب (صافي شهرياً) في أهم الأسواق العربية بناءً على المؤسسة والخبرة كالتالي:",
        skillsList: [
            "مصر (المستوى المبتدئ): من 10,000 إلى 32,000 جنيه شهرياً حسب نوع الشركة.",
            "مصر (مستوى الخبرة Senior): من 35,000 إلى أكثر من 105,000 جنيه شهرياً في الشركات الكبرى.",
            "العمل عن بُعد (Remote بالدولار): من 1,800 إلى أكثر من 5,000 دولار شهرياً.",
            "الإمارات (دبي/أبوظبي): تتراوح بين 8,000 إلى أكثر من 45,000 درهم إماراتي شهرياً.",
            "السعودية (الرياض/جدة): تبدأ من 7,000 وتصل لأكثر من 50,000 ريال سعودي للخبرات العالية.",
            "دول الخليج الأخرى والشام وشمال إفريقيا: تختلف حسب حزم الرواتب وقوة الاقتصاد المحلي."
        ],
        goldenTip: "نصيحة ذهبية: إتقان اللغة الإنجليزية والتوجه للعمل عن بُعد مع شركات أجنبية يضاعف دخلك الشهري أضعافاً مضاعفة مقارنة بالسوق المحلي.",

        projects: [
            {
                id: 1,
                title: "السوق المصري والشركات المحلية",
                desc: "تدرج الرواتب من Junior حتى Senior في الشركات المصرية وشركات الـ Outsourcing.",
                components: "رواتب تتناسب مع تكلفة المعيشة مع فرص ترقي سريعة لمن يمتلك مهارات قوية.",
                skills: "الخبرة العملية – القدرة على حل المشكلات – التواصل الفعال."
            },
            {
                id: 2,
                title: "دول الخليج (الإمارات والسعودية)",
                desc: "تُعد الأسواق الأعلى أجراً في المنطقة نظراً لطفرة التحول الرقمي ومشاريع الرؤية.",
                components: "حزم رواتب تنافسية، غالباً معفاة من الضرائب، وتشمل بدلات سكن وتأمين.",
                skills: "الشهادات المهنية المعتمدة – خبرة المشاريع الضخمة – العمل الجماعي."
            },
            {
                id: 3,
                title: "العمل الحر والعمل عن بُعد (Freelance & Remote)",
                desc: "الخيار الأفضل لمضاعفة الدخل وتقاضي الرواتب بالعملة الصعبة (الدولار أو اليورو).",
                components: "التعامل مع عملاء أجانب أو شركات عالمية كبرى وأنت مقيم في مكانك.",
                skills: "مهارات التفاوض – الالتزام بالمواعيد – لغة إنجليزية ممتازة."
            },
            {
                id: 4,
                title: "التخصصات الأعلى أجوراً",
                desc: "التخصصات التقنية التي تحظى بسقف رواتب أعلى بكثير من التطوير التقليدي.",
                components: "الذكاء الاصطناعي (AI/ML)، هندسة السحابة (Cloud/DevOps)، والأمن السيبراني.",
                skills: "التعمق التقني المستمر – متابعة أحدث تقنيات السوق."
            }
        ],

        howToPresentTitle: "العوامل الأكثر تأثيراً على زيادة راتبك البرمجي",
        howToPresentText: "الحصول على راتب أعلى لا يعتمد فقط على عدد سنوات السنين، بل تحكمه معايير حاسمة:",
        presentationSteps: [
            "التخصص الدقيق: المجالات المتقدمة مثل الذكاء الاصطناعي وDevOps تطلب بشراهة وتدفع رواتب أعلى.",
            "قوة الـ Portfolio: وجود مشاريع حقيقية ومنظمة يثبت كفاءتك يختصر سنوات طويلة في زيادات الرواتب.",
            "لغة الإجادة: إتقان الإنجليزية يفتح لك أبواب الشركات العالمية والعمل عن بُعد.",
            "المهارات الشخصية (Soft Skills): القدرة على عرض أفكارك وحل المشكلات مع فريق العمل."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "سوق البرمجة يعتمد بشكل أساسي على ما يمكنك تنفيذه وتقديم قيمه حقيقية من خلاله. الاستثمار في تطوير مهاراتك وبناء مشاريع قوية هو المفتاح الأساسي للوصول لأعلى الشريحة المالية في مصر والدول العربية أو العمل دولياً."
    },
    {
        id: 4, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "كيف تتعلم الإلكترونيات من الصفر؟ دليلك الشامل خطوة بخطوة",
        category1: "الهندسة والتقنية",
        category2: "التعليم الذاتي",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "رحلة الدخول إلى عالم الإلكترونيات والدوائر الكهربائية",
        introText: "تعلم الإلكترونيات من الصفر هو رحلة ممتعة ومجزية، خاصة إذا كنت ترغب في فهم كيفية عمل الأجهزة حولك، أو صيانة اللوحات الصناعية، أو الدخول في مجالات الأنظمة المدمجة (Embedded Systems) والأتمتة.",

        howToChooseTitle: "الخطوات الأساسية لإتقان الإلكترونيات",
        howToChooseSubtitle: "لبناء أساس قوي، يجب أن تسير في تعلمك عبر مراحل منظمة تبدأ بالنظري وتنتقل إلى العملي:",
        skillsList: [
            "الأساسيات الفيزيائية وقانون أوم (Ohm's Law) والكميات الكهربائية.",
            "التعرف على المكونات الأساسية (مقاومات، مكثفات، ديودات، ترانزستورات).",
            "استخدام أدوات القياس مثل المتر (Multimeter) ولوحة التجارب (Breadboard).",
            "بناء الدوائر الأولى والتجارب العملية البسيطة.",
            "الانتقال إلى الأنظمة المدمجة والمتحكمات الدقيقة مثل الأردوينو."
        ],
        goldenTip: "نصيحة ذهبية: التطبيق العملي وبناء الدوائر بيدك هو ما يصنع الفارق الحقيقي، ولا تكتفِ بالقراءة النظرية مطلقاً.",

        projects: [
            {
                id: 1,
                title: "المرحلة الأولى: الأساسيات النظرية والفيزيائية",
                desc: "فهم لغة الكهرباء الأساسية كالجهد، التيار، المقاومة، والعلاقة بينهم عبر قانون أوم.",
                components: "قانون أوم، قوانين كيرشوف، الفرق بين التيار المستمر (DC) والمتردد (AC).",
                skills: "التحليل الحسابي للدوائر – فهم حركة الشحنات."
            },
            {
                id: 2,
                title: "المرحلة الثانية: المكونات الإلكترونية",
                desc: "التعرف على شكل كل قطعتين ووظيفتها وكيفية قراءة قيمها وقدرتها على التحمل.",
                components: "المقاومات، المكثفات، الملفات، الديودات، والترانزستورات.",
                skills: "قراءة الألوان والقيم – التمييز بين أنواع العناصر."
            },
            {
                id: 3,
                title: "المرحلة الثالثة: الأدوات والمعدات العملية",
                desc: "تجهيز ورشتك البسيطة بالأدوات اللازمة لفحص وتوصيل الدوائر بأمان.",
                components: "المتعدد القياسات (Multimeter)، لوحة التجارب (Breadboard)، كويّة اللحام.",
                skills: "فحص التوصيلات – قياس الجهود – اللحام السليم على البوردات."
            },
            {
                id: 4,
                title: "المرحلة الرابعة: المتحكمات والأتمتة (Arduino)",
                desc: "دمج البرمجة بالإلكترونيات للتحكم في الحساسات والمحركات وبناء مشاريع ذكية.",
                components: "شريحة أردوينو، حساسات حرارة وحركة، محركات وسيرفوات.",
                skills: "برمجة المتحكمات – قراءة Datasheet – ربط الهاردوير بالسوفتوير."
            }
        ],

        howToPresentTitle: "كيف تطور مهاراتك بشكل مستمر؟",
        howToPresentText: "التعلم الذاتي في الإلكترونيات يحتاج إلى ممارسة واعية ومتابعة لأحدث التقنيات:",
        presentationSteps: [
            "استخدام برامج المحاكاة الافتراضية مثل Tinkercad لتجربة الدوائر قبل تنفيذها حقيقياً لتجنب التلف.",
            "قراءة أوراق البيانات (Datasheet) الخاصة بأي مكون إلكتروني لمعرفة حدود تشغيله.",
            "تنفيذ مشاريع صغيرة متكاملة وحل الأعطال والمشكلات التي تواجهك أثناء التوصيل.",
            "متابعة الشروحات العملية والورش الفنية لتطوير مهارات استكشاف الأعطال وتصليح اللوحات."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "الإلكترونيات علم تراكمي يعتمد على التجربة والخطأ. بالبدء بالأساسيات البسيطة والتدرج نحو المشاريع العملية والمتحكمات، ستتمكن من بناء فهم قوي يفتح لك أبواباً واسعة في صيانة الأجهزة والأنظمة الذكية."
    },
    {
        id: 5, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "كيف تتعلم البرمجة من الصفر؟ دليلك الشامل لدخول سوق العمل",
        category1: "البرمجة والتطوير",
        category2: "التوجيه المهني",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "رحلة الانطلاق في عالم البرمجة وبناء المستقبل التقني",
        introText: "تعلم البرمجة من الصفر لم يعد رفاهية بل أصبح ضرورة حتمية لكل من يريد مواكبة العصر الرقمي. البداية الصحيحة تتطلب اختيار اللغة المناسبة، فهم المفاهيم الأساسية، والتركيز على التطبيق العملي لبناء مشاريع حقيقية تؤهلك لسوق العمل.",

        howToChooseTitle: "الخطوات الأساسية لتعلم البرمجة باحترافية",
        howToChooseSubtitle: "لكي تبدأ رحلتك بشكل صحيح وتتجنب التشتت، يجب أن تتبع منهجية واضحة:",
        skillsList: [
            "تحديد المجال المستهدف (تطوير الويب، الهواتف، الذكاء الاصطناعي، أو علوم البيانات).",
            "اختيار لغة برمجة مناسبة للبداية (مثل Python أو JavaScript).",
            "فهم أساسيات علوم الكمبيوتر وطريقة تفكير المبرمج (Problem Solving).",
            "التطبيق العملي الفوري وبناء مشاريع صغيرة لكل مفهوم تتعلمه.",
            "استخدام أدوات إدارة الكود مثل Git و GitHub من اليوم الأول."
        ],
        goldenTip: "نصيحة ذهبية: لا تستغرق وقتاً طويلاً في دراسة النظريات، فالبرمجة تُتعلم بالكتابة المستمرة وحل الأخطاء (Debugging) بيديك.",

        projects: [
            {
                id: 1,
                title: "المرحلة الأولى: اختيار اللغة والأساسيات",
                desc: "فهم المتغيرات، الدوال (Functions)، الحلقات التكرارية (Loops)، والجمل الشرطية.",
                components: "أساسيات لغة البرمجة، التعامل مع المدخلات والمخرجات، المنطق البرمجي.",
                skills: "التفكير المنطقي – حل المشكلات البسيطة."
            },
            {
                id: 2,
                title: "المرحلة الثانية: بناء مشاريع المبتدئين",
                desc: "تطبيق ما تعلمته في مشاريع صغيرة تثبت فهمك الأساسي للغة.",
                components: "آلة حاسبة، لعبة تخمين الأرقام، تطبيق To-Do List بسيط.",
                skills: "ربط المفاهيم ببعضها – كتابة كود نظيف (Clean Code)."
            },
            {
                id: 3,
                title: "المرحلة الثالثة: التخصص وتطوير الويب/التطبيقات",
                desc: "التعمق في التقنيات والمكتبات المستخدمة فعلياً في شركات البرمجة.",
                components: "HTML/CSS/JS لتطوير واجهات الويب، أو إطار عمل مثل React و Node.js.",
                skills: "Front-End & Back-End – التعامل مع قواعد البيانات."
            },
            {
                id: 4,
                title: "المرحلة الرابعة: بناء الـ Portfolio ودخول سوق العمل",
                desc: "تجميع مشاريعك القوية في معرض أعمال احترافي والتقديم على الوظائف.",
                components: "رفع المشاريع على GitHub، كتابة وصف احترافي، تجهيز السيرة الذاتية.",
                skills: "عرض المشاريع بوضوح – مهارات المقابلات التقنية."
            }
        ],

        howToPresentTitle: "كيف تثبت مهاراتك وتضمن قبولك في الشركات؟",
        howToPresentText: "الشهادات وحدها لا تكفي للحصول على وظيفة برمجية، بل تحتاج إلى أدلة واضحة على كفاءتك:",
        presentationSteps: [
            "تنفيذ 3 مشاريع قوية ومتكاملة تحل مشاكل حقيقية وتغطي جوانب الـ Front-End و Back-End.",
            "توثيق الكود بشكل احترافي وشرح طريقة تشغيل كل مشروع في ملف Readme على GitHub.",
            "المشاركة المستمرة في مجتمعات البرمجة وحل المشكلات اليومية على منصات مثل LeetCode أو HackerRank.",
            "التواصل الفعال وبناء علاقات مع المبرمجين عبر منصة LinkedIn."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "البرمجة مهارة مكتسبة تتطلب الصبر والممارسة المستمرة وليست موهبة فطرية. بالالتزام بخطة واضحة وبناء مشاريع عملية حقيقية، ستتمكن من دخول سوق العمل البرمجي بثقة واقتدار."
    },
    {
        id: 6, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "كيف تحصل على وظيفة في البرمجة بدون خبرة؟ دليلك الشامل لدخول سوق العمل",
        category1: "سوق العمل",
        category2: "التوجيه المهني",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "دليلك للحصول على أول وظيفة برمجية بدون خبرة مسبقة",
        introText: "الحصول على أول وظيفة في مجال البرمجة بدون خبرة سابقة قد يبدو تحدياً كبيراً، ولكنه ليس مستحيلاً. الشركات اليوم لا تبحث فقط عن سنوات الخبرة، بل تبحث عن القدرة على حل المشكلات، وامتلاك Portfolio قوي يثبت مهاراتك العملية والقدرة على الإنتاج من اليوم الأول.",

        howToChooseTitle: "الخطوات الأساسية لاقتناص فرصتك الأولى",
        howToChooseSubtitle: "لكي تبرز بين آلاف المتقدمين وتعوض غياب سنوات الخبرة، ركز على المحاور التالية:",
        skillsList: [
            "بناء معرض أعمال (Portfolio) يحتوي على مشاريع حقيقية ومنظمة.",
            "كتابة سيرة ذاتية (CV) احترافية وموجزة تبرز مشاريعك ومهاراتك التقنية.",
            "الاستعداد الجيد للمقابلات التقنية واختبارات حل المشكلات (Problem Solving).",
            "التواصل الفعال وبناء شبكة علاقات مع المبرمجين ومديري التوظيف عبر LinkedIn.",
            "التقديم على تدريبات (Internships) أو مشاريع عمل حر (Freelance) لبناء سِجل مهني."
        ],
        goldenTip: "نصيحة ذهبية: مشروع واحد حقيقي ومكتوب بكود نظيف يعوض تماماً غياب الخبرة الرسمية ويجذب انتباه مسؤولي التوظيف فوراً.",

        projects: [
            {
                id: 1,
                title: "المرحلة الأولى: بناء Portfolio قوي ومتنوع",
                desc: "تجميع أفضل مشاريعك في مكان واحد يسهل على مسؤولي التوظيف تصفحه ومعاينة الكود.",
                components: "موقع شخصي، روابط GitHub، روابط معاينة حية (Live Demo).",
                skills: "تنظيم المشاريع – إبراز المهارات التقنية بوضوح."
            },
            {
                id: 2,
                title: "المرحلة الثانية: صياغة CV احترافي للمبرمجين",
                desc: "تصميم سيرة ذاتية خالية من الحشو ومركزة على الأدوات، التقنيات، والمشاريع المنفذة.",
                components: "ملخص مهني، المهارات التقنية، تفاصيل المشاريع، روابط التواصل.",
                skills: "الوضوح والاحترافية – التركيز على القيمة المُقدمة."
            },
            {
                id: 3,
                title: "المرحلة الثالثة: إتقان مهارات المقابلات التقنية",
                desc: "التدرب على الإجابة عن الأسئلة البرمجية الشائعة وشرح طريقة تفكيرك في حل المشاكل.",
                components: "أسئلة هياكل البيانات والخوارزميات، نقاش حول مشاريعك السابقة.",
                skills: "التواصل الفعال تحت الضغط – شرح الكود بوضوح."
            },
            {
                id: 4,
                title: "المرحلة الرابعة: استراتيجية التقديم والتواصل",
                desc: "طريقة البحث عن الوظائف المستهدفة والتقديم الذكي عبر المنصات المختلفة.",
                components: "متابعة الشركات الناشئة، التواصل المباشر مع التيم ليدرز، التقديم المخصص.",
                skills: "التسويق الذاتي – بناء شبكة العلاقات المهنية."
            }
        ],

        howToPresentTitle: "كيف تقنع الشركة بقبولك رغم غياب الخبرة؟",
        howToPresentText: "الشركات تبحث عن شخص يُسهل عليهم مهمة العمل، ولإثبات أنك الشخص المناسب:",
        presentationSteps: [
            "احرص على أن تكون مشاريعك في الـ Portfolio تحل مشاكل واقعية وليست مجرد نسخ تقليدية.",
            "قم بكتابة توثيق (README) احترافي لكل مشروع يشرح المشكلة والحل والتقنيات المستخدمة.",
            "أظهر شغفك بالتعلم المستمر وقدرتك على استكشاف التكنولوجيا الحديثة بسرعة.",
            "كن مستعداً لإجراء اختبارات عملية تثبت فيها صدق مهاراتك المكتوبة في السيرة الذاتية."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "الحصول على أول وظيفة برمجية يتطلب مثابرة وعملاً جاداً على بناء الـ Portfolio الخاص بك. بالاستعداد الجيد والتنظيم، ستتمكن من إقناع الشركات بقدراتك واجتياز عتبة البداية بنجاح."
    },
    {
        id: 7, // يمكنك تغيير الـ id حسب الترتيب لديك
        title: "هل البرمجة لسه ليها مستقبل في عصر الذكاء الاصطناعي؟",
        category1: "الذكاء الاصطناعي",
        category2: "سوق العمل",

        // صورة الخلفية (يمكنك استبدال الرابط أو استخدام نفس النظام)
        backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop')",

        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,
            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,
            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },

        introTitle: "مستقبل البرمجة في ظل الثورة التكنولوجية وتطور أدوات الـ AI",
        introText: "مع التطور الهائل لأدوات الذكاء الاصطناعي وكتابة الكود التلقائية، يتساءل الكثيرون عما إذا كانت البرمجة ما زالت مجالاً يستحق التعلم. الحقيقة أن الذكاء الاصطناعي لم يلغِ البرمجة، بل غيّر شكلها؛ فالأدوات الذكية تسهل كتابة الأسطر البرمجية، لكنها تحتاج عقلًا بشريًا يفهم المشكلات، يصمم النظام، ويوجه الـ AI بالشكل الصحيح.",

        howToChooseTitle: "المهارات المطلوبة للصمود والتألق في سوق العمل الحديث",
        howToChooseSubtitle: "لكي تضمن مستقبلًا واعدًا في مجال البرمجة، يجب أن تطور مهاراتك لتتجاوز مجرد كتابة الأكواد التقليدية:",
        skillsList: [
            "فهم العمق الهندسي وهيكلة الأنظمة (System Architecture & Design).",
            "إتقان توجيه واستخدام أدوات الذكاء الاصطناعي لزيادة الإنتاجية (AI-Assisted Coding).",
            "مهارات حل المشكلات المعقدة والتفكير النقدي (Problem Solving).",
            "فهم أمن المعلومات وحماية البيانات وإدارة قواعد البيانات.",
            "القدرة على دمج وتكامل الأنظمة المختلفة (API Integration & Automation)."
        ],
        goldenTip: "نصيحة ذهبية: الذكاء الاصطناعي لن يستبدل المبرمج، بل المبرمج الذي يستخدم الذكاء الاصطناعي هو من سيستبدل من لا يتقنه.",

        projects: [
            {
                id: 1,
                title: "المرحلة الأولى: التحول من كتابة الكود إلى هندسة الحلول",
                desc: "التركيز على فهم المشكلة الحقيقية للعميل وتحويلها إلى متطلبات تقنية واضحة.",
                components: "تحليل المتطلبات، تصميم هيكل المشروع، وتحديد التقنيات المناسبة.",
                skills: "التفكير التحليلي – التصميم الهندسي للأنظمة."
            },
            {
                id: 2,
                title: "المرحلة الثانية: دمج الذكاء الاصطناعي في دورة التطوير",
                desc: "استخدام أدوات المساعدة الذكية لتسريع كتابة الأكواد الروتينية والتركيز على الابتكار.",
                components: "التعامل مع مساعدات الكتابة البرمجية، اختبار الأكواد، وفحص الثغرات.",
                skills: "الاستفادة من الـ AI – رفع كفاءة الإنتاج البرمجي."
            },
            {
                id: 3,
                title: "المرحلة الثالثة: تطوير تطبيقات الأنظمة الذكية",
                desc: "بناء مشاريع تدمج نماذج الذكاء الاصطناعي مع تطبيقات الويب والهواتف الحديثة.",
                components: "ربط الـ APIs الذكية، إدارة البيانات الضخمة، توفير تجربة مستخدم فريدة.",
                skills: "Full-Stack Development – ربط الخدمات السحابية."
            },
            {
                id: 4,
                title: "المرحلة الرابعة: بناء الـ Portfolio المعاصر",
                desc: "عرض مشاريع تعكس قدرتك على حل مشاكل حقيقية باستخدام التكنولوجيا المتقدمة.",
                components: "توثيق المشاريع، شرح كيفية توظيف التقنيات الحديثة، وإبراز النتائج.",
                skills: "التسويق المهني – إثبات القدرة على الابتكار."
            }
        ],

        howToPresentTitle: "كيف تستعد للمستقبل وتضمن عدم استبدالك؟",
        howToPresentText: "البقاء في قمة المنافسة يتطلب تبني عقليات متجددة وتطوير مستمر للمهارات:",
        presentationSteps: [
            "توقف عن حفظ الأكواد التقليدية وركز على فهم المنطق البرمجي وكيفية بناء الأنظمة.",
            "اجعل أدوات الذكاء الاصطناعي صديقاً لك وليس عدواً، واستخدمها لتوفير وقتك في المهام البسيطة.",
            "ركز على التخصصات ذات الطلب العالي مثل هندسة السحابة، الأمن السيبراني، وتطوير الأنظمة الذكية.",
            "استمر في بناء مشاريع عملية حقيقية تثبت مرونتك وقدرتك على التكيف مع التغيرات السريعة."
        ],

        conclusionTitle: "الخلاصة",
        conclusionText: "البرمجة لم تموت ولن تموت، بل تطورت إلى مستوى أعلى وأكثر إبداعا. من يمتلك مهارات التفكير الهندسي والقدرة على توظيف أدوات العصر الحديث سيكون له المستقبل الأبهر في سوق العمل التقني."
    }
]

export const articleDataEn = {
    1: {
        title: 'New Careers Emerging from Artificial Intelligence and AI Automation',
        category1: 'Artificial Intelligence', category2: 'Job Market',
        introTitle: 'A hiring revolution in the age of AI and process automation',
        introText: 'Advances in artificial intelligence and process automation have done more than replace some traditional jobs: they have created entirely new career paths. Companies are actively looking for AI specialists who can integrate these technologies into their infrastructure and improve productivity.',
        howToChooseTitle: 'New roles making an impact on the job market',
        howToChooseSubtitle: 'If you are developing your skills and want to enter this promising field, consider these emerging roles:',
        skillsList: ['Prompt Engineer', 'AI Workflow Automation Specialist', 'AI Ethics and Algorithm Governance Auditor', 'Conversational AI and Intelligent Customer Support Developer', 'Deep Learning Data Analyst', 'AI Integration Consultant'],
        goldenTip: 'Key tip: Combining programming expertise with a strong understanding of AI tools increases your market value and makes you more attractive to leading companies.',
        projects: [
            { title: 'Prompt Engineer', desc: 'Craft and refine prompts to get the most accurate and useful results from AI models.', components: 'Understanding large language models (LLMs), testing responses, and improving output quality.', skills: 'Generative AI fundamentals and clear technical prompt design.' },
            { title: 'AI Automation Specialist', desc: 'Connect applications and tools with AI to reduce manual effort on routine tasks.', components: 'Building automated workflows, connecting APIs, and reducing operational errors.', skills: 'Make/Zapier, Python, and API integrations.' },
            { title: 'AI Application Developer', desc: 'Integrate AI into web and mobile applications to provide personalized, intelligent user experiences.', components: 'Building interfaces, calling AI models programmatically, and managing application state and responsiveness.', skills: 'React.js, Node.js, and OpenAI/Claude APIs.' },
            { title: 'AI Governance and Safety Manager', desc: 'Monitor intelligent systems to prevent biased outputs and protect user privacy.', components: 'Auditing algorithms, setting safe-use policies, and protecting customer data.', skills: 'Information security, technology governance, and risk analysis.' },
        ],
        howToPresentTitle: 'How to prepare for these emerging careers',
        howToPresentText: 'Getting an AI Automation role requires evidence of practical ability, not just theoretical certificates. Focus on the following:',
        presentationSteps: ['Build a practical project that automates a real task, such as connecting a customer platform to an AI system.', 'Document your code and explain the automation project on GitHub.', 'Create a portfolio showing how your project saves time or reduces costs by a measurable amount.', 'Keep up with new automation tools and try them regularly.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'AI will not replace you; someone who knows how to use AI may replace someone who does not. Learning AI Automation and building real projects can put you ahead in today’s job market.',
    },
    2: {
        title: 'Top Programming Projects for Beginners to Build a Strong Portfolio',
        category1: 'Programming', category2: 'Career Guidance',
        introTitle: 'Why projects and a portfolio matter in programming',
        introText: 'Courses alone are not enough to enter the programming job market. Employers care more about what you can build than how many certificates you have. A strong portfolio does not need dozens of projects; it needs well-organized, real projects that clearly demonstrate your technical ability.',
        howToChooseTitle: 'How to choose a portfolio project',
        howToChooseSubtitle: 'Before starting, ask what skill the project will demonstrate. A good project should showcase one or more of these:',
        skillsList: ['User interface development (UI/UX)', 'Working with databases', 'Consuming and calling APIs', 'Authentication and account security', 'Data analysis', 'Clean code and project architecture'],
        goldenTip: 'Key tip: Avoid building many similar projects without a purpose. Build fewer projects, but give each one more quality and depth.',
        projects: [
            { title: 'Advanced To-Do List', desc: 'A simple To-Do List can be a powerful beginner project when developed thoughtfully.', components: 'Sign-in, task creation and categories, deadlines, filters, and data persistence.', skills: 'State management, databases, and interface design.' },
            { title: 'Personal Portfolio Website', desc: 'An essential project if you are looking for your first programming job.', components: 'A bio, technical skills, projects, GitHub and LinkedIn links, and contact details.', skills: 'Web design and personal branding; make it simple, fast, and responsive.' },
            { title: 'Simple E-commerce Store', desc: 'A store makes a strong impression because it resembles a real-world product.', components: 'Product listings, search and filters, product details, a cart, and a test checkout.', skills: 'Front-end, back-end, and complex data and transaction management.' },
            { title: 'Sales Dashboard', desc: 'A great way to demonstrate how you work with and present data.', components: 'Sales totals, order counts, top-performing products, interactive charts, and summaries.', skills: 'Data visualization and analysis.' },
            { title: 'Personal Expense Tracker', desc: 'A practical project that people can use in everyday life.', components: 'Expense entry, spending categories, monthly reports, charts, and data export.', skills: 'Working with financial data and user experience (UX).' },
            { title: 'Appointment Booking System', desc: 'A strong project modeled on real systems used by companies and clinics.', components: 'Service and time selection, booking confirmation, and an admin dashboard.', skills: 'Business logic and database design and scheduling.' },
            { title: 'Weather App Using an API', desc: 'A useful way to learn how to connect to external services and retrieve live data.', components: 'Temperature, city, conditions, and weekly forecasts, with clear error handling for unknown cities.', skills: 'API integration and asynchronous data.' },
            { title: 'Simple Content Management System (CMS)', desc: 'An ideal choice if you want to focus on back-end development.', components: 'Create, edit, and delete articles (CRUD), an admin dashboard, and user roles and permissions.', skills: 'Content management, data security, and databases.' },
            { title: 'Simple Chatbot', desc: 'A project aligned with current demand for automation and customer service.', components: 'Keyword-based replies, conversation history, or integration with an external AI API.', skills: 'Automation, programming logic, and text processing.' },
            { title: 'Data Analysis Project', desc: 'Choose a real dataset from a platform such as Kaggle and use it to uncover useful findings.', components: 'Clean data, identify patterns, and present results in a clear dashboard.', skills: 'Data analysis and communicating recommendations and insights.' },
        ],
        howToPresentTitle: 'How to present your projects professionally',
        howToPresentText: 'Even a good project can look weak if it is presented poorly. Include the following for each portfolio project:',
        presentationSteps: ['A brief description of the project.', 'The problem it solves and how it solves it.', 'The technologies and tools used (tech stack).', 'High-quality screenshots or a short demo video.', 'A live demo link and a GitHub code link.', 'The technical challenges you faced and how you solved them.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'The best beginner projects are not the most numerous; they prove you can build something real from scratch. Three well-documented projects with clean code can help you enter the job market and succeed in interviews more than collecting certificates without practical experience.',
    },
    3: {
        title: 'Programmer Salaries in Egypt and Arab Countries in 2026',
        category1: 'Job Market', category2: 'Career Guidance',
        introTitle: 'A guide to programmer salaries in Egypt and the Arab region',
        introText: 'Programmer salaries vary widely depending on experience, company type, remote work paid in foreign currency, and technical specialization. The technology market continues to grow, and compensation is changing with it.',
        howToChooseTitle: 'Salary ranges by country and experience',
        howToChooseSubtitle: 'Approximate monthly net salaries in major Arab markets vary by employer and experience:',
        skillsList: ['Egypt, entry level: EGP 10,000–32,000, depending on the company.', 'Egypt, senior level: EGP 35,000 to over 105,000 at major companies.', 'Remote work paid in US dollars: USD 1,800 to over 5,000 per month.', 'UAE (Dubai/Abu Dhabi): AED 8,000 to over 45,000 per month.', 'Saudi Arabia (Riyadh/Jeddah): SAR 7,000 to over 50,000 for highly experienced developers.', 'Other Gulf, Levant, and North African markets vary with local economies and compensation packages.'],
        goldenTip: 'Key tip: Strong English skills and remote work for international companies can significantly increase your monthly income.',
        projects: [
            { title: 'Egyptian Market and Local Companies', desc: 'Salary progression from junior to senior roles at Egyptian and outsourcing companies.', components: 'Compensation aligned with living costs, with fast promotion opportunities for skilled developers.', skills: 'Practical experience, problem-solving, and effective communication.' },
            { title: 'Gulf Countries (UAE and Saudi Arabia)', desc: 'Among the region’s highest-paying markets, supported by digital transformation and national vision projects.', components: 'Competitive packages, often tax-free, with housing and insurance allowances.', skills: 'Recognized certifications, large-project experience, and teamwork.' },
            { title: 'Freelance and Remote Work', desc: 'A way to increase income and earn in foreign currencies such as dollars or euros.', components: 'Work with international clients or major global companies while based at home.', skills: 'Negotiation, reliability, and strong English.' },
            { title: 'Highest-Paying Specializations', desc: 'Technical fields that often offer higher salary ceilings than traditional development.', components: 'AI/ML, cloud engineering/DevOps, and cybersecurity.', skills: 'Ongoing technical learning and awareness of current market trends.' },
        ],
        howToPresentTitle: 'Factors that can increase your programming salary',
        howToPresentText: 'A higher salary depends on more than years of experience. Key factors include:',
        presentationSteps: ['Specialization: Advanced fields such as AI and DevOps are in high demand and often pay more.', 'A strong portfolio: Real, well-organized projects demonstrate ability and can accelerate career growth.', 'English proficiency: Strong English opens doors to international companies and remote work.', 'Soft skills: Presenting ideas clearly and solving problems with a team.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'Programming careers reward what you can build and the value you deliver. Investing in your skills and creating strong projects can help you reach higher salary bands in Egypt, across the Arab region, or internationally.',
    },
    4: {
        title: 'How to Learn Electronics from Scratch: A Step-by-Step Guide',
        category1: 'Engineering and Technology', category2: 'Self-Learning',
        introTitle: 'Your introduction to electronics and electrical circuits',
        introText: 'Learning electronics from scratch is rewarding, especially if you want to understand everyday devices, repair industrial boards, or explore embedded systems and automation.',
        howToChooseTitle: 'Core steps to learn electronics',
        howToChooseSubtitle: 'Build a strong foundation through an organized path that moves from theory to practice:',
        skillsList: ['Electrical fundamentals, Ohm’s law, and electrical quantities.', 'Common components: resistors, capacitors, diodes, and transistors.', 'Using a multimeter and breadboard.', 'Building your first circuits and simple practical experiments.', 'Moving on to embedded systems and microcontrollers such as Arduino.'],
        goldenTip: 'Key tip: Hands-on practice and building circuits yourself make the real difference; do not rely on theory alone.',
        projects: [
            { title: 'Stage 1: Theoretical and Electrical Fundamentals', desc: 'Understand voltage, current, resistance, and how they relate through Ohm’s law.', components: 'Ohm’s law, Kirchhoff’s laws, and AC versus DC.', skills: 'Circuit calculations and understanding charge flow.' },
            { title: 'Stage 2: Electronic Components', desc: 'Learn to identify components, understand their functions, and read their ratings and limits.', components: 'Resistors, capacitors, inductors, diodes, and transistors.', skills: 'Reading component values and distinguishing component types.' },
            { title: 'Stage 3: Practical Tools and Equipment', desc: 'Set up a basic workspace with tools for safely testing and connecting circuits.', components: 'Multimeter, breadboard, and soldering iron.', skills: 'Checking connections, measuring voltage, and soldering correctly.' },
            { title: 'Stage 4: Microcontrollers and Automation (Arduino)', desc: 'Combine programming and electronics to control sensors and motors and build smart projects.', components: 'Arduino, temperature and motion sensors, motors, and servos.', skills: 'Microcontroller programming, reading datasheets, and hardware/software integration.' },
        ],
        howToPresentTitle: 'How to keep developing your skills',
        howToPresentText: 'Self-learning electronics requires deliberate practice and keeping up with new technology:',
        presentationSteps: ['Use simulators such as Tinkercad to test circuits before building them.', 'Read each component’s datasheet to understand its operating limits.', 'Build complete small projects and troubleshoot problems as they arise.', 'Follow practical tutorials and workshops to improve fault-finding and board-repair skills.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'Electronics builds on itself through experimentation. Start with the fundamentals and progress to practical projects and microcontrollers to develop a strong foundation for device repair and smart systems.',
    },
    5: {
        title: 'How to Learn Programming from Scratch and Enter the Job Market',
        category1: 'Programming and Development', category2: 'Career Guidance',
        introTitle: 'Starting your programming journey and building a technical future',
        introText: 'Programming is now an essential skill in the digital age. A good start means choosing a suitable language, understanding the fundamentals, and practicing by building real projects that prepare you for the job market.',
        howToChooseTitle: 'Core steps to learn programming professionally',
        howToChooseSubtitle: 'Follow a clear approach to get started and avoid distractions:',
        skillsList: ['Choose a target field: web, mobile, AI, or data science.', 'Select a beginner-friendly language such as Python or JavaScript.', 'Learn computer science fundamentals and problem-solving.', 'Practice immediately and build a small project for each new concept.', 'Use Git and GitHub from the beginning.'],
        goldenTip: 'Key tip: Do not spend too long on theory. Programming is learned by writing code and debugging it yourself.',
        projects: [
            { title: 'Stage 1: Choose a Language and Learn the Basics', desc: 'Learn variables, functions, loops, and conditional statements.', components: 'Language fundamentals, input and output, and programming logic.', skills: 'Logical thinking and solving simple problems.' },
            { title: 'Stage 2: Build Beginner Projects', desc: 'Apply what you have learned in small projects that demonstrate your understanding.', components: 'A calculator, a number-guessing game, and a simple To-Do List.', skills: 'Connecting concepts and writing clean code.' },
            { title: 'Stage 3: Specialize and Develop Web or App Skills', desc: 'Explore the technologies and libraries used by software companies.', components: 'HTML/CSS/JavaScript for web interfaces, or a framework such as React and Node.js.', skills: 'Front-end and back-end development, and working with databases.' },
            { title: 'Stage 4: Build a Portfolio and Enter the Job Market', desc: 'Collect your strongest work in a professional portfolio and apply for roles.', components: 'Publish projects on GitHub, write professional descriptions, and prepare your CV.', skills: 'Presenting projects clearly and handling technical interviews.' },
        ],
        howToPresentTitle: 'How to demonstrate your skills and improve your chances',
        howToPresentText: 'Certificates alone are not enough to get a programming job; you need clear evidence of your ability:',
        presentationSteps: ['Build three complete projects that solve real problems and cover front-end and back-end work.', 'Document each project professionally in a GitHub README, including how to run it.', 'Join programming communities and solve problems on platforms such as LeetCode or HackerRank.', 'Communicate effectively and build connections with developers on LinkedIn.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'Programming is a learned skill that takes patience and consistent practice, not an innate talent. With a clear plan and practical projects, you can enter the programming job market with confidence.',
    },
    6: {
        title: 'How to Get a Programming Job with No Experience',
        category1: 'Job Market', category2: 'Career Guidance',
        introTitle: 'Your guide to landing your first programming job',
        introText: 'Getting your first programming job without prior experience can feel difficult, but it is possible. Employers look beyond years of experience for problem-solving ability, a strong portfolio, and evidence that you can contribute from day one.',
        howToChooseTitle: 'Steps to secure your first opportunity',
        howToChooseSubtitle: 'Stand out among applicants and make up for limited experience by focusing on:',
        skillsList: ['A portfolio of real, well-organized projects.', 'A concise, professional CV highlighting your projects and technical skills.', 'Preparation for technical interviews and problem-solving tests.', 'Networking with developers and recruiters on LinkedIn.', 'Internships or freelance projects to build a professional track record.'],
        goldenTip: 'Key tip: One real project with clean code can help make up for a lack of formal experience and attract recruiters’ attention.',
        projects: [
            { title: 'Stage 1: Build a Strong, Varied Portfolio', desc: 'Bring your best work together so recruiters can easily review your projects and code.', components: 'A personal website, GitHub links, and live demos.', skills: 'Organizing projects and clearly demonstrating technical skills.' },
            { title: 'Stage 2: Write a Professional Developer CV', desc: 'Create a concise CV focused on your tools, technologies, and completed projects.', components: 'A professional summary, technical skills, project details, and contact links.', skills: 'Clarity, professionalism, and communicating the value you offer.' },
            { title: 'Stage 3: Prepare for Technical Interviews', desc: 'Practice common programming questions and explaining how you approach problems.', components: 'Data structures and algorithms questions, plus discussion of previous projects.', skills: 'Communicating under pressure and explaining code clearly.' },
            { title: 'Stage 4: Apply Strategically and Network', desc: 'Find suitable roles and apply thoughtfully across different platforms.', components: 'Following startups, contacting team leads, and tailoring applications.', skills: 'Personal marketing and professional networking.' },
        ],
        howToPresentTitle: 'How to convince a company to hire you without experience',
        howToPresentText: 'Companies want people who make the work easier. Show that you are the right candidate by:',
        presentationSteps: ['Build portfolio projects that solve real problems rather than copying common examples.', 'Write a professional README for each project describing the problem, solution, and technologies.', 'Show enthusiasm for continuous learning and quickly exploring new technologies.', 'Be ready for practical assessments that demonstrate the skills on your CV.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'Landing your first programming job takes persistence and focused effort on your portfolio. With good preparation and organization, you can demonstrate your abilities and successfully take the first step.',
    },
    7: {
        title: 'Does Programming Still Have a Future in the Age of AI?',
        category1: 'Artificial Intelligence', category2: 'Job Market',
        introTitle: 'The future of programming amid rapid advances in AI',
        introText: 'As AI tools and automatic code generation advance, many people wonder whether programming is still worth learning. AI has not eliminated programming; it has changed it. Intelligent tools can help write code, but they still need people who understand problems, design systems, and guide the tools effectively.',
        howToChooseTitle: 'Skills for succeeding in today’s job market',
        howToChooseSubtitle: 'Build skills beyond writing conventional code to prepare for a promising future in programming:',
        skillsList: ['System architecture and design.', 'Using AI tools effectively to increase productivity.', 'Complex problem-solving and critical thinking.', 'Information security, data protection, and database management.', 'Integrating different systems through APIs and automation.'],
        goldenTip: 'Key tip: AI will not replace programmers; programmers who use AI may replace those who do not.',
        projects: [
            { title: 'Stage 1: Move from Writing Code to Engineering Solutions', desc: 'Understand the customer’s real problem and turn it into clear technical requirements.', components: 'Requirements analysis, project architecture, and selecting suitable technologies.', skills: 'Analytical thinking and systems design.' },
            { title: 'Stage 2: Integrate AI into Development', desc: 'Use intelligent assistants to speed up routine coding and focus on innovation.', components: 'Coding assistants, code testing, and vulnerability checks.', skills: 'Using AI effectively and improving development productivity.' },
            { title: 'Stage 3: Develop Intelligent Applications', desc: 'Build projects that combine AI models with modern web and mobile applications.', components: 'AI API integrations, large-scale data management, and distinctive user experiences.', skills: 'Full-stack development and cloud-service integration.' },
            { title: 'Stage 4: Build a Modern Portfolio', desc: 'Show projects that solve real problems with advanced technology.', components: 'Project documentation, explaining technology choices, and highlighting results.', skills: 'Professional presentation and demonstrating innovation.' },
        ],
        howToPresentTitle: 'How to prepare for the future',
        howToPresentText: 'Staying competitive requires an open mindset and continuous skill development:',
        presentationSteps: ['Stop memorizing conventional code and focus on programming logic and system design.', 'Treat AI tools as assistants and use them to save time on simple tasks.', 'Focus on in-demand fields such as cloud engineering, cybersecurity, and intelligent systems.', 'Keep building practical projects that demonstrate adaptability to rapid change.'],
        conclusionTitle: 'Conclusion',
        conclusionText: 'Programming is not disappearing; it is becoming more advanced and creative. People with strong systems-thinking skills who can use modern tools will be well placed in the future technology job market.',
    },
};

export default articleData