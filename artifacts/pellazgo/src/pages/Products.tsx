import { useState } from 'react';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Products() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  
  // Try to grab businessId from URL search params manually since wouter doesn't have useSearchParams out of box without extra hooks
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? Number(businessIdParam) : undefined;

  const { data: categories, isLoading: catLoading } = useListCategories();
  const { data: products, isLoading: prodLoading } = useListProducts({ 
    search: search || undefined, 
    category: activeCategory || undefined,
    businessId
  });

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      <div className="bg-card/50 backdrop-blur-md border-b border-white/5 pt-12 pb-6 px-4 md:px-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-serif mb-2">Curated Goods</h1>
            <p className="text-muted-foreground text-sm">Exclusive products from our premium partners.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-12 bg-background border-white/10 focus-visible:ring-primary rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-card border border-white/10 text-foreground hover:bg-white/5 transition-colors shrink-0">
              <Filter size={18} />
            </button>
          </div>

          {!businessId && (
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
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-8">
        {prodLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-serif mb-1">No products found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/products/${prod.id}`} className="group block h-full">
                  <div className="glass-panel rounded-2xl p-3 flex flex-col h-full transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)] gap-3">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black/20">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                      {!prod.inStock && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 px-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{prod.businessName}</p>
                      <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-primary transition-colors flex-1">{prod.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-serif text-lg">${prod.price.toFixed(2)}</p>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <p className="text-xs text-muted-foreground line-through">${prod.originalPrice.toFixed(2)}</p>
                        )}
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
