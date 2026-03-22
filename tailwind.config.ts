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
          green:    '#80B5AC',   // sage teal — primary CTA / accent
          'green-d': '#6A9E96',  // darker teal for hover states
          navy:     '#404040',   // charcoal — dark text & headings
          dark:     '#DEDAD5',   // slightly darker than offwhite — card backgrounds
          muted:    '#9B9EA0',   // cool gray — secondary text
          offwhite: '#FAF8F6',   // warm light cream — base background
        },
      },
      fontFamily: {
        sans:    ['"Darker Grotesque"', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif:   ['"Darker Grotesque"', 'Georgia', 'serif'],
        raleway: ['"Raleway"', 'sans-serif'],
        roboto:  ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
