export default {
    nodes: [
        {
            id: 'start-here',
            title: { ar: 'البداية: الرقميّ مقابل التناظري', en: 'Start Here: Digital vs Analog' },
            description: { ar: 'تعلم الفرق بين الدوائر الرقمية والتناظرية، الأساسيات الكهربائية للمبتدئين، وقواعد السلامة الأساسية قبل التعامل مع المكونات الإلكترونية.', en: 'Learn the difference between digital and analog circuits, basic electricity for beginners, and essential safety rules before handling electronic components.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'start',
            topics: [
                { title: { ar: 'الرقمي مقابل التناظري', en: 'Digital vs analog' }, description: { ar: 'الفرق بين الإشارات المستمرة والإشارات المنفصلة', en: 'Difference between continuous and discrete signals' }, optional: false },
                { title: { ar: 'أساسيات الكهرباء', en: 'Basic electricity' }, description: { ar: 'الجهد والتيار والمقاومة وم법 أوم', en: 'Voltage, current, resistance, and Ohm\'s law' }, optional: false },
                { title: { ar: 'السلامة الإلكترونية', en: 'Electronics safety' }, description: { ar: 'كيفية التعامل الآمن مع المكونات والدوائر', en: 'How to safely handle components and circuits' }, optional: false }
            ],
            skills: [{ ar: 'فهم أساسيات الإلكترونيات الرقمية', en: 'Understanding digital electronics basics' }],
            project: { ar: 'تحديد مكونات دائرة رقمية بسيطة وتطبيق قواعد السلامة', en: 'Identify components of a simple digital circuit and apply safety rules' },
            courseId: null,
            next: ['number-systems']
        },
        {
            id: 'number-systems',
            title: { ar: 'أنظمة الأرقام والتحويل بينها', en: 'Number Systems & Conversions' },
            description: { ar: 'تعلم الأنظمة الثنائية والثمانية والسداسية عشرية، وكيفية التحويل بينها وبين النظام العشري.', en: 'Learn binary, octal, and hexadecimal systems, and how to convert between them and decimal.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'النظام الثنائي', en: 'Binary system' }, description: { ar: 'الأرقام المكونة من 0 و 1 فقط', en: 'Numbers made of only 0 and 1' }, optional: false },
                { title: { ar: 'النظام السداسي عشري', en: 'Hexadecimal system' }, description: { ar: 'نظام مكون من 16 رمزًا Used في تمثيل عناوين الذاكرة', en: '16-symbol system used for memory addresses' }, optional: false },
                { title: { ar: 'التحويل بين الأنظمة', en: 'Converting between systems' }, description: { ar: 'تحويل الأرقام من نظام إلى آخر', en: 'Converting numbers from one system to another' }, optional: false }
            ],
            skills: [{ ar: 'التحويل بين أنظمة الأرقام', en: 'Converting between number systems' }],
            project: { ar: 'تحويل أرقام عشارية إلى ثنائية وسداسية عشرية يدويًا', en: 'Manually convert decimal numbers to binary and hexadecimal' },
            courseId: null,
            next: ['binary-arithmetic-codes']
        },
        {
            id: 'binary-arithmetic-codes',
            title: { ar: 'الحسابات الثنائية والأكواد', en: 'Binary Arithmetic & Codes' },
            description: { ar: 'تعلم الجمع والطرح في النظام الثنائي، وأكواد BCD و Gray و ASCII المستخدمة لتمثيل البيانات.', en: 'Learn binary addition and subtraction, and BCD, Gray, and ASCII codes used for data representation.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'الجمع والطرح الثنائي', en: 'Binary addition & subtraction' }, description: { ar: 'عمليات الحساب الأساسية في النظام الثنائي', en: 'Basic arithmetic operations in binary' }, optional: false },
                { title: { ar: 'كود BCD', en: 'BCD code' }, description: { ar: 'تمثيل الأعداد العشرية باستخدام四 بتات', en: 'Representing decimal digits using 4 bits' }, optional: false },
                { title: { ar: 'كود Gray', en: 'Gray code' }, description: { ar: 'كود حيث يتغير بت واحد فقط بين كل رقمين متتاليين', en: 'Code where only one bit changes between consecutive numbers' }, optional: false },
                { title: { ar: 'كود ASCII', en: 'ASCII code' }, description: { ar: 'تمثيل الأحرف والرموز باستخدام الأرقام الثنائية', en: 'Representing letters and symbols using binary numbers' }, optional: false }
            ],
            skills: [{ ar: 'العمليات الحسابية الثنائية والأكواد', en: 'Binary arithmetic & codes' }],
            project: { ar: 'إجراء عمليات حسابية ثنائية وتحويلها إلى أكواد BCD و ASCII', en: 'Perform binary arithmetic and convert to BCD and ASCII codes' },
            courseId: null,
            next: ['boolean-algebra']
        },
        {
            id: 'boolean-algebra',
            title: { ar: 'الجبر المنطقي وقوانينه', en: 'Boolean Algebra & Laws' },
            description: { ar: 'تعلم أساسيات الجبر المنطقي، العمليات المنطقية، والقوانين المستخدمة لتبسيط التعبيرات المنطقية.', en: 'Learn Boolean algebra basics, logical operations, and laws used to simplify logical expressions.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'العمليات المنطقية', en: 'Logical operations' }, description: { ar: 'عمليات AND، OR، NOT الأساسية', en: 'Basic AND, OR, NOT operations' }, optional: false },
                { title: { ar: 'قوانين ديمورغان', en: "De Morgan's laws" }, description: { ar: 'قوانين لتحويل التعبيرات المنطقية المعقدة', en: 'Laws for transforming complex logical expressions' }, optional: false },
                { title: { ar: 'التبسيط المنطقي', en: 'Logical simplification' }, description: { ar: 'تقليل عدد البوابات المنطقية في الدائرة', en: 'Reducing the number of logic gates in a circuit' }, optional: false }
            ],
            skills: [{ ar: 'تطبيق الجبر المنطقي على الدوائر', en: 'Applying Boolean algebra to circuits' }],
            project: { ar: 'تبسيط تعبير منطقي باستخدام قوانين الجبر المنطقي', en: 'Simplify a logical expression using Boolean algebra laws' },
            courseId: null,
            next: ['logic-gates']
        },
        {
            id: 'logic-gates',
            title: { ar: 'البوابات المنطقية', en: 'Logic Gates' },
            description: { ar: 'تعلم البوابات الأساسية AND و OR و NOT، والبوابات المركبة NAND و NOR و XOR، وكيفية عملها.', en: 'Learn basic gates AND, OR, NOT, and composite gates NAND, NOR, XOR, and how they work.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'البوابات الأساسية', en: 'Basic gates' }, description: { ar: 'بوابات AND، OR، NOT', en: 'AND, OR, NOT gates' }, optional: false },
                { title: { ar: 'البوابات المركبة', en: 'Composite gates' }, description: { ar: 'بوابات NAND، NOR، XOR، XNOR', en: 'NAND, NOR, XOR, XNOR gates' }, optional: false },
                { title: { ar: 'البوابة العالمية', en: 'Universal gates' }, description: { ar: 'كيفية بناء أي دائرة باستخدام بوابات NAND أو NOR فقط', en: 'How to build any circuit using only NAND or NOR gates' }, optional: false }
            ],
            skills: [{ ar: 'تصميم دوائر باستخدام البوابات المنطقية', en: 'Designing circuits with logic gates' }],
            project: { ar: 'بناء دائرة تضيء مصباح عند توفر شرطان باستخدام البوابات المنطقية', en: 'Build a circuit that lights a bulb when two conditions are met using logic gates' },
            courseId: null,
            next: ['truth-tables-kmaps']
        },
        {
            id: 'truth-tables-kmaps',
            title: { ar: 'جداول الحقيقة وخرائط كارنوف', en: 'Truth Tables & K-maps' },
            description: { ar: 'تعلم كتابة جداول الحقيقة للدوائر المنطقية، الت reprezentacion في صورة SOP و POS، وتبسيط الدوائر باستخدام خرائط كارنوف.', en: 'Learn to write truth tables for logic circuits, SOP and POS representations, and simplify circuits using Karnaugh maps.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'جدول الحقيقة', en: 'Truth table' }, description: { ar: 'جدول يوضح مخرجات الدائرة لكل مجموعة مدخلات', en: 'Table showing circuit outputs for every input combination' }, optional: false },
                { title: { ar: 'الصيغة الموجبة للمنتج (SOP)', en: 'SOP form' }, description: { ar: 'تمثيل الدالة المنطقية كمجموع لمجموعات الضرب', en: 'Representing logical function as sum of product terms' }, optional: false },
                { title: { ar: 'الصيغة المنطقية للمجموع (POS)', en: 'POS form' }, description: { ar: 'تمثيل الدالة المنطقية كناتج لمجاميع الجمع', en: 'Representing logical function as product of sum terms' }, optional: false },
                { title: { ar: 'خريطة كارنوف (K-map)', en: 'Karnaugh map' }, description: { ar: 'طريقة بيانية لتبسيط التعبيرات المنطقية', en: 'Graphical method for simplifying logical expressions' }, optional: false }
            ],
            skills: [{ ar: 'استخدام جداول الحقيقة وخرائط كارنوف', en: 'Using truth tables & K-maps' }],
            project: { ar: 'تبسيط دالة منطقية باستخدام خريطة كارنوف', en: 'Simplify a logical function using a Karnaugh map' },
            courseId: null,
            next: ['combinational-circuits']
        },
        {
            id: 'combinational-circuits',
            title: { ar: 'الدوائر التبادلية', en: 'Combinational Circuits' },
            description: { ar: 'تعلم الدوائر التي يعتمد مخرجها على المدخلات فقط: المضافات، المقارنات، المتعددة الطرق، المفسرات، والمشفرات.', en: 'Learn circuits whose output depends only on inputs: adders, comparators, multiplexers, decoders, and encoders.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المضخمة النصفية والكاملة', en: 'Half & full adders' }, description: { ar: 'دوائر لجمع الأرقام الثنائية', en: 'Circuits for adding binary numbers' }, optional: false },
                { title: { ar: 'المقارن الرقمي', en: 'Digital comparator' }, description: { ar: 'مقارنة عددين ثنائيين وتحديد الأكبر', en: 'Comparing two binary numbers and determining the larger' }, optional: false },
                { title: { ar: 'المتعددة الطرق (Multiplexer)', en: 'Multiplexer' }, description: { ar: 'اختيار إشارة واحدة من بين 여러 إشارات', en: 'Selecting one signal from multiple signals' }, optional: false },
                { title: { ar: 'المفسر والمشفر', en: 'Decoder & encoder' }, description: { ar: 'تحويل الرموز بين الصور المختلفة', en: 'Converting codes between different forms' }, optional: false }
            ],
            skills: [{ ar: 'تصميم الدوائر التبادلية', en: 'Designing combinational circuits' }],
            project: { ar: 'بناء دائرة مقارن رقمي لمقارنة عددين ثنائيين', en: 'Build a digital comparator circuit comparing two binary numbers' },
            courseId: null,
            next: ['latches-flipflops']
        },
        {
            id: 'latches-flipflops',
            title: { ar: 'المشابك والمزامنات (Flip-Flops)', en: 'Latches & Flip-Flops' },
            description: { ar: 'تعلم عناصر تخزين البت الواحد: المشابك SR، والمزامنات D و JK و T، وكيفية استخدامها لتخزين الحالة.', en: 'Learn single-bit storage elements: SR latches, and D, JK, T flip-flops, and how to use them to store state.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'المشابك (Latches)', en: 'Latches' }, description: { ar: 'عناصر تخزين بسيطة تستجيب فورًا للمدخلات', en: 'Simple storage elements that respond immediately to inputs' }, optional: false },
                { title: { ar: 'المزامن D', en: 'D flip-flop' }, description: { ar: 'مزامن يخزن قيمة المدخل عند إشارة الساعة', en: 'Flip-flop that stores input value on clock edge' }, optional: false },
                { title: { ar: 'المزامن JK', en: 'JK flip-flop' }, description: { ar: 'مزامن متعدد الاستخدامات للعد والتخزين', en: 'Versatile flip-flop for counting and storage' }, optional: false },
                { title: { ar: 'المزامن T', en: 'T flip-flop' }, description: { ar: 'مزامن يقلب حالته عند كل نبضة ساعة', en: 'Flip-flop that toggles state on each clock pulse' }, optional: false }
            ],
            skills: [{ ar: 'استخدام المزامنات لتخزين البتات', en: 'Using flip-flops to store bits' }],
            project: { ar: 'بناء دائرة تخزين بت واحد باستخدام المزامن D', en: 'Build a one-bit storage circuit using D flip-flop' },
            courseId: null,
            next: ['sequential-circuits']
        },
        {
            id: 'sequential-circuits',
            title: { ar: 'الدوائر التسلسلية', en: 'Sequential Circuits' },
            description: { ar: 'تعلم الدوائر التي يعتمد مخرجها على المدخلات والحالة السابقة: السجلات، سجلات التحويل، والعدادات.', en: 'Learn circuits whose output depends on inputs and previous state: registers, shift registers, and counters.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'السجلات', en: 'Registers' }, description: { ar: 'مجموعات من المزامنات لتخزين عدة بتات', en: 'Groups of flip-flops storing multiple bits' }, optional: false },
                { title: { ar: 'سجلات التحويل', en: 'Shift registers' }, description: { ar: 'نقل البيانات بتًا بتًا عبر السير', en: 'Moving data bit by bit through the circuit' }, optional: false },
                { title: { ar: 'العدادات', en: 'Counters' }, description: { ar: 'دوائر تعد عدد نبضات الساعة', en: 'Circuits that count clock pulses' }, optional: false },
                { title: { ar: 'العدادات المتزامنة وغير المتزامنة', en: 'Synchronous & asynchronous counters' }, description: { ar: 'أنواع العدادات بناءً على توقيت النبضات', en: 'Counter types based on pulse timing' }, optional: false }
            ],
            skills: [{ ar: 'تصميم الدوائر التسلسلية', en: 'Designing sequential circuits' }],
            project: { ar: 'بناء عداد من 0 إلى 9 باستخدام المزامنات', en: 'Build a 0-to-9 counter using flip-flops' },
            courseId: null,
            next: ['fsm']
        },
        {
            id: 'fsm',
            title: { ar: 'آلات الحالات المنتهية', en: 'Finite State Machines' },
            description: { ar: 'تعلم نماذج العمليات التي تمر بحالات محدودة ومحددة: آلات ميلي ومور، وكيفية تصميمها.', en: 'Learn operational models that pass through limited, defined states: Mealy and Moore machines, and how to design them.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'آلة ميلي', en: 'Mealy machine' }, description: { ar: 'آلة يعتمد مخرجها على الحالة والمدخلات معًا', en: 'Machine whose output depends on both state and inputs' }, optional: false },
                { title: { ar: 'آلة مور', en: 'Moore machine' }, description: { ar: 'آلة يعتمد مخرجها على الحالة فقط', en: 'Machine whose output depends on state only' }, optional: false },
                { title: { ar: 'رسم مخطط الحالة', en: 'State diagram' }, description: { ar: 'تمثيل المرور بين الحالات باستخدام المخططات', en: 'Representing state transitions using diagrams' }, optional: false }
            ],
            skills: [{ ar: 'تصميم آلات الحالات المنتهية', en: 'Designing finite state machines' }],
            project: { ar: 'تصميم آلة حالة لآلة بيع آلية بسيطة', en: 'Design a state machine for a simple vending machine' },
            courseId: null,
            next: ['memory-storage']
        },
        {
            id: 'memory-storage',
            title: { ar: 'الذاكرة والتخزين', en: 'Memory & Storage' },
            description: { ar: 'تعلم أنواع الذاكرة الرقمية: ROM و RAM، وكيفية تخزين البيانات في الدوائر الرقمية.', en: 'Learn digital memory types: ROM and RAM, and how data is stored in digital circuits.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'الذاكرة للقراءة فقط (ROM)', en: 'ROM' }, description: { ar: 'ذاكرة تحتفظ ببياناتها حتى عند انقطاع التيار', en: 'Memory that retains data when power is off' }, optional: false },
                { title: { ar: 'الذاكرة العشوائية (RAM)', en: 'RAM' }, description: { ar: 'ذاكرة يمكن القراءة منها والكتابة إليها', en: 'Memory that can be read from and written to' }, optional: false },
                { title: { ar: 'تنظيم الذاكرة', en: 'Memory organization' }, description: { ar: 'كيف يتم عنونة ووصول البيانات في الذاكرة', en: 'How memory addresses and accesses data' }, optional: false }
            ],
            skills: [{ ar: 'فهم أنواع الذاكرة الرقمية', en: 'Understanding digital memory types' }],
            project: { ar: 'تصميم دائرة ذاكرة بسيطة تخزن وتسترجع بيانات', en: 'Design a simple memory circuit that stores and retrieves data' },
            courseId: null,
            next: ['adc-dac']
        },
        {
            id: 'adc-dac',
            title: { ar: "المحولات التناظرية-الرقمية والرقمية-التناظرية", en: 'ADC & DAC Converters' },
            description: { ar: 'تعلم كيفية تحويل الإشارات التناظرية إلى رقمية والعكس، وجسر الفجوة بين العالم الرقمي والتناظري.', en: 'Learn how to convert analog signals to digital and vice versa, bridging the gap between digital and analog worlds.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'المحول التناظري-الرقمي (ADC)', en: 'ADC' }, description: { ar: 'تحويل الإشارة التناظرية إلى قيم رقمية', en: 'Converting analog signals to digital values' }, optional: false },
                { title: { ar: 'المحول الرقمي-التناظري (DAC)', en: 'DAC' }, description: { ar: 'تحويل القيم الرقمية إلى إشارات تناظرية', en: 'Converting digital values to analog signals' }, optional: false },
                { title: { ar: 'الدقة ومعدل العينة', en: 'Resolution & sampling rate' }, description: { ar: 'عوامل تحديد جودة التحويل', en: 'Factors determining conversion quality' }, optional: false }
            ],
            skills: [{ ar: 'فهم المحولات التناظرية والرقمية', en: 'Understanding analog-digital converters' }],
            project: { ar: 'قراءة إشارة تناظرية وتحويلها إلى رقم باستخدام محول ADC', en: 'Read an analog signal and convert it to a number using an ADC converter' },
            courseId: null,
            next: ['simulation-tools']
        },
        {
            id: 'simulation-tools',
            title: { ar: 'أدوات المحاكاة', en: 'Simulation Tools' },
            description: { ar: 'تعلم استخدام برامج المحاكاة مثل Proteus و Logisim و Multisim لتصميم واختبار الدوائر الرقمية قبل بنائها فعليًا.', en: 'Learn to use simulation programs like Proteus, Logisim, and Multisim to design and test digital circuits before building them physically.' },
            duration: { ar: 'أسبوع واحد', en: '1 week' },
            type: 'required',
            topics: [
                { title: { ar: 'البرامج الشائعة', en: 'Common programs' }, description: { ar: 'Proteus، Logisim، و Multisim', en: 'Proteus, Logisim, and Multisim' }, optional: false },
                { title: { ar: 'تصميم الدائرة افتراضيًا', en: 'Virtual circuit design' }, description: { ar: 'رسم الدائرة واختبارها على الكمبيوتر', en: 'Drawing and testing the circuit on computer' }, optional: false },
                { title: { ar: 'تصحيح الأخطاء', en: 'Debugging' }, description: { ar: 'اكتشاف وإصلاح الأخطاء في التصميم قبل التنفيذ', en: 'Discovering and fixing errors in design before implementation' }, optional: false }
            ],
            skills: [{ ar: 'محاكاة الدوائر الرقمية', en: 'Simulating digital circuits' }],
            project: { ar: 'تصميم واختبار دائرة رقمية باستخدام برنامج محاكاة', en: 'Design and test a digital circuit using simulation software' },
            courseId: null,
            next: ['hdl-fpga']
        },
        {
            id: 'hdl-fpga',
            title: { ar: 'لغات وصف العتاد و FPGA', en: 'HDL & FPGA' },
            description: { ar: 'تعلم لغات وصف العتاد مثل Verilog أو VHDL، وكيفية برمجة الدوائر الرقمية على لوحات FPGA.', en: 'Learn hardware description languages like Verilog or VHDL, and how to program digital circuits on FPGA boards.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'required',
            topics: [
                { title: { ar: 'لغة Verilog', en: 'Verilog language' }, description: { ar: 'لغة لوصف الدوائر الرقمية وتصميمها', en: 'Language for describing and designing digital circuits' }, optional: false },
                { title: { ar: 'لوحات FPGA', en: 'FPGA boards' }, description: { ar: 'لوحات قابلة لإعادة البرمجة للدوائر الرقمية', en: 'Re-programmable boards for digital circuits' }, optional: false },
                { title: { ar: 'تنفيذ الدائرة على FPGA', en: 'Implementing on FPGA' }, description: { ar: 'نقل التصميم من البرنامج إلى اللوحة الفعلية', en: 'Transferring design from software to actual board' }, optional: false }
            ],
            skills: [{ ar: 'برمجة FPGA باستخدام لغات وصف العتاد', en: 'FPGA programming with HDL' }],
            project: { ar: 'تنفيذ دائرة رقمية على لوحة FPGA باستخدام Verilog', en: 'Implement a digital circuit on FPGA using Verilog' },
            courseId: null,
            next: ['microcontrollers']
        },
        {
            id: 'microcontrollers',
            title: { ar: 'المتحكمات الدقيقة', en: 'Microcontrollers' },
            description: { ar: 'مقدمة إلى المتحكمات الدقيقة مثل Arduino، وتعلم أساسيات لغة C لكتابة برامج تتحكم في المدخلات والمخرجات الرقمية.', en: 'Introduction to microcontrollers like Arduino, and learning C basics to write programs controlling digital inputs and outputs.' },
            duration: { ar: 'أسبوعان', en: '2 weeks' },
            type: 'optional',
            topics: [
                { title: { ar: 'أردوينو (Arduino)', en: 'Arduino' }, description: { ar: 'متحكم دقيق سهل الاستخدام للمبتدئين', en: 'Beginner-friendly microcontroller' }, optional: true },
                { title: { ar: 'أساسيات لغة C', en: 'C language basics' }, description: { ar: 'كتابة برامج بسيطة تتحكم في العتاد', en: 'Writing simple programs controlling hardware' }, optional: true },
                { title: { ar: 'المدخلات والمخرجات الرقمية', en: 'Digital I/O' }, description: { ar: 'قراءة مستشعرات وتشغيل مصابيح ومحركات', en: 'Reading sensors and controlling LEDs and motors' }, optional: true }
            ],
            skills: [{ ar: 'برمجة المتحكمات الدقيقة', en: 'Microcontroller programming' }],
            project: { ar: 'بناء مشروع بسيط باستخدام أردوينو ومدخلات ومخرجات رقمية', en: 'Build a simple project using Arduino with digital inputs and outputs' },
            courseId: null,
            next: ['projects-career']
        },
        {
            id: 'projects-career',
            title: { ar: 'المشاريع والاستعداد المهني', en: 'Projects & Career Prep' },
            description: { ar: 'بناء مشاريع نهائية شاملة في الإلكترونيات الرقمية، والتحضير لوظائف مهندس الإلكترونيات الرقمية.', en: 'Build comprehensive final projects in digital electronics, and prepare for digital electronics engineer roles.' },
            duration: { ar: 'مستمر', en: 'Ongoing' },
            type: 'project',
            topics: [
                { title: { ar: 'المشاريع النهائية', en: 'Capstone projects' }, description: { ar: 'مشاريع شاملة تعكس كل ما تعلمته في الإلكترونيات الرقمية', en: 'Comprehensive projects reflecting everything learned in digital electronics' }, optional: false },
                { title: { ar: 'معرض الأعمال الشخصي', en: 'Personal portfolio' }, description: { ar: 'موقع يعرض مشاريعك في الدوائر الرقمية و FPGA', en: 'Website showcasing your digital circuit and FPGA projects' }, optional: false },
                { title: { ar: 'السيرة الذاتية التقنية', en: 'Technical resume' }, description: { ar: 'كتابة سيرة ذاتية تبرز مهاراتك في التصميم الرقمي', en: 'Writing a resume that highlights your digital design skills' }, optional: false },
                { title: { ar: 'التحضير للمقابلات', en: 'Interview preparation' }, description: { ar: 'التدريب على أسئلة المقابلات التقنية في الإلكترونيات الرقمية', en: 'Training on technical interview questions in digital electronics' }, optional: false }
            ],
            skills: [{ ar: 'عرض المشاريع والتقديم لوظائف الإلكترونيات الرقمية', en: 'Presenting projects and applying for digital electronics roles' }],
            project: { ar: 'مشروع نهائي في الإلكترونيات الرقمية أو FPGA', en: 'Final project in digital electronics or FPGA' },
            courseId: null,
            next: []
        }
    ]
};
