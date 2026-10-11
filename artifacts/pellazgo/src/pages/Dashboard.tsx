import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Heart, Star, TrendingUp, Package, Clock,
  ChevronRight, ArrowUpRight, Crown, Sparkles, Gift
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import {
  useGetLoyaltyAccount,
  useListOrders,
  useListFavorites,
  useGetDashboardStats,
  useListFeaturedProducts,
} from '@workspace/api-client-react';

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const TIER_COLORS: Record<string, string> = {
  Bronze: 'from-amber-700 to-amber-500',
  Silver: 'from-slate-400 to-slate-300',
  Gold: 'from-yellow-600 to-yellow-400',
  Platinum: 'from-violet-500 to-indigo-400',
};

export function Dashboard() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const { data: loyalty } = useGetLoyaltyAccount();
  const { data: orders } = useListOrders();
  const { data: favorites } = useListFavorites();
  const { data: stats } = useGetDashboardStats();
  const { data: products } = useListFeaturedProducts();

  const tier = loyalty?.tier || 'Bronze';
  const tierGradient = TIER_COLORS[tier] || TIER_COLORS.Bronze;
  const points = loyalty?.points || user?.loyaltyPoints || 0;
  const nextTierPoints = tier === 'Bronze' ? 500 : tier === 'Silver' ? 1500 : tier === 'Gold' ? 5000 : 99999;
  const progress = Math.min((points / nextTierPoints) * 100, 100);

  const kpis = [
    {
      icon: <Package size={20} />,
      label: t('total_orders'),
      value: orders?.length || 0,
      href: '/orders',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: <Heart size={20} />,
      label: t('saved_items'),
      value: favorites?.length || 0,
      href: '/favorites',
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
    },
    {
      icon: <Star size={20} />,
      label: t('loyalty_points'),
      value: points.toLocaleString(),
      href: '/loyalty',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: <Gift size={20} />,
      label: lang === 'sq' ? 'Karta Dhuratë' : lang === 'de' ? 'Geschenkkarten' : 'Gift Cards',
      value: lang === 'sq' ? 'Blej' : lang === 'de' ? 'Kaufen' : 'Buy',
      href: '/gift-cards',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-10">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">

        {/* Welcome header */}
        <motion.div variants={fade} className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-1">{t('welcome_back')}</p>
            <h1 className="text-4xl md:text-5xl font-serif">{user?.name || 'Pellazgo'}</h1>
            <p className="text-foreground/50 text-sm mt-2 flex items-center gap-2">
              <Crown size={14} className="text-primary" />
              {tier} Member · {lang === 'sq' ? 'Anëtar që nga' : lang === 'de' ? 'Mitglied seit' : 'Member since'} {user?.memberSince}
            </p>
          </div>
          <Link
            href="/ai"
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full gold-gradient-bg text-background text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105 transition-transform"
          >
            <Sparkles size={14} /> Pellazgo AI
          </Link>
        </motion.div>

        {/* KPI grid */}
        <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <Link key={i} href={k.href} className="group glass-panel rounded-2xl p-5 border border-white/5 hover:border-primary/20 transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center ${k.color} mb-4`}>
                {k.icon}
              </div>
              <p className="text-2xl font-serif font-semibold">{k.value}</p>
              <p className="text-xs text-foreground/50 mt-1">{k.label}</p>
              <div className="flex items-center gap-1 mt-3 text-[10px] uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {t('view_all')} <ArrowUpRight size={10} />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Loyalty card */}
        <motion.div variants={fade} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${tierGradient} p-8 md:p-10`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-white/80" />
                <p className="text-xs uppercase tracking-[0.3em] text-white/70 font-semibold">{tier} MEMBER</p>
              </div>
              <p className="text-5xl font-serif text-white font-semibold">{points.toLocaleString()}</p>
              <p className="text-white/70 text-sm mt-1">{lang === 'sq' ? 'pikë besnikërie' : lang === 'de' ? 'Treuepunkte' : 'loyalty points'}</p>

              {/* Progress to next tier */}
              <div className="mt-6 max-w-xs">
                <div className="flex justify-between text-[10px] text-white/60 mb-2">
                  <span>{tier}</span>
                  <span>{nextTierPoints.toLocaleString()} {lang === 'sq' ? 'për nivelin tjetër' : lang === 'de' ? 'für nächste Stufe' : 'for next tier'}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-right">
              <div className="font-mono text-sm text-white/60 tracking-widest">PELLAZGO · {user?.name?.toUpperCase().substring(0, 12)}</div>
              <div className="font-mono text-2xl text-white tracking-widest">•••• •••• 2025</div>
              <Link href="/loyalty" className="mt-2 inline-flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors uppercase tracking-wider">
                {lang === 'sq' ? 'Shiko Avantazhet' : lang === 'de' ? 'Vorteile ansehen' : 'View Benefits'} <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent orders */}
          <motion.div variants={fade} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="font-serif text-lg">{t('recent_orders')}</h2>
              <Link href="/orders" className="text-xs uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                {t('view_all')}
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {orders && orders.length > 0 ? (
                orders.slice(0, 4).map((o: any) => (
                  <div key={o.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <ShoppingBag size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {lang === 'sq' ? 'Porosi' : lang === 'de' ? 'Bestellung' : 'Order'} #{o.id}
                      </p>
                      <p className="text-xs text-foreground/40 flex items-center gap-1">
                        <Clock size={10} /> {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">€{Number(o.total || 0).toFixed(2)}</p>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        o.status === 'delivered' ? 'bg-emerald-400/15 text-emerald-400' :
                        o.status === 'processing' ? 'bg-blue-400/15 text-blue-400' :
                        'bg-yellow-400/15 text-yellow-400'
                      }`}>{o.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <Package size={32} className="text-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-foreground/40">{lang === 'sq' ? 'Nuk ka porosi ende.' : lang === 'de' ? 'Noch keine Bestellungen.' : 'No orders yet.'}</p>
                  <Link href="/shop" className="inline-block mt-3 text-xs text-primary hover:underline">{t('shop_all')}</Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div variants={fade} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="font-serif text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                {lang === 'sq' ? 'Rekomandimet' : lang === 'de' ? 'Empfehlungen' : 'For You'}
              </h2>
              <Link href="/shop" className="text-xs uppercase tracking-wider text-primary">{t('shop_all')}</Link>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {(products || []).slice(0, 4).map((p: any) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="group rounded-xl overflow-hidden bg-card border border-white/5 hover:border-primary/20 transition-all">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                    <p className="text-[11px] text-primary font-semibold">€{p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/shop', label: t('shop'), icon: <ShoppingBag size={18} /> },
            { href: '/favorites', label: t('favorites'), icon: <Heart size={18} /> },
            { href: '/loyalty', label: t('loyalty'), icon: <Star size={18} /> },
            { href: '/ai', label: 'Pellazgo AI', icon: <Sparkles size={18} /> },
          ].map((a, i) => (
            <Link key={i} href={a.href} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
              <span className="text-primary group-hover:scale-110 transition-transform">{a.icon}</span>
              <span className="text-sm font-medium">{a.label}</span>
              <ChevronRight size={14} className="ml-auto text-foreground/20 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
