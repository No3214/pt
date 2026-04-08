---
name: i18n-manager
description: Manage 13-language i18n. Triggers on çeviri, translation, dil, language, i18n.
autoTrigger: true
---
# i18n — 13 langs: tr en es fr de it pt ru zh ja ar ko hi
## Turkish first (source of truth). Every key in ALL 13 files.
## Usage: const t = translations[lang]; then t.section.key
## RTL: Arabic needs dir="rtl" consideration
## Files: src/locales/*.ts + index.ts