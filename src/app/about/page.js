import Image from 'next/image';

export default function About() {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '40vh',
        minHeight: '300px',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to right, rgba(58, 44, 39, 0.8) 0%, rgba(58, 44, 39, 0.8) 100%), url("/about_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--text-light)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>About Our Mission</h1>
          <p style={{ fontSize: '1.2rem', color: '#E2DDD5', maxWidth: '600px', margin: '0 auto' }}>Establishing a professional network of care for urban wildlife.</p>
        </div>
      </section>

      <div className="container" style={{ padding: '5rem 0' }}>
        <div className="grid-3" style={{ gap: '4rem', alignItems: 'center' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ color: 'var(--bg-primary)', textAlign: 'left', marginBottom: '2rem', fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Transforming Animal Rescue Operations</h2>
            <div style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-dark)' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Jeev Rakshak operates at the intersection of technology and compassion. Millions of stray animals inhabit our cities, yet the infrastructure to provide them with emergency medical care has historically been fragmented and inefficient.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                We have built a proprietary AI-driven dispatch system that eliminates the friction between a concerned citizen spotting an injured animal and a certified veterinary professional arriving at the scene. By accurately triaging incidents and routing them geographically, we ensure that resources are deployed where they are needed most, instantly.
              </p>
              <p>
                Our network strictly comprises certified NGOs and verified clinical partners in the Kanpur district, guaranteeing professional, ethical, and immediate medical intervention.
              </p>
            </div>
          </div>
          
          <div className="card glass-dark" style={{ backgroundColor: 'var(--bg-primary)', padding: '3rem 2rem', color: 'var(--text-light)', border: 'none' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem', fontSize: '1.6rem' }}>Our Core Values</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Rapid Response</strong>
                <span style={{ color: '#A39994', fontSize: '0.95rem' }}>Minimizing dispatch times to maximize survival rates.</span>
              </li>
              <li style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Clinical Excellence</strong>
                <span style={{ color: '#A39994', fontSize: '0.95rem' }}>Partnering exclusively with verified veterinary professionals.</span>
              </li>
              <li>
                <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Technological Innovation</strong>
                <span style={{ color: '#A39994', fontSize: '0.95rem' }}>Leveraging AI to optimize emergency logistics.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
