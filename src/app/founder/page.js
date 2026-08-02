import Image from 'next/image';

export default function Founder() {
  return (
    <div style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="grid-3" style={{ alignItems: 'center', gap: '4rem' }}>
          
          {/* Image Column */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(58, 44, 39, 0.15)',
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '3/4'
            }}>
              <Image 
                src="/founder/naman.jpg" 
                alt="Naman Shukla - Founder" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Text Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <h1 style={{ color: 'var(--bg-primary)', marginBottom: '0.5rem' }}>Naman Shukla</h1>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '2rem', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>Founder, Jeev Rakshak</h3>
            
            <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-dark)' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                "The greatness of a nation and its moral progress can be judged by the way its animals are treated."
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Growing up, I witnessed countless stray animals suffering on the streets without any medical attention. Often, people wanted to help but didn't know who to call or where to take them. This helplessness is what inspired the creation of Jeev Rakshak.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Our goal isn't just to build technology; it's to build a bridge of compassion. By leveraging AI and real-time mapping, we are empowering ordinary citizens to become instant lifesavers. 
              </p>
              <p>
                Every animal deserves a fighting chance. Thank you for joining us on this mission.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
