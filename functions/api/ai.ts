export const onRequestPost = async (context) => {
  try {
    const { request, env } = context;

    // 1. Dışarıdan (CURL/Postman) veya başka sitelerden gelen istekleri engelle (CORS Hardening)
    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    
    const isValidSource = origin.includes('localhost') || origin.includes('pages.dev') || origin.includes('kozbeylikonagi.com.tr') ||
                          referer.includes('localhost') || referer.includes('pages.dev') || referer.includes('kozbeylikonagi.com.tr');
                          
    if (!isValidSource) {
      return new Response(JSON.stringify({ error: 'Yetkisiz erişim kaynağı (CORS/Abuse koruması).' }), { status: 403 });
    }

    const body = await request.json();
    const { prompt, provider, imageBase64 } = body;

    // 2. Korumalı Provider Listesi (Injection Önlemi)
    const allowedProviders = ['gemini', 'openrouter', 'deepseek'];
    if (!allowedProviders.includes(provider)) {
      return new Response(JSON.stringify({ error: 'Bilinmeyen veya yetkisiz AI sağlayıcısı.' }), { status: 400 });
    }

    // 3. Katı Payload Limiti (Prompt boyutu 5000'den 3000'e çekildi)
    if (!prompt || typeof prompt !== 'string' || prompt.length > 3000) {
      return new Response(JSON.stringify({ error: 'Geçersiz veya çok büyük payload (Max 3000 karakter).' }), { status: 400 });
    }

    if (provider === 'gemini') {
      const key = request.headers.get('X-Gemini-Key') || env.GEMINI_KEY;
      if (!key) return new Response(JSON.stringify({ error: 'GEMINI API anahtarı ayarlanmamış.' }), { status: 500 });
      const parts = [{ text: prompt }];
      if (imageBase64) parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return new Response(JSON.stringify({ result: data.candidates[0].content.parts[0].text.trim() }));
    }

    if (provider === 'openrouter') {
      const key = request.headers.get('X-OpenRouter-Key') || env.OPENROUTER_KEY;
      if (!key) return new Response(JSON.stringify({ error: 'OPENROUTER API anahtarı ayarlanmamış.' }), { status: 500 });
      const content = imageBase64
        ? [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + imageBase64 } }]
        : prompt;
      
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ model: 'anthropic/claude-sonnet-4', messages: [{ role: 'user', content }] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return new Response(JSON.stringify({ result: data.choices[0].message.content.trim() }));
    }

    if (provider === 'deepseek') {
      const key = request.headers.get('X-DeepSeek-Key') || env.DEEPSEEK_KEY;
      if (!key) return new Response(JSON.stringify({ error: 'DEEPSEEK API anahtarı ayarlanmamış.' }), { status: 500 });
      
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return new Response(JSON.stringify({ result: data.choices[0].message.content.trim() }));
    }

    return new Response(JSON.stringify({ error: 'Desteklenmeyen sağlayıcı.' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Sunucu hatası: ' + err.message }), { status: 500 });
  }
}
