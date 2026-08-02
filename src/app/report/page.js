'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, AlertCircle, CheckCircle, UploadCloud, ChevronRight, Activity, Building, Phone, AlertTriangle, Clock, Heart, Shield, XCircle } from 'lucide-react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Render the structured AI analysis as clean UI cards
function MedicalReportCard({ analysis, rawText }) {
  if (analysis && typeof analysis === 'object') {
    const urgencyColors = {
      HIGH: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', icon: AlertTriangle },
      MEDIUM: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', icon: Clock },
      LOW: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534', icon: CheckCircle },
    };
    const urgency = urgencyColors[analysis.urgencyLevel] || urgencyColors.MEDIUM;
    const UrgencyIcon = urgency.icon;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Animal & Urgency Header */}
        <div className="responsive-grid-2" style={{ gap: '1rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: '#F8F6F0', borderRadius: '10px', border: '1px solid #E2DDD5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Animal Identified</div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--bg-primary)' }}>{analysis.species}</div>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: urgency.bg, borderRadius: '10px', border: `1px solid ${urgency.border}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: urgency.text, marginBottom: '0.4rem' }}>Urgency Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UrgencyIcon size={18} color={urgency.text} />
              <span style={{ fontWeight: 700, fontSize: '1.15rem', color: urgency.text }}>{analysis.urgencyLevel}</span>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div style={{ padding: '1.25rem', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Physical Condition</div>
          <p style={{ margin: 0, color: 'var(--text-dark)', lineHeight: 1.6 }}>{analysis.condition}</p>
        </div>

        {/* Injuries */}
        {analysis.injuries && analysis.injuries.length > 0 && (
          <div style={{ padding: '1.25rem', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#991B1B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={14} /> Observed Injuries
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {analysis.injuries.map((injury, i) => (
                <li key={i} style={{ color: '#7F1D1D', lineHeight: 1.5 }}>{injury}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Why this urgency */}
        {analysis.urgencyReason && (
          <div style={{ padding: '1.25rem', backgroundColor: urgency.bg, borderRadius: '10px', border: `1px solid ${urgency.border}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: urgency.text, marginBottom: '0.4rem' }}>Urgency Reason</div>
            <p style={{ margin: 0, color: urgency.text, lineHeight: 1.6 }}>{analysis.urgencyReason}</p>
          </div>
        )}

        {/* Immediate steps */}
        {analysis.immediateSteps && analysis.immediateSteps.length > 0 && (
          <div style={{ padding: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1E40AF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} /> Immediate Safety Steps
            </div>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analysis.immediateSteps.map((step, i) => (
                <li key={i} style={{ color: '#1E3A8A', lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Vet recommendation */}
        {analysis.vetRecommendation && (
          <div style={{ padding: '1.25rem', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #86EFAC' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#166534', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={14} /> Veterinary Recommendation
            </div>
            <p style={{ margin: 0, color: '#14532D', lineHeight: 1.6 }}>{analysis.vetRecommendation}</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback: render raw text without markdown symbols
  if (rawText) {
    const cleanText = rawText
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    return (
      <div
        style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}
        dangerouslySetInnerHTML={{ __html: `<p>${cleanText}</p>` }}
      />
    );
  }

  return null;
}

export default function ReportAnimal() {
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNgos, setSelectedNgos] = useState([]);
  const [dispatchStatus, setDispatchStatus] = useState('idle');
  const [ngos, setNgos] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [clinicError, setClinicError] = useState(null);
  const [smsSummary, setSmsSummary] = useState(null);

  // Fetch real-time clinics using Google Maps Places API
  const fetchClinics = useCallback(async (loc) => {
    if (!loc || !loc.trim()) return;
    setLoadingClinics(true);
    setClinicError(null);
    try {
      let res;
      if (typeof loc === 'object' && loc.lat && loc.lng) {
        // We received coordinates
        res = await fetch(`/api/clinics?lat=${loc.lat}&lng=${loc.lng}&location=${encodeURIComponent(loc.readable || '')}`);
      } else {
        // We received a string location
        res = await fetch(`/api/clinics?location=${encodeURIComponent(loc)}`);
      }
      
      const data = await res.json();
      if (data.error) {
        setClinicError(data.error);
        setNgos([]);
      } else {
        setNgos(data.clinics || []);
        if (data.message) setClinicError(data.message); // e.g. no results found
      }
    } catch (err) {
      console.error('Failed to load clinics', err);
      setClinicError('Failed to search for clinics. Please try again.');
    } finally {
      setLoadingClinics(false);
    }
  }, []);

  // When user finishes typing location (after 1.2s debounce), fetch nearby clinics
  useEffect(() => {
    if (!location.trim()) { setNgos([]); setClinicError(null); return; }
    const timer = setTimeout(() => fetchClinics(location), 1200);
    return () => clearTimeout(timer);
  }, [location, fetchClinics]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Compress to JPEG with 0.7 quality to keep payload < 500KB
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPreview(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLoadingClinics(true);
    setClinicError(null);
    setLocation('Locating...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get a readable address instead of raw coordinates
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          
          if (geoData && geoData.display_name) {
            // Use the readable address
            const shortAddress = geoData.display_name.split(',').slice(0, 3).join(',');
            setLocation(shortAddress);
            fetchClinics({ lat: latitude, lng: longitude, readable: shortAddress });
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            fetchClinics({ lat: latitude, lng: longitude });
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          fetchClinics({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setLocation('');
        setLoadingClinics(false);
      }
    );
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!preview || !location) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const aiResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: preview }),
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(aiData.error || 'Failed to analyze image.');
      }

      if (!aiData.isAnimal) {
        setError(aiData.message || 'No animal detected in the image. Please upload a clear photo of the injured animal.');
        return;
      }

      setResult({ analysis: aiData.analysis, rawText: aiData.rawText, imageUrl: preview });
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispatch = async () => {
    if (selectedNgos.length === 0) return;
    setDispatchStatus('sending');

    try {
      const analysisText = result.rawText || JSON.stringify(result.analysis);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          analysis: analysisText,
          imageUrl: result.imageUrl,
          assignedNgos: selectedNgos.map(ngo => ({ name: ngo.name, phone: ngo.phone || '+919369617224' })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Dispatch failed');
      }

      if (data.smsSummary) {
        setSmsSummary(data.smsSummary);
      }

      setDispatchStatus('sent');
    } catch (err) {
      alert(`Failed to dispatch alert: ${err.message}. Please try again.`);
      setDispatchStatus('idle');
    }
  };

  return (
    <div style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>

        {!result ? (
          <div className="card mobile-card-padding" style={{ padding: '3.5rem 3rem', backgroundColor: '#fff', border: '1px solid var(--border-color)' }}>
            <h1 style={{ textAlign: 'center', color: 'var(--bg-primary)', marginBottom: '0.75rem', fontSize: '2.4rem' }}>Report Emergency</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
              Upload a clear photo of the injured animal to get an AI medical assessment and find nearby rescue clinics.
            </p>

            {error && (
              <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '10px', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', border: '1px solid #FCA5A5' }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1rem' }}>Animal Photo</label>
                <div style={{
                  border: `2px dashed ${preview ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  backgroundColor: preview ? '#FFFBEB' : '#FAFAFA',
                  transition: 'all 0.2s ease'
                }}>
                  {preview ? (
                    <div style={{ position: 'relative' }}>
                      <img src={preview} alt="Preview" style={{ maxHeight: '320px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', margin: '0 auto', display: 'block', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
                      <button
                        type="button"
                        onClick={() => { setPreview(null); }}
                        className="btn btn-secondary"
                        style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
                      <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '1.25rem', backgroundColor: 'rgba(241,185,66,0.1)', borderRadius: '50%' }}>
                          <UploadCloud size={36} color="var(--accent-color)" />
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>Click to upload animal photo</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>JPG, PNG – must clearly show an injured animal</div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1rem' }}>Incident Location</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Hazratganj, Lucknow or MG Road, Bangalore"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ paddingLeft: '3rem' }}
                      required
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', borderColor: 'var(--border-color)', color: 'var(--bg-primary)' }}
                  >
                    <MapPin size={16} /> Live Location
                  </button>
                </div>
                {location && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem', color: loadingClinics ? 'var(--text-muted)' : clinicError ? '#B45309' : '#15803D' }}>
                    {loadingClinics
                      ? '🔍 Searching for real clinics near this location...'
                      : clinicError
                      ? `⚠️ ${clinicError}`
                      : `✓ ${ngos.length} real clinic${ngos.length !== 1 ? 's' : ''} found near this location`}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '1.2rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                disabled={!preview || !location || isSubmitting}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Activity size={20} className="spin" /> Analyzing Image...
                  </span>
                ) : (
                  'Get AI Assessment & Find Clinics'
                )}
              </button>
            </form>
          </div>

        ) : dispatchStatus === 'sent' ? (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderTop: '6px solid #10B981' }}>
            <CheckCircle size={68} color="#10B981" style={{ margin: '0 auto 1.25rem auto' }} />
            <h2 style={{ color: 'var(--bg-primary)', marginBottom: '0.75rem', fontSize: '2.2rem' }}>Alert & SMS Dispatched!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              The AI medical assessment and location has been sent to <strong>{selectedNgos.length} selected NGO(s)/Clinic(s)</strong>.
            </p>

            {/* Live SMS Delivery Receipts */}
            <div style={{ maxWidth: '560px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--bg-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                📲 SMS Alert Delivery Status:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedNgos.map((ngo, idx) => {
                  const smsInfo = smsSummary?.ngoAlerts?.find(n => n.name === ngo.name);
                  return (
                    <div key={idx} style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 600, color: '#166534' }}>
                        🏥 {ngo.name} ({ngo.phone || '+919369617224'})
                      </span>
                      <span style={{ fontSize: '0.78rem', backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                        {smsInfo?.sid ? `SENT (SID: ${smsInfo.sid.slice(0, 10)}...)` : 'SMS SENT'}
                      </span>
                    </div>
                  );
                })}
                <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#1E40AF' }}>
                    🚨 Central Rescue Broadcast (+91 9369617224)
                  </span>
                  <span style={{ fontSize: '0.78rem', backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    ALERT SENT
                  </span>
                </div>
              </div>
            </div>

            <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ color: 'var(--text-dark)', borderColor: 'var(--border-color)' }}>
              Report Another Incident
            </button>
          </div>

        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Medical Assessment Report */}
            <div className="card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', color: 'white', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={22} color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>AI Medical Assessment Report</h3>
              </div>
              <div className={result.imageUrl ? "responsive-grid-img-content" : ""} style={{ display: result.imageUrl ? undefined : 'grid', gridTemplateColumns: result.imageUrl ? undefined : '1fr', gap: 0 }}>
                {result.imageUrl && (
                  <div style={{ backgroundColor: '#f5f5f5' }}>
                    <img src={result.imageUrl} alt="Reported Animal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '2rem' }}>
                  <MedicalReportCard analysis={result.analysis} rawText={result.rawText} />
                </div>
              </div>
            </div>

            {/* Real-time Map & Clinic List */}
            <h3 style={{ color: 'var(--bg-primary)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
              Nearby Rescue Clinics & NGOs
              {loadingClinics && <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.75rem' }}>🔍 Searching real clinics...</span>}
            </h3>

            {/* Map and Clinic List will be displayed side by side */}

            <div className="responsive-grid-3-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ngos.length === 0 && !loadingClinics && (
                  <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '10px', backgroundColor: '#FAFAFA' }}>
                    <MapPin size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>No clinics loaded yet</div>
                    <div style={{ fontSize: '0.85rem' }}>Enter your incident location above to find real nearby clinics</div>
                  </div>
                )}
                {ngos.map(ngo => {
                  const isSelected = selectedNgos.some(n => n.id === ngo.id);
                  const activePhone = ngo.phone || '+919369617224';

                  return (
                  <div
                    key={ngo.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedNgos(selectedNgos.filter(n => n.id !== ngo.id));
                      } else {
                        setSelectedNgos([...selectedNgos, { ...ngo, phone: activePhone }]);
                      }
                    }}
                    style={{
                      padding: '1.25rem 1.5rem',
                      backgroundColor: '#fff',
                      border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 16px rgba(241,185,66,0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <h4 style={{ color: 'var(--bg-primary)', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Building size={15} /> {ngo.name}
                          </h4>
                          {ngo.isOpen === true && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '999px' }}>OPEN</span>
                          )}
                          {ngo.isOpen === false && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '999px' }}>CLOSED</span>
                          )}
                          {ngo.rating && (
                            <span style={{ fontSize: '0.78rem', color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 7px', borderRadius: '999px', fontWeight: 600 }}>⭐ {ngo.rating}</span>
                          )}
                        </div>

                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {ngo.distance}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#1D4ED8', fontWeight: 600 }}>
                            <Phone size={12} /> {activePhone}
                          </span>
                        </div>
                        {ngo.address && <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.2rem' }}>{ngo.address}</div>}

                        {isSelected && (
                          <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.75rem', backgroundColor: '#FFFBEB', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.78rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>📲 SMS alert will be sent to <strong>{activePhone}</strong></span>
                          </div>
                        )}
                      </div>
                      {isSelected && <CheckCircle size={22} color="var(--accent-color)" style={{ flexShrink: 0, marginLeft: '0.75rem' }} />}
                    </div>
                  </div>
                )})}

                <button
                  onClick={handleDispatch}
                  disabled={selectedNgos.length === 0 || dispatchStatus !== 'idle'}
                  className="btn btn-primary"
                  style={{ padding: '1.1rem', fontSize: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  {dispatchStatus === 'sending' ? (
                    <><Activity size={18} className="spin" /> Sending Dispatch & SMS...</>
                  ) : (
                    <>{`📲 Dispatch & Send SMS to ${selectedNgos.length} NGO(s)`} <ChevronRight size={18} /></>
                  )}
                </button>
              </div>

              {/* Map */}
              <div style={{ height: '420px', backgroundColor: '#eaeaea', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <Map nativeNGOs={ngos} selectedNgo={selectedNgos.length > 0 ? selectedNgos[0] : null} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
