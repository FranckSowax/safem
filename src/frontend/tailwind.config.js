/**
 * Configuration Tailwind CSS pour Safem
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32', // Vert principal
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32', // Notre couleur principale
          900: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#FFFFFF', // Blanc
        },
        background: {
          DEFAULT: '#F5F5F5', // Gris très clair
        },
        text: {
          DEFAULT: '#333333', // Gris foncé
          light: '#757575', // Gris moyen pour texte secondaire
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1': '24px',
        'h2': '20px',
        'h3': '16px',
        'body': '14px',
      },
      borderRadius: {
        'card': '8px',
        'button': '4px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      screens: {
        'sm': '640px', // Mobile
        'md': '768px', // Tablette
        'lg': '1024px', // Petit écran
        'xl': '1280px', // Grand écran
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
