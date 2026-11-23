export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: كيف تعمل الحواسيب والويب', en: 'Start Here: How Computers & the Web Work' },
            description: { ar: 'تعلم أساسيات كيف تعمل الحواسيب، شبكة الإنترنت، والمتصفحات قبل كتابة أول سطر برمجي.', en: 'Learn how computers, the internet, and browsers work before writing your first line of code.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'مكونات الحاسوب الأساسية', en: 'Basic computer components' }, description: { ar: 'العتاد والبرمجيات وكيفية عملها معًا', en: 'Basic hardware and software and how they work together' }, optional: false },
                { title: { ar: 'كيف يعمل الإنترنت', en: 'How the internet works' }, description: { ar: 'البروتوكولات، عناوين IP، والنطاقات', en: 'Protocols, IP addresses, and domains' }, optional: false },
                { title: { ar: 'دور المتصفح', en: 'Browser role' }, description: { ar: 'كيف يطلب المتصفح الصفحات ويعرضها', en: 'How browsers request and render pages' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الويب', en: 'Web fundamentals' }],
            project: { ar: 'بحث بسيط حول كيف تصل صفحة الويب إلى متصفحك', en: 'Simple research on how a web page reaches your browser' },
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
            next: ['html']
        },
        {
            id: 'html',
            title: { ar: 'HTML: بنية صفحات الويب', en: 'HTML: Web Page Structure' },
            description: { ar: 'بناء صفحات الويب الأولى باستخدام HTML للتنسيق وال콘تنت.', en: 'Build your first web pages using HTML for structure and content.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'هيكلية HTML', en: 'HTML structure' }, description: { ar: 'الوسوم الأساسية وهيكلة الصفحة', en: 'Basic tags and page structure' }, optional: false },
                { title: { ar: 'HTML دلالي (Semantic)', en: 'Semantic HTML' }, description: { ar: 'استخدام الوسوم المناسبة لكل قسم', en: 'Using appropriate tags for each section' }, optional: false },
                { title: { ar: 'النماذج والتحقق', en: 'Forms & validation' }, description: { ar: 'إنشاء نماذج إدخال والتحقق من البيانات', en: 'Creating input forms and validating data' }, optional: false },
                { title: { ar: 'إمكانية الوصول الأساسية', en: 'Basic accessibility' }, description: { ar: 'جعل الصفحات قابلة للاستخدام من الجميع', en: 'Making pages usable by everyone' }, optional: false }
            ],
            skills: [{ ar: 'كتابة HTML هيكلي', en: 'Writing structural HTML' }],
            project: { ar: 'صفحة تعريف شخصية بسيطة باستخدام HTML فقط', en: 'Simple personal profile page using HTML only' },
            courseId: null,
            next: ['css']
        },
        {
            id: 'css',
            title: { ar: 'CSS: التنسيق والتخطيط المتجاوب', en: 'CSS: Styling & Responsive Layout' },
            description: { ar: 'إتقان تنسيق الصفحات باستخدام Flexbox و Grid، وجعل التصميم يعمل على جميع الشاشات.', en: 'Master page styling with Flexbox and Grid, making designs work on all screens.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'محددات CSS ونموذج الصندوق', en: 'CSS selectors & box model' }, description: { ar: 'اختيار العناصر وتنسيق المسافات والحدود', en: 'Selecting elements and styling spacing and borders' }, optional: false },
                { title: { ar: 'Flexbox', en: 'Flexbox' }, description: { ar: 'التخطيط أحادي البعد والمحاذاة', en: 'One-dimensional layout and alignment' }, optional: false },
                { title: { ar: 'CSS Grid', en: 'CSS Grid' }, description: { ar: 'التخطيط ثنائي الأبعاد للصفحات المعقدة', en: 'Two-dimensional layout for complex pages' }, optional: false },
                { title: { ar: 'التصميم المتجاوب', en: 'Responsive design' }, description: { ar: 'استعلامات الوسائط وتكيف الشاشات', en: 'Media queries and screen adaptation' }, optional: false }
            ],
            skills: [{ ar: 'تصميم واجهات متجاوبة', en: 'Responsive interface design' }],
            project: { ar: 'صفحة هبوط متجاوبة (Landing Page)', en: 'Responsive landing page' },
            courseId: null,
            next: ['git-github']
        },
        {
            id: 'git-github',
            title: { ar: 'Git و GitHub: التحكم في الإصدارات', en: 'Git & GitHub: Version Control' },
            description: { ar: 'تعلم التحكم في الإصدارات، حفظ تغييرات الكود، والتعاون مع الآخرين عبر GitHub.', en: 'Learn version control, saving code changes, and collaborating with others via GitHub.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات Git', en: 'Git basics' }, description: { ar: 'المستودعات، الالتزام، والتاريخ', en: 'Repositories, commits, and history' }, optional: false },
                { title: { ar: 'الفروع والدمج', en: 'Branching & merging' }, description: { ar: 'إنشاء الفروع ودمج التغييرات', en: 'Creating branches and merging changes' }, optional: false },
                { title: { ar: 'التعاون عبر GitHub', en: 'GitHub collaboration' }, description: { ar: 'رفع المشاريع والمساهمة في المشاريع المفتوحة', en: 'Uploading projects and contributing to open source' }, optional: false },
                { title: { ar: 'طلبات السحب (Pull Requests)', en: 'Pull Requests' }, description: { ar: 'مراجعة الكود والموافقة على التغييرات', en: 'Code review and approving changes' }, optional: false }
            ],
            skills: [{ ar: 'استخدام Git و GitHub', en: 'Using Git & GitHub' }],
            project: { ar: 'رفع صفحة HTML/CSS على GitHub مع توثيق', en: 'Upload HTML/CSS page to GitHub with documentation' },
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
            next: ['tooling']
        },
        {
            id: 'tooling',
            title: { ar: 'مدير الحزم وأدوات البناء (npm, Vite)', en: 'Package Managers & Build Tools (npm, Vite)' },
            description: { ar: 'تعلم إدارة الاعتمادات، تشغيل مشاريع حديثة، واستخدام أدوات البناء.', en: 'Learn dependency management, running modern projects, and using build tools.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أساسيات npm', en: 'npm basics' }, description: { ar: 'تثبيت الحزم وإدارة ملف package.json', en: 'Installing packages and managing package.json' }, optional: false },
                { title: { ar: 'أداة Vite', en: 'Vite tool' }, description: { ar: 'إنشاء وتشغيل مشاريع أمامية سريعة', en: 'Creating and running fast front-end projects' }, optional: false },
                { title: { ar: 'متغيرات البيئة', en: 'Environment variables' }, description: { ar: 'إدارة المفاتيح والإعدادات الحساسة', en: 'Managing keys and sensitive settings' }, optional: false }
            ],
            skills: [{ ar: 'إدارة المشاريع والأدوات', en: 'Project and tool management' }],
            project: { ar: 'إعداد مشروع جافاسكريبت باستخدام Vite', en: 'Set up a JavaScript project using Vite' },
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
            next: ['styling-tools']
        },
        {
            id: 'styling-tools',
            title: { ar: 'أدوات التنسيق (Tailwind، أطر CSS)', en: 'Styling Tools (Tailwind, CSS Frameworks)' },
            description: { ar: 'تعلم استخدام أطر التنسيق الحديثة لتسريع تطوير الواجهات.', en: 'Learn to use modern styling frameworks to speed up interface development.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'optional',
            topics: [
                { title: { ar: 'Tailwind CSS', en: 'Tailwind CSS' }, description: { ar: 'الت庸يس باستخدام الفئات المنفردة', en: 'Styling with utility classes' }, optional: true },
                { title: { ar: 'أطر CSS أخرى', en: 'Other CSS frameworks' }, description: { ar: 'Bootstrap، Material UI، وغيرها', en: 'Bootstrap, Material UI, and others' }, optional: true },
                { title: { ar: 'التザイン والنظام البصري', en: 'Design systems' }, description: { ar: 'إنشاء أنظمة ألوان ومسافات متسقة', en: 'Creating consistent color and spacing systems' }, optional: true }
            ],
            skills: [{ ar: 'تنسيق سريع باستخدام الأطر', en: 'Fast styling with frameworks' }],
            project: { ar: 'إعادة تصميم صفحة باستخدام Tailwind CSS', en: 'Redesign a page using Tailwind CSS' },
            courseId: null,
            next: ['typescript']
        },
        {
            id: 'typescript',
            title: { ar: 'تايبسكريبت لتطوير الواجهات الأمامية', en: 'TypeScript for Front-End' },
            description: { ar: 'إضافة أنواع البيانات إلى جافاسكريبت لتقليل الأخطاء وتحسين جودة الكود.', en: 'Add type safety to JavaScript to reduce errors and improve code quality.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الأنواع الأساسية', en: 'Basic types' }, description: { ar: 'الأنواع الأساسية في تايبسكريبت', en: 'Basic types in TypeScript' }, optional: false },
                { title: { ar: 'الInterfaces والأنواع المخصصة', en: 'Interfaces & custom types' }, description: { ar: 'تعريف أشكال البيانات المتوقعة', en: 'Defining expected data shapes' }, optional: false },
                { title: { ar: 'تايبسكريبت مع React', en: 'TypeScript with React' }, description: { ar: 'كتابة مكونات React بأنواع آمنة', en: 'Writing React components with type safety' }, optional: false }
            ],
            skills: [{ ar: 'كتابة React باستخدام تايبسكريبت', en: 'Writing React with TypeScript' }],
            project: { ar: 'إعادة كتابة تطبيق React باستخدام تايبسكريبت', en: 'Rewrite a React app with TypeScript' },
            courseId: null,
            next: ['testing']
        },
        {
            id: 'testing',
            title: { ar: 'اختبار تطبيقات الواجهات الأمامية', en: 'Front-End Application Testing' },
            description: { ar: 'تعلم كتابة اختبارات تضمن عمل تطبيقك بشكل صحيح عند التعديل.', en: 'Learn to write tests that ensure your application works correctly when making changes.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'اختبارات الوحدات', en: 'Unit testing' }, description: { ar: 'اختبار الدوال والوحدات بشكل معزول', en: 'Testing functions and units in isolation' }, optional: false },
                { title: { ar: 'اختبار المكونات', en: 'Component testing' }, description: { ar: 'اختبار مكونات React بشكل منفصل', en: 'Testing React components individually' }, optional: false },
                { title: { ar: 'محاكاة الواجهات البرمجية', en: 'API mocking' }, description: { ar: 'محاكاة استجابات الخوادم في الاختبارات', en: 'Mocking server responses in tests' }, optional: false }
            ],
            skills: [{ ar: 'كتابة اختبارات تلقائية', en: 'Writing automated tests' }],
            project: { ar: 'إضافة اختبارات لتطبيق تايبسكريبت', en: 'Add tests to a TypeScript app' },
            courseId: null,
            next: ['performance-a11y']
        },
        {
            id: 'performance-a11y',
            title: { ar: 'الأداء وإمكانية الوصول', en: 'Performance & Accessibility' },
            description: { ar: 'جعل المواقع سريعة التنفيذ ومتاحة لجميع المستخدمين بما في ذلك أصحاب الاحتياجات الخاصة.', en: 'Make websites fast and accessible for all users, including people with disabilities.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'تحسين سرعة التحميل', en: 'Load time optimization' }, description: { ar: 'تقليل حجم الموارد وتسريع العرض', en: 'Reducing resource size and speeding up rendering' }, optional: false },
                { title: { ar: 'إمكانية الوصول (WCAG)', en: 'Accessibility (WCAG)' }, description: { ar: 'ضمان الوصول للمستخدمين من جميع القدرات', en: 'Ensuring access for users of all abilities' }, optional: false },
                { title: { ar: 'أدوات قياس الأداء', en: 'Performance tools' }, description: { ar: 'للايتفاوس، أو otras أدوات القياس', en: 'Lighthouse and other measurement tools' }, optional: false }
            ],
            skills: [{ ar: 'تحسين أداء وإمكانية الوصول', en: 'Performance and accessibility optimization' }],
            project: { ar: 'تدقيق أداء وإمكانية الوصول لمشروع', en: 'Performance and accessibility audit of a project' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء معرض أعمال مميز والتحضير لمقابلات العمل في تطوير الواجهات الأمامية.', en: 'Build a standout portfolio and prepare for front-end development job interviews.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته', en: 'Comprehensive projects reflecting everything learned' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك ومهاراتك', en: 'Website showcasing your projects and skills' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك التقنية', en: 'Writing a resume that highlights your technical skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية', en: 'Training on technical interview questions' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف', en: 'Presenting projects and applying for jobs' }],
            project: { ar: 'معرض أعمال شخصي على الويب', en: 'Personal portfolio website' },
            courseId: null,
            next: []
        }
    ]
};
