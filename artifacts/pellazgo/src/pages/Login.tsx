import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import heroImg from '@assets/generated_images/hero.jpg';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Simulate auth since we don't have auth endpoints in this spec
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: isLogin ? "Welcome back" : "Account created successfully" });
      setLocation('/');
    }, 1500);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img 
          src={heroImg} 
          alt="Luxury Lifestyle" 
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-wider gold-gradient-text">
            Pellazgo
          </Link>
          
          <div className="max-w-md">
            <div className="w-12 h-1 bg-primary mb-6" />
            <h2 className="text-4xl font-serif mb-4 leading-tight">Your gateway to the extraordinary.</h2>
            <p className="text-foreground/80 font-light text-lg">Curated experiences, bespoke goods, and unparalleled service—reserved for our members.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Header */}
        <Link href="/" className="md:hidden absolute top-8 left-8 font-serif text-2xl font-semibold tracking-wider gold-gradient-text z-20">
          Pellazgo
        </Link>

        {/* Mobile background gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-[#11281F] to-black z-0" />
        <div className="md:hidden absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="w-full max-w-md relative z-10 glass-panel md:bg-transparent md:border-none md:shadow-none p-8 md:p-0 rounded-3xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6 text-background shadow-[0_0_30px_rgba(201,168,76,0.3)]">
              <Sparkles size={24} className="fill-current" />
            </div>
            <h1 className="text-3xl font-serif mb-2">{isLogin ? 'Welcome Back' : 'Apply for Membership'}</h1>
            <p className="text-muted-foreground">{isLogin ? 'Enter your credentials to access your account.' : 'Join the exclusive Pellazgo community.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Full Name</label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-background/50 border-white/10 focus-visible:ring-primary rounded-xl"
                    placeholder="Jane Doe"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-background/50 border-white/10 focus-visible:ring-primary rounded-xl"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Password</label>
                {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>}
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-background/50 border-white/10 focus-visible:ring-primary rounded-xl"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-medium tracking-wide flex items-center justify-center gap-2 mt-8 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Submit Application')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already a member?"}
            </span>
            {' '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Apply now' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed for AnimatePresence in Login
import { AnimatePresence } from 'framer-motion';
