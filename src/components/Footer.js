import { MapPin, Phone, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1412', color: 'var(--text-light)', padding: '4rem 0 0 0' }}>
      <div className="container">
        <div className="grid-3" style={{ marginBottom: '3rem', gap: '3rem' }}>
          
          {/* Brand & About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
              <Shield size={28} />
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-outfit)', letterSpacing: '-0.5px' }}>Jeev Rakshak</h3>
            </div>
            <p style={{ color: '#A39994', lineHeight: 1.8, fontSize: '0.95rem' }}>
              A professional network dedicated to providing rapid medical assistance and rescue services for injured animals across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', borderBottom: '2px solid var(--accent-color)', display: 'inline-block', paddingBottom: '0.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/" style={{ color: '#A39994', transition: 'color 0.2s', textDecoration: 'none' }}>Home</Link></li>
              <li><Link href="/about" style={{ color: '#A39994', transition: 'color 0.2s', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link href="/founder" style={{ color: '#A39994', transition: 'color 0.2s', textDecoration: 'none' }}>Founder's Desk</Link></li>
              <li><Link href="/blog" style={{ color: '#A39994', transition: 'color 0.2s', textDecoration: 'none' }}>Blog</Link></li>
              <li><Link href="/contact" style={{ color: '#A39994', transition: 'color 0.2s', textDecoration: 'none' }}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', borderBottom: '2px solid var(--accent-color)', display: 'inline-block', paddingBottom: '0.5rem' }}>Contact Information</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#A39994', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={20} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Kidwai Nagar, Kanpur 208011<br/>Uttar Pradesh, India</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                <span>+91 9369617224</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={20} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                <span>namanshukla9889@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div style={{ backgroundColor: '#110D0B', padding: '1.5rem 0', textAlign: 'center', color: '#7A6961', fontSize: '0.9rem' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Jeev Rakshak Animal Rescue. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
