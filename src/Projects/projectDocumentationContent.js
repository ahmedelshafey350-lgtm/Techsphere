// Documentation that is written for every catalog project from the project record itself.
//
// The marketplace catalog holds over 300 projects and most of them never had documentation
// published, so a paying customer could open a project and find an empty page. This module
// composes the five documentation blocks from the project's own name, category, difficulty and
// catalog description, so every project opens with real content.
//
// A published documentation version always wins: resolveDocumentation only fills the blocks the
// published version leaves empty.

import { hasContent, isCanonicalSourceKey, localizedValue } from "./documentationBlocks";

// Project codes are issued per catalog: TXH-ESP-001, TXH-DLG-014, TXH-FSA-023 ...
const CATEGORY_BY_CODE_PREFIX = {
    ESP: "embedded-iot",
    DLG: "digital-logic",
    EE: "electronics",
    ELC: "electronics",
    MAT: "mechanical-design",
    PLC: "industrial-automation",
    IND: "industrial-automation",
    ARD: "embedded-systems",
    STM: "embedded-systems",
    ROB: "embedded-systems",
    FSA: "software-ai",
};

export const PROJECT_CATEGORY_BLUEPRINTS = {
    "embedded-iot": {
        labelAr: "إنترنت الأشياء والأجهزة المدمجة",
        labelEn: "Embedded IoT",
        idea: {
            ar: "«{title}» وحدة مدمجة مبنية على ESP32: تقرأ الحساسات محليًا، تعالج الإشارة على الجهاز، ثم ترفع النتيجة إلى لوحة متابعة عبر Wi-Fi. يغطي المشروع اختيار الحساس، وتصميم دائرة التغذية، وكتابة الثابتة التي تحوّل القراءة إلى إنذار أو قرار تحكم.",
            en: "“{title}” is an ESP32 unit that reads its sensors locally, processes the signal on-device and publishes the result to a monitoring dashboard over Wi-Fi. The build covers sensor selection, power and signal wiring, and firmware that turns a reading into an alert or a control action.",
        },
        steps: {
            ar: [
                "تحديد المتغيّر المطلوب قياسه ومداه وحساسيته، ثم اختيار الحساس المناسب لـ«{title}».",
                "توصيل الحساس بوحدة ESP32 عبر ناقل I2C أو SPI أو مدخل تماثلي، مع مقاومات السحب ومستويات الجهد الصحيحة.",
                "تصميم مسار التغذية: مثبّت جهد، مكثفات تنعيم، وحماية من ارتفاع التيار وانعكاس القطبية.",
                "برمجة قراءة العينات بمعدل ثابت وتخزينها في مخزن دائري لتفادي فقد القراءات عند انقطاع الشبكة.",
                "بناء عتبات الإنذار والتصفية (متوسط متحرك أو FFT) لتمييز الحالة الطبيعية عن بداية الخلل.",
                "ربط الوحدة بلوحة المتابعة عبر Wi-Fi أو MQTT، ثم التركيب على الماكينة ومعايرة العتبات وتسجيل نتيجة الاختبار.",
            ],
            en: [
                "Fix the variable to be measured, its range and needed sensitivity, then select the sensor that fits “{title}”.",
                "Wire the sensor to the ESP32 over I2C, SPI or an analog input, with the right pull-ups and voltage levels.",
                "Design the power path: a regulator, smoothing capacitors and protection against over-current and reverse polarity.",
                "Program a fixed sampling rate and buffer the samples in a ring buffer so readings survive a network drop.",
                "Set the alert thresholds and filtering (moving average or FFT) that separate a normal reading from the onset of a fault.",
                "Publish to the dashboard over Wi-Fi or MQTT, mount the unit, calibrate the thresholds and record the test result.",
            ],
        },
        tools: {
            ar: [
                "وحدة ESP32-WROOM-32",
                "حساس مناسب للمتغيّر المقاس",
                "مثبّت جهد 3.3 فولت ومكثفات تنعيم",
                "مقاومات سحب وأسلاك توصيل",
                "مقياس متعدد وأوسيلوسكوب",
                "مصدر تغذية 5 فولت / 2 أمبير",
                "Arduino IDE أو ESP-IDF",
                "حاوية تركيب ولوحة تثبيت",
            ],
            en: [
                "ESP32-WROOM-32 development unit",
                "Sensor matched to the measured variable",
                "3.3 V regulator and smoothing capacitors",
                "Pull-up resistors and hook-up wire",
                "Multimeter and oscilloscope",
                "5 V / 2 A power supply",
                "Arduino IDE or ESP-IDF",
                "Mounting plate and enclosure",
            ],
        },
        goal: {
            ar: "الهدف أن يعمل «{title}» كوحدة مراقبة مستقلة تنبّه قبل الوصول إلى حد الخطر بدلًا من الاعتماد على فحص يدوي دوري. المخرجات وحدة موثّقة بقراءات اختبار وعتبات معايرة، ويمكن توسيعها لتغطية أكثر من ماكينة من نفس لوحة المتابعة.",
            en: "The goal is for “{title}” to work as a standalone monitoring unit that raises an alert before a limit is reached, instead of relying on periodic manual checks. The output is a unit documented with test readings and calibrated thresholds, extendable to cover more machines from the same dashboard.",
        },
    },

    "digital-logic": {
        labelAr: "المنطق الرقمي",
        labelEn: "Digital Logic",
        idea: {
            ar: "«{title}» دائرة منطقية تُبنى على لوحة تجارب: المدخلات من مفاتيح، والمعالجة ببوابات AND وOR وNOT وXOR حسب جدول الحقيقة، والمخرج على مؤشر ضوئي أو شاشة سبعة أقسام. المشروع يوضّح الفرق بين التصميم النظري المبسّط والتنفيذ الفعلي على بوابات حقيقية.",
            en: "“{title}” is a logic circuit built on a breadboard: switch inputs, AND/OR/NOT/XOR gates following the truth table, and an LED or seven-segment output. The work shows the difference between the simplified design on paper and the same function built on real gate ICs.",
        },
        steps: {
            ar: [
                "استخراج جدول الحقيقة الكامل للدالة المطلوبة في «{title}».",
                "تبسيط الدالة بخرائط كارنو أو قواعد الجبر المنطقي للوصول إلى أقل عدد بوابات.",
                "اختيار عائلات البوابات (74HC) وحساب عدد الدوائر المتكاملة المطلوبة.",
                "تركيب الدائرة على لوحة تجارب مع مدخلات مفاتيح ومقاومات سحب 10 كيلو أوم.",
                "إضافة مقاومات 220 أوم على المخارج وحماية تغذية 5 فولت بمكثف تنعيم.",
                "اختبار كل حالة من جدول الحقيقة وتوثيق النتائج مقابل التصميم.",
            ],
            en: [
                "Write the full truth table for the function required by “{title}”.",
                "Simplify the function with a Karnaugh map or Boolean algebra to reach the fewest gates.",
                "Pick the gate family (74HC) and count the ICs the design needs.",
                "Build the circuit on a breadboard with switch inputs and 10 kΩ pull-down resistors.",
                "Add 220 Ω resistors on the outputs and a smoothing capacitor on the 5 V rail.",
                "Test every row of the truth table and record the measured result against the design.",
            ],
        },
        tools: {
            ar: [
                "بوابات 74HC08 و74HC32 و74HC86 و74HC04",
                "لوحة تجارب breadboard",
                "مفاتيح DIP ومفاتيح ضغط",
                "مؤشرات LED مع مقاومات 220 أوم",
                "مقاومات سحب 10 كيلو أوم",
                "مصدر تغذية 5 فولت",
                "مقياس متعدد",
                "Logisim أو Proteus للمحاكاة",
            ],
            en: [
                "74HC08, 74HC32, 74HC86 and 74HC04 gates",
                "Breadboard",
                "DIP switches and push buttons",
                "LEDs with 220 Ω resistors",
                "10 kΩ pull-down resistors",
                "5 V power supply",
                "Multimeter",
                "Logisim or Proteus for simulation",
            ],
        },
        goal: {
            ar: "الهدف أن ينقل «{title}» فكرة الدالة المنطقية من الورق إلى دائرة تعمل فعليًا، بحيث يبقى أثر كل بوابة ظاهرًا عند الاختبار. المخرجات دائرة موثّقة بجدول حقيقتها وصور التوصيل، وتصلح كوحدة أساس داخل مشروع أكبر.",
            en: "The goal is for “{title}” to carry a logic function from paper to a circuit that actually runs, with each gate's effect visible at test time. The output is a circuit documented with its truth table and wiring photos, usable as a building block inside a larger project.",
        },
    },

    "electronics": {
        labelAr: "الإلكترونيات والدوائر",
        labelEn: "Electronics & Circuits",
        idea: {
            ar: "«{title}» دائرة إلكترونية تنفيذية تعتمد على مكوّنات محدّدة، مع ضبط للقيم وحماية للتغذية. يمشي المشروع من حساب القيم إلى المحاكاة، ثم التركيب واللحام والاختبار تحت حمل حقيقي.",
            en: "“{title}” is a working electronic circuit built around named parts, with calculated values and a protected supply. The work runs from calculating the values through simulation, then assembly, soldering and testing under a real load.",
        },
        steps: {
            ar: [
                "تحديد مواصفات الدائرة: الجهد والتيار والحمل المتوقع في «{title}».",
                "اختيار المكوّنات الأساسية وحساب قيم المقاومات والمكثفات والمرشحات.",
                "محاكاة الدائرة في Proteus أو LTspice ومراجعة الإشارة عند نقاط القياس.",
                "تركيب الدائرة على لوحة مثقوبة أو PCB وتنفيذ اللحام مع فحص التوصيلات.",
                "اختبار التغذية أولًا بمصدر محدود التيار، ثم قياس المخارج بالمقياس والأوسيلوسكوب.",
                "تجميع الدائرة في حاوية مناسبة وتوثيق قراءات الاختبار وحدود التشغيل.",
            ],
            en: [
                "Fix the circuit specification: voltage, current and expected load for “{title}”.",
                "Select the core parts and calculate the resistor, capacitor and filter values.",
                "Simulate the circuit in Proteus or LTspice and review the signal at each test point.",
                "Assemble on perfboard or a PCB, solder it and check continuity before powering up.",
                "Test the supply first from a current-limited source, then measure the outputs with a meter and scope.",
                "Fit the board into an enclosure and document the test readings and operating limits.",
            ],
        },
        tools: {
            ar: [
                "المكوّنات الفعّالة المطلوبة (NE555 أو LM358 أو LM317 حسب الدائرة)",
                "مقاومات ومكثفات وثنائيات",
                "لوحة مثقوبة أو PCB ومحطة لحام",
                "مصدر تغذية قابل للضبط",
                "مقياس متعدد رقمي",
                "أوسيلوسكوب",
                "سلك توصيل وقصافة ومثقاب",
                "Proteus أو LTspice للمحاكاة",
            ],
            en: [
                "The active parts the design needs (NE555, LM358 or LM317 depending on the circuit)",
                "Resistors, capacitors and diodes",
                "Perfboard or PCB with a soldering station",
                "Adjustable bench power supply",
                "Digital multimeter",
                "Oscilloscope",
                "Hook-up wire, cutters and drill bits",
                "Proteus or LTspice for simulation",
            ],
        },
        goal: {
            ar: "الهدف أن يعمل «{title}» تحت الحمل الفعلي لا على الورق فقط، مع حدود تشغيل معروفة وقراءات موثّقة. المخرجات دائرة مجمّعة داخل حاوية، وتوثيق للقيم النهائية وأي تعديل جرى بعد الاختبار.",
            en: "The goal is for “{title}” to run under its real load rather than only on paper, with known operating limits and recorded readings. The output is an assembled board inside an enclosure plus documentation of the final values and any change made after testing.",
        },
    },

    "mechanical-design": {
        labelAr: "التصميم الميكانيكي ومقاومة المواد",
        labelEn: "Mechanical Design",
        idea: {
            ar: "«{title}» نموذج ثلاثي الأبعاد يُحلَّل تحت الأحمال التشغيلية بتحليل العناصر المحدودة، للتحقق من معامل الأمان ومواضع تركّز الإجهاد. يربط المشروع الأبعاد الواقعية باختيار الخامة، ثم يقارن النتيجة قبل تحسين التصميم وبعده.",
            en: "“{title}” is a three-dimensional part analysed under its service loads with finite element analysis to verify the safety factor and locate stress concentration. The work ties real dimensions to material choice, then compares the result before and after the design is optimised.",
        },
        steps: {
            ar: [
                "رسم أبعاد «{title}» في SolidWorks أو Inventor مع مراعاة حدود التركيب.",
                "اختيار الخامة من جدول الخواص (فولاذ أو ألومنيوم) وتحديد خواصها الميكانيكية.",
                "بناء شبكة تحليل مناسبة وتحديد الأحمال والشروط الحدية الواقعية.",
                "تشغيل التحليل وقراءة الإجهاد الأقصى ومقدار الانفعال وموضع تركّز الإجهاد.",
                "حساب معامل الأمان ومقارنته بالحد المسموح في الكود المرجعي.",
                "تخفيف الكتلة أو تعديل المقاطع، ثم إعادة التحليل وتوثيق الفرق بين النسختين.",
            ],
            en: [
                "Model “{title}” in SolidWorks or Inventor, respecting the real mounting envelope.",
                "Choose the material from its property table (steel or aluminium) and enter its mechanical properties.",
                "Build a suitable mesh and apply realistic loads and boundary conditions.",
                "Run the study and read peak stress, strain and the location of stress concentration.",
                "Compute the safety factor and compare it with the allowable limit in the reference code.",
                "Reduce mass or change sections, re-run the study and document the difference between versions.",
            ],
        },
        tools: {
            ar: [
                "SolidWorks أو Autodesk Inventor",
                "وحدة Simulation أو ANSYS",
                "جدول خواص الخامات والمعايير المرجعية",
                "فرجار رقمي ومسطرة فولاذية",
                "حاسبة معامل الأمان والانفعال",
                "نموذج مرجعي أو مسح ثلاثي الأبعاد",
                "قالب تقرير تصميم",
                "برنامج قراءة نتائج التحليل",
            ],
            en: [
                "SolidWorks or Autodesk Inventor",
                "Simulation add-in or ANSYS",
                "Material property tables and the reference code",
                "Digital caliper and steel rule",
                "Safety-factor and strain calculator",
                "Reference part or 3D scan",
                "Design report template",
                "FEA result viewer",
            ],
        },
        goal: {
            ar: "الهدف أن يخرج «{title}» بتصميم محسوب لا بالتقدير، بحيث يكون معامل الأمان معروفًا وموضع تركّز الإجهاد واضحًا. المخرجات نموذج ثلاثي الأبعاد وتقرير تحليل يوضّح النسخة النهائية وسبب كل تعديل.",
            en: "The goal is for “{title}” to come out of a calculated design rather than an estimate, with a known safety factor and a visible stress concentration. The output is a 3D model plus an analysis report stating the final version and the reason behind each change.",
        },
    },

    "industrial-automation": {
        labelAr: "التحكم والأتمتة الصناعية",
        labelEn: "Industrial Automation",
        idea: {
            ar: "«{title}» منظومة تحكم صناعي: الدخل من حساسات ومفاتيح، والمعالجة في وحدة تحكم بمنطق سلمي، والمخرج إلى محركات أو صمامات مع واجهة تشغيل. يغطي المشروع اختيار الأجهزة، وبرمجة المنطق، والاختبار على لوحة محاكاة قبل التركيب.",
            en: "“{title}” is an industrial control system: sensor and switch inputs, a controller running ladder logic, and outputs to motors or valves with an operator interface. The work covers device selection, logic programming and bench testing before installation.",
        },
        steps: {
            ar: [
                "تحديد متطلبات التشغيل والسلامة لمنظومة «{title}» ودخلها ومخرجها.",
                "اختيار وحدة التحكم والحساسات والمشغّلات المناسبة للأحمال الفعلية.",
                "رسم مخطط القوى ومخطط التحكم وقائمة الأطراف على اللوحة.",
                "برمجة المنطق السلمي أو النص البنيوي مع أقفال السلامة وإعادة التشغيل الآمنة.",
                "بناء واجهة تشغيل تعرض الحالة وأسباب التوقف وتسمح بالتشغيل اليدوي.",
                "اختبار على لوحة محاكاة أو ماكينة، ثم تثبيت اللوحة وتوثيق تسلسل التشغيل.",
            ],
            en: [
                "Define the operating and safety requirements of “{title}” with its inputs and outputs.",
                "Select the controller, sensors and actuators that match the real loads.",
                "Draw the power and control schematics plus the terminal list for the panel.",
                "Program the ladder or structured logic with safety interlocks and a safe restart path.",
                "Build an operator screen that shows state and trip reasons and allows manual jogging.",
                "Test on a bench or machine, then mount the panel and document the operating sequence.",
            ],
        },
        tools: {
            ar: [
                "وحدة تحكم PLC",
                "حساسات حدية وضوئية وحرارية",
                "كونتاكتورات وقواطع وحمايات",
                "محوّل تردد VFD عند الحاجة",
                "شاشة تشغيل HMI",
                "مزوّد تغذية 24 فولت مستمر",
                "كابلات وأطراف ولوحة تحكم",
                "مقياس متعدد ومقياس تيار كلامب",
            ],
            en: [
                "PLC controller",
                "Limit, photoelectric and thermal sensors",
                "Contactors, breakers and protection devices",
                "VFD where a variable speed drive is needed",
                "HMI operator screen",
                "24 V DC power supply",
                "Cables, terminals and a control panel",
                "Multimeter and clamp meter",
            ],
        },
        goal: {
            ar: "الهدف أن تعمل «{title}» كمنظومة تشغيل واضحة: بدء وإيقاف آمن، وإنذار عند الخلل، وتوثيق لأسباب التوقف. المخرجات لوحة تحكم مجمّعة وبرنامج منطق موثّق يسهل صيانته وتعديله.",
            en: "The goal is for “{title}” to behave as a clear operating system: a safe start and stop, an alarm on fault, and recorded trip reasons. The output is an assembled control panel and documented logic that is easy to maintain and change.",
        },
    },

    "embedded-systems": {
        labelAr: "الأنظمة المدمجة والروبوتات",
        labelEn: "Embedded Systems",
        idea: {
            ar: "«{title}» مشروع أنظمة مدمجة: وحدة تحكم دقيقة تقرأ الحساسات وتقود المشغّلات، مع منطق تحكم يعمل على الجهاز وواجهة إعداد. يغطي المشروع توصيل الأطراف، وكتابة الثابتة، ومعايرة الاستجابة الفعلية.",
            en: "“{title}” is an embedded build: a microcontroller reads sensors and drives actuators, with control logic running on the device and a way to configure it. The work covers pin wiring, firmware and calibrating the real response.",
        },
        steps: {
            ar: [
                "تحديد الأطراف المستخدمة في «{title}» من دخل رقمي وتماثلي ومخارج PWM.",
                "توصيل الحساسات والمشغّلات مع مراعاة التيار المسحوب وحماية الوحدة.",
                "كتابة الثابتة: تهيئة الأطراف، قراءة الحساس، ومنطق التحكم أو الحركة.",
                "ضبط المشغّلات ومعايرة نطاق الحركة أو السرعة المطلوبة.",
                "اختبار سيناريوهات التشغيل والتوقف والطوارئ على الوحدة.",
                "تثبيت الوحدة في هيكل المشروع وتوثيق الوصلات ومعاملات المعايرة.",
            ],
            en: [
                "Map the pins “{title}” needs: digital inputs, analog inputs and PWM outputs.",
                "Wire sensors and actuators while respecting current draw and protecting the board.",
                "Write the firmware: pin setup, sensor reads and the control or motion logic.",
                "Drive the actuators and calibrate the required travel range or speed.",
                "Test the run, stop and emergency scenarios on the unit itself.",
                "Fix the board into the project frame and document the wiring and calibration values.",
            ],
        },
        tools: {
            ar: [
                "لوحة تحكم دقيقة (Arduino أو STM32 أو ESP32)",
                "حساسات المسافة أو الخط أو الضوء حسب المشروع",
                "درايفر محرك ومشغّلات",
                "مصدر تغذية مناسب للأحمال",
                "لوحة تجارب وأسلاك توصيل",
                "Arduino IDE أو STM32CubeIDE",
                "مقياس متعدد ومصدر اختبار",
                "هيكل تثبيت ولوحة تثبيت",
            ],
            en: [
                "Microcontroller board (Arduino, STM32 or ESP32)",
                "Distance, line or light sensors as the project needs",
                "Motor driver and actuators",
                "Power supply sized for the loads",
                "Breadboard and hook-up wire",
                "Arduino IDE or STM32CubeIDE",
                "Multimeter and test source",
                "Mounting frame and plate",
            ],
        },
        goal: {
            ar: "الهدف أن ينفّذ «{title}» وظيفته باستجابة متوقعة وقابلة للقياس، مع منطق تحكم واضح يمكن تعديله لاحقًا. المخرجات وحدة مجمّعة وثابتة موثّقة بمعاملات المعايرة ونتائج الاختبار.",
            en: "The goal is for “{title}” to perform its function with a response that is predictable and measurable, on control logic that can be changed later. The output is an assembled unit and firmware documented with calibration values and test results.",
        },
    },

    "software-ai": {
        labelAr: "البرمجيات والذكاء الاصطناعي",
        labelEn: "Software & AI",
        idea: {
            ar: "«{title}» تطبيق ويب متكامل: واجهة أمامية، وطبقة خدمة مع قاعدة بيانات ومصادقة، وخدمة ذكاء اصطناعي داخل المسار الأساسي. يغطي المشروع نموذج البيانات، وواجهة الخدمة، وتدفق الاستخدام، والنشر على بيئة حقيقية.",
            en: "“{title}” is a full application: a front end, a service layer with database and authentication, and an AI service on the main path. The work covers the data model, the API, the user flow and deployment to a real environment.",
        },
        steps: {
            ar: [
                "تحديد حالات الاستخدام الأساسية في «{title}» وحدود الوظائف المطلوبة.",
                "تصميم نموذج البيانات والجداول وقواعد الصلاحيات قبل بناء الواجهة.",
                "بناء واجهة الخدمة التي تنفّذ منطق العمل وتخدم الواجهة الأمامية.",
                "تنفيذ الواجهة الأمامية: تدفق الدخول، والاستمارات، وحالات التحميل والأخطاء.",
                "ربط خدمة الذكاء الاصطناعي مع مهلة زمنية ومعالجة للفشل وتكلفة لكل طلب.",
                "اختبار المسار الكامل ثم النشر مع متغيرات البيئة ومراقبة الأخطاء.",
            ],
            en: [
                "Define the core use cases of “{title}” and the boundary of what it will do.",
                "Design the data model, tables and access rules before building any interface.",
                "Build the service endpoint that runs the business logic for the front end.",
                "Implement the front end: sign-in flow, forms, loading and error states.",
                "Connect the AI service with a timeout, failure handling and a per-request cost limit.",
                "Test the full path, then deploy with environment variables and error monitoring.",
            ],
        },
        tools: {
            ar: [
                "React أو Next.js للواجهة",
                "Supabase أو PostgreSQL لقاعدة البيانات",
                "مصادقة وصلاحيات على مستوى الصفوف",
                "Edge Functions لخدمة الواجهة البرمجية",
                "مزوّد نموذج ذكاء اصطناعي عبر الـ API",
                "Git وبيئة نشر",
                "سجلات ومراقبة الأخطاء",
                "مخطط نموذج بيانات موثّق",
            ],
            en: [
                "React or Next.js for the interface",
                "Supabase or PostgreSQL for the database",
                "Authentication with row-level access rules",
                "Edge Functions for the API layer",
                "An AI model provider through its API",
                "Git and a deployment target",
                "Logs and error monitoring",
                "A documented data-model schema",
            ],
        },
        goal: {
            ar: "الهدف أن يخرج «{title}» كمنتج يعمل من أول دخول المستخدم حتى النتيجة النهائية، مع حدود واضحة للتكلفة والأخطاء. المخرجات نسخة منشورة، ونموذج بيانات موثّق، وسجل للتعديلات والنسخ.",
            en: "The goal is for “{title}” to ship as a product that works from the first sign-in to the final result, with known limits on cost and failure. The output is a deployed build, a documented data model and a record of changes.",
        },
    },
};

const DEFAULT_CATEGORY = "electronics";
const generatedCache = new Map();

export function resolveProjectCategory(project) {
    const explicit = project?.category_slug
        || project?.category?.slug
        || project?.category_slug_en;
    if (project && typeof project.category === "string") return project.category;
    if (explicit && PROJECT_CATEGORY_BLUEPRINTS[explicit]) return explicit;
    const prefix = String(project?.project_code || "").split("-")[1]?.toUpperCase();
    return CATEGORY_BY_CODE_PREFIX[prefix] || DEFAULT_CATEGORY;
}

function fill(template, context) {
    return String(template).replaceAll("{title}", context.title);
}

function projectTitle(project) {
    return String(project?.title_ar || project?.title_en || project?.title || project?.project_code || "").trim();
}

function projectDetail(project) {
    const candidates = [project?.public_description_en, project?.description_en, project?.summary_en];
    return candidates.find((value) => typeof value === "string" && value.trim().length > 20)?.trim() || "";
}

function buildBlock(content, isEnglish, context) {
    if (Array.isArray(content)) {
        return {
            ar: content.map((item) => fill(item, context)),
            en: content.map((item) => fill(item, context)),
        };
    }
    return {
        ar: fill(content.ar, context),
        en: fill(content.en, context),
    };
}

// The five blocks in the schema the customer page and the admin publisher both use.
export function buildGeneratedDocumentation(project) {
    const cacheKey = `${project?.project_code || ""}-${projectTitle(project)}`;
    if (generatedCache.has(cacheKey)) return generatedCache.get(cacheKey);

    const category = resolveProjectCategory(project);
    const blueprint = PROJECT_CATEGORY_BLUEPRINTS[category] || PROJECT_CATEGORY_BLUEPRINTS[DEFAULT_CATEGORY];
    const title = projectTitle(project) || (project?.project_code ?? "");
    const context = { title };
    const detail = projectDetail(project);

    const documentation = {
        idea: {
            ar: fill(blueprint.idea.ar, context),
            en: detail
                ? `${fill(blueprint.idea.en, context)} ${detail}`
                : fill(blueprint.idea.en, context),
        },
        manufacturing_steps: buildBlock(blueprint.steps, false, context),
        tools: buildBlock(blueprint.tools, false, context),
        goal_benefits: {
            ar: fill(blueprint.goal.ar, context),
            en: fill(blueprint.goal.en, context),
        },
    };

    generatedCache.set(cacheKey, documentation);
    return documentation;
}

export function generatedCategoryLabel(project, isEnglish) {
    const blueprint = PROJECT_CATEGORY_BLUEPRINTS[resolveProjectCategory(project)]
        || PROJECT_CATEGORY_BLUEPRINTS[DEFAULT_CATEGORY];
    return isEnglish ? blueprint.labelEn : blueprint.labelAr;
}

function blockFilled(published, key) {
    const raw = published?.[key];
    return hasContent(localizedValue(raw, false)) || hasContent(localizedValue(raw, true));
}

// Published content always wins per block; generated content fills whatever is missing, and any
// extra published sections are carried through untouched.
export function resolveDocumentation(project, published) {
    const generated = buildGeneratedDocumentation(project);
    if (!published || typeof published !== "object") return generated;

    const resolved = { ...generated };
    for (const key of Object.keys(generated)) {
        if (blockFilled(published, key)) resolved[key] = published[key];
    }
    for (const [key, value] of Object.entries(published)) {
        if (key in resolved || isCanonicalSourceKey(key)) continue;
        resolved[key] = value;
    }
    return resolved;
}
