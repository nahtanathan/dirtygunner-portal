import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#09090b',
        panel: '#101216',
        line: 'rgba(255,255,255,0.08)',
        silver: '#cfd6e4',
        gunmetal: '#1a1f2a',
        electric: '#4ea4ff',
        violet: '#8b5cf6',
        danger: '#ef4444',
      },
      boxShadow: {
        panel: '0 20px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
        glow: '0 0 0 1px rgba(78,164,255,0.2), 0 20px 60px rgba(78,164,255,0.08)',
      },
      backgroundImage: {
        noise: 'radial-gradient(circle at 20% 20%, rgba(78,164,255,0.15), transparent 30%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.12), transparent 28%), radial-gradient(circle at 50% 100%, rgba(239,68,68,0.10), transparent 28%)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
