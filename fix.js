const fs = require('fs');

let t = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

// 1. Remove providers array and TestStatus
t = t.replace(/const providers = \[[^\]]*\]\n\ntype TestStatus = [^\n]*\n\n/g, '');
// Wait, my regex above might fail if it spans too far. Let's do simple replaces.

t = t.split('\n').filter(line => {
    // Drop the activeCount line
    if (line.includes('const activeCount =')) return false;
    // Drop aiKeys in handleExport
    if (line.includes('aiKeys: { gemini:')) return false;
    // Drop AI Ayarlari in tabs
    if (line.includes("key: 'ai' as const")) return false;
    // Drop setAiKeys reset code
    if (line.includes("setAiKeys({ gemini: '', openrouter: '', deepseek: '' })")) return false;
    // Drop aiKeys extraction
    if (line.match(/const \{ aiKeys, setAiKeys,/)) return false;
    return true;
}).join('\n');

// Re-add the valid extract without aiKeys
t = t.replace(/export default function Settings\(\) \{/, "export default function Settings() {\n  const { clients, calSessions, measurements, progressPhotos, savedPrograms, showToast, darkMode: dm } = useStore()");

// Fix useState
t = t.replace(/useState<'ai' \| 'data' \| 'danger'>\('ai'\)/g, "useState<'data' | 'danger'>('data')");

// Delete the AI Tab JSX safely by replacing EVERYTHING between {/* AI Tab */} and {/* Data Tab */}
t = t.replace(/\{\/\* AI Tab \*\/\}(.|\n)*?\{\/\* Data Tab \*\/\}/gm, '{/* Data Tab */}');

// Delete testConnection function
t = t.replace(/const testConnection = async(.|\n)*?5000\)\n  \}/gm, '');

// Clean up unused state hooks for testStatus, showKeyFor
t = t.replace(/const \[testStatus, setTestStatus\] = [^\n]*\n/g, '');
t = t.replace(/const \[showKeyFor, setShowKeyFor\] = [^\n]*\n/g, '');

fs.writeFileSync('src/pages/admin/Settings.tsx', t);
