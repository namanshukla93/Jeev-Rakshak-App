import Link from 'next/link';
import { Camera, CheckCircle, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: 'max(85vh, 600px)',
        marginTop: '-135px', /* Pull behind navbar */
        paddingTop: '135px', /* Push content down */
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: 'linear-gradient(to right, rgba(58, 44, 39, 0.95) 0%, rgba(58, 44, 39, 0.6) 100%), url("/hero_bg_new.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--text-light)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              <Shield size={18} />
              <span>Professional Rescue Network</span>
            </div>
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
              India's Premier <br/><span style={{ color: 'var(--accent-color)' }}>Animal Rescue</span> Initiative
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: 1.7, color: '#E2DDD5' }}>
              We facilitate rapid medical intervention for stray animals by connecting concerned citizens with certified local veterinary clinics and NGOs through our advanced AI-driven dispatch system.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/report" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={20} />
                Report an Emergency
              </Link>
              <Link href="/about" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '4px' }}>
                Discover Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem auto' }}>
            <h2 style={{ color: 'var(--bg-primary)', fontSize: '2.8rem', letterSpacing: '-0.5px' }}>Operational Protocol</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.7 }}>
              Our streamlined process ensures that every reported incident is accurately assessed and instantly routed to the nearest qualified responders.
            </p>
          </div>

          <div className="grid-3">
            <div className="card glass-dark" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-light)', borderRadius: '8px', border: 'none' }}>
              <div className="card-content" style={{ padding: '3.5rem 2.5rem' }}>
                <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.25rem', backgroundColor: 'rgba(241, 185, 66, 0.1)', borderRadius: '12px' }}>
                  <Camera size={40} color="var(--accent-color)" />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--accent-color)' }}>1. Incident Documentation</h3>
                <p style={{ color: '#E2DDD5', lineHeight: 1.7, fontSize: '1.05rem' }}>Securely upload photographic evidence and precise geographic coordinates of the injured animal through our portal.</p>
              </div>
            </div>
            
            <div className="card" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'none' }}>
              <div className="card-content" style={{ padding: '3.5rem 2.5rem' }}>
                <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.25rem', backgroundColor: 'rgba(58, 44, 39, 0.05)', borderRadius: '12px' }}>
                  <CheckCircle size={40} color="var(--bg-primary)" />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--bg-primary)' }}>2. AI Verification</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>Our proprietary AI models instantly verify the presence of an animal, assess injury severity, and categorize the urgency.</p>
              </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'none' }}>
              <div className="card-content" style={{ padding: '3.5rem 2.5rem' }}>
                <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.25rem', backgroundColor: 'rgba(58, 44, 39, 0.05)', borderRadius: '12px' }}>
                  <Shield size={40} color="var(--bg-primary)" />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--bg-primary)' }}>3. Targeted Dispatch</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>The system identifies certified native NGOs within a 5km radius, allowing you to trigger a direct alert to their dispatch dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-dark" style={{ padding: '6rem 0' }}>
        <div className="container grid-3" style={{ textAlign: 'center' }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: 700, color: 'var(--accent-color)', fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>50+</div>
            <p style={{ fontSize: '1.1rem', color: '#E2DDD5', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Certified Partners</p>
          </div>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: 700, color: 'var(--accent-color)', fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>10k+</div>
            <p style={{ fontSize: '1.1rem', color: '#E2DDD5', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Successful Rescues</p>
          </div>
          <div>
            <div style={{ fontSize: '4.5rem', fontWeight: 700, color: 'var(--accent-color)', fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>&lt; 5m</div>
            <p style={{ fontSize: '1.1rem', color: '#E2DDD5', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Average Response Time</p>
          </div>
        </div>
      </section>
    </>
  );
}
