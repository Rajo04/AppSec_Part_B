/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                text: '#e2e8f0',
                background: '#0f172a',
                primary: '#8b5cf6',   
                secondary: '#5b21b6', 
                accent: '#a78bfa',    
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                heavy: '0px 10px 20px rgba(0, 0, 0, 0.3)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};

