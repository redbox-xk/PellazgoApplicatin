import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  TrendingUp, Package, Users, Euro, BarChart3, Plus,
  ShoppingBag, Star, ArrowUpRight, Edit3, Eye, Trash2,
  ChevronRight, Activity, Zap
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import {
  useListProducts,
  useGetDashboardStats,
  useListOrders,
  useListReviews,
} from '@workspace/api-client-react';

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const MOCK_REVENUE = [
  { month: 'Jan', value: 4200 },
  { month: 'Feb', value: 6800 },
  { month: 'Mar', value: 5400 },
  { month: 'Apr', value: 9200 },
  { month: 'May', value: 11000 },
  { month: 'Jun', value: 8700 },
  { month: 'Jul', value: 14200 },
];

export function BusinessDashboard() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview');

  const { data: products } = useListProducts({});
  const { data: stats } = useGetDashboardStats();
  const { data: orders } = useListOrders();
  const { data: reviews } = useListReviews({});

  const maxRevenue = Math.max(...MOCK_REVENUE.map(r => r.value));
  const totalRevenue = MOCK_REVENUE.reduce((a, b) => a + b.value, 0);
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;

  const kpis = [
    {
      icon: <Euro size={22} />,
      label: t('total_revenue'),
      value: `€${totalRevenue.toLocaleString()}`,
      change: '+18.4%',
      up: true,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      icon: <ShoppingBag size={22} />,
      label: t('total_orders'),
      value: totalOrders,
      change: '+12.1%',
      up: true,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: <Package size={22} />,
      label: t('total_products'),
      value: totalProducts,
      change: '+3',
      up: true,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      icon: <Star size={22} />,
      label: lang === 'sq' ? 'Vlerësimi Mesatar' : lang === 'de' ? 'Ø Bewertung' : 'Avg Rating',
      value: '4.9',
      change: '↑ 0.2',
      up: true,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const TABS = [
    { id: 'overview', label: lang === 'sq' ? 'Përmbledhja' : lang === 'de' ? 'Übersicht' : 'Overview' },
    { id: 'products', label: t('products') },
    { id: 'orders', label: t('orders') },
    { id: 'analytics', label: t('sales_analytics') },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-10">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">

        {/* Header */}
        <motion.div variants={fade} className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-1">{t('business_dashboard')}</p>
            <h1 className="text-4xl md:text-5xl font-serif">{user?.name}</h1>
            <p className="text-foreground/50 text-sm mt-2 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              {lang === 'sq' ? 'Aktiv · Dyqan Online' : lang === 'de' ? 'Aktiv · Online Shop' : 'Active · Online Shop'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/shop" className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:border-primary/30 transition-colors">
              <Eye size={14} />
              {lang === 'sq' ? 'Shiko Dyqanin' : lang === 'de' ? 'Shop anzeigen' : 'View Shop'}
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full gold-gradient-bg text-background text-sm font-semibold hover:scale-105 transition-transform">
              <Plus size={14} />
              {lang === 'sq' ? 'Produkt i Ri' : lang === 'de' ? 'Neues Produkt' : 'New Product'}
            </button>
          </div>
        </motion.div>

        {/* KPI grid */}
        <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 border border-white/5">
              <div className={`w-11 h-11 rounded-xl ${k.bg} flex items-center justify-center ${k.color} mb-4`}>
                {k.icon}
              </div>
              <p className="text-2xl font-serif font-semibold">{k.value}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{k.label}</p>
              <p className={`text-[11px] mt-2 font-medium ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {k.change} <span className="text-foreground/30">{lang === 'sq' ? 'këtë muaj' : lang === 'de' ? 'diesen Monat' : 'this month'}</span>
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fade} className="flex gap-1 p-1 rounded-full bg-white/5 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? 'bg-primary text-background' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* TAB: Overview */}
        {activeTab === 'overview' && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
            {/* Revenue chart */}
            <motion.div variants={fade} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-primary" />
                  <h2 className="font-serif text-lg">{t('sales_analytics')}</h2>
                </div>
                <div className="text-sm text-foreground/50">
                  {lang === 'sq' ? '7 muajt e fundit' : lang === 'de' ? 'Letzte 7 Monate' : 'Last 7 months'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-3 h-48">
                  {MOCK_REVENUE.map((r, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(r.value / maxRevenue) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                        className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                        title={`€${r.value.toLocaleString()}`}
                      />
                      <span className="text-[10px] text-foreground/40">{r.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-8">
                  <div>
                    <p className="text-xs text-foreground/40">{lang === 'sq' ? 'Totali' : lang === 'de' ? 'Gesamt' : 'Total'}</p>
                    <p className="text-2xl font-serif font-semibold text-primary">€{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40">{lang === 'sq' ? 'Mesatarja' : lang === 'de' ? 'Durchschnitt' : 'Average'}</p>
                    <p className="text-2xl font-serif font-semibold">€{Math.round(totalRevenue / MOCK_REVENUE.length).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent orders */}
              <motion.div variants={fade} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <h2 className="font-serif text-lg">{lang === 'sq' ? 'Porositë e Fundit' : lang === 'de' ? 'Letzte Bestellungen' : 'Recent Orders'}</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-primary">{t('view_all')}</button>
                </div>
                <div className="divide-y divide-white/5">
                  {orders && orders.length > 0 ? orders.slice(0, 5).map((o: any) => (
                    <div key={o.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400 text-xs font-bold">#{o.id}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lang === 'sq' ? 'Klient' : 'Customer'} #{o.userId || 1}</p>
                        <p className="text-xs text-foreground/40">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">€{Number(o.total || 0).toFixed(2)}</p>
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-yellow-400/15 text-yellow-400'}`}>{o.status}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="px-6 py-10 text-center text-sm text-foreground/30">
                      {lang === 'sq' ? 'Nuk ka porosi ende.' : 'No orders yet.'}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Top products */}
              <motion.div variants={fade} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <h2 className="font-serif text-lg flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    {lang === 'sq' ? 'Produktet Kryesore' : lang === 'de' ? 'Top-Produkte' : 'Top Products'}
                  </h2>
                  <button onClick={() => setActiveTab('products')} className="text-xs text-primary">{t('view_all')}</button>
                </div>
                <div className="divide-y divide-white/5">
                  {(products || []).slice(0, 5).map((p: any, i: number) => (
                    <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-card shrink-0">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-foreground/40">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">€{p.price.toFixed(2)}</p>
                        <div className="flex items-center gap-0.5 justify-end">
                          <Star size={10} className="fill-primary text-primary" />
                          <span className="text-[10px] text-foreground/40">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* TAB: Products */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground/50">{totalProducts} {lang === 'sq' ? 'produkte' : lang === 'de' ? 'Produkte' : 'products'}</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-background text-xs font-semibold hover:scale-105 transition-transform">
                <Plus size={14} />{lang === 'sq' ? 'Shto Produkt' : 'Add Product'}
              </button>
            </div>
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{lang === 'sq' ? 'Produkti' : 'Product'}</th>
                    <th className="hidden md:table-cell text-left px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{t('categories')}</th>
                    <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{t('price')}</th>
                    <th className="hidden md:table-cell text-right px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{t('rating')}</th>
                    <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{lang === 'sq' ? 'Veprimet' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(products || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-card shrink-0">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-foreground/40">{p.inStock ? (lang === 'sq' ? 'Në stok' : 'In stock') : (lang === 'sq' ? 'Jashtë stoku' : 'Out of stock')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-foreground/60">{p.category}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-primary">€{p.price.toFixed(2)}</td>
                      <td className="hidden md:table-cell px-6 py-4 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Star size={12} className="fill-primary text-primary" />
                          <span className="text-sm">{p.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="p-2 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"><Edit3 size={14} /></button>
                          <Link href={`/shop/${p.id}`} className="p-2 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-primary transition-colors"><Eye size={14} /></Link>
                          <button className="p-2 rounded-lg hover:bg-red-400/10 text-foreground/40 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB: Orders */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-serif text-lg">{t('order_history')}</h2>
            </div>
            {orders && orders.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">ID</th>
                    <th className="hidden md:table-cell text-left px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{lang === 'sq' ? 'Data' : 'Date'}</th>
                    <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">{t('total')}</th>
                    <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-foreground/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-white/2">
                      <td className="px-6 py-4 text-sm font-mono text-foreground/70">#{o.id}</td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-foreground/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-primary">€{Number(o.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${o.status === 'delivered' ? 'bg-emerald-400/15 text-emerald-400' : o.status === 'processing' ? 'bg-blue-400/15 text-blue-400' : 'bg-yellow-400/15 text-yellow-400'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-16 text-center text-foreground/30">
                {lang === 'sq' ? 'Nuk ka porosi ende.' : 'No orders yet.'}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB: Analytics */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: lang === 'sq' ? 'Konvertimi' : 'Conversion Rate', value: '3.4%', change: '+0.8%', icon: <TrendingUp size={18} /> },
                { label: lang === 'sq' ? 'Vizita Mujore' : 'Monthly Visits', value: '12,840', change: '+22%', icon: <Activity size={18} /> },
                { label: lang === 'sq' ? 'Vlera Mesatare Porosie' : 'Avg Order Value', value: '€486', change: '+€34', icon: <Euro size={18} /> },
              ].map((m, i) => (
                <div key={i} className="glass-panel rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 text-primary mb-3">{m.icon}<p className="text-xs uppercase tracking-wider text-foreground/50">{m.label}</p></div>
                  <p className="text-3xl font-serif font-semibold">{m.value}</p>
                  <p className="text-xs text-emerald-400 mt-2">{m.change} {lang === 'sq' ? 'vs muaji i kaluar' : 'vs last month'}</p>
                </div>
              ))}
            </div>

            {/* Full revenue bar chart */}
            <div className="glass-panel rounded-2xl border border-white/5 p-6">
              <h3 className="font-serif text-lg mb-6">{lang === 'sq' ? 'Të Ardhurat Mujore' : lang === 'de' ? 'Monatliche Einnahmen' : 'Monthly Revenue'}</h3>
              <div className="flex items-end gap-4 h-64">
                {MOCK_REVENUE.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[10px] text-foreground/40">€{(r.value / 1000).toFixed(1)}k</p>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(r.value / maxRevenue) * 85}%` }}
                      transition={{ duration: 0.9, delay: i * 0.07, ease: 'easeOut' }}
                      className="w-full rounded-t-xl bg-gradient-to-t from-primary/60 to-primary hover:from-primary hover:to-primary/80 transition-colors cursor-pointer"
                    />
                    <span className="text-[10px] text-foreground/40">{r.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
