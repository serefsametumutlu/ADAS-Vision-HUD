/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        hud: {
          cyan: '#00F0C8',
          blue: '#00E5FF',
          teal: '#14B8A6',
          warning: '#FFB800',
          danger: '#FF3B3B',
          success: '#22C55E',
          bg: '#0A1419',
        }
      },
      fontFamily: {
        tech: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 200, 0.5), 0 0 40px rgba(0, 240, 200, 0.2)',
        'glow-warning': '0 0 20px rgba(255, 184, 0, 0.5)',
        'glow-danger': '0 0 25px rgba(255, 59, 59, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      }
    }
  },
  plugins: [],
}

