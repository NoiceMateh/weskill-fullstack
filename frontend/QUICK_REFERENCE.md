# Quick Reference - Animations & Components

## 🚀 Quick Start

### 1. Toast Notifications (Global)
```javascript
// Success
window.toast.success("Success!", "Course registered successfully");

// Error
window.toast.error("Error", "Something went wrong");

// Warning
window.toast.warning("Warning", "Please check your data");

// Info
window.toast.info("Info", "New course available");
```

### 2. Skeleton Loading
```jsx
import LoadingSkeleton from "../components/LoadingSkeleton";

// Show 6 skeleton cards
<LoadingSkeleton count={6} />

// Show 12 skeleton cards
<LoadingSkeleton count={12} />
```

### 3. Progress Bar
```jsx
import ProgressBar from "../components/ProgressBar";

<ProgressBar 
  value={75}           // Current progress
  max={100}            // Total value
  label="Learning"     // Optional label
  color="from-purple-500 to-teal-500"  // Gradient color
/>
```

### 4. Animations
```jsx
// Fade up entrance
<div className="animate-fade-up">Content</div>

// With delay
<div className="animate-fade-up-delay-200">Delayed content</div>

// Staggered items
<div className="stagger-item">Item 1</div>
<div className="stagger-item">Item 2</div>
<div className="stagger-item">Item 3</div>

// Scale up
<div className="animate-scale-up">Content</div>

// Slide in
<div className="animate-slide-in-left">From left</div>
<div className="animate-slide-in-right">From right</div>

// Pulse
<div className="animate-pulse">Pulsing content</div>

// Glow
<div className="animate-glow">Glowing content</div>
```

## 📦 Components

### CourseCard
- ✓ Spotlight hover effect (follows mouse)
- ✓ Smooth image zoom on hover
- ✓ Dynamic gradient price box
- ✓ Enhanced badge display
- ✓ Staggered chip animations

```jsx
<CourseCard course={courseData} showTrackBadge={true} />
```

### LoadingSkeleton
- ✓ Shimmer animation
- ✓ Staggered fade-in
- ✓ Responsive grid
- ✓ 6 skeleton cards (default)

### Toast
- ✓ 4 types: success, error, warning, info
- ✓ Auto-dismiss (3s default)
- ✓ Slide-in animation
- ✓ Close button

### ProgressBar
- ✓ Smooth width transition
- ✓ Gradient background
- ✓ Optional label
- ✓ Percentage display

## 🎨 CSS Classes

### Animations
| Class | Effect | Duration |
|-------|--------|----------|
| `.animate-fade-up` | Fade from bottom | 0.6s |
| `.animate-fade-in` | Simple fade | 0.4s |
| `.animate-scale-up` | Zoom in | 0.5s |
| `.animate-slide-in-left` | Slide from left | 0.5s |
| `.animate-slide-in-right` | Slide from right | 0.5s |
| `.animate-pulse` | Pulsing opacity | 2s ∞ |
| `.animate-glow` | Glowing effect | 2s ∞ |
| `.animate-bounce` | Bouncing motion | 1s ∞ |

### Hover Effects
| Class | Effect |
|-------|--------|
| `.hover-lift` | Elevation + shadow |
| `.hover-scale` | Scale up (1.05x) |
| `.hover-glow` | Box shadow glow |

### Badges & Chips
| Class | Style |
|-------|-------|
| `.badge-live` | Green with pulse dot |
| `.badge-hot` | Red accent |
| `.badge-new` | Purple accent |
| `.chip-primary` | Blue gradient |
| `.chip-success` | Green gradient |
| `.chip-warning` | Yellow gradient |
| `.chip-danger` | Red gradient |

## 🔄 Animation Delays

Combine animations with delay classes:
```jsx
<div className="animate-fade-up animate-fade-up-delay-100">100ms delay</div>
<div className="animate-fade-up animate-fade-up-delay-200">200ms delay</div>
<div className="animate-fade-up animate-fade-up-delay-300">300ms delay</div>
```

## 📊 Staggered Grid

```jsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item, idx) => (
    <div key={idx} className="stagger-item">
      {item.content}
    </div>
  ))}
</div>
```

Auto delays: 0s, 0.1s, 0.2s, 0.3s, 0.4s, 0.5s...

## 🎯 Common Patterns

### Loading State
```jsx
{isLoading ? (
  <LoadingSkeleton count={6} />
) : (
  <div className="grid grid-cols-3 gap-4">
    {items.map(item => (
      <div key={item.id} className="stagger-item">
        {/* Content */}
      </div>
    ))}
  </div>
)}
```

### Success Flow
```jsx
<button onClick={() => {
  // ... do something
  window.toast.success("Done!", "Operation successful");
}}>
  Action
</button>
```

### Error Handling
```jsx
try {
  // ... async operation
} catch (error) {
  window.toast.error("Error", error.message);
}
```

## 🎨 Color Variables

Available in CSS:
```css
--primary: #7c6fff
--primary-light: #a89cff
--accent: #00d4aa
--accent-red: #ff6b6b
--gold: #f0b429
```

## ♿ Accessibility

All animations respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## 🚀 Performance Tips

1. **Use GPU accelerated transforms**
   - Use `transform: translateY()`, `scale()`, `opacity()`
   - Avoid animating `width`, `height`, `left`, `top`

2. **Debounce heavy operations**
   - Spotlight effect uses mouse position tracking

3. **Reduce animation count on mobile**
   - Test with actual devices or DevTools

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/styles/animations.css` | All animation definitions |
| `src/components/CourseCard.jsx` | Enhanced course card |
| `src/components/LoadingSkeleton.jsx` | Skeleton loader |
| `src/components/Toast.jsx` | Toast notification |
| `src/components/ToastContainer.jsx` | Toast manager |
| `src/components/ProgressBar.jsx` | Progress indicator |
| `src/pages/Courses.jsx` | Integrated example |

## 🔗 Related Files

- [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) - Detailed documentation
- [design/design_skill_showcase.html](./design/design_skill_showcase.html) - Design system reference

---

**Quick Reference v1.0** | May 21, 2026
