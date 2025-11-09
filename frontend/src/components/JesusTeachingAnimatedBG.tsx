export function JesusTeachingAnimatedBG() {
  console.log('🎨 JesusTeachingAnimatedBG Component Rendered!')
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Base Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 40%, #f97316 60%, #1e40af 100%)'
        }}
      >
        {/* Animated Overlay Layer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(251,191,36,0.6) 0%, rgba(249,115,22,0.5) 40%, rgba(59,130,246,0.5) 70%, rgba(30,58,138,0.7) 100%)',
            animation: 'breathe 8s ease-in-out infinite'
          }}
        />

        {/* Floating Particles */}
        <div
          className="absolute w-8 h-8 bg-yellow-300 rounded-full"
          style={{
            top: '15%',
            left: '10%',
            opacity: 0.6,
            boxShadow: '0 0 30px rgba(253,224,71,0.8)',
            animation: 'float1 12s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-12 h-12 bg-orange-400 rounded-full"
          style={{
            top: '40%',
            right: '15%',
            opacity: 0.5,
            boxShadow: '0 0 40px rgba(251,146,60,0.6)',
            animation: 'float2 15s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-6 h-6 bg-yellow-200 rounded-full"
          style={{
            bottom: '30%',
            left: '25%',
            opacity: 0.7,
            boxShadow: '0 0 25px rgba(253,224,71,0.9)',
            animation: 'float3 10s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-10 h-10 bg-blue-400 rounded-full"
          style={{
            top: '65%',
            right: '35%',
            opacity: 0.4,
            boxShadow: '0 0 35px rgba(147,197,253,0.5)',
            animation: 'float1 14s ease-in-out infinite reverse'
          }}
        />

        {/* Radial Sun Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(253,224,71,0.7) 0%, rgba(251,146,60,0.4) 25%, transparent 60%)',
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />

        {/* Wave Effect Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '45%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.6) 40%, rgba(30,58,138,0.8) 100%)',
            animation: 'wave 8s ease-in-out infinite'
          }}
        />

        {/* Shimmer Light Sweep */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
            animation: 'shimmer 12s ease-in-out infinite',
            opacity: 0.3
          }}
        />
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.03); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -25px) scale(1.1); }
          50% { transform: translate(-15px, -40px) scale(0.9); }
          75% { transform: translate(25px, -20px) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 30px) rotate(120deg); }
          66% { transform: translate(20px, 15px) rotate(240deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(30px, -15px) scale(1.2); }
          80% { transform: translate(-15px, -30px) scale(0.8); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-20px) scaleY(1.1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-150%) translateY(-150%) rotate(45deg); }
          100% { transform: translateX(150%) translateY(150%) rotate(45deg); }
        }
      `}</style>
    </div>
  )
}
