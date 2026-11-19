/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every utility is scoped under the app's wrapper so it can never restyle vIDE.
  important: '.vapp-simple-gauge',
  corePlugins: { preflight: false },
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        bg:          'var(--color-bg)',
        panel:       'var(--color-panel)',
        sidebar:     'var(--color-sidebar)',
        popover:     'var(--color-popover)',
        'tab-bar':   'var(--color-tab-bar)',
        border:      'var(--color-border)',
        accent:      'rgb(var(--color-accent) / <alpha-value>)',
        fg:          'var(--color-fg)',
        'fg-muted':  'var(--color-fg-muted)',
        'fg-subtle': 'var(--color-fg-subtle)',
        'on-accent': 'var(--color-on-accent)',
      }
    }
  },
  plugins: []
}
