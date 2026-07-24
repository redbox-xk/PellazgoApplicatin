import { useGetMyLoyalty, useListLoyaltyTiers } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Award, Shield, Sparkles, ChevronRight, Lock } from 'lucide-react';
import loyaltyBg from '@assets/generated_images/loyalty-bg.jpg';

export function Loyalty() {
  const { data: account, isLoading: accLoading } = useGetMyLoyalty();
  const { data: tiers, isLoading: tiersLoading } = useListLoyaltyTiers();

  if (accLoading || tiersLoading) return <div className="p-12 animate-pulse space-y-8"><div className="h-64 bg-white/5 rounded-2xl max-w-md mx-auto" /></div>;
  if (!account) return null;

  const currentTierData = tiers?.find(t => t.name === account.tier);
  const nextTierData = account.nextTierPoints && tiers ? tiers.find(t => t.minPoints > account.points) : null;
  const progress = nextTierData ? (account.points / nextTierData.minPoints) * 100 : 100;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 items-center">
      <div className="w-full max-w-md mx-auto px-4 pt-12 flex flex-col items-center">
        <h1 className="text-3xl font-serif mb-8 text-center">Pellazgo Membership</h1>
        
        {/* Digital Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full aspect-[1.58/1] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/20"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src={loyaltyBg} 
              alt="Loyalty Background" 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Color tint based on tier */}
            <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: currentTierData?.color || '#C9A84C', opacity: 0.6 }} />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/80" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Status</p>
              <p className="text-2xl font-serif text-white uppercase tracking-widest">{account.tier}</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md bg-white/10">
              <span className="font-serif text-xl text-white">P</span>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Available Points</p>
            <p className="text-4xl font-serif text-white tracking-wider">{account.points.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Progress */}
        {nextTierData && (
          <div className="w-full mt-10 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{account.points.toLocaleString()} pts</span>
              <span className="text-primary font-medium">{nextTierData.minPoints.toLocaleString()} pts to {nextTierData.name}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Award size={24} className="text-primary mb-2" />
            <p className="text-2xl font-serif mb-1">{account.lifetimePoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Lifetime Pts</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Shield size={24} className="text-primary mb-2" />
            <p className="text-2xl font-serif mb-1">{account.streakDays}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="w-full mt-12">
          <h2 className="text-xl font-serif mb-6 text-center">Tier Benefits</h2>
          <div className="space-y-4">
            {currentTierData?.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-4 glass-panel p-4 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Sparkles size={14} />
                </div>
                <p className="text-sm">{benefit}</p>
              </div>
            ))}

            {nextTierData && (
              <div className="mt-8 border border-white/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-[50px]" />
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Unlock at {nextTierData.name}</h3>
                </div>
                <div className="space-y-3">
                  {nextTierData.benefits.slice(0, 2).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
