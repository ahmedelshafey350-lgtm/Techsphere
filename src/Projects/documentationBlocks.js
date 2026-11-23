// Documentation schema shown to paying customers as five blocks:
//   1. project name + code (comes from the project record, not the JSON)
//   2. the project idea
//   3. manufacturing steps
//   4. tools and materials
//   5. goal and how it helps
// Older published documents used other keys; each block lists the keys it accepts so
// existing content keeps working, and anything unrecognised still renders as an extra block.

export const DOCUMENTATION_BLOCKS = [
    {
        key: "idea",
        titleAr: "فكرة المشروع",
        titleEn: "The project idea",
        layout: "prose",
        sources: ["idea", "overview", "objective"],
    },
    {
        key: "manufacturing",
        titleAr: "خطوات التصنيع",
        titleEn: "Manufacturing steps",
        layout: "steps",
        sources: ["manufacturing_steps", "implementation_steps", "step_by_step", "assembly_steps"],
    },
    {
        key: "tools",
        titleAr: "الأدوات والخامات",
        titleEn: "Tools and materials",
        layout: "list",
        sources: ["tools", "tools_and_technologies", "components"],
    },
    {
        key: "goal",
        titleAr: "الهدف والفايدة",
        titleEn: "Goal and how it helps",
        layout: "prose",
        sources: ["goal_benefits", "goal", "benefits", "expected_outcomes", "community_impact"],
    },
];

export const documentationSectionLabels = {
    idea: ["The project idea", "فكرة المشروع"],
    manufacturing_steps: ["Manufacturing steps", "خطوات التصنيع"],
    implementation_steps: ["Manufacturing steps", "مراحل التنفيذ"],
    step_by_step: ["Step-by-step guide", "شرح خطوة بخطوة"],
    assembly_steps: ["Manufacturing steps", "خطوات التجميع"],
    tools: ["Tools and materials", "الأدوات والخامات"],
    tools_and_technologies: ["Tools and technologies", "الأدوات والتقنيات"],
    components: ["Components and materials", "المكونات والخامات"],
    goal_benefits: ["Goal and how it helps", "الهدف والفايدة"],
    goal: ["Goal", "الهدف"],
    benefits: ["What you gain from the project", "المستفاد من المشروع"],
    expected_outcomes: ["Expected outcomes", "النتائج المتوقعة"],
    community_impact: ["Estimated community impact", "الأثر التقديري على المجتمع"],
    overview: ["Overview", "نظرة عامة"],
    objective: ["Project objective", "هدف المشروع"],
    how_it_works: ["How it works", "آلية العمل"],
    architecture: ["Hardware and software architecture", "معمارية الأجهزة والبرمجيات"],
    circuit_diagrams: ["Circuit and wiring diagrams", "مخططات الدائرة والتوصيل"],
    pcb_information: ["PCB information", "معلومات لوحة الدوائر"],
    source_code: ["Source code", "الكود المصدري"],
    technical_specifications: ["Technical specifications", "المواصفات الفنية"],
    operating_instructions: ["Operating instructions", "تعليمات التشغيل"],
    testing: ["Testing", "الاختبار"],
    troubleshooting: ["Troubleshooting", "استكشاف الأعطال"],
    practical_applications: ["Practical applications", "التطبيقات العملية"],
    real_world_examples: ["Real-world examples", "أمثلة واقعية"],
    exercises: ["Exercises", "التدريبات"],
    code_examples: ["Code examples", "أمثلة برمجية"],
    use_cases: ["Use cases", "حالات الاستخدام"],
    common_mistakes: ["Common mistakes", "أخطاء شائعة"],
    notes: ["Technical notes", "ملاحظات فنية"],
};

const canonicalSourceKeys = new Set(DOCUMENTATION_BLOCKS.flatMap((block) => block.sources));

// Published documents used several keys for the same block over time. Anything that maps onto
// a canonical block is never rendered twice as an extra.
export function isCanonicalSourceKey(key) {
    return canonicalSourceKeys.has(key);
}

export function hasContent(value) {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
}

// Every field is stored as { ar, en }. English falls back to Arabic when it is empty so a
// customer reading English never sees a blank block, and Arabic stays authoritative.
export function localizedValue(value, isEnglish) {
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) {
        return value
            .map((item) => (typeof item === "string" ? item.trim() : localizedValue(item, isEnglish)))
            .filter((item) => hasContent(item));
    }
    if (typeof value === "object") {
        const primary = isEnglish ? value.en : value.ar;
        const secondary = isEnglish ? value.ar : value.en;
        if (hasContent(primary)) return localizedValue(primary, isEnglish);
        if (hasContent(secondary)) return localizedValue(secondary, isEnglish);
    }
    return "";
}

function sectionTitle(key, isEnglish) {
    const label = documentationSectionLabels[key];
    if (label) return label[isEnglish ? 0 : 1];
    return key.replaceAll("_", " ");
}

export function buildDocumentationBlocks(documentation, isEnglish) {
    const source = documentation && typeof documentation === "object" ? documentation : {};
    const usedKeys = new Set();

    const blocks = DOCUMENTATION_BLOCKS.map((block) => {
        let value = "";
        for (const key of block.sources) {
            const localized = localizedValue(source[key], isEnglish);
            if (hasContent(localized)) {
                value = localized;
                usedKeys.add(key);
                break;
            }
        }
        return {
            key: block.key,
            title: isEnglish ? block.titleEn : block.titleAr,
            layout: block.layout,
            value,
        };
    }).filter((block) => hasContent(block.value));

    const extras = Object.entries(source)
        .filter(([key]) => !usedKeys.has(key) && !canonicalSourceKeys.has(key))
        .map(([key, raw]) => ({
            key: `extra-${key}`,
            title: sectionTitle(key, isEnglish),
            layout: Array.isArray(localizedValue(raw, isEnglish)) ? "list" : "prose",
            value: localizedValue(raw, isEnglish),
        }))
        .filter((block) => hasContent(block.value));

    return { blocks, extras };
}
