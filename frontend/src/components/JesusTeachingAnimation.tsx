export function JesusTeachingAnimation() {
  return (
    <div className="relative mx-auto mt-6 w-full max-w-3xl">
      <div className="relative rounded-2xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-white/10 overflow-hidden">
        <svg viewBox="0 0 600 240" className="w-full h-56">
          {/* Background gradient */}
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="robe" x1="0" x2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="600" height="240" fill="url(#sky)" />

          {/* Hill */}
          <path d="M0 200 C150 140, 450 140, 600 200 L600 240 L0 240 Z" fill="#0f172a" opacity="0.8" />

          {/* Jesus (center) */}
          <g className="animate-pulse" style={{ animationDuration: '2.6s' }}>
            {/* Head */}
            <circle cx="300" cy="110" r="10" fill="#e5e7eb" />
            {/* Robe */}
            <path d="M275 170 L300 120 L325 170 Z" fill="url(#robe)" opacity="0.9" />
            {/* Arms */}
            <path d="M280 135 Q300 140 320 135" stroke="#93c5fd" strokeWidth="5" fill="none" />
          </g>

          {/* Disciples - left group */}
          {[260, 235, 210].map((x, i) => (
            <g key={`l-${i}`} className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }}>
              <circle cx={x} cy={150 + i * 4} r="7" fill="#cbd5e1" />
              <path d={`M${x - 10} ${170 + i * 4} L ${x} ${155 + i * 4} L ${x + 10} ${170 + i * 4}`} fill="#64748b" />
            </g>
          ))}

          {/* Disciples - right group */}
          {[340, 365, 390].map((x, i) => (
            <g key={`r-${i}`} className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: `${0.5 + i * 0.3}s` }}>
              <circle cx={x} cy={152 + i * 4} r="7" fill="#cbd5e1" />
              <path d={`M${x - 10} ${172 + i * 4} L ${x} ${157 + i * 4} L ${x + 10} ${172 + i * 4}`} fill="#64748b" />
            </g>
          ))}

          {/* Rays */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={300}
              y1={110}
              x2={300 + Math.cos((i * 72 * Math.PI) / 180) * 40}
              y2={110 + Math.sin((i * 72 * Math.PI) / 180) * 40}
              stroke="#93c5fd"
              strokeOpacity={0.5}
              strokeWidth={2}
              className="animate-pulse"
              style={{ animationDuration: `${1.8 + i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Keyframes for gentle float */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-3px) } }
      `}</style>
    </div>
  )
}
