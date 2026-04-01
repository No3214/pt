// ═══════════════ Turkish Food Database ═══════════════
export interface FoodItem {
  name: string; cal: number; p: number; f: number; c: number
}

export const turkishFoods: FoodItem[] = [
  { name: 'Tavuk Göğsü (100g)', cal: 165, p: 31, f: 3.6, c: 0 },
  { name: 'Yumurta (1 adet)', cal: 78, p: 6, f: 5, c: 0.6 },
  { name: 'Pirinç Pilavı (150g)', cal: 195, p: 4, f: 0.4, c: 43 },
  { name: 'Bulgur Pilavı (150g)', cal: 170, p: 5, f: 0.5, c: 37 },
  { name: 'Tam Buğday Ekmeği (1 dilim)', cal: 80, p: 4, f: 1, c: 15 },
  { name: 'Yulaf Ezmesi (40g)', cal: 150, p: 5, f: 2.5, c: 27 },
  { name: 'Lor Peyniri (100g)', cal: 98, p: 11, f: 4, c: 3 },
  { name: 'Beyaz Peynir (30g)', cal: 80, p: 5, f: 6, c: 1 },
  { name: 'Süzme Yoğurt (200g)', cal: 130, p: 20, f: 0.8, c: 9 },
  { name: 'Ton Balığı (1 kutu, 80g)', cal: 90, p: 20, f: 1, c: 0 },
  { name: 'Mercimek Çorbası (1 kase)', cal: 180, p: 12, f: 4, c: 27 },
  { name: 'Kuru Fasulye (1 porsiyon)', cal: 220, p: 14, f: 1, c: 39 },
  { name: 'Nohutlu Pilav (1 porsiyon)', cal: 280, p: 9, f: 5, c: 48 },
  { name: 'Izgara Köfte (3 adet)', cal: 250, p: 22, f: 16, c: 4 },
  { name: 'Salata (zeytinyağsız)', cal: 35, p: 2, f: 0.3, c: 7 },
  { name: 'Zeytinyağı (1 yemek kaşığı)', cal: 120, p: 0, f: 14, c: 0 },
  { name: 'Avokado (yarım)', cal: 120, p: 1.5, f: 11, c: 6 },
  { name: 'Muz (1 adet)', cal: 105, p: 1.3, f: 0.4, c: 27 },
  { name: 'Elma (1 adet)', cal: 95, p: 0.5, f: 0.3, c: 25 },
  { name: 'Badem (20 adet, 28g)', cal: 164, p: 6, f: 14, c: 6 },
  { name: 'Ceviz (5 adet)', cal: 130, p: 3, f: 13, c: 3 },
  { name: 'Fıstık Ezmesi (1 yk)', cal: 95, p: 4, f: 8, c: 3 },
  { name: 'Patates (1 orta, haşlanmış)', cal: 130, p: 3, f: 0.2, c: 30 },
  { name: 'Tatlı Patates (150g)', cal: 135, p: 2, f: 0.1, c: 31 },
  { name: 'Hindi Göğsü (100g)', cal: 135, p: 30, f: 1, c: 0 },
  { name: 'Somon (100g)', cal: 208, p: 20, f: 13, c: 0 },
  { name: 'Makarna (pişmiş, 200g)', cal: 280, p: 10, f: 1.3, c: 56 },
  { name: 'Protein Tozu (1 ölçek)', cal: 120, p: 24, f: 1, c: 3 },
  { name: 'Süt (1 bardak, 200ml)', cal: 120, p: 6, f: 5, c: 12 },
  { name: 'Bal (1 yk)', cal: 64, p: 0, f: 0, c: 17 },
]

// ═══════════════ Workout Splits ═══════════════
export const splits: Record<string, string> = {
  '3gun': `▸ *PZT · Tüm Vücut 1*\n• Goblet Squat 3×10\n• DB Bench Press 3×10\n• RDL 3×10\n\n▸ *ÇAR · Tüm Vücut 2*\n• Split Squat 3×8\n• Lat Pulldown 3×10\n• Hip Thrust 3×12\n\n▸ *CUMA · Tüm Vücut 3*\n• Leg Press 3×12\n• OHP 3×8\n• Core Devre 3×45sn`,
  '4gun': `▸ *PZT · Alt Vücut / Sıçrama*\n• Back Squat 4×6 (RPE 8)\n• Bulgarian Split Squat 3×10\n• Box Jump 4×5\n\n▸ *SALI · Üst Vücut / Core*\n• Bench Press 4×8\n• Barbell Row 4×8\n• Plank 3×45sn\n\n▸ *PER · Alt Vücut / Posterior*\n• RDL 4×8\n• Hip Thrust 4×10\n• Leg Curl 3×12\n\n▸ *CUM · Üst Vücut / Omuz Sağlığı*\n• OHP 4×8\n• Face Pull 3×15\n• Lateral Raise 3×15`,
  voleybol: `▸ *PZT · Patlayıcı Kuvvet*\n• Power Clean 4×3\n• Depth Jump 4×4\n• Med Ball Throw 3×5\n\n▸ *ÇAR · Sahaya Dönüş & Core*\n• Lateral Lunge 3×8\n• Woodchopper 3×12\n• Copenhagen Plank 3×30sn\n\n▸ *CUM · İniş Mekaniği & Mobilite*\n• Drop Freeze 4×5\n• T-Spine Rotation 3×10\n• Banded Walks 3×15`,
}

export const daysArr = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'] as const

// ═══════════════ Utility ═══════════════
export function sanitize(str: string): string {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return doc.body.textContent || ''
}

export function showToastEvent(msg: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: msg }))
}
