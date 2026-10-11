import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

const HERO = 'https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg';

export function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const { t, lang, setLang } = useI18n();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let ok: boolean;
      if (mode === 'login') {
        ok = await login(email, password);
      } else {
        ok = await register(name, email, password);
      }
      if (ok) {
        navigate('/');
      } else {
        setError(lang === 'sq' ? 'Email ose fjalëkalim i gabuar.' : lang === 'de' ? 'E-Mail oder Passwort falsch.' : 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex bg-background">
      {/* Left — form */}
      <div className="flex-1 flex flex-col px-6 md:px-16 py-10 max-w-xl w-full mx-auto md:mx-0">
        {/* Back + logo */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm">
            <ArrowLeft size={16} />
            {lang === 'sq' ? 'Kthim' : lang === 'de' ? 'Zurück' : 'Back'}
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center">
              <span className="font-serif font-bold text-background text-base">P</span>
            </div>
            <span className="font-serif tracking-widest gold-gradient-text text-lg">PELLAZGO</span>
          </div>
        </div>

        {/* Language tabs */}
        <div className="flex gap-1 mb-10 p-1 rounded-full bg-white/5 w-fit">
          {(['sq', 'en', 'de'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${lang === l ? 'bg-primary text-background' : 'text-foreground/40 hover:text-foreground'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-10 border-b border-white/5">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-widest border-b-2 -mb-px transition-all ${
                mode === m ? 'border-primary text-primary' : 'border-transparent text-foreground/40 hover:text-foreground/70'
              }`}
            >
              {m === 'login' ? t('sign_in') : t('sign_up')}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-2">{t('login_title')}</h1>
          <p className="text-foreground/50 text-sm">{t('login_sub')}</p>
        </div>

        {/* Demo hint */}
        <div className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary/80">
          <strong>{lang === 'sq' ? 'Demo:' : 'Demo:'}</strong> alex@example.com / demo123 &nbsp;|&nbsp; business@pellazgo.com / business123
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-foreground/50">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Emri dhe mbiemri..."
                className="h-12 px-4 rounded-xl bg-card border border-white/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground/50">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
              className="h-12 px-4 rounded-xl bg-card border border-white/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground/50">{t('password')}</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-12 px-4 pr-12 rounded-xl bg-card border border-white/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 px-1">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-14 rounded-full bg-primary text-background font-semibold uppercase tracking-widest text-sm mt-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] disabled:opacity-60 disabled:scale-100"
          >
            {loading ? '...' : mode === 'login' ? t('sign_in') : t('sign_up')}
          </button>
        </form>

        <div className="mt-auto pt-12 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-foreground/40">
              {t('no_account')}{' '}
              <button onClick={() => setMode('register')} className="text-primary hover:underline">{t('sign_up')}</button>
            </p>
          ) : (
            <p className="text-sm text-foreground/40">
              {t('have_account')}{' '}
              <button onClick={() => setMode('login')} className="text-primary hover:underline">{t('sign_in')}</button>
            </p>
          )}
        </div>
      </div>

      {/* Right — image (desktop only) */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <img src={HERO} alt="Pellazgo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/60" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Pellazgo AI</span>
          </div>
          <blockquote className="font-serif text-3xl italic leading-relaxed">
            {lang === 'sq'
              ? '"Çdo copë tregon një histori të trashëgimisë sonë."'
              : lang === 'de'
              ? '"Jedes Stück erzählt eine Geschichte unseres Erbes."'
              : '"Every piece tells a story of our heritage."'}
          </blockquote>
          <p className="text-sm text-white/50 mt-4">Pellazgo Studio, Vushtrri, Kosovo</p>
        </div>
      </div>
    </div>
  );
}
