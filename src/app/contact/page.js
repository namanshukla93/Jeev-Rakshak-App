'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('There was a problem sending your message. Please try again.');
    }
  };

  return (
    <div style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ color: 'var(--bg-primary)', letterSpacing: '-0.5px' }}>Contact <span style={{ color: 'var(--accent-color)' }}>Us</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Whether you're a certified NGO wanting to join our network, or a citizen with questions about our mission, we'd love to hear from you.
          </p>
        </div>
        
        <div className="grid-3" style={{ gap: '3rem' }}>
          {/* Contact Details Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div className="card" style={{ padding: '3rem 2rem', height: '100%', backgroundColor: 'var(--bg-primary)', color: 'var(--text-light)', border: 'none' }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '2rem', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Headquarters</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <MapPin size={24} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Address</h4>
                    <p style={{ color: '#E2DDD5', lineHeight: 1.6 }}>Kidwai Nagar, Kanpur 208011<br/>Uttar Pradesh, India</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Phone size={24} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Phone</h4>
                    <p style={{ color: '#E2DDD5', lineHeight: 1.6 }}>+91 9369617224</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Mail size={24} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Email</h4>
                    <p style={{ color: '#E2DDD5', lineHeight: 1.6 }}>namanshukla9889@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card glass" style={{ padding: '3rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--bg-primary)', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Send us a Message</h3>
              
              {status === 'success' ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <CheckCircle size={48} color="#16A34A" style={{ margin: '0 auto 1rem auto' }} />
                  <h4 style={{ color: '#166534', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Message Sent Successfully!</h4>
                  <p style={{ color: '#15803D' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button onClick={() => setStatus('idle')} className="btn btn-outline" style={{ marginTop: '1.5rem', color: '#166534', borderColor: '#166534' }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {status === 'error' && (
                    <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={20} />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Your Message</label>
                    <textarea 
                      className="form-textarea" 
                      rows="6" 
                      placeholder="How can we collaborate?" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ alignSelf: 'flex-start', padding: '0.8rem 2rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending...' : 'Submit Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
