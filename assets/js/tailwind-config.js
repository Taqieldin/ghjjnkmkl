
    window.tailwind = window.tailwind || {};
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            parchment: {
              50: '#fcfbf8',
              100: '#f8f5ee',
              200: '#f0ebd8',
              300: '#e5dcbe',
              400: '#d5c59b',
              500: '#c2ab79',
            },
            emerald: {
              850: '#112921',
              900: '#0e231c',
              950: '#071510',
            },
            homeTile: {
              quran: '#10231d',
              prayer: '#dce7d9',
              audio: '#e8d9c3',
              hadith: '#d1e8df',
              habits: '#d9d9ef',
            },
            gold: {
              400: '#c9f45b',
              500: '#c9f45b',
              600: '#83a83c',
            }
          },
          fontFamily: {
            sans: ['Alexandria', 'system-ui', 'sans-serif'],
            quran: ['Amiri', 'serif'],
            naskh: ['Noto Naskh Arabic', 'serif'],
          }
        }
      }
    }
  