import { AccountCircle, CalendarToday, Visibility } from '@mui/icons-material';
const articles = [
    {
        id: 1,
        image: "/image/AI Automation_ مستقبل الوظائف الذكية.png",
        title: "AI Automation الوظائف الجديدة التي ظهرت بسبب الذكاء الاصطناعي",
        description:
            "تعرف على مجال AI Automation والوظائف الجديدة التي ظهرت بسبب الذكاء الاصطناعي وأهم المهارات المطلوبة لدخول المجال.",
        paragraph:
            "اكتشف كيف يغيّر الذكاء الاصطناعي والأتمتة سوق العمل، وما المهارات التي يمكنك تعلمها للاستفادة من الفرص الجديدة.",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
    },
    {
        id: 2,
        image: "/image/KS2oz63i53V4eGp-n7k7chhnovZJDgNoimportant.jpg",
        title: "أهم 10 مشاريع برمجي للمبتدئين لبناء Portfolio قوي",
        description:
            "قائمة بأفضل 10 مشاريع برمجية للمبتدئين تساعدك على بناء Portfolio قوي وإثبات مهاراتك عند التقديم على أول وظيفة برمجية.",
        paragraph:
            "تعرف على مجموعة من المشاريع العملية التي تساعدك على تطبيق ما تعلمته، وتطوير مهاراتك، وإنشاء معرض أعمال يعكس مستواك البرمجي.",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
    },
    {
        id: 3,
        image: "/image/Salary.jpg",
        title: "رواتب المبرمجين في مصر والدول العربية 2026",
        description:
            "تعرف على رواتب المبرمجين في مصر والدول العربية في 2026 والعوامل التي تؤثر على الدخل مثل الخبرة والتخصص واللغة.",
        paragraph:
            "استكشف متوسطات الرواتب في مجال البرمجة، والفروق بين التخصصات ومستويات الخبرة، والعوامل التي قد تساعدك على تحسين دخلك.",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
    },
    {
        id: 4,
        image: "/image/Electronics.jpg",
        title: "كيف تتعلم الإلكترونيات من الصفر؟ 2026",
        description:
           " كل دائرة إلكترونية وراها فكرة، وكل مشروع كبير بيبدأ بفهم الأساسيات.",
        paragraph:
           " في البوست ده هنبدأ رحلتنا في عالم الإلكترونيات، من فهم المكونات الإلكترونية وطريقة عملها، لحد تحليل الدوائر وتصميم مشاريع عملية بإيدك.",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
    },
    {
        id: 5,
        title: "كيف تتعلم البرمجة من الصفر؟",
        slug: "how-to-learn-programming-from-scratch",
        image: "/image/fullstack.jpg",
        paragraph:
            "دليل شامل للمبتدئين لتعلم البرمجة من الصفر، واختيار لغة البرمجة المناسبة، وبناء مشاريع عملية تساعدك على تطوير مهاراتك والاستعداد لسوق العمل.",
        category: "Programming",
        author: {
            name: "Ahmed Elshafey",
            avatar: "/images/authors/ahmed.jpg",
            bio: "Mechatronics and Industrial Automation Engineer | Front-End Developer | Tech Enthusiast",
        },
        publishedAt: "2026-10-29",
        readTime: "8 min read",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
        comments: 24,
        tags: ["Programming", "Beginners", "Learning Path"],
        featured: true,
    },

    {
        id: 6,
        title: "كيف تحصل على وظيفة في البرمجة بدون خبرة؟",
        slug: "how-to-get-a-programming-job-without-experience",
        image: "/image/HowLearning.jpg",
        paragraph:
            "اكتشف كيف تبني Portfolio قويًا، وتنفذ مشاريع حقيقية، وتكتب CV احترافيًا، وتستعد للمقابلات الشخصية لتزيد فرصك في الحصول على أول وظيفة في مجال البرمجة.",
        category: "Career",
        author: {
            name: "Ahmed Elshafey",
            avatar: "/images/authors/ahmed.jpg",
            bio: "Mechatronics and Industrial Automation Engineer | Front-End Developer | Tech Enthusiast",
        },
        publishedAt: "2026-10-29",
        readTime: "7 min read",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "1167 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
        comments: 18,
        tags: ["Career", "Jobs", "Portfolio", "Junior Developer"],
        featured: true,
    },

    {
        id: 7,
        title: "هل البرمجة لسه ليها مستقبل؟",
        slug: "does-programming-still-have-a-future",
        image: "/image/programing.jpg",
        paragraph:
            "مع تطور الذكاء الاصطناعي وأدوات كتابة الكود، هل ما زالت البرمجة مجالًا يستحق التعلم؟ تعرّف على المهارات المطلوبة، وتأثير AI على سوق العمل، وكيف تستعد للمستقبل.",
        category: "Technology",
        author: {
            name: "Ahmed Elshafey",
            avatar: "/images/authors/ahmed.jpg",
            bio: "Mechatronics and Industrial Automation Engineer | Front-End Developer | Tech Enthusiast",
        },
        publishedAt: "2026-10-29",
        readTime: "6 min read",
        meta: {
            author: "موريشن",
            authorIcon: <AccountCircle style={{ fontSize: '1.2rem' }} />,

            date: "١٨ يونيو ٢٠٢٦",  
            dateIcon: <CalendarToday style={{ fontSize: '1rem' }} />,

            views: "450 مشاهدة",
            viewsIcon: <Visibility style={{ fontSize: '1.2rem' }} />
        },
        comments: 36,
        tags: ["AI", "Programming", "Future of Tech", "Career"],
        featured: true,
    },

];

const englishArticleContent = {
    1: {
        title: 'New Careers Emerging from AI and AI Automation',
        description: 'Explore AI Automation, the new careers emerging from artificial intelligence, and the key skills needed to enter the field.',
        paragraph: 'Discover how artificial intelligence and automation are changing the job market and which skills can help you benefit from new opportunities.',
    },
    2: {
        title: '10 Essential Programming Projects for Beginners to Build a Strong Portfolio',
        description: 'Explore 10 beginner-friendly programming projects that help you build a strong portfolio and demonstrate your skills when applying for your first developer role.',
        paragraph: 'Explore practical projects that help you apply what you have learned, develop your skills, and build a portfolio that reflects your programming ability.',
    },
    3: {
        title: 'Programmer Salaries in Egypt and Arab Countries in 2026',
        description: 'Learn about programmer salaries in Egypt and Arab countries in 2026, and how experience, specialization, and language skills affect earnings.',
        paragraph: 'Explore salary ranges in programming, differences between specializations and experience levels, and factors that can help increase your income.',
    },
    4: {
        title: 'How to Learn Electronics from Scratch in 2026',
        description: 'Every electronic circuit starts with an idea, and every major project begins with understanding the fundamentals.',
        paragraph: 'Start exploring electronics by learning how components work, analyzing circuits, and designing hands-on projects.',
    },
    5: {
        title: 'How to Learn Programming from Scratch',
        paragraph: 'A complete beginner’s guide to learning programming from scratch, choosing the right language, and building practical projects that develop your skills and prepare you for the job market.',
    },
    6: {
        title: 'How to Get a Programming Job with No Experience',
        paragraph: 'Learn how to build a strong portfolio, complete real projects, write a professional CV, and prepare for interviews to improve your chances of landing your first programming job.',
    },
    7: {
        title: 'Does Programming Still Have a Future?',
        paragraph: 'As AI and code-generation tools evolve, is programming still worth learning? Explore the skills employers need, AI’s impact on the job market, and how to prepare for the future.',
    },
};

articles.forEach((article) => {
    const englishContent = englishArticleContent[article.id];
    if (englishContent) {
        article.titleEn = englishContent.title;
        article.descriptionEn = englishContent.description;
        article.paragraphEn = englishContent.paragraph;
    }
    article.meta.authorEn = 'Techsphere Team';
    article.meta.dateEn = 'June 18, 2026';
    article.meta.viewsEn = article.id === 7 ? '450 views' : '1,167 views';
});

export default articles;