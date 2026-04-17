# Lessons Learned

## 2026-04-09

### Git on Windows via Desktop Commander
- **Problem**: PowerShell doesn't capture git output properly
- **Solution**: Use Git Bash via `& 'C:\Program Files\Git\bin\bash.exe' -c "..."` and redirect to file, then read file separately
- **Pattern**: Always redirect to temp file → read with Get-Content

### Lock Files
- **Problem**: `.git/ORIG_HEAD.lock` blocks git operations
- **Solution**: `rm -f .git/ORIG_HEAD.lock` via Git Bash before pull
- **Prevention**: Don't interrupt git operations

### Screenshot Tool Viewport Desync
- **Problem**: Browser screenshots show blank after JS scrollTo()
- **Root cause**: Screenshot tool viewport doesn't sync with JS scroll position
- **Workaround**: Use DOM inspection (JS) to verify content instead of relying on screenshots after scroll

### Leads Page Data Source
- **Problem**: Injected leads into localStorage Zustand store but component shows 0
- **Root cause**: Leads component reads from Supabase, not localStorage
- **Lesson**: Always check data source in component before injecting test data
