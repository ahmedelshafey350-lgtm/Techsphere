export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: كيف يعمل الإنترنت والسيرفرات', en: 'Start Here: How the Internet & Servers Work' },
            description: { ar: 'تعلم أساسيات كيف يعمل الإنترنت، نموذج العميل والسيرفر، وكيف تصل طلبات الويب إلى الخوادم قبل كتابة أي كود.', en: 'Learn how the internet, client-server model, and web requests work before writing any code.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'كيف يعمل الإنترنت', en: 'How the internet works' }, description: { ar: 'البروتوكولات، عناوين IP، والنطاقات', en: 'Protocols, IP addresses, and domains' }, optional: false },
                { title: { ar: 'العميل والسيرفر', en: 'Client & server' }, description: { ar: 'كيف يتصل المتصفح بالسيرفر ويستقبل الاستجابات', en: 'How browsers connect to servers and receive responses' }, optional: false },
                { title: { ar: 'بروتوكول HTTP', en: 'HTTP protocol' }, description: { ar: 'أساسيات طلبات واستجابات الويب', en: 'Basics of web requests and responses' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الويب والسيرفرات', en: 'Web and server fundamentals' }],
            project: { ar: 'رسم خريطة لكيفية وصول طلب ويب إلى سيرفر والعودة', en: 'Draw a map of how a web request reaches a server and returns' },
            courseId: null,
            next: ['programming-fundamentals']
        },
        {
            id: 'programming-fundamentals',
            title: { ar: 'أساسيات البرمجة ومنطق الحل', en: 'Programming Fundamentals & Logic' },
            description: { ar: 'تعلم كيف تفكر كمبرمج: الخوارزميات، المنطق، المخططات الانسيابية، والكود الوهمي قبل اختيار لغة.', en: 'Learn to think like a programmer: algorithms, logic, flowcharts, and pseudocode before picking a language.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'حل المشاكل خطوة بخطوة', en: 'Step-by-step problem solving' }, description: { ar: 'تقسيم المشكلة الكبيرة إلى أجزاء أصغر', en: 'Breaking big problems into smaller parts' }, optional: false },
                { title: { ar: 'المخططات الانسيابية', en: 'Flowcharts' }, description: { ar: 'رسم مسار المنطق قبل كتابة الكود', en: 'Drawing logic flow before writing code' }, optional: false },
                { title: { ar: 'الكود الوهمي', en: 'Pseudocode' }, description: { ar: 'كتابة الخطوات بلغة بسيطة قريبة من الإنجليزية', en: 'Writing steps in simple English-like language' }, optional: false },
                { title: { ar: 'المتغيرات والشرطات والتكرارات', en: 'Variables, conditionals, loops' }, description: { ar: 'تخزين البيانات واتخاذ القرارات وتكرار العمليات', en: 'Storing data, making decisions, and repeating operations' }, optional: false }
            ],
            skills: [{ ar: 'التفكير الخوارزمي', en: 'Algorithmic thinking' }],
            project: { ar: 'رسم مخطط انسيابي لمشكلة يومية وحلها', en: 'Draw a flowchart for a daily-life problem and solve it' },
            courseId: null,
            next: ['javascript-node']
        },
        {
            id: 'javascript-node',
            title: { ar: 'جافاسكريبت(Node.js) للسيرفرات', en: 'JavaScript (Node.js) for Servers' },
            description: { ar: 'تعلم جافاسكريبت من الصفر ثم استخدم Node.js لبناء سيرفرات وتطبيقات طرف السيرفر.', en: 'Learn JavaScript from scratch, then use Node.js to build servers and backend applications.' },
            duration: { ar: '4 أسابيع', en: '4 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'متغيرات ودوال جافاسكريبت', en: 'JavaScript variables & functions' }, description: { ar: 'const، let، الدوال التقليدية والسهمية', en: 'const, let, regular and arrow functions' }, optional: false },
                { title: { ar: 'أساسيات Node.js', en: 'Node.js basics' }, description: { ar: 'تشغيل جافاسكريبت خارج المتصفح، وإنشاء سيرفرات بسيطة', en: 'Running JavaScript outside the browser, and creating simple servers' }, optional: false },
                { title: { ar: 'مدير الحزم npm', en: 'npm packages' }, description: { ar: 'تثبيت وإدارة المكتبات الخارجية', en: 'Installing and managing external libraries' }, optional: false },
                { title: { ar: 'البرمجة غير المتزامنة', en: 'Asynchronous JavaScript' }, description: { ar: 'Promises، async/await، والتعامل مع المهام التي تستغرق وقتًا', en: 'Promises, async/await, and handling time-consuming tasks' }, optional: false },
                { title: { ar: 'بايثون كبديل', en: 'Python as an alternative' }, description: { ar: 'لغة بديلة لتطوير السيرفرات إذا كنت تفضلها على جافاسكريبت', en: 'Alternative language for server development if you prefer it over JavaScript' }, optional: true }
            ],
            skills: [{ ar: 'برمجة السيرفرات بجافاسكريبت و Node.js', en: 'Server programming with JavaScript & Node.js' }],
            project: { ar: 'أداة سطر أوامر بسيطة باستخدام Node.js', en: 'Simple command-line tool using Node.js' },
            courseId: null,
            next: ['git-github']
        },
        {
            id: 'git-github',
            title: { ar: 'Git و GitHub: التحكم في الإصدارات', en: 'Git & GitHub: Version Control' },
            description: { ar: 'تعلم التحكم في الإصدارات، حفظ تغييرات الكود، والتعاون مع الآخرين عبر GitHub.', en: 'Learn version control, saving code changes, and collaborating via GitHub.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات Git', en: 'Git basics' }, description: { ar: 'المستودعات، الالتزام، والتاريخ', en: 'Repositories, commits, and history' }, optional: false },
                { title: { ar: 'الفروع والدمج', en: 'Branching & merging' }, description: { ar: 'إنشاء الفروع ودمج التغييرات', en: 'Creating branches and merging changes' }, optional: false },
                { title: { ar: 'التعاون عبر GitHub', en: 'GitHub collaboration' }, description: { ar: 'رفع المشاريع والمساهمة في المشاريع المفتوحة', en: 'Uploading projects and contributing to open source' }, optional: false },
                { title: { ar: 'طلبات السحب (Pull Requests)', en: 'Pull Requests' }, description: { ar: 'مراجعة الكود والموافقة على التغييرات', en: 'Code review and approving changes' }, optional: false }
            ],
            skills: [{ ar: 'استخدام Git و GitHub', en: 'Using Git & GitHub' }],
            project: { ar: 'رفع مشروع Node.js على GitHub مع توثيق', en: 'Upload Node.js project to GitHub with documentation' },
            courseId: null,
            next: ['terminal-linux']
        },
        {
            id: 'terminal-linux',
            title: { ar: 'سطر الأوامر وأساسيات لينكس', en: 'Terminal & Linux Basics' },
            description: { ar: 'تعلم استخدام سطر الأوامر، التنقل في الملفات، وإدارة السيرفرات عبر لينكس.', en: 'Learn to use the terminal, navigate files, and manage servers via Linux.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات سطر الأوامر', en: 'Terminal basics' }, description: { ar: 'تشغيل الأوامر والتنقل بين المجلدات', en: 'Running commands and navigating folders' }, optional: false },
                { title: { ar: 'إدارة الملفات والصلاحيات', en: 'File management & permissions' }, description: { ar: 'إنشاء الملفات وتعديلها وضبط صلاحيات الوصول', en: 'Creating and editing files and setting access permissions' }, optional: false },
                { title: { ar: 'الاتصال بالسيرفر عبر SSH', en: 'SSH basics' }, description: { ar: 'الاتصال الآمن بالسيرفرات عن بعد', en: 'Securely connecting to remote servers' }, optional: false },
                { title: { ar: 'إدارة الحزم في لينكس', en: 'Linux package management' }, description: { ar: 'تثبيت وتحديث البرامج عبر سطر الأوامر', en: 'Installing and updating software via command line' }, optional: false }
            ],
            skills: [{ ar: 'استخدام سطر الأوامر ولينكس', en: 'Linux command line usage' }],
            project: { ar: 'إدارة سيرفر بعيد عبر سطر الأوامر', en: 'Manage a remote server via terminal' },
            courseId: null,
            next: ['http-rest-json']
        },
        {
            id: 'http-rest-json',
            title: { ar: 'بروتوكول HTTP، REST، و JSON', en: 'HTTP, REST, and JSON' },
            description: { ar: 'فهم كيف يتواصل العملاء مع السيرفرات عبر HTTP، وتصميم واجهات RESTful، وتعامل مع بيانات JSON.', en: 'Understand how clients communicate with servers via HTTP, design RESTful interfaces, and work with JSON data.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'طرق HTTP', en: 'HTTP methods' }, description: { ar: 'GET، POST، PUT، DELETE ومتى تستخدم كل منها', en: 'GET, POST, PUT, DELETE and when to use each' }, optional: false },
                { title: { ar: 'أكواد الحالة', en: 'HTTP status codes' }, description: { ar: 'فهم أكواد مثل 200، 404، 500', en: 'Understanding codes like 200, 404, 500' }, optional: false },
                { title: { ar: 'مبادئ REST', en: 'REST principles' }, description: { ar: 'تصميم واجهات برمجية موحدة ومتوقعة', en: 'Designing consistent and predictable API interfaces' }, optional: false },
                { title: { ar: 'بيانات JSON', en: 'JSON data' }, description: { ar: 'تنسيق البيانات المستخدَم في الواجهات البرمجية', en: 'Data format used in APIs' }, optional: false }
            ],
            skills: [{ ar: 'أساسيات HTTP وواجهات REST', en: 'HTTP & REST API fundamentals' }],
            project: { ar: 'اختبار واجهات برمجية باستخدام Postman أو curl', en: 'Test APIs using Postman or curl' },
            courseId: null,
            next: ['express-node']
        },
        {
            id: 'express-node',
            title: { ar: 'إطار العمل Express مع Node.js', en: 'Express Framework with Node.js' },
            description: { ar: 'بناء سيرفرات ويب ومسارات API باستخدام Express، أشهر إطار عمل لـ Node.js.', en: 'Build web servers and API routes using Express, the most popular Node.js framework.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'إعداد Express', en: 'Express setup' }, description: { ar: 'إنشاء سيرفر بسيط واستقبال الطلبات', en: 'Creating a simple server and receiving requests' }, optional: false },
                { title: { ar: 'المسارات (Routing)', en: 'Routing' }, description: { ar: 'تحديد عناوين الواجهات البرمجية وسلوكها', en: 'Defining API endpoints and their behavior' }, optional: false },
                { title: { ar: 'الوسائط الوسيطة (Middleware)', en: 'Middleware' }, description: { ar: 'الوظائف التي تتعامل مع الطلب قبل الوصول للمسار', en: 'Functions that handle requests before reaching the route' }, optional: false },
                { title: { ar: 'معالجة الطلب والاستجابة', en: 'Request/response handling' }, description: { ar: 'قراءة بيانات الطلب وإرسال الاستجابات', en: 'Reading request data and sending responses' }, optional: false },
                { title: { ar: 'معالجة الأخطاء', en: 'Error handling' }, description: { ar: 'التقاط الأخطاء وإرسال استجابات مناسبة', en: 'Catching errors and sending appropriate responses' }, optional: false }
            ],
            skills: [{ ar: 'بناء سيرفرات باستخدام Express', en: 'Building servers with Express' }],
            project: { ar: 'خادم REST API باستخدام Express', en: 'REST API server with Express' },
            courseId: null,
            next: ['sql-postgres']
        },
        {
            id: 'sql-postgres',
            title: { ar: 'قواعد البيانات العلائقية (SQL و PostgreSQL)', en: 'Relational Databases (SQL & PostgreSQL)' },
            description: { ar: 'تعلم قواعد البيانات العلائقية، كتابة استعلامات SQL، واستخدام PostgreSQL لتخزين البيانات.', en: 'Learn relational databases, write SQL queries, and use PostgreSQL for data storage.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات SQL', en: 'SQL basics' }, description: { ar: 'اختيار البيانات،فلترتها، وترتيبها', en: 'Selecting, filtering, and ordering data' }, optional: false },
                { title: { ar: 'الجداول والعلاقات', en: 'Tables & relationships' }, description: { ar: 'تصميم الجداول وربطها معًا', en: 'Designing tables and linking them together' }, optional: false },
                { title: { ar: 'الاستعلامات والتجميع', en: 'Queries & joins' }, description: { ar: 'جلب البيانات من جداول متعددة', en: 'Fetching data from multiple tables' }, optional: false },
                { title: { ar: 'إعداد PostgreSQL', en: 'PostgreSQL setup' }, description: { ar: 'تثبيت وتشغيل قاعدة بيانات PostgreSQL', en: 'Installing and running PostgreSQL database' }, optional: false },
                { title: { ar: 'تصميم قاعدة البيانات', en: 'Database design' }, description: { ar: 'التخطيط لهيكل البيانات قبل البناء', en: 'Planning data structure before building' }, optional: false }
            ],
            skills: [{ ar: 'SQL وتصميم قواعد البيانات', en: 'SQL & database design' }],
            project: { ar: 'تصميم واستعلام قاعدة بيانات PostgreSQL', en: 'Design and query a PostgreSQL database' },
            courseId: null,
            next: ['nosql-mongodb']
        },
        {
            id: 'nosql-mongodb',
            title: { ar: 'قواعد بيانات غير علائقية (NoSQL و MongoDB)', en: 'NoSQL Databases & MongoDB' },
            description: { ar: 'تعلم قواعد بيانات المستندات، وتخزين البيانات بصيغة JSON مرنة باستخدام MongoDB.', en: 'Learn document databases and store data in flexible JSON format using MongoDB.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'مفاهيم NoSQL', en: 'NoSQL concepts' }, description: { ar: 'الفرق بين قواعد البيانات العلائقية وغير العلائقية', en: 'Difference between relational and non-relational databases' }, optional: false },
                { title: { ar: 'أساسيات MongoDB', en: 'MongoDB basics' }, description: { ar: 'إنشاء قواعد بيانات ومجموعات ووثائق', en: 'Creating databases, collections, and documents' }, optional: false },
                { title: { ar: 'عمليات CRUD', en: 'CRUD operations' }, description: { ar: 'إنشاء، قراءة، تحديث، وحذف البيانات', en: 'Create, read, update, and delete data' }, optional: false },
                { title: { ar: 'مكتبة Mongoose (اختياري)', en: 'Mongoose (optional)' }, description: { ar: 'ربط Node.js بـ MongoDB بسهولة', en: 'Connecting Node.js to MongoDB easily' }, optional: true }
            ],
            skills: [{ ar: 'MongoDB وقواعد البيانات المستندية', en: 'MongoDB & document databases' }],
            project: { ar: 'تخزين بيانات الواجهة البرمجية في MongoDB', en: 'Store API data in MongoDB' },
            courseId: null,
            next: ['auth-jwt']
        },
        {
            id: 'auth-jwt',
            title: { ar: 'التوثيق والصلاحيات (Authentication & Authorization)', en: 'Authentication & Authorization' },
            description: { ar: 'تعلم تسجيل الدخول، إدارة الجلسات، استخدام JWT، وتشفير كلمات المرور.', en: 'Learn login, session management, JWT usage, and password hashing.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الجلسات وملفات تعريف الارتباط', en: 'Sessions & cookies' }, description: { ar: 'تذكر المستخدم بين الطلبات', en: 'Remembering users between requests' }, optional: false },
                { title: { ar: 'رموز JWT', en: 'JWT tokens' }, description: { ar: 'رموز آمنة لإثبات هوية المستخدم', en: 'Secure tokens for proving user identity' }, optional: false },
                { title: { ar: 'تشفير كلمات المرور', en: 'Password hashing' }, description: { ar: 'تخزين كلمات المرور بشكل آمن', en: 'Storing passwords securely' }, optional: false },
                { title: { ar: 'الصلاحيات basada على الأدوار', en: 'Role-based access' }, description: { ar: 'تحديد ما يمكن لكل مستخدم القيام به', en: 'Defining what each user can do' }, optional: false },
                { title: { ar: 'أساسيات OAuth', en: 'OAuth basics' }, description: { ar: 'تسجيل الدخول عبر حسابات خارجية مثل جوجل', en: 'Logging in via external accounts like Google' }, optional: true }
            ],
            skills: [{ ar: 'التوثيق والتحكم في الوصول', en: 'Auth & access control' }],
            project: { ar: 'نظام تسجيل دخول وتسجيل مستخدمين باستخدام JWT', en: 'Login & registration system with JWT' },
            courseId: null,
            next: ['api-design']
        },
        {
            id: 'api-design',
            title: { ar: 'تصميم وتوثيق الواجهات البرمجية', en: 'API Design & Documentation' },
            description: { ar: 'تصميم واجهات API واضحة وموحدة، وتوثيقها باستخدام أدوات مثل Swagger أو Postman.', en: 'Design clear and consistent APIs, and document them using tools like Swagger or Postman.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'تصميم RESTful', en: 'RESTful design' }, description: { ar: 'مبادئ تصميم الواجهات البرمجية الحديثة', en: 'Principles of modern API design' }, optional: false },
                { title: { ar: 'إصدارات الواجهة', en: 'Versioning' }, description: { ar: 'إدارة التغييرات في الواجهات مع مرور الوقت', en: 'Managing interface changes over time' }, optional: false },
                { title: { ar: 'صيغ الأخطاء', en: 'Error formats' }, description: { ar: 'إرسال رسائل أخطاء واضحة ومفيدة', en: 'Sending clear and useful error messages' }, optional: false },
                { title: { ar: 'توثيق الواجهات', en: 'API documentation' }, description: { ar: 'كتابة دليل استخدام للمطورين الآخرين', en: 'Writing a usage guide for other developers' }, optional: false },
                { title: { ar: 'اختبار الواجهات', en: 'API testing' }, description: { ar: 'التأكد من عمل الواجهات كما هو متوقع', en: 'Verifying APIs work as expected' }, optional: false }
            ],
            skills: [{ ar: 'تصميم وتوثيق واجهات API', en: 'API design & documentation' }],
            project: { ar: 'توثيق واجهة REST باستخدام Swagger', en: 'Document a REST API with Swagger' },
            courseId: null,
            next: ['security-basics']
        },
        {
            id: 'security-basics',
            title: { ar: 'أساسيات أمن التطبيقات', en: 'Security Basics' },
            description: { ar: 'تعلم حماية السيرفرات والتطبيقات من الثغرات الشائعة مثل حقن SQL واختراق الجلسات.', en: 'Learn to protect servers and applications from common vulnerabilities like SQL injection and session hijacking.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أهم 10 ثغرات (OWASP)', en: 'OWASP top 10' }, description: { ar: 'أكثر ثغرات أمن الويب شيوعًا', en: 'Most common web security vulnerabilities' }, optional: false },
                { title: { ar: 'التحقق من المدخلات', en: 'Input validation' }, description: { ar: 'التحقق من بيانات المستخدم قبل معالجتها', en: 'Validating user data before processing' }, optional: false },
                { title: { ar: 'الوقاية من حقن SQL', en: 'SQL injection prevention' }, description: { ar: 'حماية قاعدة البيانات من الهجمات الضارة', en: 'Protecting the database from malicious attacks' }, optional: false },
                { title: { ar: 'الأمان عبر CORS', en: 'CORS' }, description: { ar: 'التحكم في المواقع التي يمكنها الوصول لواجهاتك', en: 'Controlling which sites can access your APIs' }, optional: false },
                { title: { ar: 'وسيط Helmet (اختياري)', en: 'Helmet middleware (optional)' }, description: { ar: 'إضافة رؤوس أمان للسيرفر Express', en: 'Adding security headers to Express server' }, optional: true }
            ],
            skills: [{ ar: 'أساسيات أمن الويب', en: 'Web security fundamentals' }],
            project: { ar: 'تأمين واجهة Express API ضد الهجمات الشائعة', en: 'Secure an Express API against common attacks' },
            courseId: null,
            next: ['testing']
        },
        {
            id: 'testing',
            title: { ar: 'اختبار تطبيقات السيرفر', en: 'Server Application Testing' },
            description: { ar: 'تعلم كتابة اختبارات للتأكد من عمل واجهات البرمجة والمنطق السيرفري بشكل صحيح.', en: 'Learn to write tests to ensure APIs and server logic work correctly.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'اختبارات الوحدات', en: 'Unit testing' }, description: { ar: 'اختبار الدوال والوحدات بشكل معزول', en: 'Testing functions and units in isolation' }, optional: false },
                { title: { ar: 'اختبار التكامل', en: 'Integration testing' }, description: { ar: 'اختبار كيف تعمل الأجزاء معًا', en: 'Testing how parts work together' }, optional: false },
                { title: { ar: 'اختبار الواجهات', en: 'API testing' }, description: { ar: 'التأكد من عمل نقاط النهاية بشكل صحيح', en: 'Verifying endpoints work correctly' }, optional: false },
                { title: { ar: 'المحاكاة (Mocking)', en: 'Mocking' }, description: { ar: 'تقليدdependence الخارجية في الاختبارات', en: 'Simulating external dependencies in tests' }, optional: false },
                { title: { ar: 'أدوات الاختبار', en: 'Test runners' }, description: { ar: 'استخدام Jest أو Mocha للاختبار', en: 'Using Jest or Mocha for testing' }, optional: false }
            ],
            skills: [{ ar: 'اختبار تطبيقات السيرفر', en: 'Backend testing' }],
            project: { ar: 'إضافة اختبارات لواجهة Express API', en: 'Add tests to an Express API' },
            courseId: null,
            next: ['docker-deployment']
        },
        {
            id: 'docker-deployment',
            title: { ar: 'دوكير، النشر، و CI/CD', en: 'Docker, Deployment & CI/CD' },
            description: { ar: 'تعلم تغليف التطبيقات باستخدام دوكير، نشرها على السيرفرات، وإعداد خطوط النشر التلقائي.', en: 'Learn to package apps with Docker, deploy them to servers, and set up automated CI/CD pipelines.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات دوكير', en: 'Docker basics' }, description: { ar: 'فهم الحاويات والصور', en: 'Understanding containers and images' }, optional: false },
                { title: { ar: 'ملف Dockerfile', en: 'Dockerfile' }, description: { ar: 'كتابة تعليمات بناء صورة دوكير', en: 'Writing instructions to build a Docker image' }, optional: false },
                { title: { ar: 'تشغيل الحاويات', en: 'Containers' }, description: { ar: 'تشغيل التطبيقات في بيئات معزولة', en: 'Running applications in isolated environments' }, optional: false },
                { title: { ar: 'منصات النشر (اختياري)', en: 'Deployment platforms (optional)' }, description: { ar: 'نشر التطبيقات علىheroku، AWS، أو同様', en: 'Deploying apps to Heroku, AWS, or similar' }, optional: true },
                { title: { ar: 'أساسيات CI/CD', en: 'CI/CD basics' }, description: { ar: 'بناء واختبار ونشر تلقائي عند كل تعديل', en: 'Automated build, test, and deploy on every change' }, optional: true }
            ],
            skills: [{ ar: 'دوكير والنشر التلقائي', en: 'Docker & deployment' }],
            project: { ar: 'تغليف ونشر تطبيق Node.js باستخدام دوكير', en: 'Containerize and deploy a Node.js app' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء مشاريع نهائية شاملة والتحضير لمقابلات العمل في تطوير السيرفرات.', en: 'Build comprehensive final projects and prepare for backend development job interviews.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته', en: 'Comprehensive projects reflecting everything learned' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك ومهاراتك', en: 'Website showcasing your projects and skills' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك التقنية', en: 'Writing a resume that highlights your technical skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية', en: 'Training on technical interview questions' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف', en: 'Presenting projects and applying for jobs' }],
            project: { ar: 'معرض أعمال خلفي مع عدة واجهات برمجية', en: 'Backend portfolio with multiple APIs' },
            courseId: null,
            next: []
        }
    ]
};
