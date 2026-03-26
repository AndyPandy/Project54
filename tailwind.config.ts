import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:     '#1A1815',   // near-black — primary text & headings
          offwhite: '#F0EDE6',   // warm cream — base background (swatch 1)
          'sage-l': '#C4D1B8',   // light sage — subtle tints (swatch 2)
          sage:     '#8FB082',   // medium sage — main accent (swatch 3)
          'sage-d': '#6E8A5C',   // dark sage/olive — hover states (swatch 4)
          earth:    '#5A4232',   // deep warm earth (swatch 5)
          dark:     '#E8E4DC',   // warm neutral — borders / dividers
          muted:    '#8A8680',   // warm gray — secondary text
          // compat aliases
          green:    '#8FB082',
          'green-d': '#6E8A5C',
          accent:   '#8FB082',
        },
      },
      fontFamily: {
        sans:    ['"Darker Grotesque"', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif:   ['Georgia', 'Times New Roman', 'serif'],
        raleway: ['"Raleway"', 'sans-serif'],
        roboto:  ['"Roboto"', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.08em',
        wide:      '0.05em',
      },
    },
  },
  plugins: [],
}

export default config
