export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: ما الأتمتة وكيف تعمل واجهات برمجة التطبيقات', en: 'Start Here: What Automation Is & How APIs Work' },
            description: { ar: 'تعلم مفهوم الأتمتة (Automation)، كيف تنقل التطبيقات البيانات بينها، وما هي واجهة برمجة التطبيقات (API) بلغة بسيطة.', en: 'Learn what automation is, how apps exchange data, and what an API is, in simple terms.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'مفهوم الأتمتة', en: 'Automation concept' }, description: { ar: 'إتمام المهام المتكررة تلقائيًا دون تدخل بشري', en: 'Completing repetitive tasks automatically without human intervention' }, optional: false },
                { title: { ar: 'ما هي واجهة برمجة التطبيقات', en: 'What is an API' }, description: { ar: 'طريقة تواصل التطبيقات مع بعضها البعض لتبادل البيانات', en: 'How apps communicate with each other to exchange data' }, optional: false },
                { title: { ar: 'طلب واستجابة API', en: 'API request & response' }, description: { ar: 'كيف يرسل أحد التطبيقات طلبًا ويحصل على رد', en: 'How one app sends a request and gets a response' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الأتمتة وAPI', en: 'Understanding automation & API basics' }],
            project: { ar: 'رسم مخطط يوضح كيف يشارك تطبيقان البيانات عبر API', en: 'Draw a diagram showing how two apps share data via API' },
            courseId: null,
            next: ['json-basics']
        },
        {
            id: 'json-basics',
            title: { ar: 'أساسيات JSON', en: 'JSON Basics' },
            description: { ar: 'تعلم صيغة JSON التي تنقل البيانات بين التطبيقات، وهي الصيغة التي تستخدمها الأتمتة بشكل أساسي.', en: 'Learn JSON format used to exchange data between apps, and the primary format automation uses.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'هيكل JSON', en: 'JSON structure' }, description: { ar: 'المفاتيح والقيم، والمصفوفات والكائنات', en: 'Keys and values, arrays and objects' }, optional: false },
                { title: { ar: 'قراءة وكتابة JSON', en: 'Reading & writing JSON' }, description: { ar: 'كيفية قراءة ملف JSON وتعديل بياناته', en: 'How to read a JSON file and modify its data' }, optional: false },
                { title: { ar: 'أنواع البيانات في JSON', en: 'JSON data types' }, description: { ar: 'النصوص، الأرقام، القيم المنطقية، والقيم الفارغة', en: 'Strings, numbers, booleans, and null values' }, optional: false },
                { title: { ar: 'الأخطاء الشائعة في JSON', en: 'Common JSON errors' }, description: { ar: 'الفواصل الناقصة، والأقواس غير المغلقة', en: 'Missing commas, unclosed brackets' }, optional: true }
            ],
            skills: [{ ar: 'العمل مع بيانات JSON', en: 'Working with JSON data' }],
            project: { ar: 'إنشاء ملف JSON يمثل بيانات عميل أو منتج', en: 'Create a JSON file representing customer or product data' },
            courseId: null,
            next: ['http-rest-webhooks']
        },
        {
            id: 'http-rest-webhooks',
            title: { ar: 'بروتوكول HTTP، REST، والويب هوك', en: 'HTTP, REST & Webhooks' },
            description: { ar: 'فهم كيف تنتقل البيانات عبر الإنترنت باستخدام HTTP، وما هي واجهات REST، وكيف يسمح الويب هوك للتطبيقات بإخطار بعضها فور حدوث حدث.', en: 'Understand how data moves over the internet via HTTP, what REST APIs are, and how webhooks let apps notify each other instantly when an event happens.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'طرق HTTP', en: 'HTTP methods' }, description: { ar: 'GET، POST، PUT، DELETE ومتى تستخدم كل منها', en: 'GET, POST, PUT, DELETE and when to use each' }, optional: false },
                { title: { ar: 'واجهة REST', en: 'REST interface' }, description: { ar: 'مبادئ التصميم البسيط لواجهات الويب', en: 'Simple design principles for web interfaces' }, optional: false },
                { title: { ar: 'رموز الاستجابة', en: 'Response codes' }, description: { ar: '200، 201، 400، 404، 500 وما تعنيه', en: '200, 201, 400, 404, 500 and what they mean' }, optional: false },
                { title: { ar: 'الويب هوك (Webhook)', en: 'Webhook' }, description: { ar: 'عنوان URL يستقبل إشعارات فورية من تطبيق آخر', en: 'A URL that receives instant notifications from another app' }, optional: false }
            ],
            skills: [{ ar: 'فهم HTTP و REST و الويب هوك', en: 'Understanding HTTP, REST & webhooks' }],
            project: { ar: 'إرسال طلب HTTP بسيط واستلام استجابة JSON', en: 'Send a simple HTTP request and receive a JSON response' },
            courseId: null,
            next: ['n8n-basics']
        },
        {
            id: 'n8n-basics',
            title: { ar: 'أساسيات n8n: سير العمل والعقد والمشغلات', en: 'n8n Basics: Workflows, Nodes & Triggers' },
            description: { ar: 'تعلم استخدام n8n (سواء السحابي أو المثبت ذاتيًا)، إنشاء سير عمل أول، وفهم العقد (Nodes) والمشغلات (Triggers) والتنفيذات (Executions).', en: 'Learn to use n8n (cloud or self-hosted), create your first workflow, and understand nodes, triggers, and executions.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'إنشاء حساب n8n أو التثبيت محليًا', en: 'Create n8n account or local install' }, description: { ar: 'بدء استخدام n8n على السحابة أو تثبيته على جهازك', en: 'Start using n8n on cloud or install it on your machine' }, optional: false },
                { title: { ar: 'سير العمل (Workflow)', en: 'Workflow' }, description: { ar: 'سلسلة من الخطوات المتصلة تنفذ مهمة بشكل تلقائي', en: 'A series of connected steps that perform a task automatically' }, optional: false },
                { title: { ar: 'العقد (Nodes)', en: 'Nodes' }, description: { ar: 'أجزاء السير التي تؤدي إجراءات مثل إرسال بريد أو كتابة بيانات', en: 'Workflow parts that perform actions like sending email or writing data' }, optional: false },
                { title: { ar: 'المشغلات (Triggers)', en: 'Triggers' }, description: { ar: 'أحداث تبدأ سير العمل مثل وصول بريد أو استلام ويب هوك', en: 'Events that start a workflow like receiving email or a webhook' }, optional: false },
                { title: { ar: 'التنفيذات (Executions)', en: 'Executions' }, description: { ar: 'مراجعة سجل تشغيل السير العمل والتحقق من نجاحه', en: 'Reviewing workflow run history and verifying success' }, optional: false }
            ],
            skills: [{ ar: 'إنشاء سير عمل أول في n8n', en: 'Creating first workflow in n8n' }],
            project: { ar: 'سير عمل يستقبل ويب هوك ويسجل البيانات في جدول', en: 'Workflow that receives a webhook and logs data to a table' },
            courseId: null,
            next: ['expressions-data-mapping']
        },
        {
            id: 'expressions-data-mapping',
            title: { ar: 'التعبيرات ورسم البيانات', en: 'Expressions & Data Mapping' },
            description: { ar: 'تعلم استخدام تعبيرات n8n لنقل البيانات بين العقد، وتحويل شكل البيانات حسب الحاجة.', en: 'Learn to use n8n expressions to pass data between nodes and transform data shape as needed.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات التعبيرات', en: 'Expression basics' }, description: { ar: 'كيفية الإشارة إلى بيانات العقد السابقة في النodb.current', en: 'How to reference data from previous nodes' }, optional: false },
                { title: { ar: 'رسم البيانات (Data Mapping)', en: 'Data mapping' }, description: { ar: 'نقل حقل من عقدة إلى أخرى لتحويله أو استخدامه', en: 'Moving a field from one node to another to transform or use it' }, optional: false },
                { title: { ar: 'الشرط في التعبير', en: 'Conditions in expressions' }, description: { ar: 'استخدامif-else بسيط لاختيار مسار مختلف', en: 'Using simple if-else to choose a different path' }, optional: false },
                { title: { ar: 'البيانات المكررة', en: 'Repeated data (items)' }, description: { ar: 'التعامل مع قوائم البيانات وتكرار الإجراءات عليها', en: 'Handling lists of data and repeating actions on them' }, optional: false }
            ],
            skills: [{ ar: 'استخدام تعبيرات n8n ورسم البيانات', en: 'Using n8n expressions & data mapping' }],
            project: { ar: 'تحويل بيانات ويب هوك إلى تنسيق جديد وإرسالها لعقدة أخرى', en: 'Transform webhook data into a new format and send to another node' },
            courseId: null,
            next: ['data-transformation']
        },
        {
            id: 'data-transformation',
            title: { ar: 'تحويل البيانات: Set، IF، Switch، Merge، و العقد المبرمج', en: 'Data Transformation: Set, IF, Switch, Merge & Code Node' },
            description: { ar: 'تعلم تحويل البيانات باستخدام عقد Set و IF و Switch و Merge، وكتابة أكواد بسيطة في عقدة Code باستخدام جافاسكريبت.', en: 'Learn to transform data using Set, IF, Switch, and Merge nodes, and write simple code in the Code node using JavaScript.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'عقدة Set', en: 'Set node' }, description: { ar: 'إضافة أو تعديل حقول البيانات في السير', en: 'Adding or modifying data fields in the workflow' }, optional: false },
                { title: { ar: 'عقدة IF', en: 'IF node' }, description: { ar: 'تقسيم السير إلى مسارين بناءً على شرط', en: 'Splitting workflow into two paths based on a condition' }, optional: false },
                { title: { ar: 'عقدة Switch', en: 'Switch node' }, description: { ar: 'توجيه البيانات إلى مسارات متعددة بناءً على قيمتها', en: 'Routing data to multiple paths based on its value' }, optional: false },
                { title: { ar: 'عقدة Merge', en: 'Merge node' }, description: { ar: 'دمج بيانات من مسارات متعددة في مسار واحد', en: 'Combining data from multiple paths into one' }, optional: false },
                { title: { ar: 'عقدة Code usando JavaScript', en: 'Code node with JavaScript' }, description: { ar: 'كتابة سكريبت جافاسكريبت بسيط لتحويل البيانات', en: 'Writing a simple JavaScript script to transform data' }, optional: true }
            ],
            skills: [{ ar: 'تحويل البيانات في n8n', en: 'Data transformation in n8n' }],
            project: { ar: 'فلترة العملاء المحتملين وتصنيفهم باستخدام IF و Switch', en: 'Filter and classify leads using IF and Switch nodes' },
            courseId: null,
            next: ['integrations']
        },
        {
            id: 'integrations',
            title: { ar: 'التكاملات: جداول Google، البريد، سلاك، تليجرام، وقواعد البيانات', en: 'Integrations: Google Sheets, Gmail, Slack, Telegram & Databases' },
            description: { ar: 'تعلم ربط n8n مع الخدمات الشائعة مثل جداول Google، Gmail، سلاك، تليجرام، وقواعد البيانات لنقل البيانات بينها.', en: 'Learn to connect n8n with popular services like Google Sheets, Gmail, Slack, Telegram, and databases to move data between them.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'جداول Google (Google Sheets)', en: 'Google Sheets' }, description: { ar: 'إضافة وتعديل وقرء بيانات في جداول Google تلقائيًا', en: 'Adding, modifying, and reading Google Sheets data automatically' }, optional: false },
                { title: { ar: 'جيميل (Gmail)', en: 'Gmail' }, description: { ar: 'إرسال رسائل بريد إلكتروني تلقائيًا من سير العمل', en: 'Sending emails automatically from workflow' }, optional: false },
                { title: { ar: 'سلاك (Slack)', en: 'Slack' }, description: { ar: 'إرسال إشعارات إلى قنوات سلاك', en: 'Sending notifications to Slack channels' }, optional: false },
                { title: { ar: 'تليجرام (Telegram)', en: 'Telegram' }, description: { ar: 'إرسال رسائل عبر روبوت تليجرام', en: 'Sending messages via Telegram bot' }, optional: false },
                { title: { ar: 'قواعد البيانات', en: 'Databases' }, description: { ar: 'حفظ واسترجاع البيانات من قواعد البيانات', en: 'Saving and retrieving data from databases' }, optional: false }
            ],
            skills: [{ ar: 'ربط n8n مع الخدمات الخارجية', en: 'Connecting n8n with external services' }],
            project: { ar: 'إرسال بيانات потенциال (Lead) من نموذج إلى جداول Google وإشعار في سلاك', en: 'Send lead data from a form to Google Sheets and notify Slack' },
            courseId: null,
            next: ['error-handling-retries']
        },
        {
            id: 'error-handling-retries',
            title: { ar: 'معالجة الأخطاء والمحاولات المتكررة', en: 'Error Handling & Retries' },
            description: { ar: 'تعلم جعل سير العمل يستمر حتى عند حدوث أخطاء، وإعادة المحاولة تلقائيًا عند الفشل.', en: 'Learn to make workflows continue even when errors occur, and retry automatically on failure.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أنواع الأخطاء في n8n', en: 'Error types in n8n' }, description: { ar: 'أخطاء الشبكة، وأخطاء البيانات، وأخطاء المنطق', en: 'Network errors, data errors, and logic errors' }, optional: false },
                { title: { ar: 'عقدة Error Workflow', en: 'Error Workflow node' }, description: { ar: 'سير عمل منفصل لمعالجة الأخطاء التي تحدث في سير العمل الرئيسي', en: 'Separate workflow for handling errors in the main workflow' }, optional: false },
                { title: { ar: 'إعادة المحاولة (Retry)', en: 'Retry' }, description: { ar: 'محاولة تنفيذ العقدة مرة أخرى تلقائيًا عند الفشل', en: 'Automatically retrying a node execution on failure' }, optional: false },
                { title: { ar: 'تجاوز الأخطاء', en: 'Continue on Fail' }, description: { ar: 'إكمال السير حتى لو Failed了一 عقدة', en: 'Completing the workflow even if a node fails' }, optional: true }
            ],
            skills: [{ ar: 'معالجة الأخطاء في سير العمل', en: 'Workflow error handling' }],
            project: { ar: 'إعداد سير عمل يعيد المحاولة عند فشل إرسال البريد الإلكتروني', en: 'Workflow that retries when email sending fails' },
            courseId: null,
            next: ['ai-basics']
        },
        {
            id: 'ai-basics',
            title: { ar: 'أساسيات الذكاء الاصطناعي والنماذج اللغوية', en: 'AI Basics: LLMs & Prompting' },
            description: { ar: 'فهم ما هي النماذج اللغوية الكبيرة (LLMs)، وكيفية كتابة مطالبات (Prompts) فعالة للحصول على نتائج جيدة.', en: 'Understanding large language models (LLMs) and how to write effective prompts for good results.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'ما هو نموذج اللغة الكبير', en: 'What is an LLM' }, description: { ar: 'نموذج ذكاء اصطناعي يفهم ويولد نصوصًا بشرية', en: 'AI model that understands and generates human-like text' }, optional: false },
                { title: { ar: 'كتابة المطالبات (Prompting)', en: 'Prompting' }, description: { ar: 'كيفية توجيه النموذج لإعطاء إجابة دقيقة ومفيدة', en: 'How to guide the model to give accurate and useful answers' }, optional: false },
                { title: { ar: 'سياق المحادثة', en: 'Conversation context' }, description: { ar: 'الحفاظ على سياق المحادثة بين الرسائل', en: 'Maintaining conversation context between messages' }, optional: false }
            ],
            skills: [{ ar: 'كتابة المطالبات للذكاء الاصطناعي', en: 'Writing AI prompts' }],
            project: { ar: 'إنشاء مطالبة تلخص نصًا طويلًا إلى نقاط رئيسية', en: 'Create a prompt that summarizes a long text into key points' },
            courseId: null,
            next: ['ai-nodes-agents']
        },
        {
            id: 'ai-nodes-agents',
            title: { ar: 'عقد الذكاء الاصطناعي والوكلاء في n8n', en: 'AI Nodes & Agents in n8n' },
            description: { ar: 'تعلم استخدام عقد الذكاء الاصطناعي في n8n، وإنشاء وكلاء (Agents) يستخدمون أدواتًا للرد على الاستفسارات.', en: 'Learn to use AI nodes in n8n, and create agents that use tools to respond to inquiries.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'عقد الذكاء الاصطناعي', en: 'AI nodes' }, description: { ar: 'عقد متخصصة للتواصل مع نماذج الذكاء الاصطناعي', en: 'Specialized nodes for communicating with AI models' }, optional: false },
                { title: { ar: 'الوكلاء (Agents)', en: 'Agents' }, description: { ar: 'نظام الذكاء الاصطناعي الذي يختار الأدوات المناسبة للتنفيذ', en: 'AI system that chooses appropriate tools for execution' }, optional: false },
                { title: { ar: 'الذاكرة (Memory)', en: 'Memory' }, description: { ar: 'تذكر المحادثات السابقة في التفاعل مع الوكيل', en: 'Remembering previous conversations in agent interaction' }, optional: false },
                { title: { ar: 'الأدوات (Tools)', en: 'Tools' }, description: { ar: 'الوظائف التي يستدعيها الوكيل لإنجاز مهام محددة', en: 'Functions the agent calls to perform specific tasks' }, optional: false }
            ],
            skills: [{ ar: 'بناء وكلاء الذكاء الاصطناعي في n8n', en: 'Building AI agents in n8n' }],
            project: { ar: 'وكيل ذكاء اصطناعي يجيب على أسئلة العملاء باستخدام قاعدة معرفة', en: 'AI agent answering customer questions using a knowledge base' },
            courseId: null,
            next: ['vector-rag']
        },
        {
            id: 'vector-rag',
            title: { ar: 'قواعد المتجهات و RAG', en: 'Vector Databases & RAG' },
            description: { ar: 'فهم قواعد البيانات المتجهية وكيفية استخدامها مع الذكاء الاصطناعي في تقنية RAG (التعزيز بالاسترجاع) لإعطاء إجابات مبنية على بياناتك الخاصة.', en: 'Understanding vector databases and using them with AI in RAG (Retrieval-Augmented Generation) to give answers based on your own data.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'optional',
            topics: [
                { title: { ar: 'قاعدة البيانات المتجهة', en: 'Vector database' }, description: { ar: 'تخزين البيانات كمتجهات للبحث الدلالي السريع', en: 'Storing data as vectors for fast semantic search' }, optional: true },
                { title: { ar: 'تقنية RAG', en: 'RAG technique' }, description: { ar: 'دمج البحث في الوثائق مع التوليد بالذكاء الاصطناعي', en: 'Combining document search with AI generation' }, optional: true },
                { title: { ar: 'القطع والتضمين (Chunking & Embedding)', en: 'Chunking & embedding' }, description: { ar: 'تقسيم النصوص الكبيرة وتحويلها إلى متجهات', en: 'Splitting large texts and converting to vectors' }, optional: true }
            ],
            skills: [{ ar: 'أساسيات قواعد المتجهات و RAG', en: 'Vector databases & RAG basics' }],
            project: { ar: 'نظام الإجابة على الأسئلة باستخدام وثائق الشركة و RAG', en: 'Q&A system using company documents with RAG' },
            courseId: null,
            next: ['docker-selfhosting']
        },
        {
            id: 'docker-selfhosting',
            title: { ar: 'التثبيت الذاتي باستخدام دوكير', en: 'Self-Hosting with Docker' },
            description: { ar: 'تعلم تثبيت n8n على خادمك الخاص باستخدام دوكير، والتحكم الكامل في بياناتك وسير عملك.', en: 'Learn to install n8n on your own server using Docker, with full control over your data and workflows.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'ما هو دوكير', en: 'What is Docker' }, description: { ar: 'تقنية لتغليف التطبيقات في حاويات منفصلة', en: 'Technology for packaging apps in separate containers' }, optional: false },
                { title: { ar: 'تثبيت n8n باستخدام دوكير', en: 'Installing n8n with Docker' }, description: { ar: 'تشغيل n8n في حاوية دوكير على خادمك', en: 'Running n8n in a Docker container on your server' }, optional: false },
                { title: { ar: 'إدارة الحاويات', en: 'Container management' }, description: { ar: 'بدء وإيقاف وتحديث حاويات دوكير', en: 'Start, stop, and update Docker containers' }, optional: false }
            ],
            skills: [{ ar: 'التثبيت الذاتي لـ n8n باستخدام دوكير', en: 'n8n self-hosting with Docker' }],
            project: { ar: 'نشر n8n على خادم خاص باستخدام دوكير', en: 'Deploy n8n on a private server using Docker' },
            courseId: null,
            next: ['security-credentials']
        },
        {
            id: 'security-credentials',
            title: { ar: 'الأمان وبيانات الاعتماد', en: 'Security & Credentials' },
            description: { ar: 'تعلم كيف يحفظ n8n كلمات المرور والمفاتيح بأمان، وكيفية حماية سير العمل من الوصول غير المصرح به.', en: 'Learn how n8n securely stores passwords and keys, and how to protect workflows from unauthorized access.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'بيانات الاعتماد (Credentials)', en: 'Credentials' }, description: { ar: 'تخزين كلمات المرور ومفاتيح API بشكل مشفر', en: 'Storing passwords and API keys encrypted' }, optional: false },
                { title: { ar: 'إدارة الوصول', en: 'Access management' }, description: { ar: 'تحديد من يمكنه تعديل أو تشغيل سير العمل', en: 'Defining who can modify or run workflows' }, optional: false },
                { title: { ar: 'الأمان في الويب هوك', en: 'Webhook security' }, description: { ar: 'التحقق من مصدر الطلبات الواردة إلى الويب هوك', en: 'Verifying the source of incoming webhook requests' }, optional: true }
            ],
            skills: [{ ar: 'إدارة الأمان وبيانات الاعتماد في n8n', en: 'Managing security & credentials in n8n' }],
            project: { ar: 'تأمين بيانات الاعتماد في سير عمل يتعامل مع بيانات حساسة', en: 'Securing credentials in a workflow handling sensitive data' },
            courseId: null,
            next: ['business-projects']
        },
        {
            id: 'business-projects',
            title: { ar: 'مشاريع الأعمال الحقيقية', en: 'Real Business Projects' },
            description: { ar: 'بناء سير عمل لحالات استخدام واقعية مثل جمع بيانات العملاء المحتملين إلى جداول Google، روبوت واتساب، وكيل دعم العملاء بالذكاء الاصطناعي.', en: 'Build workflows for real use cases like lead capture to Google Sheets, WhatsApp bot, and AI customer support agent.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'جمع العملاء المحتملين', en: 'Lead capture' }, description: { ar: 'إرسال بيانات النموذج إلى جداول Google وإشعار الفريق', en: 'Sending form data to Google Sheets and notifying the team' }, optional: false },
                { title: { ar: 'روبوت واتساب أو تليجرام', en: 'WhatsApp or Telegram bot' }, description: { ar: 'الرد تلقائيًا على رسائل العملاء', en: 'Automatically replying to customer messages' }, optional: false },
                { title: { ar: 'وكيل دعم العملاء', en: 'Customer support agent' }, description: { ar: 'الذكاء الاصطناعي يجيب على أسئلة العملاء الشائعة', en: 'AI answering common customer questions' }, optional: false }
            ],
            skills: [{ ar: 'بناء مشروعات أتمتة أعمال حقيقية', en: 'Building real business automation projects' }],
            project: { ar: 'نظام أتمتة متكامل لاستقبال العملاء والرد عليهم', en: 'Complete automation system for customer intake and response' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء معرض أعمال من مشاريع الأتمتة والذكاء الاصطناعي، والتحضير لوظائف أخصائي الأتمتة.', en: 'Build a portfolio of automation and AI projects, and prepare for automation specialist roles.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته في الأتمتة والذكاء الاصطناعي', en: 'Comprehensive projects reflecting everything learned in automation and AI' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك في الأتمتة والذكاء الاصطناعي', en: 'Website showcasing your automation and AI projects' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك في n8n والذكاء الاصطناعي', en: 'Writing a resume that highlights your n8n and AI skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية في الأتمتة', en: 'Training on technical interview questions in automation' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف الأتمتة', en: 'Presenting projects and applying for automation roles' }],
            project: { ar: 'معرض أعمال للأتمتة والذكاء الاصطناعي', en: 'Automation & AI portfolio' },
            courseId: null,
            next: []
        }
    ]
};
