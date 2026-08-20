'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, MapPin, LogOut, Heart, AlertCircle, AlertTriangle, Shield, XCircle, Send, MessageSquare, Smartphone, RefreshCw } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

function MedicalReportCard({ analysisStr }) {
  let analysis = null;
  try {
    analysis = typeof analysisStr === 'string' ? JSON.parse(analysisStr) : analysisStr;
  } catch (e) {
    analysis = null;
  }

  if (analysis && typeof analysis === 'object') {
    const urgencyColors = {
      HIGH: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', icon: AlertTriangle },
      MEDIUM: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', icon: Clock },
      LOW: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534', icon: CheckCircle },
    };
    const urgency = urgencyColors[analysis.urgencyLevel] || urgencyColors.MEDIUM;
    const UrgencyIcon = urgency.icon;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="responsive-grid-2" style={{ gap: '0.75rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#F8F6F0', borderRadius: '10px', border: '1px solid #E2DDD5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Animal Identified</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--bg-primary)' }}>{analysis.species}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: urgency.bg, borderRadius: '10px', border: `1px solid ${urgency.border}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: urgency.text, marginBottom: '0.3rem' }}>Urgency Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UrgencyIcon size={18} color={urgency.text} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: urgency.text }}>{analysis.urgencyLevel}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Physical Condition</div>
          <p style={{ margin: 0, color: 'var(--text-dark)', lineHeight: 1.5, fontSize: '0.95rem' }}>{analysis.condition}</p>
        </div>

        {analysis.injuries && analysis.injuries.length > 0 && (
          <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#991B1B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={14} /> Observed Injuries
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
              {analysis.injuries.map((injury, i) => (
                <li key={i} style={{ color: '#7F1D1D', lineHeight: 1.4 }}>{injury}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.immediateSteps && analysis.immediateSteps.length > 0 && (
          <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1E40AF', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} /> Immediate Safety Steps
            </div>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
              {analysis.immediateSteps.map((step, i) => (
                <li key={i} style={{ color: '#1E3A8A', lineHeight: 1.5 }}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  // Fallback raw string
  return (
    <div style={{ fontSize: '0.95rem', lineHeight: 1.6, padding: '1rem', backgroundColor: '#F8F6F0', borderRadius: '8px', border: '1px solid #E2DDD5' }}>
      <div dangerouslySetInnerHTML={{ __html: (analysisStr || '').replace(/\n/g, '<br/>') }} />
    </div>
  );
}

export default function NGODashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Quick SMS Tool State
  const [showSmsTool, setShowSmsTool] = useState(false);
  const [smsPhone, setSmsPhone] = useState('+919369617224');
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState(null);

  const router = useRouter();

  // Protect route
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/ngo/login');
      } else {
        const { data: ngoData, error } = await supabase
          .from('ngos')
          .select('email, name, phone')
          .eq('email', session.user.email)
          .single();
          
        if (error || !ngoData) {
          console.error("Not a registered NGO", error);
          router.push('/ngo/signup?onboarding=true');
        } else {
          setUser(ngoData);
        }
      }
    };
    checkUser();
  }, [router]);

  const fetchReports = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/reports');
      if (!res.ok) {
        throw new Error(`Failed to load reports (Status ${res.status}). Ensure you have created the 'reports' table in Supabase.`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      setError(err.message || 'Failed to connect to reports database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAccept = async (id) => {
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'ACCEPT', ngoName: user?.name, ngoPhone: user?.phone })
      });
      fetchReports();
    } catch (err) {
      console.error('Failed to accept report', err);
    }
  };

  const handleUpdateCondition = async (id, conditionReport, treatmentImageUrl) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'UPDATE_CONDITION', conditionReport, treatmentImageUrl })
      });
      if (!res.ok) throw new Error('Failed to submit treatment report.');
      fetchReports();
    } catch (err) {
      console.error('Failed to update report condition', err);
      alert(err.message || 'Failed to update condition.');
    }
  };

  const handleSendDirectSms = async (e) => {
    e.preventDefault();
    if (!smsPhone.trim() || !smsMessage.trim()) return;
    setSendingSms(true);
    setSmsResult(null);

    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toPhone: smsPhone, message: smsMessage })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setSmsResult({ success: false, error: data.error || 'Failed to send SMS' });
      } else {
        setSmsResult({ success: true, sid: data.sid, message: 'SMS sent successfully!' });
        setSmsMessage('');
      }
    } catch (err) {
      setSmsResult({ success: false, error: err.message || 'Network error sending SMS' });
    } finally {
      setSendingSms(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) {
    return <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Authenticating...</div>;
  }

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header - Mobile Responsive */}
        <div className="ngo-dashboard-header">
          <div>
            <h1 style={{ color: 'var(--bg-primary)', letterSpacing: '-0.5px', fontSize: '2rem', marginBottom: '0.3rem' }}>
              Dispatch Control Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Logged in as: <strong style={{ color: 'var(--bg-primary)' }}>{user.email}</strong> ({user.name})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSmsTool(!showSmsTool)}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Smartphone size={16} />
              {showSmsTool ? 'Hide SMS Tool' : '?? SMS Tool'}
            </button>

            <div style={{ padding: '0.5rem 1rem', backgroundColor: '#E0F2FE', color: '#0369A1', borderRadius: '9999px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#0EA5E9', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
              Monitoring Live
            </div>

            <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.88rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* Quick SMS Broadcast & Send Feature */}
        {showSmsTool && (
          <div className="ngo-sms-tool-card" style={{ borderLeft: '5px solid var(--accent-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
              <MessageSquare size={20} color="var(--accent-color)" />
              <span>SMS Emergency Broadcast Center</span>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Send real-time SMS alerts to rescue drivers, volunteer teams, or vet specialists via Twilio integration.
            </p>

            {smsResult && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                backgroundColor: smsResult.success ? '#F0FDF4' : '#FEF2F2',
                color: smsResult.success ? '#166534' : '#991B1B',
                border: `1px solid ${smsResult.success ? '#86EFAC' : '#FCA5A5'}`
              }}>
                {smsResult.success ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="#166534" />
                    <span>SMS Sent Successfully! Message SID: <strong>{smsResult.sid}</strong></span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertCircle size={16} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{smsResult.error}</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSendDirectSms} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="responsive-grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Recipient Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+919369617224"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    required
                    style={{ fontSize: '0.9rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Include country code (e.g. +91)</span>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Quick Templates</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSmsMessage('[ALERT] JEEV RAKSHAK: Immediate animal rescue needed at reported location. Please respond.')}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      Rescue Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmsMessage('[AMBULANCE] JEEV RAKSHAK: Rescue vehicle dispatched to incident site.')}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      Dispatched
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmsMessage('[VET] JEEV RAKSHAK: Critical animal case requires immediate vet consultation.')}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      Vet Required
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Message Text</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Enter custom SMS notification message..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  required
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  disabled={sendingSms}
                >
                  <Send size={16} />
                  {sendingSms ? 'Sending SMS...' : 'Send SMS Now'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Database Warning if Error */}
        {error && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #FCA5A5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
              <AlertCircle size={20} />
              <span>Database Connection Error</span>
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              {error}
            </p>
          </div>
        )}

        {/* Reports Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <RefreshCw size={20} className="spin" /> Loading dispatch data...
          </div>
        ) : reports.length === 0 ? (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <CheckCircle size={52} style={{ margin: '0 auto 1.25rem auto', color: '#10B981', opacity: 0.8 }} />
            <h3 style={{ color: 'var(--bg-primary)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>No Active Emergencies</h3>
            <p style={{ fontSize: '0.95rem' }}>The network is clear. We will alert you immediately if a dispatch is required.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onAccept={handleAccept} 
                onUpdateCondition={handleUpdateCondition}
                ngoName={user.name} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function ReportCard({ report, onAccept, onUpdateCondition, ngoName }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [treatmentTimeLeft, setTreatmentTimeLeft] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [treatmentPreview, setTreatmentPreview] = useState(null);
  const [forceShowReportForm, setForceShowReportForm] = useState(false);
  const [submittingTreatment, setSubmittingTreatment] = useState(false);

  // Card SMS Sending State
  const [showCardSms, setShowCardSms] = useState(false);
  const [cardSmsPhone, setCardSmsPhone] = useState('+919369617224');
  const [sendingCardSms, setSendingCardSms] = useState(false);
  const [cardSmsStatus, setCardSmsStatus] = useState(null);

  const isAccepted = report.status === 'ACCEPTED' || report.status === 'RESOLVED';
  const isResolved = report.status === 'RESOLVED';
  const isMine = report.assigned_ngo === ngoName || report.assigned_ngo?.startsWith(ngoName);

  const handleTreatmentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTreatmentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Accept Dispatch Countdown
  useEffect(() => {
    if (isAccepted) return;

    const calculateTimeLeft = () => {
      const created = new Date(report.created_at).getTime();
      const now = new Date().getTime();
      const diff = now - created;
      const fiveMins = 5 * 60 * 1000;
      
      if (diff > fiveMins) return 'Expired';
      
      const remaining = fiveMins - diff;
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      return `${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      if (time === 'Expired') clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [report.created_at, isAccepted]);

  // 30-Minute Post-Treatment Countdown
  useEffect(() => {
    if (!isAccepted || isResolved || !report.accepted_at) return;

    const calculateTreatmentTimeLeft = () => {
      const acceptedTime = new Date(report.accepted_at).getTime();
      const now = new Date().getTime();
      const diff = now - acceptedTime;
      const thirtyMins = 30 * 60 * 1000;
      
      if (diff > thirtyMins) return 'Time to report';
      
      const remaining = thirtyMins - diff;
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      return `${minutes}m ${seconds}s`;
    };

    setTreatmentTimeLeft(calculateTreatmentTimeLeft());
    const interval = setInterval(() => {
      const time = calculateTreatmentTimeLeft();
      setTreatmentTimeLeft(time);
      if (time === 'Time to report') clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [report.accepted_at, isAccepted, isResolved]);

  const handleConditionSubmit = async (e) => {
    e.preventDefault();
    if (!conditionInput.trim()) return;
    setSubmittingTreatment(true);
    await onUpdateCondition(report.id, conditionInput, treatmentPreview);
    setSubmittingTreatment(false);
  };

  const handleSendCardSms = async () => {
    if (!cardSmsPhone.trim()) return;
    setSendingCardSms(true);
    setCardSmsStatus(null);

    const cleanLoc = (report.location || '').split(',').slice(0, 2).join(',').trim();
    const smsText = `[ALERT] JEEV RAKSHAK DISPATCH\nLoc: ${cleanLoc}\nStatus: ${report.status}\nAssigned: ${report.assigned_ngo || 'BROADCASTED'}\nCheck dashboard for details.`;

    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toPhone: cardSmsPhone, message: smsText })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setCardSmsStatus({ success: false, error: data.error || 'Failed to send SMS' });
      } else {
        setCardSmsStatus({ success: true, sid: data.sid });
      }
    } catch (err) {
      setCardSmsStatus({ success: false, error: err.message || 'SMS Send Error' });
    } finally {
      setSendingCardSms(false);
    }
  };

  const showReportForm = isAccepted && isMine && !isResolved && (treatmentTimeLeft === 'Time to report' || forceShowReportForm);

  return (
    <div className={`ngo-report-card ${isAccepted ? 'glass' : ''}`} style={{ 
      borderLeft: isResolved ? '6px solid #3B82F6' : isAccepted ? '6px solid #10B981' : '6px solid #EF4444',
      opacity: isAccepted && !isMine ? 0.65 : 1,
    }}>
      {report.image_url && (
        <div className="ngo-report-card-image">
          <img src={report.image_url} alt="Incident Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      
      <div className="ngo-report-card-content">
        <div className="ngo-card-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '1.15rem' }}>
              <MapPin size={18} color="var(--accent-color)" /> {report.location}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Logged: {new Date(report.created_at).toLocaleString()}
            </div>
          </div>
          
          {isResolved ? (
            <div style={{ padding: '0.4rem 0.85rem', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #BFDBFE' }}>
              Resolved & Updated
            </div>
          ) : isAccepted ? (
            <div style={{ padding: '0.4rem 0.85rem', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #BBF7D0' }}>
              Accepted by {report.assigned_ngo}
            </div>
          ) : (
            <div style={{ padding: '0.4rem 0.85rem', backgroundColor: timeLeft === 'Expired' ? '#FEF2F2' : '#FEF9C3', color: timeLeft === 'Expired' ? '#991B1B' : '#854D0E', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: timeLeft === 'Expired' ? '1px solid #FECACA' : '1px solid #FEF08A' }}>
              <Clock size={15} /> {timeLeft}
            </div>
          )}
        </div>

        <div style={{ color: 'var(--text-dark)', marginBottom: '1.25rem', flexGrow: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--bg-primary)', fontSize: '0.95rem' }}>Diagnostic Assessment:</div>
          <MedicalReportCard analysisStr={report.analysis} />
        </div>

        {/* Post-Treatment Follow-up Info */}
        {isAccepted && isMine && !isResolved && (
          <div style={{ 
            backgroundColor: '#FEF3C7', 
            padding: '0.85rem 1.25rem', 
            borderRadius: '8px', 
            marginBottom: '1.25rem',
            border: '1px solid #FCD34D',
            fontSize: '0.88rem',
            color: '#78350F'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} /> Time remaining for post-treatment condition update: <strong>{treatmentTimeLeft}</strong>
              </span>
              {treatmentTimeLeft !== 'Time to report' && (
                <button 
                  onClick={() => setForceShowReportForm(true)} 
                  className="btn btn-outline" 
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', color: '#78350F', borderColor: '#78350F' }}
                >
                  Test: Update Instantly
                </button>
              )}
            </div>
          </div>
        )}

        {/* Inline Card SMS Dispatch Drawer */}
        {showCardSms && (
          <div style={{ padding: '1rem', backgroundColor: '#F8F6F0', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #E2DDD5' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--bg-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={15} /> Send Direct SMS Alert for this Dispatch
            </div>
            
            {cardSmsStatus && (
              <div style={{ fontSize: '0.8rem', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem', backgroundColor: cardSmsStatus.success ? '#D1FAE5' : '#FEE2E2', color: cardSmsStatus.success ? '#065F46' : '#991B1B' }}>
                {cardSmsStatus.success ? `? SMS Sent! SID: ${cardSmsStatus.sid}` : `? ${cardSmsStatus.error}`}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Phone number (+91...)"
                value={cardSmsPhone}
                onChange={(e) => setCardSmsPhone(e.target.value)}
                style={{ flex: 1, minWidth: '160px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={handleSendCardSms}
                className="btn btn-primary"
                disabled={sendingCardSms}
                style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                {sendingCardSms ? 'Sending...' : 'Send SMS Alert'}
              </button>
            </div>
          </div>
        )}

        {/* Follow-up condition report submission form */}
        {showReportForm && (
          <form onSubmit={handleConditionSubmit} style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1rem' }}>
              <Heart size={16} /> Update Current Animal Condition (Post 30-Min Treatment)
            </h4>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe the current condition of the animal post-treatment (e.g. Bandage applied, pain levels reduced, sent to vet shelter...)"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Post-Treatment Photographic Proof (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleTreatmentImageChange} 
                  id={`treatment-upload-${report.id}`}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor={`treatment-upload-${report.id}`} 
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer', margin: 0, color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                >
                  Choose Image
                </label>
                {treatmentPreview && (
                  <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={treatmentPreview} alt="Treatment preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }} disabled={submittingTreatment}>
              {submittingTreatment ? 'Submitting...' : 'Submit Treatment Report'}
            </button>
          </form>
        )}

        {/* Display Resolved / Post-Treatment condition */}
        {isResolved && (
          <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <Heart size={16} /> Post-Treatment Status Update
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {report.post_treatment_image_url && (
                <div style={{ width: '140px', height: '90px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={report.post_treatment_image_url} alt="Post Treatment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5, padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', color: '#1E3A8A' }}>
                {report.post_treatment_report}
              </div>
            </div>
          </div>
        )}

        {/* Action Button Row - Mobile Responsive */}
        <div className="ngo-action-btn-row" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowCardSms(!showCardSms)}
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Smartphone size={15} /> {showCardSms ? 'Close SMS Alert' : 'Send SMS Alert'}
          </button>

          {!isAccepted && timeLeft !== 'Expired' && (
            <button className="btn btn-primary" onClick={() => onAccept(report.id)} style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Confirm Dispatch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
