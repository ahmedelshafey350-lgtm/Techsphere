const fs = require('fs');

const fixes = [
    {
        file: 'F:\\Techsphere\\src\\Jobs\\Jobs.jsx',
        replacements: [
            { old: 'أنظمة التحكى….', new: 'أنظمة التحكم.' },
            { old: 'فري‚.', new: 'الفريق.' },
            { old: 'تسجيل الدخو„', new: 'تسجيل الدخول' }
        ]
    },
    {
        file: 'F:\\Techsphere\\src\\Paymant\\PayMant.jsx',
        replacements: [
            { old: 'حالة‡.', new: 'الحالة.' },
            { old: 'تسجيل الدخو„', new: 'تسجيل الدخول' }
        ]
    }
];

fixes.forEach(({ file, replacements }) => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    replacements.forEach(({ old, new: replacement }) => {
        if (content.includes(old)) {
            content = content.replaceAll(old, replacement);
            console.log(`FIXED in ${file.split('\\').pop()}: '${old}' -> '${replacement}'`);
        } else {
            console.log(`NOT FOUND in ${file.split('\\').pop()}: '${old}'`);
        }
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`  → File written`);
    } else {
        console.log(`  → No changes needed`);
    }
});
