import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronRight, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import {
  useListFeaturedProducts,
  useListOffers,
  useListBlogPosts,
  useListCategories,
} from '@workspace/api-client-react';
import { useI18n } from '@/lib/i18n';

const HERO_BG = 'https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg';

const FEATURES = [
  { icon: <Truck size={22} />, title: { sq: 'Transport Falas', en: 'Free Shipping', de: 'Gratis Versand' }, sub: { sq: 'Për porosi mbi €150', en: 'On orders over €150', de: 'Ab €150 Bestellwert' } },
  { icon: <Shield size={22} />, title: { sq: 'Autenticitet i Garantuar', en: 'Guaranteed Authenticity', de: 'Garantierte Echtheit' }, sub: { sq: 'Çdo copë certifikohet', en: 'Every piece certified', de: 'Jedes Stück zertifiziert' } },
  { icon: <RotateCcw size={22} />, title: { sq: 'Kthim 30 Ditë', en: '30-Day Returns', de: '30 Tage Rückgabe' }, sub: { sq: 'Kthim pa pyetje', en: 'No-questions returns', de: 'Rückgabe ohne Fragen' } },
  { icon: <ShoppingBag size={22} />, title: { sq: 'Punë Dore', en: 'Handcrafted', de: 'Handgefertigt' }, sub: { sq: 'Artizanat shqiptar', en: 'Albanian artisanship', de: 'Albanisches Handwerk' } },
];

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function Home() {
  const { t, lang } = useI18n();
  const { data: products, isLoading: prodLoading } = useListFeaturedProducts();
  const { data: offers, isLoading: offersLoading } = useListOffers({ featured: true });
  const { data: blogs, isLoading: blogLoading } = useListBlogPosts();
  const { data: categories } = useListCategories();

  return (
    <div className="w-full flex flex-col">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Pellazgo Collection"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fade} className="flex items-center gap-2 mb-8">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
                {t('hero_badge')}
              </span>
            </motion.div>

            <motion.h1 variants={fade} className="text-6xl md:text-8xl font-serif font-medium leading-[1.05] mb-8">
              {t('hero_h1_1')}<br />
              <em className="gold-gradient-text not-italic">{t('hero_h1_2')}</em>
            </motion.h1>

            <motion.p variants={fade} className="text-lg md:text-xl text-foreground/70 font-light leading-relaxed mb-12 max-w-lg">
              {t('hero_sub')}
            </motion.p>

            <motion.div variants={fade} className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 h-14 px-8 rounded-full bg-primary text-background font-semibold uppercase tracking-widest text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.5)]"
              >
                {t('discover')} <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 h-14 px-8 rounded-full border border-white/20 text-foreground/80 font-medium text-sm hover:border-primary/40 hover:text-primary transition-all"
              >
                {t('our_story')}
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fade} className="flex gap-10 mt-16">
              {[
                { n: '2023', label: { sq: 'Themeluar', en: 'Founded', de: 'Gegründet' } },
                { n: '127+', label: { sq: 'Vlerësime 5★', en: '5★ Reviews', de: '5★ Bewertungen' } },
                { n: '€€€', label: { sq: 'Çmimi', en: 'Price Range', de: 'Preisklasse' } },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-serif gold-gradient-text font-semibold">{s.n}</p>
                  <p className="text-xs uppercase tracking-wider text-foreground/50 mt-1">{(s.label as any)[lang] || s.label.en}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-card/50 border-y border-white/5 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{(f.title as any)[lang] || f.title.en}</p>
                <p className="text-xs text-foreground/50">{(f.sub as any)[lang] || f.sub.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-10">
          <motion.div variants={fade} className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{lang === 'sq' ? 'Koleksioni' : lang === 'de' ? 'Kollektion' : 'Collection'}</p>
              <h2 className="text-4xl font-serif">{t('categories')}</h2>
            </div>
          </motion.div>
          <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(categories || [
              { id: 1, name: 'Çanta', slug: 'bags' },
              { id: 2, name: 'Portofola', slug: 'wallets' },
              { id: 3, name: 'Rripa', slug: 'belts' },
              { id: 4, name: 'Aksesore', slug: 'accessories' },
              { id: 5, name: 'Koleksion i Ri', slug: 'new' },
              { id: 6, name: 'Outlet', slug: 'sale' },
            ]).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-square rounded-2xl bg-card border border-white/5 hover:border-primary/30 overflow-hidden flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShoppingBag size={28} className="text-primary/60 group-hover:text-primary transition-colors" />
                <p className="text-xs font-semibold uppercase tracking-wider text-center px-2 relative z-10">{cat.name}</p>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-card/30 py-20">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-10">
            <motion.div variants={fade} className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{lang === 'sq' ? 'Të Zgjedhura' : lang === 'de' ? 'Ausgewählt' : 'Selected'}</p>
                <h2 className="text-4xl font-serif">{t('featured_products')}</h2>
              </div>
              <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
                {t('shop_all')} <ChevronRight size={14} />
              </Link>
            </motion.div>

            {prodLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {(products || []).slice(0, 8).map((p: any, i: number) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <ProductCard product={p} t={t} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── BRAND STORY BANNER ── */}
      <section className="relative overflow-hidden py-32 px-6 md:px-12">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fade} className="flex justify-center mb-6">
            <div className="h-px w-20 bg-primary self-center" />
            <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center mx-4 shadow-[0_0_24px_rgba(201,168,76,0.4)]">
              <span className="font-serif font-bold text-background text-xl">P</span>
            </div>
            <div className="h-px w-20 bg-primary self-center" />
          </motion.div>
          <motion.h2 variants={fade} className="text-4xl md:text-6xl font-serif mb-6">
            {lang === 'sq' ? 'Artizanat Shqiptar' : lang === 'de' ? 'Albanisches Handwerk' : 'Albanian Craftsmanship'}
          </motion.h2>
          <motion.p variants={fade} className="text-lg text-foreground/60 leading-relaxed mb-10">
            {lang === 'sq'
              ? 'Pellazgo lindi nga dashuria ndaj traditat shqiptare. Çdo çantë, çdo rrip, çdo portofol — punuar me dorë nga zejtarët tanë në Vushtrri, Kosovë.'
              : lang === 'de'
              ? 'Pellazgo entstand aus der Liebe zu albanischen Traditionen. Jede Tasche, jeder Gürtel, jede Brieftasche — handgefertigt von unseren Handwerkern in Vushtrri, Kosovo.'
              : 'Pellazgo was born from a love of Albanian traditions. Every bag, every belt, every wallet — handcrafted by our artisans in Vushtrri, Kosovo.'}
          </motion.p>
          <motion.div variants={fade}>
            <Link href="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary font-semibold hover:gap-4 transition-all">
              {t('our_story')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── OFFERS ── */}
      {!offersLoading && offers && offers.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-8">
            <motion.div variants={fade} className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{lang === 'sq' ? 'Ekskluzive' : lang === 'de' ? 'Exklusiv' : 'Exclusive'}</p>
                <h2 className="text-4xl font-serif">{t('offers')}</h2>
              </div>
              <Link href="/offers" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                {t('view_all')} <ChevronRight size={14} />
              </Link>
            </motion.div>
            <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.slice(0, 3).map((o: any) => (
                <Link key={o.id} href="/offers" className="group glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{o.discount}</p>
                  <h3 className="text-lg font-serif mb-2 group-hover:text-primary transition-colors">{o.title}</h3>
                  <p className="text-sm text-foreground/50 line-clamp-2">{o.description}</p>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ── BLOG ── */}
      {!blogLoading && blogs && blogs.length > 0 && (
        <section className="bg-card/30 py-20">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-8">
              <motion.div variants={fade} className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{lang === 'sq' ? 'Artikuj' : lang === 'de' ? 'Artikel' : 'Articles'}</p>
                  <h2 className="text-4xl font-serif">Blog</h2>
                </div>
                <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                  {t('view_all')} <ChevronRight size={14} />
                </Link>
              </motion.div>
              <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.slice(0, 3).map((b: any) => (
                  <Link key={b.id} href={`/blog/${b.id}`} className="group flex flex-col gap-4 rounded-2xl bg-card border border-white/5 overflow-hidden hover:border-primary/20 transition-all">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="px-5 pb-5">
                      <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">{b.category}</p>
                      <h3 className="font-serif text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">{b.title}</h3>
                      <p className="text-sm text-foreground/50 mt-2 line-clamp-2">{b.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-card/50 border-t border-white/5 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center">
                <span className="font-serif font-bold text-background text-lg">P</span>
              </div>
              <span className="font-serif text-xl tracking-widest gold-gradient-text">PELLAZGO</span>
            </div>
            <p className="text-sm text-foreground/50 max-w-xs leading-relaxed">
              {lang === 'sq' ? 'Elegancë e përjetshme. Aksesore luksoz lëkure të punuara me dorë. Artizanat shqiptar i klasit botëror.' : lang === 'de' ? 'Zeitlose Eleganz. Luxuriöse handgefertigte Lederaccessoires. Albanisches Handwerk von Weltklasse.' : 'Timeless elegance. Luxury handcrafted leather accessories. World-class Albanian artisanship.'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4 text-foreground/50">{lang === 'sq' ? 'Lidhjet' : lang === 'de' ? 'Links' : 'Links'}</p>
            <div className="flex flex-col gap-3">
              {[['/', t('home')], ['/shop', t('shop')], ['/about', t('about')], ['/blog', 'Blog']].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-foreground/60 hover:text-primary transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4 text-foreground/50">{t('contact')}</p>
            <div className="flex flex-col gap-2 text-sm text-foreground/50">
              <p>Vushtrri, Mitrovicë</p>
              <p>Kosovo — XK 42000</p>
              <p className="mt-2">info@pellazgo.com</p>
              <p>+383 44 000 000</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/30">© 2025 Pellazgo. {lang === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : lang === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</p>
          <div className="flex gap-2">
            {(['sq', 'en', 'de'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${lang === l ? 'bg-primary text-background border-primary' : 'border-white/10 text-foreground/40 hover:border-primary/30'}`}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product: p, t }: { product: any; t: (k: any) => string }) {
  const { lang } = useI18n();
  return (
    <Link href={`/shop/${p.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card">
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {p.originalPrice && (
          <div className="absolute top-3 left-3 bg-primary text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {lang === 'sq' ? 'Zbritje' : lang === 'de' ? 'Sale' : 'Sale'}
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-background/90 backdrop-blur-md rounded-xl px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-primary">
            {t('add_to_cart')}
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs text-foreground/40 uppercase tracking-wider mb-1">{p.category}</p>
        <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{p.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-primary font-semibold">€{p.price.toFixed(2)}</span>
          {p.originalPrice && <span className="text-foreground/40 text-xs line-through">€{p.originalPrice.toFixed(2)}</span>}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="fill-primary text-primary" />
          <span className="text-xs text-foreground/40">{p.rating.toFixed(1)} ({p.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
