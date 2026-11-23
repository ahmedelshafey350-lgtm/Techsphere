export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: الإلكترونيات والسلامة الكهربائية', en: 'Start Here: Electronics & Electrical Safety' },
            description: { ar: 'تعلم ما هي الإلكترونيات، الأساسيات الرياضية والفيزيائية المطلوبة، وقواعد السلامة الكهربائية قبل التعامل مع أي دائرة.', en: 'Learn what electronics is, the basic math and physics needed, and electrical safety rules before handling any circuit.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'ما هي الإلكترونيات', en: 'What is electronics' }, description: { ar: 'دراسة تدفق الإلكترونات في المواد والمكونات', en: 'Study of electron flow in materials and components' }, optional: false },
                { title: { ar: 'الأساسيات الرياضية والفيزيائية', en: 'Basic math & physics' }, description: { ar: 'الحسابات البسيطة المستخدمة في تصميم الدوائر', en: 'Simple calculations used in circuit design' }, optional: false },
                { title: { ar: 'السلامة الكهربائية', en: 'Electrical safety' }, description: { ar: 'كيفية تجنب الصدمة الكهربائية والتعامل الآمن مع الطاقة', en: 'How to avoid electric shock and handle power safely' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الإلكترونيات والسلامة', en: 'Understanding electronics & safety basics' }],
            project: { ar: 'تحديد مخاطر دائرة كهربائية بسيطة وتطبيق قواعد السلامة', en: 'Identify hazards in a simple electric circuit and apply safety rules' },
            courseId: null,
            next: ['electrical-fundamentals']
        },
        {
            id: 'electrical-fundamentals',
            title: { ar: 'أساسيات الكهرباء', en: 'Electrical Fundamentals' },
            description: { ar: 'تعلم الجهد والتيار والمقاومة والقوة، قانون أوم، وقوانين كيرشوف للجهد والتيار.', en: 'Learn voltage, current, resistance, and power, Ohm\'s law, and Kirchhoff\'s voltage and current laws.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الجهد والتيار والمقاومة', en: 'Voltage, current & resistance' }, description: { ar: 'الأساسيات التي تحكم تدفق الكهرباء في الدائرة', en: 'Fundamentals governing electricity flow in a circuit' }, optional: false },
                { title: { ar: 'قانون أوم', en: 'Ohm\'s law' }, description: { ar: 'العلاقة بين الجهد والتيار والمقاومة', en: 'Relationship between voltage, current, and resistance' }, optional: false },
                { title: { ar: 'القوة الكهربائية', en: 'Electrical power' }, description: { ar: 'حساب الطاقة المستهلكة من المكونات', en: 'Calculating power consumed by components' }, optional: false },
                { title: { ar: 'قوانين كيرشوف', en: 'Kirchhoff\'s laws' }, description: { ar: 'قوانين Conservation of energy and charge في الدوائر', en: 'Conservation of energy and charge laws in circuits' }, optional: false }
            ],
            skills: [{ ar: 'حساب القيم الكهربائية الأساسية', en: 'Calculating basic electrical values' }],
            project: { ar: 'حساب التيار والجهد في دائرة بسيطة باستخدام قانون أوم', en: 'Calculate current and voltage in a simple circuit using Ohm\'s law' },
            courseId: null,
            next: ['tools-schematics']
        },
        {
            id: 'tools-schematics',
            title: { ar: 'الأدوات وقراءة المخططات', en: 'Tools & Reading Schematics' },
            description: { ar: 'تعلم استخدام المقياس الفومي (Multimeter)، اللوحة التجريبية (Breadboard)، مصدر الطاقة، ومبادئ المجس الذبذب، وقراءة المخططات الكهربائية.', en: 'Learn to use the multimeter, breadboard, power supply, oscilloscope basics, and reading electrical schematics.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'المقياس الفومي (Multimeter)', en: 'Multimeter' }, description: { ar: 'قياس الجهد والتيار والمقاومة والدوائر المقطوعة', en: 'Measuring voltage, current, resistance, and open circuits' }, optional: false },
                { title: { ar: 'اللوحة التجريبية (Breadboard)', en: 'Breadboard' }, description: { ar: 'تركيب واختبار الدوائر بدون لحام', en: 'Building and testing circuits without soldering' }, optional: false },
                { title: { ar: 'مصدر الطاقة', en: 'Power supply' }, description: { ar: 'توفير الجهد والتيار المناسبين للدائرة', en: 'Providing appropriate voltage and current for the circuit' }, optional: false },
                { title: { ar: 'قراءة المخططات الكهربائية', en: 'Reading schematics' }, description: { ar: 'فهم الرموز والاتصالات في رسم الدوائر', en: 'Understanding symbols and connections in circuit drawings' }, optional: false },
                { title: { ar: 'مبادئ المجس الذبذب (Oscilloscope)', en: 'Oscilloscope basics' }, description: { ar: 'مقدمة لعرض الإشارات الكهربائية على الشاشة', en: 'Introduction to viewing electrical signals on screen' }, optional: true }
            ],
            skills: [{ ar: 'استخدام أدوات القياس والتركيب', en: 'Using measurement & assembly tools' }],
            project: { ar: 'قياس جهد بطارية ومقاومة باستخدام المقياس الفومي، وتركيب دائرة على اللوحة التجريبية', en: 'Measure battery voltage and resistance with multimeter, and assemble a circuit on breadboard' },
            courseId: null,
            next: ['passive-components']
        },
        {
            id: 'passive-components',
            title: { ar: 'المكونات السلبية والدوائر RC و RL', en: 'Passive Components & RC/RL Circuits' },
            description: { ar: 'تعلم المقاومات والمكثفات والملفات، وكيفية عملها في الدوائر المتجهة والمستقيمة.', en: 'Learn resistors, capacitors, and inductors, and how they work in AC and DC circuits.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المقاومات', en: 'Resistors' }, description: { ar: 'مقاومة مرور التيار وتقسيم الجهد', en: 'Opposing current flow and dividing voltage' }, optional: false },
                { title: { ar: 'المكثفات', en: 'Capacitors' }, description: { ar: 'تخزين الشحنة الكهربائية وتحريرها', en: 'Storing and releasing electrical charge' }, optional: false },
                { title: { ar: 'الملفات', en: 'Inductors' }, description: { ar: 'تخزين الطاقة في المجال المغناطيسي', en: 'Storing energy in magnetic field' }, optional: false },
                { title: { ar: 'الدوائر RC و RL', en: 'RC & RL circuits' }, description: { ar: 'دوائر تحتوي على مكثفات وملفات ومقاومات', en: 'Circuits containing capacitors, inductors, and resistors' }, optional: false }
            ],
            skills: [{ ar: 'العمل مع المكونات السلبية', en: 'Working with passive components' }],
            project: { ar: 'تركيب دائرة RC لتأخير تشغيل مصباح LED', en: 'Build an RC circuit to delay turning on an LED' },
            courseId: null,
            next: ['ac-basics']
        },
        {
            id: 'ac-basics',
            title: { ar: 'أساس والتيار المتردد', en: 'AC Basics' },
            description: { ar: 'تعلم الموجات الجيبية، التردد، والمانعة (Impedance) في الدوائر التيار المتردد.', en: 'Learn sine waves, frequency, and impedance in AC circuits.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'الموجة الجيبية', en: 'Sine wave' }, description: { ar: 'شكل التيار المتردد الذي يتغير مع الوقت', en: 'Shape of AC current that changes over time' }, optional: false },
                { title: { ar: 'التردد والفترة', en: 'Frequency & period' }, description: { ar: 'عدد الدورات في الثانية ووقت الدورة الواحدة', en: 'Number of cycles per second and time of one cycle' }, optional: false },
                { title: { ar: 'المانعة (Impedance)', en: 'Impedance' }, description: { ar: 'مقاومة totale للتيار في دوائر التيار المتردد', en: 'Total opposition to current in AC circuits' }, optional: false }
            ],
            skills: [{ ar: 'فهم 기초ات التيار المتردد', en: 'Understanding AC basics' }],
            project: { ar: 'قياس تيار متردد باستخدام المultimeter ومعرفة تردد الإشارة', en: 'Measure AC current with multimeter and determine signal frequency' },
            courseId: null,
            next: ['diodes-rectifiers']
        },
        {
            id: 'diodes-rectifiers',
            title: { ar: 'الثنائيات (Diodes) والمستقمات', en: 'Diodes & Rectifiers' },
            description: { ar: 'تعلم الثنائيات العادية، وزينر، والثنائيات الضوئية (LED)، وكيفية استخدام المستقمات لتحويل التيار المتردد إلى مستمر.', en: 'Learn regular diodes, Zener diodes, LEDs, and how rectifiers convert AC to DC.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'الثنائي العادي', en: 'Regular diode' }, description: { ar: 'السماح بمرور التيار في اتجاه واحد فقط', en: 'Allowing current flow in one direction only' }, optional: false },
                { title: { ar: 'الثنائي زينر', en: 'Zener diode' }, description: { ar: 'تنظيم الجهد عند قيمة محددة', en: 'Regulating voltage at a specific value' }, optional: false },
                { title: { ar: 'الثنائي الضوئي (LED)', en: 'LED' }, description: { ar: 'إصدار الضوء عند مرور التيار', en: 'Emitting light when current passes' }, optional: false },
                { title: { ar: 'المستقيمات', en: 'Rectifiers' }, description: { ar: 'تحويل التيار المتردد إلى مستمر باستخدام الثنائيات', en: 'Converting AC to DC using diodes' }, optional: false }
            ],
            skills: [{ ar: 'العمل مع الثنائيات والمستقمات', en: 'Working with diodes & rectifiers' }],
            project: { ar: 'بناء مستقيم بسيط لتحويل التيار المتردد إلى مستمر وتشغيل LED', en: 'Build a simple rectifier to convert AC to DC and light an LED' },
            courseId: null,
            next: ['bjt-transistors']
        },
        {
            id: 'bjt-transistors',
            title: { ar: 'ترانزستورات BJT', en: 'BJT Transistors' },
            description: { ar: 'تعلم ترانزستورات unión bipolar (BJT)، وكيفية استخدامها كمفاتيح ومضخمات، وأساسيات التحيز (Biasing).', en: 'Learn BJT transistors, how to use them as switches and amplifiers, and biasing basics.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'أنواع BJT', en: 'BJT types' }, description: { ar: 'NPN و PNP وكيفية عمل كل منها', en: 'NPN and PNP and how each works' }, optional: false },
                { title: { ar: 'التحيز (Biasing)', en: 'Biasing' }, description: { ar: 'إعداد نقطة العمل للترانزستور', en: 'Setting transistor operating point' }, optional: false },
                { title: { ar: 'الترانزستور كمفتاح', en: 'Transistor as switch' }, description: { ar: 'تشغيل وإيقاف الأحمال باستخدام الترانزستور', en: 'Turning loads on/off using transistor' }, optional: false },
                { title: { ar: 'الترانزستور كمضخم', en: 'Transistor as amplifier' }, description: { ar: 'تقوية الإشارات الضعيفة باستخدام الترانزستور', en: 'Amplifying weak signals using transistor' }, optional: false }
            ],
            skills: [{ ar: 'استخدام ترانزستورات BJT', en: 'Using BJT transistors' }],
            project: { ar: 'بناء دائرة تشغيل مفتاح باستخدام ترانزستور BJT', en: 'Build a switch circuit using BJT transistor' },
            courseId: null,
            next: ['fet-mosfet']
        },
        {
            id: 'fet-mosfet',
            title: { ar: 'ترانزستورات FET و MOSFET', en: 'FET & MOSFET Transistors' },
            description: { ar: 'تعلم ترانزستورات التأثير الميداني (FET) وموسفيت (MOSFET)، واستخدامها في key switching والمضخمات.', en: 'Learn field-effect transistors (FET) and MOSFET, and their use in switching and amplification.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'أنواع FET', en: 'FET types' }, description: { ar: 'JFET و MOSFET وكيفية التحكم فيها', en: 'JFET and MOSFET and how to control them' }, optional: false },
                { title: { ar: 'MOSFET كキー', en: 'MOSFET as switch' }, description: { ar: 'استخدام MOSFET لتشغيل الأحمال الكبيرة', en: 'Using MOSFET to control large loads' }, optional: false },
                { title: { ar: 'الاختلاف بين BJT و MOSFET', en: 'BJT vs MOSFET' }, description: { ar: 'مقارنة بين النوعين ومتى يستخدم كل منهما', en: 'Comparison between types and when to use each' }, optional: false }
            ],
            skills: [{ ar: 'استخدام ترانزستورات MOSFET', en: 'Using MOSFET transistors' }],
            project: { ar: 'بناء دائرة تشغيل محرك صغير باستخدام MOSFET', en: 'Build a circuit to run a small motor using MOSFET' },
            courseId: null,
            next: ['amplifiers']
        },
        {
            id: 'amplifiers',
            title: { ar: 'المضخمات (Amplifiers)', en: 'Amplifiers' },
            description: { ar: 'تعلم المضخمات المشتركة للم coletor (Common Emitter)، معامل التكبير (Gain)، واستجابة التردد.', en: 'Learn common-emitter amplifiers, gain, and frequency response.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المضخم المشترك للم coletor', en: 'Common emitter amplifier' }, description: { ar: 'مضخم أساسي يستخدم في تقوية الإشارات', en: 'Basic amplifier used to strengthen signals' }, optional: false },
                { title: { ar: 'معامل التكبير (Gain)', en: 'Gain' }, description: { ar: 'نسبة الإخراج إلى الإدخال في المضخم', en: 'Ratio of output to input in amplifier' }, optional: false },
                { title: { ar: 'استجابة التردد', en: 'Frequency response' }, description: { ar: 'كيف يستجيب المضخم للت مختلف الترددات', en: 'How amplifier responds to different frequencies' }, optional: false }
            ],
            skills: [{ ar: 'تصميم مضخمات بسيطة', en: 'Designing simple amplifiers' }],
            project: { ar: 'بناء مضخم صوتي بسيط لتشغيل مكبر صوت', en: 'Build a simple audio amplifier to drive a speaker' },
            courseId: null,
            next: ['op-amps']
        },
        {
            id: 'op-amps',
            title: { ar: 'المضخمات التشغيلية (Op-Amps)', en: 'Op-Amps' },
            description: { ar: 'تعلم المضخم التشغيلي (Op-Amp)، ومضخم العاكس (Inverting)، ومضخم غير العاكس (Non-inverting)، والمقارنات، والمرشحات النشطة.', en: 'Learn op-amp, inverting amplifier, non-inverting amplifier, comparators, and active filters.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المضخم التشغيلي', en: 'Op-amp basics' }, description: { ar: 'مكون إلكتروني يستخدم لتكبير الفروق في الجهد', en: 'Component used to amplify voltage differences' }, optional: false },
                { title: { ar: 'مضخم العاكس', en: 'Inverting amplifier' }, description: { ar: 'مضخم يقلب طور الإشارة ويضخمها', en: 'Amplifier that inverts signal phase and amplifies' }, optional: false },
                { title: { ar: 'مضخم غير العاكس', en: 'Non-inverting amplifier' }, description: { ar: 'مضخم يحافظ على طور الإشارة ويضخمها', en: 'Amplifier that preserves signal phase and amplifies' }, optional: false },
                { title: { ar: 'المقارن (Comparator)', en: 'Comparator' }, description: { ar: 'مقارنة جهدين وإخراج إشارة según النتيجة', en: 'Comparing two voltages and outputting signal based on result' }, optional: false },
                { title: { ar: 'المرشحات النشطة', en: 'Active filters' }, description: { ar: 'تصفية الترددات غير المرغوب فيها باستخدام مضخمات تشغيلية', en: 'Filtering unwanted frequencies using op-amps' }, optional: true }
            ],
            skills: [{ ar: 'العمل مع المضخمات التشغيلية', en: 'Working with op-amps' }],
            project: { ar: 'بناء دائرة مضخم غير عاكس لتكبير إشارة صوتية', en: 'Build non-inverting amplifier circuit to amplify audio signal' },
            courseId: null,
            next: ['oscillators-timers']
        },
        {
            id: 'oscillators-timers',
            title: { ar: 'المولدات ومؤقتات (555)', en: 'Oscillators & Timers (555)' },
            description: { ar: 'تعلم المولدات الحرانية، ومؤقت 555 الشهير، واستخدامها في توليد الإشارات والتوقيت.', en: 'Learn oscillator circuits and the famous 555 timer, and their use in signal generation and timing.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'المولدات الحرانية', en: 'Oscillator circuits' }, description: { ar: 'دوائر تولد إشارات دورية بشكل تلقائي', en: 'Circuits that generate periodic signals automatically' }, optional: false },
                { title: { ar: 'مؤقت 555', en: '555 timer' }, description: { ar: 'دائرة متكاملة مشهورة للتوقيت والتوليد', en: 'Popular IC for timing and generation' }, optional: false },
                { title: { ar: 'تطبيقات مؤقت 555', en: '555 timer applications' }, description: { ar: 'استخدام 555 في التأخير والوميض والتوليد', en: 'Using 555 in delay, blinking, and generation' }, optional: false }
            ],
            skills: [{ ar: 'استخدام مؤقت 555 والمولدات', en: 'Using 555 timer & oscillators' }],
            project: { ar: 'بناء دائرة وميض LED باستخدام مؤقت 555', en: 'Build LED blinking circuit using 555 timer' },
            courseId: null,
            next: ['power-supplies']
        },
        {
            id: 'power-supplies',
            title: { ar: 'مصادر الطاقة والمنظمات الجهد', en: 'Power Supplies & Voltage Regulators' },
            description: { ar: 'تعلم تصميم مصادر الطاقة، والمنظمات الجهد (Voltage Regulators)، وكيفية توفير جهد مستقر للدوائر.', en: 'Learn power supply design, voltage regulators, and how to provide stable voltage for circuits.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'مصدر الطاقة linear', en: 'Linear power supply' }, description: { ar: 'تحويل التيار المتردد إلى مستمر باستخدام محول ومستقيم ومنظم', en: 'Converting AC to DC using transformer, rectifier, and regulator' }, optional: false },
                { title: { ar: 'منظم الجهد', en: 'Voltage regulator' }, description: { ar: 'الحفاظ على جهد الإخراج ثابتًا despite التغيرات', en: 'Maintaining constant output voltage despite changes' }, optional: false },
                { title: { ar: 'التصفية (Filtering)', en: 'Filtering' }, description: { ar: 'إزالة التقلبات من التيار المستمر', en: 'Removing fluctuations from DC current' }, optional: false }
            ],
            skills: [{ ar: 'تصميم مصادر طاقة بسيطة', en: 'Designing simple power supplies' }],
            project: { ar: 'بناء مصدر طاقة منظم بجهد 5 فولت للدوائر الرقمية', en: 'Build a regulated 5V power supply for digital circuits' },
            courseId: null,
            next: ['simulation-tools']
        },
        {
            id: 'simulation-tools',
            title: { ar: 'أدوات المحاكاة', en: 'Simulation Tools' },
            description: { ar: 'تعلم استخدام برامج المحاكاة مثل Proteus و LTspice و Multisim لتصميم واختبار الدوائر التناظرية قبل بنائها فعليًا.', en: 'Learn to use simulation programs like Proteus, LTspice, and Multisim to design and test analog circuits before building them physically.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'البرامج الشائعة', en: 'Common programs' }, description: { ar: 'Proteus، LTspice، و Multisim', en: 'Proteus, LTspice, and Multisim' }, optional: false },
                { title: { ar: 'تصميم الدائرة افتراضيًا', en: 'Virtual circuit design' }, description: { ar: 'رسم الدائرة واختبارها على الكمبيوتر', en: 'Drawing and testing the circuit on computer' }, optional: false },
                { title: { ar: 'تصحيح الأخطاء', en: 'Debugging' }, description: { ar: 'اكتشاف وإصلاح الأخطاء في التصميم قبل التنفيذ', en: 'Discovering and fixing errors before implementation' }, optional: false }
            ],
            skills: [{ ar: 'محاكاة الدوائر التناظرية', en: 'Simulating analog circuits' }],
            project: { ar: 'تصميم واختبار دائرة تناظرية باستخدام برنامج محاكاة', en: 'Design and test an analog circuit using simulation software' },
            courseId: null,
            next: ['troubleshooting']
        },
        {
            id: 'troubleshooting',
            title: { ar: 'استكشاف الأخطاء والاختبار', en: 'Troubleshooting & Testing' },
            description: { ar: 'تعلم كيفية العثور على الأعطال في الدوائر الإلكترونية، واختبار المكونات، وإصلاح الدوائر المعطلة.', en: 'Learn how to find faults in electronic circuits, test components, and repair broken circuits.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'الأعطال الشائعة', en: 'Common faults' }, description: { ar: 'المقاومات المحروقة، والمكثفات المتسربة، والموصلات المقطوعة', en: 'Burnt resistors, leaking capacitors, broken connections' }, optional: false },
                { title: { ar: 'اختبار المكونات', en: 'Component testing' }, description: { ar: 'فحص صلاحية المكونات باستخدام المultimeter', en: 'Checking component health using multimeter' }, optional: false },
                { title: { ar: 'إصلاح الدوائر', en: 'Circuit repair' }, description: { ar: 'استبدال المكونات التالفة وإعادة اختبار الدائرة', en: 'Replacing damaged components and retesting circuit' }, optional: false }
            ],
            skills: [{ ar: 'استكشاف أخطاء الدوائر الإلكترونية', en: 'Troubleshooting electronic circuits' }],
            project: { ar: 'إصلاح دائرة إلكترونية معطلة باستخدام المultimeter', en: 'Repair a broken electronic circuit using multimeter' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء مشاريع نهائية شاملة في الإلكترونيات التناظرية، والتحضير لوظائف مهندس الإلكترونيات.', en: 'Build comprehensive final projects in analog electronics, and prepare for electronics engineer roles.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته في الإلكترونيات التناظرية', en: 'Comprehensive projects reflecting everything learned in analog electronics' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك في الدوائر التناظرية', en: 'Website showcasing your analog circuit projects' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك في التصميم التناظري', en: 'Writing a resume that highlights your analog design skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية في الإلكترونيات التناظرية', en: 'Training on technical interview questions in analog electronics' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف الإلكترونيات التناظرية', en: 'Presenting projects and applying for analog electronics roles' }],
            project: { ar: 'مشروع نهائي في الإلكترونيات التناظرية', en: 'Final project in analog electronics' },
            courseId: null,
            next: []
        }
    ]
};
