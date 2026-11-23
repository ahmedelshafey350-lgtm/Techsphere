const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function collectFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectFiles(fullPath, files);
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Mojibake sequence → replacement
const MOJIBAKE_MAP = {
    '\uFFFD\u2026': 'م',   // �… → م
    '\uFFFD\u0160': 'ي',   // �Š → ي
    '\uFFFD\u201E': 'ل',   // �„ → ل
    '\uFFFD\u0178': 'ة',   // �Ÿ → ة
    '\uFFFD\u0192': 'ف',   // �ƒ → ف
    '\uFFFD\u201A': 'ت',   // �‚ → ت
    '\uFFFD\u2020': 'ك',   // �† → ك
    '\uFFFD\u2021': 'ه',   // �‡ → ه
    '\uFFFD\u2030': 'ت',   // �‰ → ت
};

// Double-encoded mojibake
const DOUBLE_ENCODED_MAP = {
    'â€„': '.',
    'â€”': '—',
    'â€“': '–',
    'â€™': '\'',
    'â€œ': '"',
    'â€': '"',
};

function fixText(text) {
    let result = text;
    for (const [old, newVal] of Object.entries(DOUBLE_ENCODED_MAP)) {
        result = result.split(old).join(newVal);
    }
    for (const [old, newVal] of Object.entries(MOJIBAKE_MAP)) {
        result = result.split(old).join(newVal);
    }
    return result;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    let result = content;
    
    // Fix double-quoted strings
    result = result.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, capture) => {
        const fixed = fixText(capture);
        return fixed !== capture ? '"' + fixed.replace(/"/g, '\\"') + '"' : match;
    });
    
    // Fix single-quoted strings
    result = result.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, capture) => {
        const fixed = fixText(capture);
        return fixed !== capture ? "'" + fixed.replace(/'/g, "\\'") + "'" : match;
    });
    
    // Fix template literals (backtick strings)
    result = result.replace(/`([^`\\]*(?:\\.[^`\\]*)*)`/g, (match, capture) => {
        const fixed = fixText(capture);
        return fixed !== capture ? '`' + fixed.replace(/`/g, '\\`') + '`' : match;
    });
    
    if (result !== original) {
        fs.writeFileSync(filePath, result, 'utf8');
        return true;
    }
    return false;
}

const files = collectFiles(srcDir);
let fixedCount = 0;
for (const file of files) {
    if (processFile(file)) {
        fixedCount++;
        console.log(`FIXED: ${path.relative(__dirname, file)}`);
    }
}

console.log(`\nDone. Fixed ${fixedCount} of ${files.length} files.`);
