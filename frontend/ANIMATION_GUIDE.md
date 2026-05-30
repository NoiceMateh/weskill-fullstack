# Frontend Animation & Loading Redesign

## 📋 Overview

Your frontend has been redesigned with advanced animations and loading patterns from the Web3 Design System showcase. This includes glassmorphism effects, skeleton loading, smooth transitions, and toast notifications.

## 🎨 Design Patterns Implemented

### 1. **Skeleton Loading with Shimmer Effect**
- **File**: `src/components/LoadingSkeleton.jsx`
- **Usage**: Shows placeholder cards while courses are loading
- **Features**:
  - Animated shimmer effect
  - Staggered fade-in animation
  - Responsive grid layout
  - Dark theme compatible

```jsx
import LoadingSkeleton from "../components/LoadingSkeleton";

<LoadingSkeleton count={6} />
```

### 2. **Glassmorphism Cards**
- **File**: `src/components/CourseCard.jsx`
- **Features**:
  - Backdrop blur effect
  - Spotlight hover effect (follows mouse)
  - Smooth color transitions
  - Dynamic gradient borders
  - Enhanced image zoom on hover

**Visual Effects:**
- Subtle spotlight that follows mouse position
- Smooth elevation on hover (translateY)
- Glow effect around card
- Image scale zoom (1.08x)

### 3. **Advanced Animations**
- **File**: `src/styles/animations.css`
- **Available Animations**:

| Animation | Purpose | Duration |
|-----------|---------|----------|
| `fadeUp` | Entrance from bottom | 0.6s |
| `fadeIn` | Simple fade entrance | 0.4s |
| `scaleUp` | Zoom in effect | 0.5s |
| `shimmer` | Loading skeleton | 2s (infinite) |
| `slideInLeft` | Slide from left | 0.5s |
| `slideInRight` | Slide from right | 0.5s |
| `pulse` | Pulsing opacity | 2s (infinite) |
| `glow` | Glowing box-shadow | 2s (infinite) |
| `bounce` | Bouncing motion | 1s (infinite) |

**Usage:**
```jsx
<div className="animate-fade-up">Content</div>
<div className="animate-fade-up-delay-100">Delayed content</div>
```

### 4. **Staggered Animations**
- **Class**: `.stagger-item`
- **Purpose**: Sequential animation of multiple items
- **Delay Progression**: 0s, 0.1s, 0.2s, 0.3s...

```jsx
<div className="grid grid-cols-3 gap-4">
  <div className="stagger-item">Item 1</div>
  <div className="stagger-item">Item 2</div>
  <div className="stagger-item">Item 3</div>
</div>
```

### 5. **Toast Notifications**
- **Files**: 
  - `src/components/Toast.jsx`
  - `src/components/ToastContainer.jsx`

**Types:**
- ✓ Success (green)
- ✕ Error (red)
- ⚠ Warning (yellow)
- ℹ Info (blue)

**Global Usage:**
```javascript
// Success notification
window.toast.success("Title", "Message");

// Error notification
window.toast.error("Error", "Something went wrong");

// Warning
window.toast.warning("Warning", "Please check...");

// Info
window.toast.info("Info", "Important message");
```

### 6. **Modern Badges & Chips**
- **Classes**: `badge-*`, `chip-*`
- **Styles**:
  - `badge-live` - With animated pulse dot
  - `badge-hot` - Red accent
  - `badge-new` - Purple accent
  - `chip-primary` - Blue theme
  - `chip-success` - Green theme
  - `chip-warning` - Yellow theme
  - `chip-danger` - Red theme

### 7. **Progress Bars**
- **Class**: `progress-bar-container` & `progress-bar-fill`
- **Features**:
  - Smooth width transition
  - Gradient background
  - Cubic-bezier easing

```jsx
<div className="progress-bar-container">
  <div className="progress-bar-fill" style={{ width: "75%" }}></div>
</div>
```

### 8. **Hover Effects**
- **Classes**:
  - `hover-lift` - Elevation effect
  - `hover-scale` - Scale up
  - `hover-glow` - Box glow effect

## 📁 File Structure

```
src/
├── styles/
│   └── animations.css           # All animation definitions
├── components/
│   ├── CourseCard.jsx           # Enhanced with spotlight effect
│   ├── LoadingSkeleton.jsx       # Skeleton loading component
│   ├── Toast.jsx                # Toast notification
│   └── ToastContainer.jsx        # Toast manager
├── pages/
│   └── Courses.jsx              # Updated with skeleton loading
└── App.jsx                      # Includes ToastContainer
```

## 🚀 Key Features in Course Cards

### Spotlight Effect
The course cards now feature an interactive spotlight that follows your mouse:
- Real-time position tracking
- Smooth opacity transitions
- Subtle glow effect

### Enhanced Hover States
1. **Image Zoom**: Images scale to 1.08x
2. **Card Elevation**: Subtle Y-axis translation
3. **Shadow Enhancement**: Box shadow increases
4. **Color Transitions**: Text colors update smoothly

### Loading State
When courses are loading, skeleton cards appear with:
- Shimmer animation
- Staggered fade-in
- Same layout as real cards
- Smooth transition to real content

## 🎯 Usage Examples

### 1. Adding Toast Notifications to a Button
```jsx
<button onClick={() => {
  window.toast.success("Course Registered", "You've successfully registered for this course!");
}}>
  Enroll Now
</button>
```

### 2. Implementing Staggered Animations
```jsx
<div className="grid grid-cols-3 gap-4">
  {courses.map((course) => (
    <div key={course.id} className="stagger-item">
      <CourseCard course={course} />
    </div>
  ))}
</div>
```

### 3. Custom Animation with Delays
```jsx
<div className="animate-fade-up animate-fade-up-delay-200">
  This content appears 0.2s after the previous item
</div>
```

## 🎨 Color System

The animations use a consistent color palette:
- **Primary**: `#7c6fff` (Purple)
- **Accent**: `#00d4aa` (Teal)
- **Danger**: `#ff6b6b` (Red)
- **Gold**: `#f0b429` (Yellow)

## ⚙️ Configuration

### Animation Duration
Adjust in `animations.css`:
```css
@keyframes fadeUp {
  /* Modify animation duration in usage */
}

.animate-fade-up {
  animation: fadeUp 0.6s ease-out both; /* Change 0.6s */
}
```

### Skeleton Count
```jsx
<LoadingSkeleton count={12} /> {/* Default: 6 */}
```

### Toast Duration
```javascript
window.toast.success("Title", "Message", 5000); // 5 seconds
```

## 🔍 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations: Full support
- CSS backdrop-filter: Minor support (graceful fallback)
- CSS custom properties: Full support

## ♿ Accessibility

- Reduced motion support: Animations respect `prefers-reduced-motion`
- Toast notifications: ARIA role="alert"
- Keyboard navigation: All interactive elements

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

## 📈 Performance

- GPU-accelerated transforms (scale, translate, opacity)
- Efficient skeleton loading (minimal DOM)
- Debounced mouse tracking for spotlight
- CSS-only animations (no JavaScript overhead)

## 🎬 Animation Library Reference

All animations are defined in `src/styles/animations.css`:
- 10+ keyframe animations
- 20+ utility classes
- Consistent timing and easing functions
- Easy to customize and extend

## 📝 Next Steps

1. **Integrate Toast Notifications**: Add error handling notifications to API calls
2. **Custom Animations**: Create specific animations for your features
3. **Theme Customization**: Modify color variables in `:root`
4. **Loading States**: Add skeleton loading to other pages

## 💡 Tips

- Use `stagger-item` class for groups of elements
- Combine animations with Tailwind transitions for extra smoothness
- Test animations with "Reduce motion" settings enabled
- Use backdrop-filter carefully on mobile devices

---

**Last Updated**: May 21, 2026
**Design System**: Web3 Design System Showcase
