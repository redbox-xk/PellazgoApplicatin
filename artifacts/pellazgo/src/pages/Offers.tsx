import { useListOffers } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export function Offers() {
  const { data: offers, isLoading } = useListOffers();

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-[#AA7C11] text-[#11281F] py-16 px-4 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-50px] w-64 h-64 bg-black/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-black/10 mb-6 text-xs uppercase tracking-widest font-bold">
            <Tag size={14} /> Member Privileges
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Exclusive Deals</h1>
          <p className="text-[#11281F]/80 text-lg max-w-xl font-medium">
            Curated benefits and limited-time offers available only to Pellazgo members. Elevate your lifestyle for less.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : offers?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No active offers at the moment. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers?.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="group relative h-full glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/10 hover:border-primary/50 transition-colors">
                  <div className="relative h-48 bg-black/20 overflow-hidden shrink-0">
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {offer.discount}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 relative z-10 -mt-10">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2 font-bold">{offer.businessName}</p>
                    <h3 className="text-xl font-serif mb-2 line-clamp-2">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {offer.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={14} />
                        <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/businesses/${offer.businessId}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
