import { useState } from 'react';
import { useListBusinesses, useListCategories } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Businesses() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');

  const { data: categories, isLoading: catLoading } = useListCategories();
  const { data: businesses, isLoading: bizLoading } = useListBusinesses({ 
    search: search || undefined, 
    category: activeCategory || undefined 
  });

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-white/5 pt-12 pb-6 px-4 md:px-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-serif mb-2">Discover</h1>
            <p className="text-muted-foreground text-sm">Find your next extraordinary experience.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search venues, cuisines, experiences..." 
                className="pl-10 h-12 bg-background border-white/10 focus-visible:ring-primary rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-card border border-white/10 text-foreground hover:bg-white/5 transition-colors shrink-0">
              <Filter size={18} />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            <button 
              onClick={() => setActiveCategory('')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${!activeCategory ? 'bg-primary text-primary-foreground' : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'}`}
            >
              All
            </button>
            {!catLoading && categories?.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-8">
        {bizLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : businesses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-serif mb-1">No venues found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses?.map((biz, idx) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/businesses/${biz.id}`} className="group block h-full">
                  <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)]">
                    <div className="relative h-48 overflow-hidden bg-black/20 shrink-0">
                      <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
                        <Star size={12} className="text-primary fill-primary" />
                        <span>{biz.rating.toFixed(1)}</span>
                      </div>
                      {biz.isOpen ? (
                        <div className="absolute top-3 left-3 bg-green-500/80 text-white backdrop-blur px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          Open Now
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 bg-black/60 text-white/80 backdrop-blur px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          Closed
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{biz.category}</p>
                      <h3 className="text-xl font-serif mb-2 line-clamp-1 group-hover:text-primary transition-colors">{biz.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {biz.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={14} />
                          <span className="truncate max-w-[150px]">{biz.address}</span>
                        </div>
                        {biz.loyaltyPoints ? (
                          <div className="text-xs font-medium gold-gradient-text bg-primary/10 px-2 py-1 rounded">
                            {biz.loyaltyPoints} pts / visit
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
