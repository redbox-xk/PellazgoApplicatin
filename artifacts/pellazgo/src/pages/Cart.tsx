import { useGetCart, useRemoveFromCart, useClearCart, useCreateOrder } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function Cart() {
  const { data: cart, isLoading, refetch } = useGetCart();
  const remove = useRemoveFromCart();
  const clear = useClearCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [address, setAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const handleRemove = (itemId: number) => {
    remove.mutate({ itemId }, {
      onSuccess: () => refetch()
    });
  };

  const handleCheckout = () => {
    if (!address) {
      toast({ title: "Address required", variant: "destructive" });
      return;
    }
    setCheckingOut(true);
    createOrder.mutate({ data: { shippingAddress: address } }, {
      onSuccess: () => {
        toast({ title: "Order placed successfully." });
        refetch();
        setLocation('/orders');
      },
      onError: () => setCheckingOut(false)
    });
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8 max-w-4xl mx-auto"><div className="h-64 bg-white/5 rounded-2xl" /></div>;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      <div className="max-w-5xl mx-auto w-full px-4 md:px-12 pt-12">
        <h1 className="text-4xl font-serif mb-8">Your Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8">Discover our curated collection of premium goods.</p>
            <Link href="/products" className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:scale-105">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-6 glass-panel p-4 rounded-2xl border border-white/5 relative">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20 shrink-0">
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-medium mb-1 line-clamp-1">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Qty: {item.quantity}</p>
                    <p className="text-primary font-serif">${item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    clear.mutate(undefined, { onSuccess: () => refetch() });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 sticky top-24">
                <h3 className="text-xl font-serif mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="h-[1px] w-full bg-border my-2" />
                  <div className="flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span className="text-primary">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Delivery Address</label>
                  <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter shipping address..."
                    className="bg-background border-border h-12"
                  />
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {checkingOut ? 'Processing...' : 'Complete Checkout'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
