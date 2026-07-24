import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, ChevronRight, Clock } from 'lucide-react';
import { 
  useGetDashboardStats, 
  useListFeaturedBusinesses, 
  useListFeaturedProducts, 
  useListOffers, 
  useListBlogPosts 
} from '@workspace/api-client-react';

// Attempt to use assets if available, fallback to empty string if not setup yet.
import heroImg from '@assets/generated_images/hero.jpg';

export function Home() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: featuredBusinesses, isLoading: bizLoading } = useListFeaturedBusinesses();
  const { data: featuredProducts, isLoading: prodLoading } = useListFeaturedProducts();
  const { data: offers, isLoading: offersLoading } = useListOffers({ featured: true });
  const { data: blogs, isLoading: blogLoading } = useListBlogPosts();

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="w-full flex flex-col pb-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[500px] w-full flex items-end pb-12 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Luxury Lifestyle" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image not ready yet
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        
        <div className="relative z-10 px-4 md:px-12 w-full max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
              <Star size={14} className="text-primary fill-primary" />
              <span className="text-xs uppercase tracking-widest text-foreground font-medium">Curated Excellence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6">
              Unlock the City's <br />
              <span className="gold-gradient-text italic">Finest Experiences</span>
            </h1>
            <p className="text-lg text-foreground/80 font-light mb-8 max-w-md">
              Your exclusive pass to premium dining, bespoke shopping, and luxury wellness.
            </p>
            <Link href="/businesses" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium tracking-wide transition-transform hover:scale-105">
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-16 px-4 md:px-12 w-full max-w-7xl mx-auto mt-12"
      >
        {/* Loyalty Teaser Widget */}
        <motion.section variants={itemVariants} className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-2xl font-serif mb-2">Your Pellazgo Card</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Earn points on every curated experience. Unlock exclusive tiers, priority bookings, and private events.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                <p className="text-xl font-medium gold-gradient-text">Gold Member</p>
              </div>
              <div className="h-10 w-[1px] bg-border" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Points</p>
                <p className="text-xl font-medium text-foreground">{statsLoading ? '--' : stats?.activeLoyaltyPoints?.toLocaleString() || '12,450'}</p>
              </div>
              <Link href="/loyalty" className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors ml-4">
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Featured Businesses */}
        <motion.section variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-serif mb-2">The Collection</h2>
              <p className="text-muted-foreground text-sm">Hand-selected venues for the discerning palate.</p>
            </div>
            <Link href="/businesses" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wider text-primary hover:text-primary/80 transition-colors font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {bizLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1,2,3].map(i => <div key={i} className="min-w-[280px] h-[320px] rounded-2xl bg-white/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {featuredBusinesses?.map((biz) => (
                <Link key={biz.id} href={`/businesses/${biz.id}`} className="group relative min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] flex flex-col gap-4">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-card">
                    <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium border border-white/10">
                      <Star size={12} className="text-primary fill-primary" />
                      <span>{biz.rating.toFixed(1)}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">{biz.category}</p>
                      <h3 className="text-xl font-serif text-white">{biz.name}</h3>
                      <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> <span className="truncate">{biz.address}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* Active Offers Strip */}
        <motion.section variants={itemVariants} className="relative rounded-2xl overflow-hidden bg-[#AA7C11] text-[#11281F] p-8 md:p-12">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-black/10 mb-4 text-xs uppercase tracking-widest font-bold">
                Limited Time
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Exclusive Member Privileges</h2>
              <p className="text-[#11281F]/80 font-medium">
                Reserve your spot at highly sought-after experiences. These curated offers are available for a short window.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-4 overflow-x-auto hide-scrollbar snap-x">
              {offersLoading ? (
                 <div className="min-w-[260px] h-[140px] rounded-xl bg-black/10 animate-pulse" />
              ) : offers?.slice(0, 2).map(offer => (
                <Link key={offer.id} href={`/offers/${offer.id}`} className="snap-start min-w-[260px] bg-background/95 backdrop-blur text-foreground p-5 rounded-xl border border-white/20 shadow-xl group hover:-translate-y-1 transition-transform">
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 font-bold">{offer.discount}</p>
                  <h3 className="text-lg font-serif mb-1 group-hover:text-primary transition-colors line-clamp-1">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{offer.businessName}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> Ends soon
                    </span>
                    <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Products Grid */}
        <motion.section variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-serif mb-2">Curated Goods</h2>
              <p className="text-muted-foreground text-sm">Elevate your daily rituals.</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wider text-primary hover:text-primary/80 transition-colors font-medium">
              Shop All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {prodLoading ? (
              [1,2,3,4].map(i => <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />)
            ) : (
              featuredProducts?.slice(0, 4).map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col gap-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-white/5">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider backdrop-blur-sm">View Details</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{product.businessName}</p>
                    <p className="text-sm font-serif font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
