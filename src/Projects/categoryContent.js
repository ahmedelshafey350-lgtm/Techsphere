export const categoryDescriptions = {
    "embedded-iot": {
        en: "Connected devices, sensors, and practical Internet of Things systems.",
        ar: "أجهزة متصلة وحساسات وأنظمة عملية لإنترنت الأشياء.",
    },
    "digital-logic": {
        en: "Logic gates, digital circuits, and sequential systems.",
        ar: "بوابات منطقية ودوائر رقمية وأنظمة تسلسلية.",
    },
    electronics: {
        en: "Electronic circuits, power systems, and measurement projects.",
        ar: "دوائر إلكترونية وأنظمة قدرة ومشاريع قياس.",
    },
    "mechanical-design": {
        en: "Mechanical design, structures, and strength-of-materials projects.",
        ar: "تصميم ميكانيكي ومنشآت ومشاريع مقاومة المواد.",
    },
    "industrial-automation": {
        en: "Industrial control, PLCs, drives, and automated processes.",
        ar: "تحكم صناعي ومتحكمات PLC ومحركات وعمليات مؤتمتة.",
    },
    "embedded-systems": {
        en: "Microcontrollers, robotics, and embedded applications.",
        ar: "متحكمات دقيقة وروبوتات وتطبيقات الأنظمة المدمجة.",
    },
    "software-ai": {
        en: "Full-stack applications, automation, and artificial intelligence.",
        ar: "تطبيقات متكاملة وأتمتة وذكاء اصطناعي.",
    },
};

export function categoryDescription(category, isEnglish) {
    return (isEnglish ? category.description_en : category.description_ar)
        || categoryDescriptions[category.slug]?.[isEnglish ? "en" : "ar"]
        || "";
}
