import { Code, Laptop, Code2, CircuitBoard, Zap, Server, Layout } from 'lucide-react';

export const tracks = [
    {
        id: 'frontend',
        title: { ar: 'تطوير الواجهات الأمامية', en: 'Front-End Development' },
        description: { ar: 'بناء واجهات المستخدم الحديثة باستخدام HTML، CSS، وجافاسكريبت.', en: 'Build modern user interfaces with HTML, CSS, and JavaScript.' },
        accent: '#3b82f6',
        Icon: Code,
        group: 'software',
        ready: true
    },
    {
        id: 'backend',
        title: { ar: 'تطوير السيرفرات', en: 'Back-End Development' },
        description: { ar: 'بناء منطق السيرفر، قواعد البيانات، وواجهات برمجة التطبيقات.', en: 'Server logic, databases, and APIs.' },
        accent: '#10b981',
        Icon: Server,
        group: 'software',
        ready: true
    },
    {
        id: 'fullstack',
        title: { ar: 'التطوير الكامل', en: 'Full-Stack Development' },
        description: { ar: 'دمج تطوير الواجهات الأمامية والسيرفر في مسار واحد.', en: 'Combine front-end and back-end into one path.' },
        accent: '#8b5cf6',
        Icon: Layout,
        group: 'software',
        ready: true
    },
    {
        id: 'analog-electronics',
        title: { ar: 'الإلكترونيات التناظرية', en: 'Analog Electronics' },
        description: { ar: 'الدوائر الإلكترونية، المضخمات، ومصادر الطاقة.', en: 'Electronic circuits, amplifiers, and power supplies.' },
        accent: '#f59e0b',
        Icon: CircuitBoard,
        group: 'electronics',
        ready: true
    },
    {
        id: 'digital-electronics',
        title: { ar: 'الإلكترونيات الرقمية', en: 'Digital Electronics' },
        description: { ar: 'البوابات المنطقية، الدوائر التسلسلية، وFPGA.', en: 'Logic gates, sequential circuits, and FPGA.' },
        accent: '#ef4444',
        Icon: CircuitBoard,
        group: 'electronics',
        ready: true
    },
    {
        id: 'n8n-ai-automation',
        title: { ar: 'الأتمتة والذكاء الاصطناعي', en: 'n8n / AI Automation' },
        description: { ar: 'سير العمل، الذكاء الاصطناعي، والتكاملات بدون كود.', en: 'Workflows, AI agents, and no-code integrations.' },
        accent: '#06b6d4',
        Icon: Zap,
        group: 'automation',
        ready: true
    }
];
