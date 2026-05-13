import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'

export default function MarketingKit({ slug }: { slug: string }) {
  const { darkMode: dm } = useStore()
  const publicUrl = `${window.location.origin}/p/${slug}`

  const kits = [
    {
      title: 'Instagram Bio Linki',
      desc: 'Instagram profilinize eklemek için en ideal link.',
      link: publicUrl,
      btn: 'Linki Kopyala'
    },
    {
      title: 'WhatsApp Tanıtım Mesajı',
      desc: 'Yeni adaylara gönderebileceğiniz profesyonel taslak.',
      link: `Selam! Benimle online koçluk süreci hakkında detaylı bilgiye buradan ulaşabilirsin: ${publicUrl}`,
      btn: 'Taslağı Kopyala'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Kopyalandı! 🚀')
  }

  return (
    <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
      <h2 className="font-display text-2xl font-bold mb-8">Pazarlama Kiti 🛠️</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {kits.map((kit, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${dm ? 'bg-white/5 border-white/5' : 'bg-bg border-black/5'}`}>
            <h4 className="font-bold mb-2">{kit.title}</h4>
            <p className="text-xs opacity-40 mb-6 leading-relaxed">{kit.desc}</p>

            <div className={`p-4 rounded-xl mb-6 text-xs font-mono break-all line-clamp-2 ${dm ? 'bg-black/20' : 'bg-black/5'}`}>
              {kit.link}
            </div>

            <button
              onClick={() => copyToClipboard(kit.link)}
              className="w-full py-3 rounded-xl bg-primary text-white text-[0.65rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
            >
              {kit.btn}
            </button>
          </div>
        ))}

        <div className={`p-6 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${dm ? 'border-white/10' : 'border-black/10'}`}>
           <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center text-white text-3xl mb-4">
             📱
           </div>
           <h4 className="font-bold text-sm mb-1">Dinamik QR Kod</h4>
           <p className="text-[0.6rem] opacity-40">Salonunuzdaki afişler için otomatik oluşturulur.</p>
           <button className="mt-4 text-xs font-bold text-primary">QR İndir (Yakında)</button>
        </div>
      </div>
    </div>
  )
}
