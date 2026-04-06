import re

with open("src/pages/admin/Settings.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(r'const providers = \[.*?\]\n\n', '', text, flags=re.DOTALL)
text = re.sub(r"type TestStatus = 'idle' \| 'testing' \| 'success' \| 'error'\n\n", '', text)

text = text.replace("aiKeys, setAiKeys, ", "")
text = text.replace("aiKeys, ", "")

text = re.sub(r'const \[testStatus, setTestStatus\] = useState<Record<string, TestStatus>>\(\{\}\)\n\s*', '', text)
text = text.replace("useState<'ai' | 'data' | 'danger'>('ai')", "useState<'data' | 'danger'>('data')")
text = re.sub(r'const \[showKeyFor, setShowKeyFor\] = useState<string \| null>\(null\)\n\s*', '', text)
text = re.sub(r'const activeCount = \[aiKeys\.gemini, aiKeys\.openrouter, aiKeys\.deepseek\]\.filter\(Boolean\)\.length\n\s*', '', text)

# Delete testConnection block
text = re.sub(r'const testConnection = async \(key: string\) => \{.*?\n  \}\n', '', text, flags=re.DOTALL)

# Delete usage in handleExport
text = re.sub(r'\s*aiKeys: \{ gemini: !!aiKeys\.gemini, openrouter: !!aiKeys\.openrouter, deepseek: !!aiKeys\.deepseek \},', '', text)

text = re.sub(r"\s*\{ key: 'ai' as const, label: 'AI Ayarları', icon: '🤖' \},", '', text)

# Important: remove the whole AI tab HTML chunk
text = re.sub(r'\{\/\* AI Tab \*\/\}.*?(?=\{\/\* Data Tab \*\/\})', '', text, flags=re.DOTALL)

# reset ai action in handleDanger
text = text.replace("setAiKeys({ gemini: '', openrouter: '', deepseek: '' })\n", "")

with open("src/pages/admin/Settings.tsx", "w", encoding="utf-8") as f:
    f.write(text)
