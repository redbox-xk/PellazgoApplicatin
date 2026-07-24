import { useState } from 'react';
import { useListBlogPosts } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { data: posts, isLoading } = useListBlogPosts({ category: activeCategory || undefined });

  // In a real app we might fetch these, but let's hardcode some editorial categories
  const categories = ['All', 'Culture', 'Dining', 'Wellness', 'Travel'];

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      <div className="bg-card/50 backdrop-blur-md border-b border-white/5 pt-12 pb-6 px-4 md:px-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-serif mb-2">Editorial</h1>
            <p className="text-muted-foreground text-sm">Stories, guides, and perspectives on the luxury lifestyle.</p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat === 'All' ? '' : cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  (activeCategory === cat) || (!activeCategory && cat === 'All') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-12">
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1,2,3,4,5].map(i => <div key={i} className="rounded-2xl bg-white/5 animate-pulse" style={{ height: `${Math.random() * 200 + 200}px` }} />)}
          </div>
        ) : posts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-serif mb-1">No articles found</h3>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {posts?.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="break-inside-avoid"
              >
                <Link href={`/blog/${post.id}`} className="group block mb-6">
                  <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)]">
                    <div className="relative bg-black/20 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{post.category}</span>
                        <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
                      </div>
                      <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 font-light">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <span className="text-xs text-muted-foreground">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</span>
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
