/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,ts,jsx,tsx,mdx}',
		'./*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-geist-mono)', 'Menlo', 'monospace'],
				bricolage: ['Bricolage Grotesque', 'sans-serif']
			},
			colors: {
				primary: '#6366f1',
				'primary-dark': '#4f46e5',
				secondary: '#8b5cf6',
				accent: '#06b6d4',
				// Variables adaptatives pour light/dark
				background: {
					light: '#ffffff',
					dark: '#0f0f23',
				},
				surface: {
					light: '#f8fafc',
					dark: '#1a1a2e',
				},
				text: {
					light: '#1e293b',
					dark: '#e2e8f0',
				},
				'text-muted': {
					light: '#64748b',
					dark: '#94a3b8',
				},
				border: {
					light: '#e2e8f0',
					dark: '#334155',
				},
			},

		}
	}
}