'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 100,
    }}>
      {/* Main Floating Rounded Navbar */}
      <div style={{ 
        padding: '1.2rem 1.5rem', 
        maxWidth: '1200px', 
        margin: '1rem auto 0 auto',
      }}>
        <nav className="nav-mobile-padding" style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '9999px',
          padding: '0.75rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'relative'
        }}>
          {/* Logo on Left */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderRadius: '50%', 
              padding: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Shield size={22} color="var(--accent-color)" />
            </div>
            <span style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800, 
              color: 'var(--text-dark)', 
              fontFamily: 'var(--font-outfit)', 
              letterSpacing: '-0.5px' 
            }}>
              Jeev Rakshak
            </span>
          </Link>

          {/* Desktop Navigation Links in Center */}
          <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Home</Link>
            <Link href="/about" style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Us</Link>
            <Link href="/founder" style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder's Desk</Link>
            <Link href="/blog" style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog</Link>
            <Link href="/contact" style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</Link>
          </div>

          {/* NGO Action on Right & Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/ngo/login" className="btn btn-primary hidden-mobile" style={{ 
              padding: '0.6rem 1.5rem', 
              fontSize: '0.85rem', 
              borderRadius: '9999px',
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              fontWeight: 700
            }}>
              NGO Login
            </Link>

            {/* Hamburger Icon for Mobile */}
            <button 
              className="mobile-only" 
              onClick={toggleMenu}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isOpen ? <X size={28} color="var(--text-dark)" /> : <Menu size={28} color="var(--text-dark)" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="mobile-only" style={{
            position: 'absolute',
            top: '5rem',
            left: '1.5rem',
            right: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 99
          }}>
            <Link href="/" onClick={toggleMenu} style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Home</Link>
            <Link href="/about" onClick={toggleMenu} style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Us</Link>
            <Link href="/founder" onClick={toggleMenu} style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder's Desk</Link>
            <Link href="/blog" onClick={toggleMenu} style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog</Link>
            <Link href="/contact" onClick={toggleMenu} style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</Link>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }}></div>
            <Link href="/ngo/login" onClick={toggleMenu} className="btn btn-primary" style={{ textAlign: 'center', padding: '0.8rem', borderRadius: '8px' }}>
              NGO Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
