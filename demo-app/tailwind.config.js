/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'google-blue': '#4285f4',
                'google-green': '#34a853',
                'google-red': '#ea4335',
                'google-yellow': '#fbbc05',
            }
        },
    },
    plugins: [],
}
