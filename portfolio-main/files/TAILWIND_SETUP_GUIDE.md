# Tailwind CSS Production Setup Guide

## Quick Start (Copy & Paste These Commands)

### Step 1: Initialize Node.js Project
```bash
cd your-portfolio-folder
npm init -y
```

### Step 2: Install Tailwind CSS and Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Initialize Tailwind Configuration
```bash
npx tailwindcss init -p
```

This creates two files:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### Step 4: Configure Template Paths
Edit `tailwind.config.js` and replace the content with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#0ea5e9',
        bgDark: '#0f172a',
        cardDark: '#1e293b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
}
```

### Step 5: Create Input CSS File
Create a new file called `input.css` in your project root:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 6: Update package.json Scripts
Edit your `package.json` and update the `scripts` section:

```json
"scripts": {
  "dev": "tailwindcss -i ./input.css -o ./output.css --watch",
  "build": "tailwindcss -i ./input.css -o ./output.css --minify"
}
```

### Step 7: Update HTML to Use Generated CSS
Replace this line in `index.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

With this:
```html
<link rel="stylesheet" href="output.css">
```

Also REMOVE this script block:
```html
<script>
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    primary: '#3b82f6',
                    secondary: '#64748b',
                    accent: '#0ea5e9',
                    bgDark: '#0f172a',
                    cardDark: '#1e293b'
                },
                fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    serif: ['Playfair Display', 'serif'],
                },
                animation: {
                    'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }
            }
        }
    }
</script>
```

## Running Commands

### For Development (with auto-reload):
```bash
npm run dev
```
This watches for changes and regenerates `output.css` automatically.

### For Production (minified):
```bash
npm run build
```
This creates an optimized, minified `output.css` file.

## Final Project Structure
```
your-portfolio/
├── index.html
├── profile-picture.png
├── style.css
├── script.js
├── three-scene.js
├── input.css              (NEW - source CSS)
├── output.css             (NEW - generated CSS)
├── tailwind.config.js     (NEW - configuration)
├── postcss.config.js      (NEW - PostCSS config)
└── package.json           (NEW - npm configuration)
```

## Deployment

When deploying to production:
1. Run `npm run build` to generate minified CSS
2. Upload all files including the `output.css`
3. Make sure `index.html` references `output.css`
4. You don't need to upload `node_modules`, `input.css`, or any config files

## Size Comparison

### Before (CDN):
- Every user downloads full Tailwind from CDN
- No caching benefits
- Higher latency

### After (Production Build):
- Only **used styles** are included (~50KB vs 500KB+)
- Single HTTP request
- Faster load times
- Optimized for your specific design

## Troubleshooting

### `output.css` not being generated?
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Still showing the warning?
Make sure you:
1. Removed the `<script src="https://cdn.tailwindcss.com"></script>` line
2. Linked to `output.css` instead
3. Removed the inline script that configures Tailwind

### Want to add more Tailwind config later?
Edit `tailwind.config.js` and re-run:
```bash
npm run build
```

## Quick Reference Commands

```bash
# Initial setup
npm init -y
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development
npm run dev

# Production
npm run build

# Clean rebuild
rm output.css && npm run build
```

---

## Need Help?

- Tailwind CSS Docs: https://tailwindcss.com/docs
- Installation Guide: https://tailwindcss.com/docs/installation
- CLI Commands: https://tailwindcss.com/docs/tailwind-cli
