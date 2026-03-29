import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

// Animated placeholder for future Exit.Wave logo animation
function LogoPlaceholder() {
  return (
    <motion.div
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 64,
        height: 64,
        background: '#004df1',
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const [emailValue, setEmailValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setSubmitted(true);
    }
  };

  const signalBorder = '1px solid #004df1';

  return (
    <footer
      style={{
        background: '#010313',
        padding: '5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        containerType: 'inline-size',
      }}
    >
      {/* Email signup panel */}
      <div
        style={{
          border: signalBorder,
          padding: '3vw',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          minHeight: 140,
        }}
      >
        {/* Left: headline + description */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="text-display"
            style={{
              fontSize: '6cqw',
              color: '#004df1',
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            enter the frequency
          </div>
          <p
            className="text-condensed"
            style={{ fontSize: 14, color: '#e6e6e6', letterSpacing: '-0.02em', margin: 0, maxWidth: 480 }}
          >
            We will occasionally send word of gatherings, new songs, and transmissions from the void.
          </p>
        </div>

        {/* Right: email input */}
        <div style={{ flex: '0 1 420px' }}>
          {submitted ? (
            <div
              className="text-mono"
              style={{
                border: signalBorder,
                padding: '24px 28px',
                color: '#004df1',
                fontSize: 12,
                letterSpacing: '0.12em',
              }}
            >
              SIGNAL RECEIVED — TRANSMISSION CONFIRMED
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex' }}>
              <input
                type="email"
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                placeholder="Enter your email"
                required
                className="dark-input"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: signalBorder,
                  borderRight: 'none',
                  padding: '20px 24px',
                  color: '#e6e6e6',
                  fontFamily: 'var(--font-condensed)',
                  fontSize: 14,
                  letterSpacing: '-0.02em',
                  outline: 'none',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#004df1',
                  border: signalBorder,
                  padding: '20px 24px',
                  color: '#e6e6e6',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0040cc'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#004df1'; }}
              >
                JOIN
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Massive wordmark */}
      <div className="text-display footer-wordmark" aria-label="exit.wave">
        exit.wave
      </div>

      {/* Navigation panels */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          flexWrap: 'wrap',
          minHeight: 180,
        }}
      >
        {/* Grimoire — links nav */}
        <div
          style={{
            border: signalBorder,
            padding: 24,
            flex: '0 0 auto',
            width: '30vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            className="text-display"
            style={{ fontSize: '5cqw', color: '#004df1', lineHeight: 1, fontWeight: 400 }}
          >
            grimoire
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/signal', label: 'The Signal' },
              { to: '/coven', label: 'The Coven' },
              { to: '/ritual', label: 'Ritual Contact' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-mono"
                style={{ fontSize: 11, color: 'rgba(230,230,230,0.5)', letterSpacing: '0.1em', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e6e6e6'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(230,230,230,0.5)'; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Albums panel */}
        <div
          style={{
            border: signalBorder,
            padding: 24,
            flex: '1 1 200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 180,
          }}
        >
          <div
            className="text-display"
            style={{ fontSize: '3cqw', color: '#004df1', lineHeight: 1, fontWeight: 400 }}
          >
            ALBUMS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {[
              { label: 'Mounting Mountain Cemetery', year: 'MMXXVI' },
              { label: 'Soft Pain', year: 'MMXXVI' },
            ].map(({ label, year }) => (
              <div
                key={label}
                className="text-mono"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}
              >
                <span style={{ fontSize: 11, color: 'rgba(230,230,230,0.5)', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontSize: 9, color: 'rgba(0,77,241,0.5)', letterSpacing: '0.1em', flexShrink: 0 }}>{year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar — logo placeholder + copyright */}
      <div
        style={{
          border: signalBorder,
          padding: 12,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <LogoPlaceholder />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="text-mono"
            style={{ fontSize: 12, color: '#e6e6e6', letterSpacing: '-0.02em' }}
          >
            © EW-{new Date().getFullYear()}
          </span>
          <span style={{ color: '#004df1', fontSize: 14 }}>◆</span>
          <span
            className="text-mono"
            style={{ fontSize: 12, color: '#e6e6e6', letterSpacing: '-0.02em' }}
          >
            MMXXVI
          </span>
        </div>
      </div>
    </footer>
  );
}
