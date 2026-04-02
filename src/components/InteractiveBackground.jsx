import { useEffect, useRef } from 'react'

const ORB_COUNT = 14

function createOrb(width, height) {
  const palette = [
    [130, 100, 255, 0.18],
    [180, 120, 255, 0.14],
    [100, 140, 255, 0.16],
    [200, 90, 220, 0.12],
    [90, 200, 250, 0.1],
    [255, 180, 220, 0.1],
  ]
  const color = palette[Math.floor(Math.random() * palette.length)]
  const radius = 60 + Math.random() * 180
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius,
    color,
    baseVx: (Math.random() - 0.5) * 0.4,
    baseVy: (Math.random() - 0.5) * 0.4,
    phase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.003 + Math.random() * 0.006,
    wobbleAmp: 10 + Math.random() * 30,
  }
}

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const orbsRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef(null)
  const darkRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Bail out in environments without canvas support (e.g. jsdom)
    if (!ctx) return

    // Detect dark mode
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    darkRef.current = mq?.matches ?? false
    const handleChange = (e) => {
      darkRef.current = e.matches
    }
    mq?.addEventListener('change', handleChange)

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = Math.max(window.innerHeight, document.body.scrollHeight)
      // Re-seed orbs on resize
      orbsRef.current = Array.from({ length: ORB_COUNT }, () =>
        createOrb(canvas.width, canvas.height),
      )
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
    }
    window.addEventListener('mousemove', onMouseMove)

    let tick = 0

    function draw() {
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const orb of orbsRef.current) {
        // Wobble motion
        const wobbleX = Math.sin(tick * orb.wobbleSpeed + orb.phase) * orb.wobbleAmp
        const wobbleY = Math.cos(tick * orb.wobbleSpeed * 0.7 + orb.phase) * orb.wobbleAmp * 0.6

        // Mouse attraction (subtle pull toward cursor)
        const dx = mx - orb.x
        const dy = my - orb.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const pull = Math.min(0.8, 200 / dist)

        orb.vx += (orb.baseVx + dx * pull * 0.0004 - orb.vx) * 0.02
        orb.vy += (orb.baseVy + dy * pull * 0.0004 - orb.vy) * 0.02

        orb.x += orb.vx + wobbleX * 0.02
        orb.y += orb.vy + wobbleY * 0.02

        // Soft wrap around edges
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        // Mouse proximity glow — orbs get brighter when near cursor
        const glowBoost = Math.max(0, 1 - dist / 400) * 0.15

        const [r, g, b, a] = orb.color
        const alpha = darkRef.current ? a + glowBoost : a * 1.2 + glowBoost

        const gradient = ctx.createRadialGradient(
          orb.x + wobbleX * 0.3,
          orb.y + wobbleY * 0.3,
          0,
          orb.x,
          orb.y,
          orb.radius,
        )
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      mq?.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
