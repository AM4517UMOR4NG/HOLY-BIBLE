export function JesusTeachingScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* DARK BACKGROUND - Divine theme */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0f0f1e 40%, #050510 100%)'
      }}>
        {/* Divine light from above */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(255,223,186,0.8) 0%, rgba(255,223,186,0.4) 15%, rgba(255,223,186,0.1) 30%, transparent 50%)',
            animation: 'breathe 6s ease-in-out infinite'
          }}
        />
        
        {/* Light rays */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 180deg at 50% 20%, transparent 0deg, rgba(255,223,186,0.2) 20deg, transparent 40deg, rgba(255,223,186,0.2) 60deg, transparent 80deg, rgba(255,223,186,0.2) 100deg, transparent 120deg, rgba(255,223,186,0.2) 140deg, transparent 160deg, rgba(255,223,186,0.2) 180deg, transparent 200deg, rgba(255,223,186,0.2) 220deg, transparent 240deg, rgba(255,223,186,0.2) 260deg, transparent 280deg, rgba(255,223,186,0.2) 300deg, transparent 320deg, rgba(255,223,186,0.2) 340deg, transparent 360deg)',
            animation: 'rotate 120s linear infinite'
          }}
        />
      </div>

      {/* Divine Light Effects - No Figure */}
      <div className="absolute inset-0 flex items-center justify-center p-8" style={{ background: 'rgba(255,223,186,0.02)' }}>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          style={{ maxWidth: '95%', maxHeight: '95%' }}
        >
          {/* Divine glow circles - Center of screen */}
          <defs>
            <radialGradient id="divineGlow">
              <stop offset="0%" stopColor="#fff5e6" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#ffe4cc" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ffd4a3" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffb366" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Multiple glowing circles */}
          <circle cx="400" cy="300" r="120" fill="url(#divineGlow)">
            <animate attributeName="r" values="120;130;120" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="300" r="80" fill="none" stroke="#fff5e6" strokeWidth="3" opacity="0.4">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
            <animate attributeName="r" values="80;85;80" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="300" r="60" fill="none" stroke="#ffe4cc" strokeWidth="2" opacity="0.5">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="r" values="60;65;60" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="300" r="40" fill="none" stroke="#ffd4a3" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Light rays emanating from center */}
          <g opacity="0.3">
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d={`M 400 300 L ${400 + Math.cos((i * 30) * Math.PI / 180) * 250} ${300 + Math.sin((i * 30) * Math.PI / 180) * 250}`}
                stroke="#ffe4cc"
                strokeWidth="2"
                opacity="0.6"
              >
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </path>
            ))}
          </g>
          
          {/* Floating light particles */}
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <circle
                key={i}
                cx={400 + Math.cos((i * 45) * Math.PI / 180) * 150}
                cy={300 + Math.sin((i * 45) * Math.PI / 180) * 150}
                r="3"
                fill="#fff5e6"
                opacity="0.8"
              >
                <animate attributeName="cy" values={`${300 + Math.sin((i * 45) * Math.PI / 180) * 150};${250 + Math.sin((i * 45) * Math.PI / 180) * 150};${300 + Math.sin((i * 45) * Math.PI / 180) * 150}`} dur="4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="3;5;3" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        </svg>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
