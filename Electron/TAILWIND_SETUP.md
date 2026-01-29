# Tailwind CSS Setup Guide

## Installation Complete ✅

Tailwind CSS has been installed and configured for this project.

## Configuration

- **tailwind.config.js** - Main Tailwind configuration
- **postcss.config.js** - PostCSS configuration with Tailwind and Autoprefixer
- **main.css** - Contains Tailwind directives (@tailwind base, components, utilities)

## Using Tailwind Classes

### Basic Usage

Instead of writing custom CSS, use Tailwind utility classes:

```jsx
// ❌ Old way (custom CSS)
<div className="message-box">
  <h1>Hello</h1>
</div>

// ✅ New way (Tailwind)
<div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
  <h1 className="text-xl font-bold text-gray-800">Hello</h1>
</div>
```

### Using Custom Theme Colors

The theme is configured to use CSS variables for consistency:

```jsx
// Primary color (green)
<button className="bg-primary hover:bg-secondary text-bg-dark">
  Save
</button>

// Danger/warning colors (beige/orange)
<button className="bg-danger hover:bg-accent text-text-light">
  Delete
</button>

// Text colors with proper contrast
<p className="text-text-light">Light text</p>
<p className="text-text-muted">Muted text</p>
<p className="text-text-subtle">Subtle text</p>
```

### Available Custom Colors in Theme

```
Primary: var(--mn-00) - Green
Secondary: var(--mn-01) - Green darker
Accent: var(--mn-02) - Green darkest
Warning: var(--mn-06) - Orange
Danger: var(--mn-08) - Brown
Success: var(--mn-00) - Green

Text Light: var(--cl-00) - White
Text Muted: var(--cl-01) - Light gray
Text Subtle: var(--cl-02) - Medium gray

Background Dark: var(--cl-04) - Black
Background Default: var(--cl-03) - Dark gray
Background Light: var(--cl-02) - Medium gray
Background Muted: var(--cl-01) - Light gray
```

### Common Patterns

```jsx
// Form inputs
<input className="px-3 py-2 border border-text-subtle rounded bg-bg-default text-text-light placeholder-text-muted focus:outline-none focus:border-primary" />

// Buttons
<button className="px-4 py-2 bg-primary text-bg-dark rounded font-semibold hover:bg-secondary transition-colors" />

// Cards
<div className="bg-bg-default border border-text-subtle rounded-lg p-4 shadow-md" />

// Tables
<thead className="bg-bg-light">
  <th className="px-4 py-2 text-text-light font-semibold text-left" />
</thead>
```

### Responsive Design

```jsx
// Mobile first approach
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-lg md:text-2xl lg:text-3xl" />
</div>

// Hide/show based on screen size
<div className="hidden md:block">Visible on medium+ screens</div>
<div className="md:hidden">Visible on small screens only</div>
```

### Spacing

```jsx
// Margin: m-{size}, mt-, mb-, ml-, mr-, mx-, my-
<div className="m-4">Margin all sides</div>
<div className="mt-2 mb-4">Margin top and bottom</div>

// Padding: p-{size}, pt-, pb-, pl-, pr-, px-, py-
<div className="p-6">Padding all sides</div>
<div className="px-4 py-2">Horizontal and vertical padding</div>
```

### Flexbox

```jsx
<div className="flex justify-between items-center gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

<div className="flex flex-col gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## When to Use Tailwind vs Custom CSS

**Use Tailwind for:**
- ✅ New components
- ✅ Responsive layouts
- ✅ Quick styling
- ✅ Consistent design system

**Keep Custom CSS for:**
- ✅ Complex animations
- ✅ Existing styles (don't break them)
- ✅ Theme-specific styles
- ✅ Performance-critical code

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)
- [Tailwind Cheat Sheet](https://flowbite.com/tools/tailwind-cheat-sheet/)

## Example: Converting Old CSS to Tailwind

Before (custom CSS):
```css
.button {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background: #388e3c;
}
```

After (Tailwind):
```jsx
<button className="px-5 py-2 bg-primary text-bg-dark rounded cursor-pointer hover:bg-secondary transition-colors">
  Click me
</button>
```

Much simpler! 🎉
