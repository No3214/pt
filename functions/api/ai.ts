export const onRequestPost = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { prompt, provider, imageBase64 } = body;

    // Rate Limiting ve Payload boyutu kontrolü
    if (!prompt || typeof prompt !== 'string' || prompt.length > 5000) {
      return new Response(JSON.stringify({ error: 'Geçersiz veya çok büyük payload.' }), { status: 400 });
    }

    if (provider === 'gemini') {
      const key = env.GEMINI_KEY;
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
      const key = env.OPENROUTER_KEY;
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
      const key = env.DEEPSEEK_KEY;
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
