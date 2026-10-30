import {

    KeyboardBackspaceOutlined,
    ImportContactsOutlined,
    CardMembershipOutlined,
    GroupOutlined,
    LocalFireDepartmentOutlined,
    WorkOutlineOutlined,
    FlightTakeoffOutlined,
    MilitaryTechOutlined,
    TipsAndUpdatesOutlined,
} from '@mui/icons-material';


const Education = [
    {
        id:0,
        icon: <ImportContactsOutlined className='Icon'  />,
        Title: "هيكل الدبلومة",
        TitleEn: "Diploma Structure",
        Head: "تنظيم المحتوى والربط بالتطبيق العملي",
        HeadEn: "Organizing the curriculum and connecting it to practical work",
        description1: "تقسيم المحتوى إلى وحدات تعليمية متسلسلة و مترابطة تضمن بناء المعرفة بشكل تدريجي.",
        description1En: "The curriculum is divided into connected, sequential learning units that build knowledge gradually.",
        description2: "ربط كل وحدة بتطبيقات عملية وورش عمل لترسيخ المفاهيم وتحويلها إلى مهارات قابلة للتنفيذ.",
        description2En: "Each unit includes practical applications and workshops that reinforce concepts and turn them into usable skills.",
        description3: "الانتقال من الأساسيات إلى المشاريع المتقدمة وفق خطة واضحة تحاكي احتياجات سوق العمل.",
        description3En: "Progress from the fundamentals to advanced projects through a clear plan aligned with job-market needs.",
        description4: "متابعة مستمرة لقياس التقدم وضمان الاستعداد للمراحل التالية من الرحلة التعليمية.",
        description4En: "Ongoing progress tracking ensures readiness for the next stages of the learning journey."
    },
    {
        id: 1,

        icon: <CardMembershipOutlined />,
        Title: "نظام التقييم الشامل ",
        TitleEn: "Comprehensive Assessment System",
        Head: "قياس الأداء ومعايير الانتقال والقبول",
        HeadEn: "Measuring performance and setting progression and admission criteria",
        description1: "تقييم مستمر يركز على الحضور، الالتزام، تسليم الـ Tasks، وجودة التطبيق العملي.",
        description1En: "Continuous assessment focuses on attendance, commitment, task completion, and the quality of practical work.",
        description2: "قياس مستوى الطالب بشكل دوري لتحديد مدى جاهزيته للانتقال إلى المراحل المتقدمة.",
        description2En: "Students are assessed regularly to determine their readiness to move on to advanced stages.",
        description3: " يشترط في بعض الأنشطة والبرامج العملية تحقيق نسبة تقييم لا تقل عن 90% لضمان الاستفادة الكاملة من التجربة.",
        description3En: "Some activities and practical programs require an assessment score of at least 90% to ensure participants get the full benefit.",
        description4: " تقديم Feedback مستمر يساعد الطالب على معرفة نقاط القوة وفرص التحسين خلال رحلته التعليمية.",
        description4En: "Ongoing feedback helps students identify their strengths and opportunities to improve throughout their learning journey."
    },
    {
        id: 2,

        icon: <GroupOutlined />,
        Title: " ورش العمل",
        TitleEn: "Workshops",
        Head: "بيئة تطبيقية تحاكي تحديات سوق العمل",
        HeadEn: "A practical environment that reflects real-world job challenges",
        description1: "تطبيق عملي على مشاريع وسيناريوهات تحاكي احتياجات الشركات وسوق العمل تحت إشراف مدربين خبراء في المجال.",
        description1En: "Work on projects and scenarios that reflect company and job-market needs, with guidance from experienced instructors.",
        description2: "تُنظم بشكل  دوري للطلاب المؤهلين و الحاصلين علي اكثر90% من التقييم، بهدف رفع مستوى التطبيق واكتساب خبرات عملية متقدمة.",
        description2En: "Held regularly for eligible students who score above 90%, these workshops strengthen practical skills and build advanced experience.",
        description3: "تنمية مهارات تحليل المشكلات، والعمل على حلول تقنية وفق أساليب احترافية.",
        description3En: "Develop problem-analysis skills and create technical solutions using professional practices.",
        description4: "تعزيز الثقة في تنفيذ المشاريع والاستعداد للتعامل مع التحديات التي يواجهها المطورون في بيئة العمل.",
        description4En: "Build confidence in delivering projects and prepare for the challenges developers face in the workplace."
    },
    {
        id: 3,

        icon: <LocalFireDepartmentOutlined />,
        Title: " معسكرات تك اسفير",
        TitleEn: "Techsphere Bootcamps",
        Head: "المشاريع المتكاملة وتطوير العمل الجماعي",
        HeadEn: "End-to-end projects and teamwork",
        description1: "تنفيذ مشروع متكامل من الفكرة وحتى المنتج النهائي من خلال تجربة تطبيقية مكثفة.",
        description1En: "Build a complete project from the initial idea to the final product through an intensive hands-on experience.",
        description2: "العمل ضمن فريق باستخدام أساليب وأدوات التعاون المتبعة في بيئات العمل التقنية داخل الشركات .",
        description2En: "Work in a team using the collaboration practices and tools common in technology companies.",
        description3: "مخصصة للطلاب المتميزين الذين أثبتوا جاهزيتهم للانتقال إلى مراحل تطبيقية أكثر تقدمًا.",
        description3En: "Designed for outstanding students who are ready to move on to more advanced practical stages.",
        description4: "تُنظم بشكل دوري للطلاب المؤهلين الذين أثبتوا جاهزيتهم للانتقال إلى مراحل تطبيقية أكثر تقدمًا.",
        description4En: "Held regularly for eligible students who have demonstrated readiness for more advanced practical stages."
    },
    {
        id: 4,

        icon: <WorkOutlineOutlined />,
        Title: " محاكاة يوم العمل (Job Day)",
        TitleEn: "Job Day Simulation",
        Head: "عِش تجربة يوم عمل حقيقي داخل شركة برمجيات",
        HeadEn: "Experience a real workday at a software company",
        description1: " محاكاة كاملة لدورة العمل باستخدام أدوات إدارة المشاريع والتعاون بين الفرق التقنية.",
        description1En: "Experience a complete work cycle using project-management tools and collaboration across technical teams.",
        description2: "تنفيذ المهام ضمن فريق عمل مع متابعة التقدم وعقد اجتماعات دورية وعرض نتائج للمشاريع في Demo Sessions.",
        description2En: "Complete team tasks, track progress, attend regular meetings, and present project results in demo sessions.",
        description3: " اكتساب خبرة عملية في إدارة الوقت، التواصل، والعمل وفق معايير بيئة الشركات.",
        description3En: "Gain practical experience in time management, communication, and working to company standards.",
        description4: "يكون متاحاًً للطلاب المؤهلين الذين استوفوا معايير الأداء والجاهزية للانتقال إلى هذه المرحلة.",
        description4En: "Available to eligible students who meet the performance and readiness criteria for this stage."
    },
    {
        id: 5,

        icon: <FlightTakeoffOutlined />,
        Title: " تاثيرات ",
        TitleEn: "Career Preparation",
        Head:"التأهيل المهني و المهارات الشخصية لسوق العمل",
        HeadEn: "Career preparation and soft skills for the job market",
        description1: " بناء CV  احترافي متوافق مع أنظمة الفرز الآلي(ATS) لزيادة فرص وصوله إلى مسؤولي التوظيف.",
        description1En: "Build a professional CV optimized for applicant tracking systems (ATS) to increase its visibility to recruiters.",
        description2: "تحسين حساب LinkedIn وبناء هوية مهنية تعكس مهاراتك ومشاريعك بشكل احترافي لجذب مسؤولي التوظيف.",
        description2En: "Improve your LinkedIn profile and build a professional identity that showcases your skills and projects to recruiters.",
        description3: "الاستعداد للمقابلات الشخصية من خلال التدريب على الأسئلة الفنية و الشخصيه وأساليب التواصل الاحترافي.",
        description3En: "Prepare for interviews by practicing technical and behavioral questions and professional communication.",
        description4: "تطوير مهارات التواصل داخل بيئة العمل، بما في ذلك أساسيات اللغة الإنجليزية المستخدمة في المجال التقني.",
        description4En: "Develop workplace communication skills, including the English basics used in technology.",
        description5: " حضور Freelancing Workshops للتعرف على كيفية التسعير، والتعامل مع العملاء، وكتابة العروض(Proposals)، وإدارة المشاريع على منصات العمل الحر.",
        description5En: "Attend freelancing workshops to learn pricing, client communication, proposal writing, and project management on freelance platforms."
    },
    {
        id:6,
        icon: <MilitaryTechOutlined />,
        Title: " مشروع التخرج",
        TitleEn: "Graduation Project",
    },
    {
        id: 7,

        icon: <TipsAndUpdatesOutlined />,
        Title: " Techsphere Community",
        TitleEn: "Techsphere Community",
    },
]





export default Education