import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/useStore';
import { tenantConfig } from '../config/tenant';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'kvkk' | 'terms';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const dm = useStore(s => s.darkMode);
  const brandName = tenantConfig.brand.name;
  const email = tenantConfig.brand.contact.email;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-4 md:inset-x-auto md:inset-y-8 md:max-w-2xl md:mx-auto z-[401] rounded-2xl border overflow-hidden flex flex-col ${
              dm
                ? 'bg-[#111] border-white/[0.08] text-white'
                : 'bg-white border-black/[0.06] text-[#1C1917]'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <h2 className="font-display text-xl font-bold">
                {type === 'kvkk' ? 'KVKK & Gizlilik Politikası' : 'Kullanım Koşulları'}
              </h2>
              <button
                onClick={onClose}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer ${
                  dm ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-[#1C1917] hover:bg-black/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
              {type === 'kvkk' ? (
                <KVKKContent brandName={brandName} email={email} dm={dm} />
              ) : (
                <TermsContent brandName={brandName} email={email} dm={dm} />
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-white rounded-full text-[0.82rem] font-semibold border-none cursor-pointer transition-all hover:shadow-lg"
              >
                Anladım, Kapat
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ children, dm }: { children: React.ReactNode; dm: boolean }) {
  return <h3 className={`text-[1rem] font-display font-bold mt-6 mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{children}</h3>;
}

function P({ children, dm }: { children: React.ReactNode; dm: boolean }) {
  return <p className={`text-[0.85rem] leading-[1.8] mb-3 ${dm ? 'text-white/50' : 'text-[#1C1917]/60'}`}>{children}</p>;
}

function KVKKContent({ brandName, email, dm }: { brandName: string; email: string; dm: boolean }) {
  return (
    <div>
      <P dm={dm}>
        Son güncelleme: 7 Nisan 2026
      </P>
      <P dm={dm}>
        {brandName} olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin güvenliğine büyük önem vermekteyiz. Bu politika, kişisel verilerinizin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır.
      </P>

      <SectionTitle dm={dm}>1. Veri Sorumlusu</SectionTitle>
      <P dm={dm}>
        Veri sorumlusu olarak {brandName}, pt.kozbeylikonagi.com.tr internet sitesi üzerinden toplanan tüm kişisel verilerden sorumludur. İletişim: {email}
      </P>

      <SectionTitle dm={dm}>2. Toplanan Kişisel Veriler</SectionTitle>
      <P dm={dm}>
        Hizmetlerimiz kapsamında aşağıdaki kişisel veriler toplanabilmektedir: Ad, soyad ve iletişim bilgileri (e-posta, telefon); sağlık ve fiziksel ölçüm verileri (boy, kilo, vücut analizi); antrenman ve beslenme kayıtları; form onay videoları ve gelişim fotoğrafları; çerez verileri ve site kullanım istatistikleri.
      </P>

      <SectionTitle dm={dm}>3. Verilerin İşlenme Amacı</SectionTitle>
      <P dm={dm}>
        Kişisel verileriniz şu amaçlarla işlenmektedir: Kişiye özel antrenman ve beslenme programı oluşturulması; performans takibi ve ilerleme analizi; randevu ve iletişim yönetimi; hizmet kalitesinin artırılması; yasal yükümlülüklerin yerine getirilmesi.
      </P>

      <SectionTitle dm={dm}>4. Verilerin Aktarılması</SectionTitle>
      <P dm={dm}>
        Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmamaktadır. Veriler yurt içindeki güvenli sunucularda saklanmaktadır.
      </P>

      <SectionTitle dm={dm}>5. Veri Saklama Süresi</SectionTitle>
      <P dm={dm}>
        Kişisel verileriniz, hizmet ilişkisi devam ettiği sürece ve yasal saklama süreleri boyunca muhafaza edilir. Hizmet ilişkisi sona erdikten sonra, yasal zorunluluklar saklı kalmak kaydıyla verileriniz silinir veya anonim hale getirilir.
      </P>

      <SectionTitle dm={dm}>6. Haklarınız (KVKK Madde 11)</SectionTitle>
      <P dm={dm}>
        KVKK'nın 11. maddesi uyarınca şu haklara sahipsiniz: Kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse bilgi talep etme; işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme; verilerin düzeltilmesini, silinmesini veya yok edilmesini isteme; işlenen verilerin aktarıldığı üçüncü kişileri bilme; verilerin eksik veya yanlış işlenmesi halinde düzeltilmesini isteme.
      </P>

      <SectionTitle dm={dm}>7. Çerez Politikası</SectionTitle>
      <P dm={dm}>
        Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Zorunlu çerezler sitenin çalışması için gereklidir. Analitik çerezler ziyaret istatistiklerini toplar. Pazarlama çerezleri kişiselleştirilmiş içerik sunumu sağlar. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
      </P>

      <SectionTitle dm={dm}>8. İletişim</SectionTitle>
      <P dm={dm}>
        KVKK kapsamındaki talepleriniz için {email} adresine e-posta göndererek bize ulaşabilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanacaktır.
      </P>
    </div>
  );
}

function TermsContent({ brandName, email, dm }: { brandName: string; email: string; dm: boolean }) {
  return (
    <div>
      <P dm={dm}>
        Son güncelleme: 7 Nisan 2026
      </P>
      <P dm={dm}>
        Bu web sitesini (pt.kozbeylikonagi.com.tr) kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Lütfen bu koşulları dikkatlice okuyunuz.
      </P>

      <SectionTitle dm={dm}>1. Hizmet Tanımı</SectionTitle>
      <P dm={dm}>
        {brandName}, kişiye özel antrenman programları, beslenme danışmanlığı ve performans koçluğu hizmetleri sunmaktadır. Tüm programlar bireysel değerlendirme sonucu hazırlanır ve kişiye özeldir.
      </P>

      <SectionTitle dm={dm}>2. Üyelik ve Hesap</SectionTitle>
      <P dm={dm}>
        Portal erişimi için oluşturulan hesap bilgileri kişiye özeldir ve üçüncü kişilerle paylaşılamaz. Hesabınızın güvenliğinden siz sorumlusunuz. Şüpheli bir durum fark ettiğinizde derhal {email} adresine bildirmeniz gerekmektedir.
      </P>

      <SectionTitle dm={dm}>3. Ödeme Koşulları</SectionTitle>
      <P dm={dm}>
        Hizmet bedelleri aylık olarak tahsil edilir. Ödeme yapıldıktan sonra ilgili dönem için hizmet başlatılır. İade politikası hizmet sözleşmesinde belirtilen koşullara tabidir.
      </P>

      <SectionTitle dm={dm}>4. Sağlık Uyarısı</SectionTitle>
      <P dm={dm}>
        Sunulan antrenman ve beslenme programları, tıbbi tavsiye niteliği taşımamaktadır. Herhangi bir sağlık sorununuz varsa programa başlamadan önce doktorunuza danışmanız önerilir. {brandName}, sağlık sorunlarından kaynaklanan durumlardan sorumlu tutulamaz.
      </P>

      <SectionTitle dm={dm}>5. Fikri Mülkiyet</SectionTitle>
      <P dm={dm}>
        Bu web sitesindeki tüm içerik (metin, görsel, tasarım, logo, yazılım) {brandName}'a aittir ve telif hakkı ile korunmaktadır. İçeriklerin izinsiz kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.
      </P>

      <SectionTitle dm={dm}>6. Sorumluluk Sınırı</SectionTitle>
      <P dm={dm}>
        {brandName}, web sitesinin kesintisiz ve hatasız çalışacağını garanti etmez. Teknik aksaklıklardan kaynaklanan veri kaybı veya erişim sorunları için sorumluluk kabul edilmez. Antrenman programlarının uygulanmasından doğan fiziksel yaralanmalar kullanıcının kendi sorumluluğundadır.
      </P>

      <SectionTitle dm={dm}>7. Değişiklik Hakkı</SectionTitle>
      <P dm={dm}>
        {brandName}, bu kullanım koşullarını önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Güncel koşullar her zaman bu sayfada yayınlanır.
      </P>

      <SectionTitle dm={dm}>8. Uygulanacak Hukuk</SectionTitle>
      <P dm={dm}>
        Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir.
      </P>

      <SectionTitle dm={dm}>9. İletişim</SectionTitle>
      <P dm={dm}>
        Sorularınız için {email} adresinden bize ulaşabilirsiniz.
      </P>
    </div>
  );
}
