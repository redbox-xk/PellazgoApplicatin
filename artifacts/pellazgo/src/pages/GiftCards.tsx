import { useState } from 'react';
import { useListGiftCards, useCreateGiftCard } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Gift, Plus, CreditCard, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import loyaltyBg from '@assets/generated_images/loyalty-bg.jpg';

export function GiftCards() {
  const { data: cards, isLoading, refetch } = useListGiftCards();
  const createCard = useCreateGiftCard();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = () => {
    if (!amount || isNaN(Number(amount))) return;
    createCard.mutate({
      data: {
        amount: Number(amount),
        recipientEmail: email || undefined,
        message: message || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "Gift Card created successfully" });
        setOpen(false);
        setAmount('');
        setEmail('');
        setMessage('');
        refetch();
      }
    });
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 items-center">
      <div className="w-full max-w-2xl mx-auto px-4 pt-12 flex flex-col items-center">
        <h1 className="text-3xl font-serif mb-2 text-center">Digital Gift Cards</h1>
        <p className="text-muted-foreground text-center mb-8">Share the Pellazgo experience.</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-full h-14 glass-panel border border-primary/30 rounded-xl flex items-center justify-center gap-2 text-primary font-medium tracking-wide hover:bg-primary/10 transition-colors mb-8">
              <Plus size={20} /> Purchase New Gift Card
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">New Gift Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Amount ($)</label>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="bg-background border-border h-12"
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Recipient Email (Optional)</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-background border-border h-12"
                  placeholder="gift@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message (Optional)</label>
                <Input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="bg-background border-border h-12"
                  placeholder="Enjoy the experience!"
                />
              </div>
              <button 
                onClick={handleCreate}
                disabled={createCard.isPending || !amount}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium mt-4 disabled:opacity-50"
              >
                {createCard.isPending ? "Processing..." : "Purchase"}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="w-full space-y-4">
            <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          </div>
        ) : cards?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Gift size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">You have no active gift cards.</p>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {cards?.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="w-full aspect-[1.58/1] rounded-2xl p-6 relative overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={loyaltyBg} 
                    alt="Gift Card Background" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#11281F]/90 via-[#11281F]/70 to-black/90" />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md bg-white/10">
                    <Gift size={16} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Balance</p>
                    <p className="text-2xl font-serif text-white">${card.balance.toFixed(2)}</p>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-white/80 font-mono tracking-widest text-lg md:text-xl mb-4">{card.code.match(/.{1,4}/g)?.join(' ')}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      {card.recipientEmail ? (
                        <p className="text-xs text-white/60 flex items-center gap-1"><Send size={12}/> Sent to {card.recipientEmail}</p>
                      ) : (
                        <p className="text-xs text-white/60 flex items-center gap-1"><CreditCard size={12}/> Available to use</p>
                      )}
                    </div>
                    {card.status === 'active' ? (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-white/10 text-white/50 px-2 py-1 rounded">{card.status}</span>
                    )}
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
