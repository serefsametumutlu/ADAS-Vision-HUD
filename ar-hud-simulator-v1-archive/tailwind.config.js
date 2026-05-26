/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        hud: {
          cyan:    'rgb(var(--hud-cyan) / <alpha-value>)',
          blue:    'rgb(var(--hud-blue) / <alpha-value>)',
          teal:    '#14B8A6',
          warning: 'rgb(var(--hud-warning) / <alpha-value>)',
          danger:  'rgb(var(--hud-danger) / <alpha-value>)',
          success: '#22C55E',
          bg:      '#0A1419',
          panel:   'rgba(0, 20, 30, 0.45)',
        }
      },
      fontFamily: {
        tech:    ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan':    '0 0 20px rgb(var(--hud-cyan) / 0.5), 0 0 40px rgb(var(--hud-cyan) / 0.2)',
        'glow-warning': '0 0 20px rgba(255, 184, 0, 0.5)',
        'glow-danger':  '0 0 25px rgba(255, 59, 59, 0.6), 0 0 50px rgba(255, 59, 59, 0.3)',
        'glow-inner':   'inset 0 0 20px rgb(var(--hud-cyan) / 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line':  'scanLine 3s linear infinite',
        'hud-flicker':'hudFlicker 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'spin-slow':  'spin 8s linear infinite',
        'boot-line':  'bootLine 0.15s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%':      { opacity: '0.7', filter: 'brightness(1.4)' }
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        hudFlicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%':           { opacity: '0.85' },
          '97%':           { opacity: '1' },
          '98%':           { opacity: '0.9' },
          '99%':           { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bootLine: {
          '0%':   { opacity: '0', transform: 'translateX(-6px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
      }
    }
  },
  plugins: [],
}
