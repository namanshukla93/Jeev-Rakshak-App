import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    slug: 'first-aid-for-strays',
    title: 'Essential First Aid for Injured Strays: What to Do Before the NGO Arrives',
    excerpt: 'Learn the critical first steps you should take when you encounter an injured animal to ensure their safety and yours.',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop',
    date: 'July 24, 2026',
    author: 'Dr. Neha Sharma'
  },
  {
    slug: 'impact-of-rapid-dispatch',
    title: 'How Rapid AI Dispatch is Changing the Landscape of Animal Welfare in India',
    excerpt: 'An inside look at how reducing response times from hours to minutes significantly increases the survival rate of urban wildlife.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop',
    date: 'July 20, 2026',
    author: 'Naman Shukla'
  },
  {
    slug: 'community-feeding-guidelines',
    title: 'Community Feeding Guidelines: Best Practices for Stray Animal Care',
    excerpt: 'Feeding strays is a noble act, but it must be done responsibly. Discover the legal and ethical guidelines for community feeders.',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1000&auto=format&fit=crop',
    date: 'July 15, 2026',
    author: 'Jeev Rakshak Team'
  }
];

export default function BlogList() {
  return (
    <div style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ color: 'var(--bg-primary)', letterSpacing: '-0.5px' }}>Insights & <span style={{ color: 'var(--accent-color)' }}>Updates</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Read the latest news, expert veterinary advice, and impact stories from the Jeev Rakshak network.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '2.5rem' }}>
          {BLOG_POSTS.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {post.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {post.author}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--bg-primary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', flexGrow: 1 }}>
                    {post.excerpt}
                  </p>
                  
                  <div style={{ color: 'var(--accent-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
