import { useState, useRef, useEffect } from 'react';
import { useGetChatHistory, useSendChatMessage, useClearChatHistory } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RefreshCcw, ArrowLeft, Bot } from 'lucide-react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import aiBg from '@assets/generated_images/ai-bg.jpg';

export function AIAssistant() {
  const { data: history, isLoading, refetch } = useGetChatHistory();
  const sendMessage = useSendChatMessage();
  const clearChat = useClearChatHistory();
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync server history with local state
  useEffect(() => {
    if (history) {
      setLocalMessages(history);
    }
  }, [history]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [localMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString()
    };

    setLocalMessages(prev => [...prev, userMsg]);
    const messageToSend = input;
    setInput('');

    sendMessage.mutate({ data: { content: messageToSend } }, {
      onSuccess: () => refetch(),
      onError: () => {
        toast({ title: "Failed to send message", variant: "destructive" });
        // Revert optimisic update
        setLocalMessages(prev => prev.filter(m => m.id !== userMsg.id));
      }
    });
  };

  const handleClear = () => {
    clearChat.mutate(undefined, {
      onSuccess: () => {
        setLocalMessages([]);
        refetch();
      }
    });
  };

  const suggestedPrompts = [
    "Find a romantic restaurant for tomorrow night",
    "What spas offer a couple's massage?",
    "Show me the latest fashion arrivals",
    "Where can I earn the most loyalty points?"
  ];

  return (
    <div className="w-full flex flex-col h-[100dvh] relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={aiBg} 
          alt="Concierge Background" 
          className="w-full h-full object-cover opacity-20 blur-sm"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 md:px-8 border-b border-white/5 bg-background/50 backdrop-blur-md shrink-0">
        <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <h1 className="font-serif text-lg tracking-wider">Pellazgo Concierge</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Always at your service</p>
        </div>
        <button onClick={handleClear} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors" title="Reset Conversation">
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-4">
          
          {/* Welcome Message if empty */}
          {localMessages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 md:py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full gold-gradient-bg flex items-center justify-center text-background mb-6 shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                <Sparkles size={32} className="fill-current" />
              </div>
              <h2 className="text-3xl font-serif mb-4">How may I assist you today?</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-12">
                I am your personal concierge, ready to curate dining experiences, find exclusive products, or answer questions about your membership.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="glass-panel p-4 rounded-xl text-sm text-left hover:bg-white/5 transition-colors border border-white/5 hover:border-primary/30"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {localMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-white/10' : 'bg-primary/20 text-primary'}`}>
                    {msg.role === 'user' ? <span className="text-xs font-medium">ME</span> : <Bot size={16} />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'glass-panel border border-white/5 rounded-tl-sm'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {sendMessage.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} />
                </div>
                <div className="glass-panel border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-white/5 shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="w-full h-14 pl-6 pr-14 rounded-full bg-card border-white/10 focus-visible:ring-primary text-base shadow-lg"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || sendMessage.isPending}
            className="absolute right-2 top-2 bottom-2 w-10 rounded-full gold-gradient-bg flex items-center justify-center text-background disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
          >
            <Send size={16} className="-ml-0.5 mt-0.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
          AI Concierge may produce inaccurate information
        </p>
      </div>
    </div>
  );
}
