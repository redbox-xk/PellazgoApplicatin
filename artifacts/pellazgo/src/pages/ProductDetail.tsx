import { useParams, Link } from 'wouter';
import { 
  useGetProduct, 
  useAddToCart,
  useListProducts,
  useAddFavorite,
  useRemoveFavorite,
  useListFavorites
} from '@workspace/api-client-react';
import { Star, ChevronLeft, Heart, ShoppingBag, Truck, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ProductDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id } });
  const { data: relatedProducts } = useListProducts(
    { category: product?.category, businessId: product?.businessId }, 
    { query: { enabled: !!product } }
  );

  const addToCart = useAddToCart();
  
  const { data: favorites } = useListFavorites();
  const isFavorite = favorites?.some(f => f.productId === id);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        toast({
          title: "Added to cart",
          description: `${quantity}x ${product.name} added.`,
        });
      }
    });
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      const fav = favorites?.find(f => f.productId === id);
      if (fav) {
        removeFav.mutate({ id: fav.id }, {
          onSuccess: () => toast({ description: "Removed from favorites." })
        });
      }
    } else {
      addFav.mutate({ data: { type: 'product', productId: id } }, {
        onSuccess: () => toast({ description: "Added to favorites." })
      });
    }
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8"><div className="h-96 bg-white/5 rounded-2xl" /></div>;
  if (!product) return <div className="p-12 text-center text-muted-foreground">Product not found.</div>;

  const related = relatedProducts?.filter(p => p.id !== id).slice(0, 4);

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 md:left-20 h-16 flex items-center justify-between px-4 md:px-12 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <Link href="/products" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          <ChevronLeft size={16} /> Back
        </Link>
        <button onClick={toggleFavorite} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <Heart size={20} className={isFavorite ? "fill-primary text-primary" : ""} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-12 pt-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-panel border-white/10 p-2">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black/20">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col py-4">
          <Link href={`/businesses/${product.businessId}`} className="text-xs font-bold uppercase tracking-widest text-primary mb-3 hover:underline">
            {product.businessName}
          </Link>
          <h1 className="text-3xl md:text-5xl font-serif mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-serif">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="h-6 w-[1px] bg-border" />
            <div className="flex items-center gap-1 text-sm text-foreground/80">
              <Star size={14} className="text-primary fill-primary" />
              <span className="font-medium text-foreground">{product.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-muted-foreground">({product.reviewCount || 0} reviews)</span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed font-light mb-8">
            {product.description || "An exclusive offering curated for Pellazgo members."}
          </p>

          <div className="space-y-6 border-t border-b border-border py-8 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-20">Quantity</span>
              <div className="flex items-center gap-4 glass-panel rounded-full px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full h-14 rounded-full flex items-center justify-center gap-2 font-medium tracking-wide transition-all ${product.inStock ? 'bg-primary text-primary-foreground hover:scale-[1.02]' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            >
              <ShoppingBag size={20} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Perks */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Truck size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Complimentary Delivery</p>
                <p className="text-xs text-muted-foreground mt-1">Available for Pellazgo members on all orders.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <RotateCcw size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Concierge Returns</p>
                <p className="text-xs text-muted-foreground mt-1">Hassle-free returns arranged via your concierge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-16">
          <h2 className="text-2xl font-serif mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(prod => (
              <Link key={prod.id} href={`/products/${prod.id}`} className="group block h-full">
                <div className="glass-panel rounded-2xl p-3 flex flex-col h-full transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)] gap-3">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/20">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col flex-1 px-1">
                    <h3 className="text-sm font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors flex-1">{prod.name}</h3>
                    <p className="font-serif">${prod.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
