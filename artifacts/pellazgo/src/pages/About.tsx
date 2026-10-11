import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const HERO = 'https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg';

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

export function About() {
  const { lang } = useI18n();

  const content = {
    sq: {
      badge: 'Historia Jonë',
      h1: 'Artizanat Shqiptar, Elegancë Universale',
      p1: 'Pellazgo lindi në Vushtrri, Kosovë — një qytet me tradita të pasura zejtarisë. Themeluar në vitin 2023 nga pasioni për lëkurën dhe artizanatin shqiptar, Pellazgo është bërë simbol i luksorit autentik.',
      p2: 'Çdo copë që dalë nga dyert tona është punuar me dorë nga zejtarët tanë me dekada përvojë. Ne besojmë se luksoja e vërtetë nuk ndodhet në markat e famshme — por në artizanatin, kujdesin dhe trashëgiminë.',
      p3: 'Pellazgo nuk është vetëm një markë — është një histori e Shqipërisë, e Ko sovës, e kulturës sonë të pasur. Çdo rrip, çdo çantë, çdo portofol mbart veten e artizanit që e ka krijuar.',
      values: [
        { title: 'Punë Dore', desc: 'Çdo copë punuar me dorë nga zejtarët shqiptarë me dekada përvojë.' },
        { title: 'Lëkurë Premium', desc: 'Vetëm lëkura të cilësisë më të lartë nga burime italiane dhe vendore.' },
        { title: 'Trashëgimi', desc: 'Ruajmë teknikat tradicionale shqiptare duke i kombinuar me dizajn modern.' },
        { title: 'Qëndrueshmëria', desc: 'Produkte të krijuara për të zgjatur — investim, jo konsum.' },
      ],
      cta: 'Shiko Koleksionin',
    },
    en: {
      badge: 'Our Story',
      h1: 'Albanian Craftsmanship, Universal Elegance',
      p1: 'Pellazgo was born in Vushtrri, Kosovo — a city with rich artisan traditions. Founded in 2023 from a passion for leather and Albanian craftsmanship, Pellazgo has become a symbol of authentic luxury.',
      p2: 'Every piece that leaves our doors is handcrafted by our artisans with decades of experience. We believe that true luxury lies not in famous brands — but in craftsmanship, care, and heritage.',
      p3: 'Pellazgo is not just a brand — it is a story of Albania, of Kosovo, of our rich culture. Every belt, every bag, every wallet carries within it the spirit of the artisan who created it.',
      values: [
        { title: 'Handcrafted', desc: 'Every piece handmade by Albanian artisans with decades of experience.' },
        { title: 'Premium Leather', desc: 'Only the highest quality leather from Italian and local sources.' },
        { title: 'Heritage', desc: 'We preserve traditional Albanian techniques combined with modern design.' },
        { title: 'Durability', desc: 'Products made to last — an investment, not consumption.' },
      ],
      cta: 'View Collection',
    },
    de: {
      badge: 'Unsere Geschichte',
      h1: 'Albanisches Handwerk, Universelle Eleganz',
      p1: 'Pellazgo entstand in Vushtrri, Kosovo — einer Stadt mit reichen Handwerkstraditionen. Gegründet 2023 aus der Leidenschaft für Leder und albanisches Handwerk, ist Pellazgo zum Symbol für authentischen Luxus geworden.',
      p2: 'Jedes Stück, das unsere Türen verlässt, wird von unseren Handwerkern mit jahrzehntelanger Erfahrung handgefertigt. Wir glauben, dass echter Luxus nicht in berühmten Marken liegt — sondern in Handwerk, Sorgfalt und Erbe.',
      p3: 'Pellazgo ist nicht nur eine Marke — es ist eine Geschichte Albaniens, des Kosovos, unserer reichen Kultur. Jeder Gürtel, jede Tasche, jede Brieftasche trägt den Geist des Handwerkers, der sie geschaffen hat.',
      values: [
        { title: 'Handgefertigt', desc: 'Jedes Stück handgefertigt von albanischen Handwerkern.' },
        { title: 'Premium-Leder', desc: 'Nur höchste Lederqualität aus italienischen und lokalen Quellen.' },
        { title: 'Erbe', desc: 'Wir bewahren traditionelle albanische Techniken kombiniert mit modernem Design.' },
        { title: 'Langlebigkeit', desc: 'Produkte, die halten — eine Investition, kein Konsum.' },
      ],
      cta: 'Kollektion ansehen',
    },
  };

  const c = content[lang] || content.en;

  return (
    <div className="w-full flex flex-col">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO} alt="Pellazgo Atelier" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pb-16">
          <motion.div initial="hidden" animate="visible" variants={fade}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-primary">{c.badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium">{c.h1}</h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="flex flex-col gap-8">
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/80">{c.p1}</p>
          <p className="text-lg leading-relaxed text-foreground/60">{c.p2}</p>
          <p className="text-lg leading-relaxed text-foreground/60">{c.p3}</p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-card/30 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-white/5"
              >
                <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-background font-serif font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="font-serif text-xl">{v.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-4xl font-serif mb-6">{lang === 'sq' ? 'Zbuloni Koleksionin' : lang === 'de' ? 'Entdecken Sie die Kollektion' : 'Discover the Collection'}</h2>
          <Link href="/shop" className="inline-flex items-center gap-3 h-14 px-10 rounded-full bg-primary text-background font-semibold uppercase tracking-widest text-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] transition-all">
            {c.cta} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
