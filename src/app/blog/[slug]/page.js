import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPost({ params }) {
  // In a real app, you would fetch the blog post data based on the slug from a database
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div style={{ padding: '4rem 0', backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <h1 style={{ color: 'var(--bg-primary)', fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2, letterSpacing: '-1px' }}>
          {title}
        </h1>
        
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> July 24, 2026</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Jeev Rakshak Expert</span>
        </div>
        
        <div className="prose" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            When an animal is injured, the first few moments are critical. By taking the right steps, you can significantly increase the chances of survival and recovery while waiting for professional help to arrive.
          </p>
          <h2 style={{ fontSize: '2rem', color: 'var(--bg-primary)', margin: '2.5rem 0 1rem 0' }}>1. Ensure Personal Safety First</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            An injured animal is often scared, in pain, and confused. Even the friendliest dog or cat might bite out of fear. Always approach slowly, avoid direct eye contact initially, and speak in a soft, soothing voice. If the animal shows aggression, do not force interaction. Wait for the NGO professionals.
          </p>
          <h2 style={{ fontSize: '2rem', color: 'var(--bg-primary)', margin: '2.5rem 0 1rem 0' }}>2. Do Not Move Them Unnecessarily</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            If the animal has suffered trauma (like a car accident), moving them incorrectly can worsen spinal injuries or internal bleeding. Only move them if they are in immediate danger (e.g., in the middle of a busy road). If you must move them, use a flat board or a thick blanket as a makeshift stretcher.
          </p>
          <h2 style={{ fontSize: '2rem', color: 'var(--bg-primary)', margin: '2.5rem 0 1rem 0' }}>3. Use the Jeev Rakshak App</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The most effective action you can take is to immediately upload a photo and location coordinates using our reporting tool. The AI will instantly categorize the emergency and dispatch the nearest verified NGO partner in Kanpur directly to your location.
          </p>
        </div>

      </div>
    </div>
  );
}
