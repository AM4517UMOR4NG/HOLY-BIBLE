import { useEffect, useRef, useState } from 'react'

interface JesusTeachingBackgroundProps {
  autoplay?: boolean
  pauseOnFocus?: boolean
  className?: string
}

interface LottieAnimation {
  path: string
  loop: boolean
  autoplay: boolean
  rendererSettings?: {
    preserveAspectRatio?: string
  }
}

export function JesusTeachingBackground({
  autoplay = true,
  pauseOnFocus = true,
  className = ''
}: JesusTeachingBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true) // Set to true immediately
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [useVideoFallback, setUseVideoFallback] = useState(true) // Always use CSS fallback for now
  const lottieRefs = useRef<any[]>([])

  // Debug log
  console.log('✅ JesusTeachingBackground RENDERED', { useVideoFallback, prefersReducedMotion, isVisible })

  // Lottie overlays configuration
  const lottieOverlays: LottieAnimation[] = [
    {
      path: '/animations/overlay_dove.min.json',
      loop: true,
      autoplay: true
    },
    {
      path: '/animations/overlay_particles.min.json',
      loop: true,
      autoplay: true
    }
  ]

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Check if video files exist, switch from CSS to video if available
  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        const response = await fetch('/animations/poster.webp', { method: 'HEAD' })
        if (response.ok) {
          // Video files exist, switch to video
          setUseVideoFallback(false)
        }
        // If not ok, keep using CSS fallback (already true by default)
      } catch {
        // Keep using CSS fallback (already true by default)
      }
    }
    checkVideoExists()
  }, [])

  // Video autoplay and pause handling
  useEffect(() => {
    if (!videoRef.current || prefersReducedMotion || useVideoFallback) return

    const video = videoRef.current

    if (isVisible && autoplay && !isPaused) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, fallback to CSS
          setUseVideoFallback(true)
        })
      }
    } else {
      video.pause()
    }
  }, [isVisible, autoplay, isPaused, prefersReducedMotion, useVideoFallback])

  // Pause on input focus handler
  useEffect(() => {
    if (!pauseOnFocus) return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setIsPaused(true)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Delay resume to avoid flicker
        setTimeout(() => {
          setIsPaused(false)
        }, 1000)
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [pauseOnFocus])

  // Load Lottie animations (lazy)
  useEffect(() => {
    if (!isVisible || prefersReducedMotion || isPaused) return

    const loadLottie = async () => {
      // Wait 500ms after video starts
      await new Promise(resolve => setTimeout(resolve, 500))

      try {
        // @ts-ignore - Lottie will be loaded via script tag or npm
        const lottie = window.lottie
        if (!lottie) return

        lottieOverlays.forEach((overlay, index) => {
          const container = document.getElementById(`lottie-overlay-${index}`)
          if (container && !lottieRefs.current[index]) {
            lottieRefs.current[index] = lottie.loadAnimation({
              container,
              renderer: 'svg',
              loop: overlay.loop,
              autoplay: overlay.autoplay,
              path: overlay.path,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
                ...overlay.rendererSettings
              }
            })
          }
        })
      } catch (error) {
        // Lottie not available or error loading
        console.warn('Lottie animations could not be loaded:', error)
      }
    }

    loadLottie()

    return () => {
      // Cleanup Lottie instances
      lottieRefs.current.forEach(animation => {
        if (animation) animation.destroy()
      })
      lottieRefs.current = []
    }
  }, [isVisible, prefersReducedMotion, isPaused])

  // Always render CSS animation for now (simple and reliable)
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    >
      {/* CSS-based animated background */}
      <div className="absolute inset-0" style={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #1e40af 100%)'
      }}>
          {/* Animated sky gradient overlay */}
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              background: 'linear-gradient(180deg, rgba(251,191,36,0.5) 0%, rgba(249,115,22,0.4) 40%, rgba(59,130,246,0.4) 70%, rgba(30,58,138,0.6) 100%)',
              animation: prefersReducedMotion ? 'none' : 'breathe 8s ease-in-out infinite'
            }}
          />
          
          {/* Floating light particles - Enhanced */}
          {!prefersReducedMotion && (
            <>
              <div 
                className="absolute w-4 h-4 bg-yellow-300/50 rounded-full blur-sm"
                style={{
                  top: '15%',
                  left: '10%',
                  animation: 'float1 12s ease-in-out infinite',
                  boxShadow: '0 0 20px rgba(253,224,71,0.5)'
                }}
              />
              <div 
                className="absolute w-6 h-6 bg-orange-300/40 rounded-full blur-md"
                style={{
                  top: '35%',
                  right: '15%',
                  animation: 'float2 15s ease-in-out infinite',
                  boxShadow: '0 0 25px rgba(251,146,60,0.4)'
                }}
              />
              <div 
                className="absolute w-3 h-3 bg-yellow-200/60 rounded-full blur-sm"
                style={{
                  bottom: '25%',
                  left: '20%',
                  animation: 'float3 10s ease-in-out infinite',
                  boxShadow: '0 0 15px rgba(253,224,71,0.6)'
                }}
              />
              <div 
                className="absolute w-5 h-5 bg-blue-300/30 rounded-full blur-md"
                style={{
                  top: '60%',
                  right: '30%',
                  animation: 'float1 14s ease-in-out infinite reverse',
                  boxShadow: '0 0 20px rgba(147,197,253,0.3)'
                }}
              />
            </>
          )}
          
          {/* Radial light rays from sun */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 70% 15%, rgba(253,224,71,0.6) 0%, rgba(251,146,60,0.3) 30%, transparent 70%)',
              animation: prefersReducedMotion ? 'none' : 'pulse 6s ease-in-out infinite'
            }}
          />
          
          {/* Gentle wave effect at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-2/5 opacity-40"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.5) 50%, rgba(30,58,138,0.7) 100%)',
              animation: prefersReducedMotion ? 'none' : 'wave 8s ease-in-out infinite'
            }}
          />
          
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
              animation: prefersReducedMotion ? 'none' : 'shimmer 10s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Add keyframe animations */}
        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.02); }
          }
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(15px, -20px); }
            50% { transform: translate(-10px, -35px); }
            75% { transform: translate(20px, -15px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(-20px, 25px); }
            66% { transform: translate(15px, 12px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0); }
            40% { transform: translate(25px, -12px); }
            80% { transform: translate(-12px, -25px); }
          }
          @keyframes wave {
            0%, 100% { transform: translateY(0) scaleY(1); }
            50% { transform: translateY(-15px) scaleY(1.08); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%); }
            100% { transform: translateX(100%) translateY(100%); }
          }
        `}</style>
    </div>
  )
}
