# Skill & MCP Kurulum Rehberi

## Hemen Yapılabilecekler (Terminal'de çalıştır)

### 1. Nano-Banana-MCP (AI Image Generation)
```bash
# Claude Code settings'e ekle (.claude/settings.json veya claude mcp add):
claude mcp add nano-banana -- npx nano-banana-mcp

# Veya manuel: .claude/settings.json'a ekle:
# "mcpServers": {
#   "nano-banana": {
#     "command": "npx",
#     "args": ["nano-banana-mcp"],
#     "env": { "GEMINI_API_KEY": "senin-gemini-key" }
#   }
# }
```
> Gemini API key al: https://aistudio.google.com/apikey

### 2. Figma MCP (Zaten bağlı ✅)
Cowork'te zaten aktif. Kullanım:
- `get_design_context` — Figma tasarımlarını çek
- `get_screenshot` — Figma frame screenshot
- `search_design_system` — Design system ara

### 3. shadcn/ui MCP (Zaten bağlı ✅)
Cowork'te aktif. Kullanım:
- `list_components` — Tüm component listesi
- `get_component` — Component kodu al
- `get_block` — Hazır block'lar
- `apply_theme` — Tema uygula

### 4. Vercel MCP (Zaten bağlı ✅)
Deploy ve preview.

### 5. Supabase MCP (Zaten bağlı ✅)
Database, edge functions, migrations.

## Terminal'de Çalıştırılacak Komutlar

Aşağıdaki komutları PowerShell veya CMD'de çalıştır:

```powershell
# PT proje dizinine git
cd "C:\Users\HP Pavilion\Desktop\pt"

# shadcn/ui init (eğer henüz yapılmadıysa)
npx shadcn@latest init

# Nano-Banana-MCP kur
claude mcp add nano-banana -- npx nano-banana-mcp
```

## Notlar
- Cowork mode'dan CLI komutları çalıştırılamaz
- MCP server'lar Claude Code oturumunda eklenir
- Skill'ler `.claude/skills/` dizininde zaten 30+ tane var
- Figma, shadcn/ui, Vercel, Supabase, Cloudflare, Notion, Slack MCP'leri zaten aktif
