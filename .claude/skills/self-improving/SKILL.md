---
name: self-improving
description: 2026 continuous improvement loop PT. Triggers on improve, iyileştir, öğren, pattern.
---
# Self-Improving Agent — 2026 PT

## Loop
Code → Audit → Fix → Learn → Improve → Repeat

## After Every Task
1. **Extract pattern** — ne işe yaradı? neden başarısız oldu?
2. **Update CLAUDE.md** working memory — sürekli geçerli kural
3. **Add to SKILL.md** — spesifik domain bilgisi
4. **Add to `.auto-memory/feedback.md`** — iletişim kuralı
5. **Update `.auto-memory/projects.md`** — proje bilgisi

## Pattern Kaydetme Şablonu
```md
## Pattern: [isim]
- **Trigger**: Ne zaman uygulanır?
- **Context**: Hangi PT subsystem?
- **Solution**: Kod/komut örneği
- **Anti-pattern**: Yapma!
- **Source**: Task #, commit hash, date
```

## Örnek — Yeni Pattern
```md
## Pattern: React 19 ref as prop
- **Trigger**: Yeni component + ref forwarding
- **Context**: React 19'da forwardRef deprecate
- **Solution**: `function Input({ ref, ...props }: { ref?: Ref<HTMLInputElement> })`
- **Anti-pattern**: `forwardRef((props, ref) => ...)`
- **Source**: Task 2, skill-upgrade, 2026-04-17
```

## Memory Files
- `.auto-memory/user-profile.md` — Yunuscan profili
- `.auto-memory/projects.md` — BOT/PT/WEB/OTEL detay
- `.auto-memory/feedback.md` — iletişim kuralı
- `.auto-memory/patterns.md` — yeni: tekrarlayan çözümler

## Review Cadence
- **Günlük**: patterns.md tarama
- **Haftalık**: CLAUDE.md update
- **Aylık**: SKILL.md refresh (yeni 2026 pattern)
- **Release**: consolidate-memory skill çalıştır

## Learning Sources
1. **User feedback** — "böyle yapma", "şu şekilde istiyorum"
2. **Task failure** — hata → root cause → pattern kaydet
3. **New Claude/React release** — 4.7, 4.8, React 20
4. **Industry practice** — Core Web Vitals v5, TC39 proposal

## Metrics
- Task completion time ↓
- Error rate ↓
- User satisfaction ↑
- Pattern reuse frequency ↑
- Code quality score (Lighthouse, CodeClimate) ↑

## Anti-Pattern
- Aynı hatayı 2 kez yapma (kayıt et)
- Eski pattern'ı yeni koşulda uygulama (version check)
- Memory file şişirme (relevant only, 1y+ eskiyi arşivle)
