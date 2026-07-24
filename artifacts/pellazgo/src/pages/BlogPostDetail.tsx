import { useParams, Link } from 'wouter';
import { useGetBlogPost } from '@workspace/api-client-react';
import { ChevronLeft, Share2, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BlogPostDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { toast } = useToast();

  const { data: post, isLoading } = useGetBlogPost(id, { query: { enabled: !!id } });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: "Link copied to clipboard." });
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8"><div className="h-64 bg-white/5 rounded-2xl" /><div className="h-96 bg-white/5 rounded-2xl max-w-3xl mx-auto" /></div>;
  if (!post) return <div className="p-12 text-center text-muted-foreground">Article not found.</div>;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-card">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <Link href="/blog" className="w-10 h-10 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-background/80 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-background/80 transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/80">
            <div className="flex items-center gap-2">
              <User size={14} className="text-primary" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 md:px-12 py-16">
        <p className="text-xl md:text-2xl font-serif text-muted-foreground leading-relaxed mb-12 italic">
          "{post.excerpt}"
        </p>

        <div className="prose prose-invert prose-lg max-w-none text-foreground/80 font-light leading-relaxed space-y-6">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <br /><br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              <br /><br />
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
