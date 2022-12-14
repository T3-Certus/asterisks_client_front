/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // fontSize: {
    //   'sm': '0.875rem',
    //   'base': '1rem',
    //   'lg': '1.125rem',
    //   'xl': '1.25rem',
    //   '2xl': '1.563rem',
    //   '3xl': '1.875rem',
    //   '4xl': '2.5rem',
    //   '5xl': '3.052rem',
    //   '6xl': '3.75rem',
    //   '7xl': '4.5rem',
    //   '8xl': '6rem',
    //   '9xl': '8rem'
    // },
    extend: {
      backgroundColor: {
        'rojo': "#ff0000",
        'celeste': "#85c1e9",
        'azul': "#7d3c98",
        'morado': " #76448a ",
        'verde': " #239b56 ",
        'crema': " #fcf3cf ",
        'amarillo': " #f4d03f ",
        'negro': " #17202a ",
        'gris': " #abb2b9 ",
        'marron': " #784212 ",
        'naranja': " #e67e22 ",
        'blanco': "ffffff",
        'acero': " #1f618d "
      },
      backgroundImage: {
        'backgroundIndex': "url('/img/background.jpg')",
        'horizontalIndex': "url('/img/horizontal_index.jpg')",
        'abrigo': "url('/img/assets/abrigo.jpg')",
        'blusa': "url('/img/assets/blusa.jpg')",
        'camisa': "url('/img/assets/camisa.jpg')",
        'casaca': "url('/img/assets/casaca.jpg')",
        'chompa': "url('/img/assets/chompa.jpg')",
        'falda': "url('/img/assets/falda.jpg')",
        'jeans': "url('/img/assets/jeans.jpg')",
        'jogger': "url('/img/assets/jogger.jpg')",
        'polo': "url('/img/assets/polo.jpg')",
        'short': "url('/img/assets/short.jpg')",
        'abrigoGris': "url('/img/assets/abrigoGris.jpeg')"
      },
      fontFamily: {
        'Comfortaa': ['Comfortaa', 'sans-serif'],
        'Pacifico': ['Pacifico', 'sans-serif']
      },
      screens: {
        'sm': { 'min': '0px', 'max': '767px' },
        // => @media (min-width: 640px and max-width: 767px) { ... }

        'md': { 'min': '768px', 'max': '1023px' },
        // => @media (min-width: 768px and max-width: 1023px) { ... }

        'lg': { 'min': '1024px', 'max': '1279px' },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }

        'xl': { 'min': '1280px', 'max': '1535px' },
        // => @media (min-width: 1280px and max-width: 1535px) { ... }

        '2xl': { 'min': '1536px' },
        // => @media (min-width: 1536px) { ... }
      },
      colors: {
        'ivory': "#FCFAEE",
        'cornsilk': '#F9F5DC',
        'green': '#70A9A1',
        'teal': '#40798C',
        'charleston': '#0B2027'
      },
      spacing: {
        '100%': '100vh',
        '90%': '90vh',
        '80%': '80vh',
        '70%': '70vh',
        '60%': '60vh',
        '50%': '50vh',
        '45%': '45vh',
        '40%': '40vh',
        '35%': '35vh',
        '30%': '30vh'
      }

    },
  },
  plugins: [],
}