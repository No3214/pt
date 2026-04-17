# Bug Hunts

## BUG-001: Hero-About Whitespace Gap
- **Status**: Open
- **Severity**: Medium (visual)
- **Description**: Excessive whitespace between Hero and About sections on landing page
- **Location**: Between Hero.tsx and About.tsx sections
- **Steps to reproduce**: Load landing page, scroll down past hero
- **Root cause**: TBD — likely padding/margin overlap or section divider
- **Fix**: TBD

## BUG-002: Preloader on Every Route Change
- **Status**: Open
- **Severity**: High (UX)
- **Description**: The Ela Ebeoğlu animated preloader (circle animation, "HAZIR 100%") triggers on every full page navigation, not just initial load
- **Location**: src/components/Preloader.tsx
- **Expected behavior**: Preloader should only show on first site load
- **Root cause**: Preloader component likely re-mounts on every route change without session check
- **Fix**: Add sessionStorage flag to track if preloader has already shown
