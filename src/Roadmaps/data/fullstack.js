export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: كيف يعمل الويب', en: 'Start Here: How the Web Works' },
            description: { ar: 'تعلم أساسيات كيف يعمل الويب، شبكة الإنترنت، وكيف تصل طلبات الصفحات إلى السيرفرات قبل كتابة أي كود.', en: 'Learn how the web works, the internet, and how page requests reach servers before writing any code.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'كيف يعمل الإنترنت', en: 'How the internet works' }, description: { ar: 'البروتوكولات، عناوين IP، والنطاقات', en: 'Protocols, IP addresses, and domains' }, optional: false },
                { title: { ar: 'العميل والسيرفر', en: 'Client & server' }, description: { ar: 'كيف يتصل المتصفح بالسيرفر ويستقبل الاستجابات', en: 'How browsers connect to servers and receive responses' }, optional: false },
                { title: { ar: 'دور المتصفح', en: 'Browser role' }, description: { ar: 'كيف يطلب المتصفح الصفحات ويعرضها', en: 'How browsers request and render pages' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الويب', en: 'Web fundamentals' }],
            project: { ar: 'رسم خريطة لكيفية وصول صفحة الويب إلى متصفحك', en: 'Draw a map of how a web page reaches your browser' },
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
            next: ['html-css']
        },
        {
            id: 'html-css',
            title: { ar: 'HTML و CSS: بناء وتصميم الصفحات', en: 'HTML & CSS: Structure & Styling' },
            description: { ar: 'بناء صفحات الويب باستخدام HTML، وتنسيقها باستخدام CSS incluyendo Flexbox و Grid.', en: 'Build web pages using HTML, and style them using CSS including Flexbox and Grid.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'HTML هيكلي', en: 'Structural HTML' }, description: { ar: 'الوسوم الأساسية وهيكلة الصفحة', en: 'Basic tags and page structure' }, optional: false },
                { title: { ar: 'CSS التنسيقات الأساسية', en: 'CSS basic styling' }, description: { ar: 'الألوان، الخطوط، والمسافات', en: 'Colors, fonts, and spacing' }, optional: false },
                { title: { ar: 'Flexbox و Grid', en: 'Flexbox & Grid' }, description: { ar: 'التخطيط أحادي البعد وثنائي الأبعاد', en: 'One-dimensional and two-dimensional layout' }, optional: false },
                { title: { ar: 'التصميم المتجاوب', en: 'Responsive design' }, description: { ar: 'جعل الصفحات تعمل على جميع الشاشات', en: 'Making pages work on all screens' }, optional: false }
            ],
            skills: [{ ar: 'بناء صفحات HTML و CSS', en: 'Building HTML & CSS pages' }],
            project: { ar: 'صفحة هبوط متجاوبة باستخدام HTML و CSS', en: 'Responsive landing page using HTML & CSS' },
            courseId: null,
            next: ['javascript']
        },
        {
            id: 'javascript',
            title: { ar: 'جافاسكريبت: ES6+، DOM، وغير المتزامن', en: 'JavaScript: ES6+, DOM & Async' },
            description: { ar: 'تعلم جافاسكريبت من الصفر: المتغيرات، الدوال، التعامل مع صفحة الويب، والعمليات غير المتزامنة.', en: 'Learn JavaScript from scratch: variables, functions, working with the web page, and asynchronous operations.' },
            duration: { ar: '4 أسابيع', en: '4 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'متغيرات ودوال جافاسكريبت', en: 'JavaScript variables & functions' }, description: { ar: 'const، let، الدوال التقليدية والسهمية', en: 'const, let, regular and arrow functions' }, optional: false },
                { title: { ar: 'التعامل مع DOM', en: 'DOM manipulation' }, description: { ar: 'تعديل صفحة الويب ديناميكيًا عبر جافاسكريبت', en: 'Modifying the web page dynamically with JavaScript' }, optional: false },
                { title: { ar: 'الأحداث والتفاعل', en: 'Events & interaction' }, description: { ar: 'الرد على إجراءات المستخدم مثل النقر والكتابة', en: 'Responding to user actions like clicks and typing' }, optional: false },
                { title: { ar: 'البرمجة غير المتزامنة', en: 'Asynchronous JavaScript' }, description: { ar: 'Promises، async/await، وجلب البيانات عبر Fetch', en: 'Promises, async/await, and fetching data via Fetch' }, optional: false }
            ],
            skills: [{ ar: 'برمجة تفاعلية بجافاسكريبت', en: 'Interactive JavaScript programming' }],
            project: { ar: 'تطبيق يعرض بيانات من واجهة برمجية (API)', en: 'App that displays data from an API' },
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
            project: { ar: 'رفع مشروع HTML/CSS/JavaScript على GitHub مع توثيق', en: 'Upload HTML/CSS/JavaScript project to GitHub with documentation' },
            courseId: null,
            next: ['terminal-npm']
        },
        {
            id: 'terminal-npm',
            title: { ar: 'سطر الأوامر و npm', en: 'Terminal & npm' },
            description: { ar: 'تعلم استخدام سطر الأوامر، التنقل في الملفات، وإدارة الحزم باستخدام npm.', en: 'Learn to use the terminal, navigate files, and manage packages using npm.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات سطر الأوامر', en: 'Terminal basics' }, description: { ar: 'تشغيل الأوامر والتنقل بين المجلدات', en: 'Running commands and navigating folders' }, optional: false },
                { title: { ar: 'إدارة الحزم باستخدام npm', en: 'npm package management' }, description: { ar: 'تثبيت الحزم وإدارة ملف package.json', en: 'Installing packages and managing package.json' }, optional: false },
                { title: { ar: 'متغيرات البيئة', en: 'Environment variables' }, description: { ar: 'إدارة المفاتيح والإعدادات الحساسة', en: 'Managing keys and sensitive settings' }, optional: false }
            ],
            skills: [{ ar: 'استخدام سطر الأوامر و npm', en: 'Terminal & npm usage' }],
            project: { ar: 'إعداد مشروع جافاسكريبت باستخدام npm', en: 'Set up a JavaScript project using npm' },
            courseId: null,
            next: ['react']
        },
        {
            id: 'react',
            title: { ar: 'React: بناء واجهات المستخدم', en: 'React: Building User Interfaces' },
            description: { ar: 'تعلم بناء واجهات حديثة باستخدام مكونات React، الخطافات (Hooks)، والتوجيه.', en: 'Learn to build modern interfaces with React components, hooks, and routing.' },
            duration: { ar: '3 أسابيع', en: '3 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المكونات و JSX', en: 'Components & JSX' }, description: { ar: 'إنشاء مكونات قابلة لإعادة الاستخدام', en: 'Creating reusable components' }, optional: false },
                { title: { ar: 'الخصائص والحالة', en: 'Props & state' }, description: { ar: 'تمرير البيانات وإدارة الحالة داخل المكونات', en: 'Passing data and managing state within components' }, optional: false },
                { title: { ar: 'الخطافات (Hooks)', en: 'Hooks' }, description: { ar: 'useState، useEffect، والخطافات المخصصة', en: 'useState, useEffect, and custom hooks' }, optional: false },
                { title: { ar: 'التوجيه في React', en: 'React routing' }, description: { ar: 'التنقل بين الصفحات في تطبيق واحد', en: 'Navigating between pages in a single app' }, optional: false }
            ],
            skills: [{ ar: 'بناء تطبيقات React', en: 'Building React applications' }],
            project: { ar: 'مكتبة أفلام مع بحث وتنقل بين الصفحات', en: 'Movie library with search and page navigation' },
            courseId: null,
            next: ['node-express']
        },
        {
            id: 'node-express',
            title: { ar: 'Node.js و Express: بناء السيرفرات وواجهات API', en: 'Node.js & Express: Building Servers & APIs' },
            description: { ar: 'بناء سيرفرات ويب ومسارات API باستخدام Node.js و Express، أشهر إطار عمل لـ Node.js.', en: 'Build web servers and API routes using Node.js and Express, the most popular Node.js framework.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'إعداد Node.js و Express', en: 'Node.js & Express setup' }, description: { ar: 'إنشاء سيرفر بسيط واستقبال الطلبات', en: 'Creating a simple server and receiving requests' }, optional: false },
                { title: { ar: 'المسارات (Routing)', en: 'Routing' }, description: { ar: 'تحديد عناوين الواجهات البرمجية وسلوكها', en: 'Defining API endpoints and their behavior' }, optional: false },
                { title: { ar: 'الوسائط الوسيطة (Middleware)', en: 'Middleware' }, description: { ar: 'الوظائف التي تتعامل مع الطلب قبل الوصول للمسار', en: 'Functions that handle requests before reaching the route' }, optional: false },
                { title: { ar: 'معالجة الطلب والاستجابة', en: 'Request/response handling' }, description: { ar: 'قراءة بيانات الطلب وإرسال الاستجابات', en: 'Reading request data and sending responses' }, optional: false },
                { title: { ar: 'معالجة الأخطاء', en: 'Error handling' }, description: { ar: 'التقاط الأخطاء وإرسال استجابات مناسبة', en: 'Catching errors and sending appropriate responses' }, optional: false }
            ],
            skills: [{ ar: 'بناء سيرفرات وواجهات API باستخدام Express', en: 'Building servers & APIs with Express' }],
            project: { ar: 'خادم REST API باستخدام Node.js و Express', en: 'REST API server with Node.js & Express' },
            courseId: null,
            next: ['databases']
        },
        {
            id: 'databases',
            title: { ar: 'قواعد البيانات: SQL ثم NoSQL', en: 'Databases: SQL then NoSQL' },
            description: { ar: 'تعلم قواعد البيانات العلائقية باستخدام SQL و PostgreSQL، ثم قواعد البيانات غير العلائقية باستخدام MongoDB.', en: 'Learn relational databases using SQL & PostgreSQL, then non-relational databases using MongoDB.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات SQL', en: 'SQL basics' }, description: { ar: 'اختيار البيانات، فلترتها، وترتيبها', en: 'Selecting, filtering, and ordering data' }, optional: false },
                { title: { ar: 'الجداول والعلاقات', en: 'Tables & relationships' }, description: { ar: 'تصميم الجداول وربطها معًا', en: 'Designing tables and linking them together' }, optional: false },
                { title: { ar: 'قاعدة بيانات PostgreSQL', en: 'PostgreSQL database' }, description: { ar: 'تثبيت وتشغيل قاعدة بيانات PostgreSQL', en: 'Installing and running PostgreSQL database' }, optional: false },
                { title: { ar: 'أساسيات NoSQL', en: 'NoSQL basics' }, description: { ar: 'الفرق بين قواعد البيانات العلائقية وغير العلائقية', en: 'Difference between relational and non-relational databases' }, optional: false },
                { title: { ar: 'أساسيات MongoDB', en: 'MongoDB basics' }, description: { ar: 'إنشاء قواعد بيانات ومجموعات ووثائق', en: 'Creating databases, collections, and documents' }, optional: false }
            ],
            skills: [{ ar: 'SQL، PostgreSQL، و MongoDB', en: 'SQL, PostgreSQL, & MongoDB' }],
            project: { ar: 'تصميم واستعلام قواعد بيانات SQL و NoSQL', en: 'Design and query SQL & NoSQL databases' },
            courseId: null,
            next: ['auth-jwt']
        },
        {
            id: 'auth-jwt',
            title: { ar: 'التوثيق والصلاحيات', en: 'Authentication & Authorization' },
            description: { ar: 'تعلم تسجيل الدخول، إدارة الجلسات، استخدام JWT، وتشفير كلمات المرور.', en: 'Learn login, session management, JWT usage, and password hashing.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الجلسات وملفات تعريف الارتباط', en: 'Sessions & cookies' }, description: { ar: 'تذكر المستخدم بين الطلبات', en: 'Remembering users between requests' }, optional: false },
                { title: { ar: 'رموز JWT', en: 'JWT tokens' }, description: { ar: 'رموز آمنة لإثبات هوية المستخدم', en: 'Secure tokens for proving user identity' }, optional: false },
                { title: { ar: 'تشفير كلمات المرور', en: 'Password hashing' }, description: { ar: 'تخزين كلمات المرور بشكل آمن', en: 'Storing passwords securely' }, optional: false },
                { title: { ar: 'الصلاحية حسب الدور', en: 'Role-based access' }, description: { ar: 'تحديد ما يمكن لكل مستخدم القيام به', en: 'Defining what each user can do' }, optional: false }
            ],
            skills: [{ ar: 'التوثيق والتحكم في الوصول', en: 'Auth & access control' }],
            project: { ar: 'نظام تسجيل دخول وتسجيل مستخدمين باستخدام JWT', en: 'Login & registration system with JWT' },
            courseId: null,
            next: ['fullstack-connect']
        },
        {
            id: 'fullstack-connect',
            title: { ar: 'الربط بين الواجهة الأمامية والسيرفر', en: 'Connecting Frontend to Backend' },
            description: { ar: 'تعلم ربط تطبيق React بواجهة API خاصة بك، وإدارة حالة البيانات بين الواجهة الأمامية والسيرفر.', en: 'Learn to connect a React app to your own API, and manage data state between frontend and backend.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'استدعاء الواجهات من React', en: 'Calling APIs from React' }, description: { ar: 'جلب البيانات من السيرفر وعرضها في واجهة React', en: 'Fetching data from the server and displaying it in React UI' }, optional: false },
                { title: { ar: 'إدارة حالة الخادم', en: 'Server state management' }, description: { ar: 'تخزين وتحديث البيانات المستلمة من السيرفر', en: 'Storing and updating data received from the server' }, optional: false },
                { title: { ar: 'التعامل مع أخطاء الاستدعاء', en: 'API error handling' }, description: { ar: 'التعامل مع أخطاء الشبكة والفشل في الاستدعاء', en: 'Handling network errors and call failures' }, optional: false },
                { title: { ar: 'أمان الاتصال', en: 'Connection security' }, description: { ar: 'استخدام HTTPS والتحقق من هوية الطلبات', en: 'Using HTTPS and verifying request identity' }, optional: true }
            ],
            skills: [{ ar: 'ربط الواجهة الأمامية بالسيرفر', en: 'Connecting frontend to backend' }],
            project: { ar: 'تطبيق كامل يربط React بواجهة Express API', en: 'Full app connecting React to Express API' },
            courseId: null,
            next: ['typescript']
        },
        {
            id: 'typescript',
            title: { ar: 'تايبسكريبت للتطوير الكامل', en: 'TypeScript for Full-Stack' },
            description: { ar: 'إضافة أنواع البيانات إلى جافاسكريبت لتقليل الأخطاء وتحسين جودة الكود في الواجهة الأمامية والسيرفر.', en: 'Add type safety to JavaScript to reduce errors and improve code quality in frontend and backend.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الأنواع الأساسية', en: 'Basic types' }, description: { ar: 'الأنواع الأساسية في تايبسكريبت', en: 'Basic types in TypeScript' }, optional: false },
                { title: { ar: 'Interfaces والأنواع المخصصة', en: 'Interfaces & custom types' }, description: { ar: 'تعريف أشكال البيانات المتوقعة', en: 'Defining expected data shapes' }, optional: false },
                { title: { ar: 'تايبسكريبت مع React و Node.js', en: 'TypeScript with React & Node.js' }, description: { ar: 'كتابة مكونات React وسيرفرات Node.js بأنواع آمنة', en: 'Writing React components and Node.js servers with type safety' }, optional: false }
            ],
            skills: [{ ar: 'كتابة تطبيقات كاملة باستخدام تايبسكريبت', en: 'Writing full-stack apps with TypeScript' }],
            project: { ar: 'إعادة كتابة تطبيق كامل باستخدام تايبسكريبت', en: 'Rewrite a full app with TypeScript' },
            courseId: null,
            next: ['testing']
        },
        {
            id: 'testing',
            title: { ar: 'اختبار التطبيقات الكاملة', en: 'Testing Full-Stack Apps' },
            description: { ar: 'تعلم كتابة اختبارات للواجهة الأمامية والسيرفر للتأكد من عمل التطبيق بشكل صحيح.', en: 'Learn to write tests for frontend and backend to ensure the application works correctly.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'اختبارات الوحدات', en: 'Unit testing' }, description: { ar: 'اختبار الدوال والوحدات بشكل معزول', en: 'Testing functions and units in isolation' }, optional: false },
                { title: { ar: 'اختبار المكونات', en: 'Component testing' }, description: { ar: 'اختبار مكونات React بشكل منفصل', en: 'Testing React components individually' }, optional: false },
                { title: { ar: 'اختبار الواجهات البرمجية', en: 'API testing' }, description: { ar: 'التأكد من عمل نقاط النهاية بشكل صحيح', en: 'Verifying endpoints work correctly' }, optional: false },
                { title: { ar: 'اختبار التكامل', en: 'Integration testing' }, description: { ar: 'اختبار كيف تعمل الواجهة الأمامية والسيرفر معًا', en: 'Testing how frontend and backend work together' }, optional: false }
            ],
            skills: [{ ar: 'اختبار التطبيقات الكاملة', en: 'Full-stack testing' }],
            project: { ar: 'إضافة اختبارات لتطبيق React و Node.js', en: 'Add tests to a React & Node.js app' },
            courseId: null,
            next: ['docker-deployment']
        },
        {
            id: 'docker-deployment',
            title: { ar: 'دوكير، النشر، و Supabase', en: 'Docker, Deployment & Supabase' },
            description: { ar: 'تعلم تغليف التطبيقات باستخدام دوكير، نشرها على السيرفرات، واستخدام Supabase كخيار للتحكم في الخلفية بدون كود.', en: 'Learn to package apps with Docker, deploy them to servers, and use Supabase as a BaaS option for backend without code.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات دوكير', en: 'Docker basics' }, description: { ar: 'فهم الحاويات والصور', en: 'Understanding containers and images' }, optional: false },
                { title: { ar: 'ملف Dockerfile', en: 'Dockerfile' }, description: { ar: 'كتابة تعليمات بناء صورة دوكير', en: 'Writing instructions to build a Docker image' }, optional: false },
                { title: { ar: 'منصات النشر', en: 'Deployment platforms' }, description: { ar: 'نشر التطبيقات علىheroku، AWS، أو同様', en: 'Deploying apps to Heroku, AWS, or similar' }, optional: false },
                { title: { ar: 'أساسيات CI/CD', en: 'CI/CD basics' }, description: { ar: 'بناء واختبار ونشر تلقائي عند كل تعديل', en: 'Automated build, test, and deploy on every change' }, optional: true },
                { title: { ar: 'Supabase كخلفية', en: 'Supabase as backend' }, description: { ar: 'استخدام Supabase لقاعدة البيانات والتوثيق دون كتابة سيرفر', en: 'Using Supabase for database and auth without writing a server' }, optional: true }
            ],
            skills: [{ ar: 'دوكير، النشر، و Supabase', en: 'Docker, deployment, & Supabase' }],
            project: { ar: 'تغليف ونشر تطبيق كامل باستخدام دوكير و Supabase', en: 'Containerize and deploy a full app with Docker & Supabase' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء مشاريع نهائية شاملة تجمع بين الواجهة الأمامية والسيرفر، والتحضير لمقابلات العمل في التطوير الكامل.', en: 'Build comprehensive final projects combining frontend and backend, and prepare for full-stack development job interviews.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته', en: 'Comprehensive projects reflecting everything learned' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك ومهاراتك', en: 'Website showcasing your projects and skills' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك التقنية', en: 'Writing a resume that highlights your technical skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية', en: 'Training on technical interview questions' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف', en: 'Presenting projects and applying for jobs' }],
            project: { ar: 'معرض أعمال كامل مع واجهة أمامية وسيرفر', en: 'Full portfolio with frontend & backend' },
            courseId: null,
            next: []
        }
    ]
};
