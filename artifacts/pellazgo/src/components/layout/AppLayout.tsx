import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingBag, Heart, User, Sparkles, Menu, X,
  Search, Globe, LogOut, LayoutDashboard, Briefcase, ShoppingCart
} from 'lucide-react';
import { useI18n, Lang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useGetCartItems } from '@workspace/api-client-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const { user, logout, isAuthenticated } = useAuth();
  const { data: cartItems } = useGetCartItems();

  const isFullScreen = location === '/login' || location === '/ai';

  const cartCount = cartItems?.length || 0;

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/shop', label: t('shop') },
    { href: '/about', label: t('about') },
    { href: '/blog', label: 'Blog' },
    { href: '/offers', label: t('offers') },
    { href: '/business', label: t('business') },
  ];

  const LANGS: { code: Lang; label: string }[] = [
    { code: 'sq', label: 'SQ' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
  ];

  if (isFullScreen) {
    return <div className="min-h-[100dvh] w-full bg-background flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      {/* ── TOP HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-background/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 md:px-10 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-auto md:mr-0">
          <div className="w-9 h-9 rounded-full gold-gradient-bg flex items-center justify-center shadow-[0_0_16px_rgba(201,168,76,0.4)]">
            <span className="font-serif font-bold text-background text-lg leading-none">P</span>
          </div>
          <span className="font-serif text-xl tracking-widest gold-gradient-text hidden md:block">PELLAZGO</span>
        </Link>

        {/* Desktop center nav */}
        <nav className="hidden md:flex items-center gap-8 mx-auto">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                location === l.href ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Globe size={14} />
              {lang.toUpperCase()}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-10 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-[80px]"
                >
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                        lang === l.code ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-foreground/70'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
            <ShoppingCart size={20} className="text-foreground/70" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Search */}
          <Link href="/shop" className="hidden md:flex p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search size={20} className="text-foreground/70" />
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              {user?.role === 'business' && (
                <Link href="/business" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors">
                  <Briefcase size={14} />
                  {t('business')}
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-white/5">
                <LayoutDashboard size={14} />
                {t('dashboard')}
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-white/5">
                <LogOut size={14} />
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 text-primary text-xs font-medium uppercase tracking-wider hover:bg-primary/10 transition-colors">
              {t('login')}
            </Link>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl flex flex-col pt-20 px-6 pb-8">
              {/* Mobile nav links */}
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center h-14 text-2xl font-serif border-b border-white/5 transition-colors ${
                        location === l.href ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Auth + lang */}
              <div className="mt-auto flex flex-col gap-4">
                <div className="flex gap-2">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                        lang === l.code ? 'bg-primary text-background border-primary' : 'border-border text-foreground/60'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                {isAuthenticated ? (
                  <div className="flex gap-3">
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex-1 py-3 text-center rounded-full border border-border text-sm font-medium">{t('dashboard')}</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="flex-1 py-3 text-center rounded-full border border-border text-sm font-medium text-foreground/70">{t('logout')}</button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="py-4 text-center rounded-full bg-primary text-background font-medium uppercase tracking-wider text-sm">
                    {t('login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-20 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2">
        <MobileNavItem href="/" icon={<Home size={21} />} label={t('home')} active={location === '/'} />
        <MobileNavItem href="/shop" icon={<ShoppingBag size={21} />} label={t('shop')} active={location === '/shop' || location.startsWith('/shop/')} />
        <div className="relative -top-4">
          <Link href="/ai" className="flex items-center justify-center w-14 h-14 rounded-full gold-gradient-bg shadow-[0_0_24px_rgba(201,168,76,0.5)] text-background transition-transform hover:scale-105 active:scale-95">
            <Sparkles size={22} className="fill-current" />
          </Link>
        </div>
        <MobileNavItem href="/cart" icon={
          <div className="relative">
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-background text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </div>
        } label={t('cart')} active={location === '/cart'} />
        <MobileNavItem href={isAuthenticated ? '/dashboard' : '/login'} icon={<User size={21} />} label={isAuthenticated ? t('dashboard') : t('login')} active={location === '/dashboard' || location === '/profile'} />
      </nav>
    </div>
  );
}

function MobileNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-colors ${active ? 'text-primary' : 'text-foreground/40'}`}>
      {icon}
      <span className="text-[9px] uppercase tracking-wider font-medium leading-none">{label}</span>
    </Link>
  );
}
