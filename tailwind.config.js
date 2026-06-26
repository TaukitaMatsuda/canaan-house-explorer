/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tomb': {
          black: '#0a0a0c',
          dark: '#121218',
          grey: '#1a1a24',
          light: '#2a2a38',
          ivory: '#e8e0d0',
          bone: '#c4b8a8',
          bronze: '#8b7355',
          gold: '#a8946a',
          green: '#4a5a48',
          sage: '#6b7a6a',
          blood: '#6b2d2d',
          rust: '#8b4513',
        }
      },
      fontFamily: {
        'serif': ['Cinzel', 'Georgia', 'serif'],
        'display': ['Cinzel Decorative', 'Cinzel', 'serif'],
        'body': ['Cormorant Garamond', 'Georgia', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(168, 148, 106, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(168, 148, 106, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
