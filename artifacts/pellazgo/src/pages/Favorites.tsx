import { useListFavorites, useRemoveFavorite } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Heart, Trash2, MapPin } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function Favorites() {
  const { data: favorites, isLoading, refetch } = useListFavorites();
  const removeFav = useRemoveFavorite();
  const { toast } = useToast();

  const handleRemove = (id: number) => {
    removeFav.mutate({ id }, {
      onSuccess: () => {
        toast({ description: "Removed from favorites." });
        refetch();
      }
    });
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8 max-w-7xl mx-auto"><div className="h-64 bg-white/5 rounded-2xl" /></div>;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-12 pt-12">
        <h1 className="text-4xl font-serif mb-8">Saved Collection</h1>

        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5 max-w-4xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif mb-2">No saved items</h3>
            <p className="text-muted-foreground mb-8">Save businesses and products you love to build your personal collection.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/businesses" className="inline-flex h-12 items-center justify-center px-6 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                Explore Venues
              </Link>
              <Link href="/products" className="inline-flex h-12 items-center justify-center px-6 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav, idx) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="group block h-full relative">
                  <Link href={fav.type === 'business' ? `/businesses/${fav.businessId}` : `/products/${fav.productId}`}>
                    <div className="glass-panel rounded-2xl p-3 flex flex-col h-full transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)] gap-3">
                      <div className={`relative ${fav.type === 'business' ? 'aspect-[4/3]' : 'aspect-square'} rounded-xl overflow-hidden bg-black/20`}>
                        <img src={fav.imageUrl || ''} alt={fav.businessName || fav.productName || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          {fav.type}
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 px-1 py-2">
                        <h3 className="text-lg font-serif mb-1 line-clamp-1 group-hover:text-primary transition-colors flex-1">
                          {fav.type === 'business' ? fav.businessName : fav.productName}
                        </h3>
                        {fav.type === 'product' && fav.businessName && (
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{fav.businessName}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(fav.id); }}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-background/50 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
