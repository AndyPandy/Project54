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
          green:    '#1A1815',   // near-black — primary CTA / buttons
          'green-d': '#000000',  // pure black for hover
          navy:     '#1A1815',   // near-black — text & headings
          dark:     '#EDE9E4',   // warm light — card backgrounds / borders
          muted:    '#8A8680',   // warm gray — secondary text
          offwhite: '#F5F2EE',   // warm cream — base background
          accent:   '#7BA89F',   // sage teal — used sparingly for badges
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
