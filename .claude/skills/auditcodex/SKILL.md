---
name: auditcodex
description: Send recent work to a secondary AI (Codex/GPT) for independent code review. Triggers on audit, review, kontrol, denetle, codex.
allowedTools:
  - Bash(git:*)
  - Bash(codex:*)
---
# AuditCodex — Cross-AI Code Review

## Pattern: Claude builds → Secondary AI reviews independently

## Phase 1: Gather Context
```bash
git diff HEAD
git log --oneline -10
git status --short
```

## Phase 2: Prepare Summary
Review diffs and commits. Create concise summary of what changed.

## Phase 3: Run Audit
Send diff to secondary reviewer with prompt:
"Review for bugs, security issues, performance problems, logic errors, style concerns."
Strict read-only: NO file edits, NO commits, NO destructive ops.

## Phase 4: Validate Findings
CRITICAL: Secondary AI has limited context. For each finding:
- Confirm issue exists in actual source code
- Check CLAUDE.md and project docs for context
- Distinguish real bugs from misunderstandings
- Assess if finding is meaningful or trivial

## Phase 5: Present Results
Show validated findings with justifications.
Report if code passes or list actionable issues.

## PT Project Specifics
- Check XSS sanitization on user inputs
- Verify AI council anti-hallucination prompts present
- Confirm createPortal usage for modals/lightbox
- Validate i18n keys exist in all 13 locale files
- Check Cloudflare build compatibility (no Node-only APIs in client)