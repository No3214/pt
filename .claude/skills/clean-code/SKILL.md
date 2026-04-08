# Clean Code Skill

Write clean, maintainable code for the PT project.

## Naming
- Components: PascalCase (ClientAlerts, AIChat)
- Hooks: camelCase with use prefix (useStore, useTranslation)
- Constants: UPPER_SNAKE (MAX_RETRIES)
- Files: PascalCase for components, camelCase for utils
- Boolean vars: is/has/can prefix (isLoading, hasError)

## Functions
- Single responsibility: one function, one job
- Under 30 lines preferred
- Max 3 parameters; use object for more
- Early returns to reduce nesting
- Descriptive names: calculateTDEE not calc

## Components
- Under 150 lines; extract sub-components
- Props interface defined above component
- Default exports for page components
- Named exports for shared components

## Error Handling
- Try/catch on all async operations
- User-friendly error messages (Turkish + English)
- Toast notifications for user feedback
- console.error for debugging, never console.log in production

## Comments
- Why, not what
- JSDoc for public APIs
- TODO with ticket/issue reference
- No commented-out code in production

## DRY
- Extract repeated logic into custom hooks
- Shared UI patterns in components/common/
- Constants in lib/constants.ts
- No magic numbers: use named constants
