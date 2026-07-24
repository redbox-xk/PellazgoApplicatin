import { useParams } from 'wouter';
import { 
  useGetBusiness, 
  useListProducts, 
  useListOffers, 
  useListReviews,
  useAddFavorite,
  useRemoveFavorite,
  useListFavorites
} from '@workspace/api-client-react';
import { Star, MapPin, Clock, Phone, Globe, ChevronLeft, Heart } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export function BusinessProfile() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { toast } = useToast();

  const { data: biz, isLoading } = useGetBusiness(id, { query: { enabled: !!id } });
  const { data: products } = useListProducts({ businessId: id }, { query: { enabled: !!id } });
  // We don't have a direct endpoint for business offers, but we can list offers and filter or just show them if the API supports it.
  // Actually, listOffers doesn't take businessId in params based on schema. But let's check schema.
  // Wait, I can just fetch all offers and filter client side if small, or use it if API doesn't support.
  // Let's just fetch products and reviews.
  const { data: reviews } = useListReviews({ businessId: id }, { query: { enabled: !!id } });
  
  const { data: favorites } = useListFavorites();
  const isFavorite = favorites?.some(f => f.businessId === id);
  
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  const toggleFavorite = () => {
    if (isFavorite) {
      const fav = favorites?.find(f => f.businessId === id);
      if (fav) {
        removeFav.mutate({ id: fav.id }, {
          onSuccess: () => toast({ description: "Removed from favorites." })
        });
      }
    } else {
      addFav.mutate({ data: { type: 'business', businessId: id } }, {
        onSuccess: () => toast({ description: "Added to favorites." })
      });
    }
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8"><div className="h-64 bg-white/5 rounded-2xl" /><div className="h-32 bg-white/5 rounded-2xl" /></div>;
  if (!biz) return <div className="p-12 text-center text-muted-foreground">Business not found.</div>;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full bg-card">
        <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <Link href="/businesses" className="w-10 h-10 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-background/80 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <button onClick={toggleFavorite} className="w-10 h-10 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-background/80 transition-colors">
            <Heart size={20} className={isFavorite ? "fill-primary text-primary" : ""} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">{biz.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">{biz.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="font-medium text-foreground">{biz.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({biz.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{biz.address}</span>
                </div>
                {biz.isOpen ? (
                  <span className="text-green-400 font-medium text-xs uppercase tracking-wider">Open Now</span>
                ) : (
                  <span className="text-red-400 font-medium text-xs uppercase tracking-wider">Closed</span>
                )}
              </div>
            </div>
            
            {biz.loyaltyPoints ? (
              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-background font-bold text-xl">
                  P
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Earn</p>
                  <p className="text-lg font-medium gold-gradient-text">{biz.loyaltyPoints} points / visit</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed font-light">{biz.description}</p>
          </section>

          {products && products.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-serif">Curated Selection</h2>
                <Link href={`/products?businessId=${biz.id}`} className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map(prod => (
                  <Link key={prod.id} href={`/products/${prod.id}`} className="group relative rounded-xl overflow-hidden glass-panel aspect-square">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-sm font-medium mb-1 line-clamp-1">{prod.name}</h3>
                      <p className="text-primary font-serif">${prod.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-serif mb-6">Guest Reviews</h2>
            <div className="space-y-6">
              {reviews?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reviews yet.</p>
              ) : (
                reviews?.map(review => (
                  <div key={review.id} className="border-b border-white/5 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{review.authorName}</p>
                      <div className="flex items-center text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-primary" : "text-muted-foreground"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground/50 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-serif">Information</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground">{biz.address}</span>
              </div>
              {biz.openingHours && (
                <div className="flex gap-3">
                  <Clock size={18} className="text-primary shrink-0" />
                  <span className="text-muted-foreground whitespace-pre-line">{biz.openingHours}</span>
                </div>
              )}
              {biz.phone && (
                <div className="flex gap-3">
                  <Phone size={18} className="text-primary shrink-0" />
                  <a href={`tel:${biz.phone}`} className="text-muted-foreground hover:text-primary">{biz.phone}</a>
                </div>
              )}
              {biz.website && (
                <div className="flex gap-3">
                  <Globe size={18} className="text-primary shrink-0" />
                  <a href={biz.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary break-all">{biz.website}</a>
                </div>
              )}
            </div>

            <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium tracking-wide mt-4">
              Make Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
