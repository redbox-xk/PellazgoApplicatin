import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // Hide bottom nav on specific fullscreen pages like AI chat or Login
  const isFullScreenPage = location === '/login' || location === '/ai';

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col font-sans">
      {/* Top Header - Mobile only for quick actions, or we can leave it to pages */}
      {!isFullScreenPage && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md z-40 border-b border-border flex items-center justify-between px-4 md:px-8">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-wider gold-gradient-text">
            Pellazgo
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${!isFullScreenPage ? 'pt-16 pb-20 md:pb-0 md:pl-20' : ''}`}>
        {children}
      </main>

      {/* Side Nav for Desktop / Bottom Nav for Mobile */}
      {!isFullScreenPage && (
        <>
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/90 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
            <NavItem href="/" icon={<Home size={22} />} label="Home" active={location === '/'} />
            <NavItem href="/businesses" icon={<Search size={22} />} label="Discover" active={location === '/businesses' || location.startsWith('/businesses/')} />
            
            <div className="relative -top-6">
              <Link href="/ai" className="flex items-center justify-center w-14 h-14 rounded-full gold-gradient-bg shadow-[0_0_20px_rgba(201,168,76,0.4)] text-background transition-transform hover:scale-105 active:scale-95">
                <Sparkles size={24} className="fill-current" />
              </Link>
            </div>

            <NavItem href="/loyalty" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>} label="Loyalty" active={location === '/loyalty'} />
            <NavItem href="/profile" icon={<User size={22} />} label="Profile" active={location === '/profile'} />
          </nav>

          {/* Desktop Side Nav */}
          <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-20 bg-background/90 backdrop-blur-xl border-r border-border z-50 flex-col items-center py-8 gap-8">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-wider gold-gradient-text w-12 h-12 flex items-center justify-center rounded-full bg-white/5">
              P
            </Link>
            
            <div className="flex-1 flex flex-col gap-6 mt-8">
              <NavItemDesktop href="/" icon={<Home size={24} />} active={location === '/'} tooltip="Home" />
              <NavItemDesktop href="/businesses" icon={<Search size={24} />} active={location === '/businesses' || location.startsWith('/businesses/')} tooltip="Discover" />
              <NavItemDesktop href="/loyalty" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>} active={location === '/loyalty'} tooltip="Loyalty" />
              <NavItemDesktop href="/favorites" icon={<Heart size={24} />} active={location === '/favorites'} tooltip="Favorites" />
              <NavItemDesktop href="/profile" icon={<User size={24} />} active={location === '/profile'} tooltip="Profile" />
            </div>

            <Link href="/ai" className="flex items-center justify-center w-12 h-12 rounded-full gold-gradient-bg shadow-[0_0_20px_rgba(201,168,76,0.3)] text-background transition-transform hover:scale-110">
              <Sparkles size={20} className="fill-current" />
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-16 h-14 gap-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
      <div className="relative">
        {icon}
        {active && (
          <motion.div layoutId="nav-indicator-mobile" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
        )}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}

function NavItemDesktop({ href, icon, active, tooltip }: { href: string; icon: React.ReactNode; active: boolean; tooltip: string }) {
  return (
    <Link href={href} className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`} title={tooltip}>
      {icon}
      {active && (
        <motion.div layoutId="nav-indicator-desktop" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
      )}
    </Link>
  );
}
