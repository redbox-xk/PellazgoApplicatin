import { useListOrders } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Package, Clock } from 'lucide-react';
import { Link } from 'wouter';

export function Orders() {
  const { data: orders, isLoading } = useListOrders();

  if (isLoading) return <div className="p-12 animate-pulse space-y-8 max-w-4xl mx-auto"><div className="h-64 bg-white/5 rounded-2xl" /></div>;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-12 pt-12">
        <h1 className="text-4xl font-serif mb-8">Order History</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8">Your past purchases will appear here.</p>
            <Link href="/products" className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:scale-105">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium">Order #{order.id.toString().padStart(6, '0')}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="font-serif text-xl text-primary">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {item.productName}
                        </Link>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className="mt-6 pt-6 border-t border-white/5 text-sm">
                    <p className="text-muted-foreground mb-1 text-xs uppercase tracking-widest font-bold">Shipping Address</p>
                    <p className="text-foreground/80">{order.shippingAddress}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
