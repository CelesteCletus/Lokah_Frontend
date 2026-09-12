import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Calendar, User, ArrowRight, X, Clock, Share2 } from 'lucide-react';
import PageHero from '../../components/PageHero';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import type { Blog as BlogType } from '../../lib/db';

export default function Blog() {
  const { onOpenBooking, blogs } = useOutletContext<LayoutContextType>();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Engineering' | 'Design' | 'Planning'>('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArticle, setSelectedArticleState] = useState<BlogType | null>(null);

  const posts = blogs;

  // Open the article referenced by ?article=<id> (e.g. from a shared link) once posts are loaded
  useEffect(() => {
    const articleId = searchParams.get('article');
    if (!articleId || posts.length === 0) return;
    const match = posts.find((p) => String(p.id) === articleId);
    if (match) setSelectedArticleState(match);
  }, [searchParams, posts]);

  const setSelectedArticle = (article: BlogType | null) => {
    setSelectedArticleState(article);
    const next = new URLSearchParams(searchParams);
    if (article) {
      next.set('article', String(article.id));
    } else {
      next.delete('article');
    }
    setSearchParams(next, { replace: true });
  };

  const categories: ('All' | 'Engineering' | 'Design' | 'Planning')[] = ['All', 'Engineering', 'Design', 'Planning'];

  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'All') return true;
    return post.category === activeCategory;
  });

  const featuredPost = posts.find(p => p.featured);
  const remainingPosts = filteredPosts.filter(p => !p.featured || activeCategory !== 'All');

  // Simple Markdown Renderer for luxury reading layout
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="font-display text-xl sm:text-2xl text-gradient-gold font-semibold mt-8 mb-4 border-b border-gold-500/10 pb-2">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="font-display text-2xl sm:text-3xl text-ivory-50 font-semibold mt-10 mb-5">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc list-inside pl-4 space-y-3 text-ivory-300 font-light my-5 text-sm sm:text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i} className="marker:text-gold-500">
                {item.replace(/^(\d+\.\s*|-\s*)/, '')}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light mb-6 whitespace-pre-wrap">
          {paragraph}
        </p>
      );
    });
  };

  const handleShare = (article: BlogType) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/blog?article=${article.id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <PageHero
        title="Lokah Insights"
        subtitle="Technical construction advice, engineering methodologies, and design inspirations from our principal builders."
        imageSrc="/images/hero/about-hero.jpg"
        category="Corporate Blog"
      />

      {/* Featured Article Section */}
      {activeCategory === 'All' && featuredPost && (
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
          <div className="text-center lg:text-left mb-12">
            <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold">
              Featured Insight
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedArticle(featuredPost)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center glass-card overflow-hidden border-gold-500/20 group cursor-pointer"
          >
            <div className="aspect-[16/10] lg:aspect-square overflow-hidden relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-950/65 to-transparent" />
            </div>

            <div className="p-8 lg:p-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-body text-ivory-400">
                <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-450 font-semibold uppercase tracking-wider">
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gold-500" />
                  {featuredPost.author}
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl text-ivory-50 font-light group-hover:text-champagne-400 transition-colors">
                {featuredPost.title}
              </h3>
              
              <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
                {featuredPost.excerpt}
              </p>

              <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-body font-semibold tracking-wider uppercase group-hover:text-gold-300 transition-colors">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Category Selection Tabs */}
      <section className="py-12 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-body font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-champagne-500 to-gold-500 text-matte-black shadow-gold'
                  : 'bg-matte-900 border border-ivory-400/10 text-ivory-300 hover:border-gold-500/30'
              }`}
            >
              {cat === 'All' ? 'All Articles' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid List */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        {remainingPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-ivory-400 text-sm font-light">No other articles in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {remainingPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedArticle(post)}
                className="glass-card overflow-hidden flex flex-col justify-between group cursor-pointer border border-gold-500/10 hover:border-gold-500/30 transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-950/60 to-transparent" />
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-body text-ivory-400">
                      <span className="text-gold-450 font-semibold uppercase tracking-wider">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    
                    <h3 className="font-display text-xl text-ivory-50 font-light group-hover:text-champagne-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="font-body text-ivory-355 text-xs sm:text-sm leading-relaxed font-light">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 pt-0 mt-auto">
                  <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-body font-semibold tracking-wider uppercase group-hover:text-gold-300 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* ARTICLE READER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-matte-950 border border-gold-500/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Floating Close & Share */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => handleShare(selectedArticle)}
                  className="w-10 h-10 flex items-center justify-center bg-matte-black/80 backdrop-blur-sm rounded-full border border-ivory-400/20 text-ivory-300 hover:text-gold-450 hover:border-gold-500/40 transition-all"
                  aria-label="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 flex items-center justify-center bg-matte-black/80 backdrop-blur-sm rounded-full border border-ivory-400/20 text-ivory-300 hover:text-ivory-50 hover:border-ivory-400/40 transition-all"
                  aria-label="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Reader Layout */}
              <div className="overflow-y-auto pr-1 hide-scrollbar flex-grow">
                {/* Visual Cover Header */}
                <div className="relative aspect-[21/9] w-full bg-matte-900 overflow-hidden">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-matte-955/20 to-transparent" />
                </div>

                {/* Article Info */}
                <div className="px-6 md:px-12 pt-8 pb-12 space-y-6 max-w-3xl mx-auto">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-ivory-400">
                    <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-450 font-semibold uppercase tracking-wider">
                      {selectedArticle.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                      {selectedArticle.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gold-500" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {Math.ceil((selectedArticle.content?.length || 1000) / 1000)} min read
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 leading-tight">
                    {selectedArticle.title}
                  </h1>

                  <div className="w-20 h-[2px] bg-gradient-to-r from-champagne-500 to-gold-500 my-4" />

                  {/* Body Content */}
                  <article className="prose prose-invert max-w-none text-left">
                    {renderMarkdown(selectedArticle.content)}
                  </article>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
