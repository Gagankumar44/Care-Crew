# 🔧 Dashboard Troubleshooting Guide

## ❌ Issue: Buttons Not Working / Links Not Clickable

### Problem
Action cards in SmartActions component were not clickable because the `motion.div` was blocking pointer events.

### Solution Applied ✅

**1. Updated SmartActions.tsx:**
- Added `passHref` to all `Link` components
- Added `whileTap={{ scale: 0.98 }}` for click feedback
- Properly structured Link wrapper around motion.div

**2. Updated SmartActions.css:**
- Added `cursor: pointer` to `.action-card-link`
- Added `pointer-events: auto` to `.action-card`
- Removed conflicting `cursor: pointer` from `.action-card`

### How to Verify It's Fixed:

1. **Start the dev server:**
   ```bash
   cd hcp-portal
   npm run dev
   ```

2. **Navigate to dashboard:**
   ```
   http://localhost:3000/dashboard
   ```

3. **Test each card:**
   - ✅ AR Scan → Should navigate to `/ar-scan`
   - ✅ Messages → Should navigate to `/messages`
   - ✅ AI Assistant → Should navigate to `/assistant`
   - ✅ Appointments → Should navigate to `/appointments`

4. **Check for:**
   - Cursor changes to pointer on hover
   - Cards scale up on hover
   - Cards scale down slightly on click (whileTap effect)
   - Page navigation happens on click

---

## 🐛 Common Issues & Solutions

### Issue: Cards hover but don't click

**Possible Causes:**
1. Z-index conflicts
2. Overlapping elements
3. Pointer events disabled

**Solution:**
```css
/* Ensure the link is clickable */
.action-card-link {
  cursor: pointer;
  z-index: 1;
  position: relative;
}

.action-card {
  pointer-events: auto;
}
```

---

### Issue: Navigation doesn't work

**Check:**
1. Routes exist in Next.js app directory
2. Link href is correct
3. No JavaScript errors in console

**Quick Fix:**
```tsx
// Make sure Link is imported
import Link from 'next/link'

// Use passHref prop
<Link href="/your-route" passHref>
  <motion.div>...</motion.div>
</Link>
```

---

### Issue: Hover animation works but click doesn't

**Problem:** Motion.div may be capturing the click event

**Solution:**
```tsx
// Add whileTap for feedback and ensure Link wraps motion.div
<Link href="/route" className="action-card-link" passHref>
  <motion.div 
    whileHover={cardHover}
    whileTap={{ scale: 0.98 }}  // Add this!
  >
    {/* Card content */}
  </motion.div>
</Link>
```

---

### Issue: Console errors about Link children

**Error:** "Warning: Function components cannot be given refs"

**Solution:**
We're NOT using the old pattern with `<a>` tags. We're using the new Next.js 13+ App Router pattern where Link can directly wrap any element.

**Correct pattern:**
```tsx
<Link href="/route" className="your-class">
  <motion.div>Content</motion.div>
</Link>
```

**Incorrect pattern (old Next.js):**
```tsx
<Link href="/route">
  <a>Content</a>
</Link>
```

---

## 🔍 Debugging Checklist

### 1. Check Browser Console
```bash
# Open DevTools (F12)
# Look for errors in Console tab
# Check Network tab for navigation attempts
```

### 2. Verify Routes Exist
```bash
# Check that these pages exist:
hcp-portal/src/app/ar-scan/page.tsx
hcp-portal/src/app/messages/page.tsx
hcp-portal/src/app/assistant/page.tsx
hcp-portal/src/app/appointments/page.tsx
```

### 3. Test Click Event
```tsx
// Add onClick handler for debugging
<Link href="/test" onClick={() => console.log('Link clicked!')}>
  <motion.div>Test Card</motion.div>
</Link>
```

### 4. Check CSS Conflicts
```css
/* Make sure no global styles are preventing clicks */
* {
  pointer-events: auto; /* Don't set to 'none' globally */
}
```

---

## ⚡ Performance Issues

### Issue: Animations are laggy

**Solutions:**
1. Check if too many animations running at once
2. Use `will-change` CSS property
3. Reduce backdrop-filter blur amount

```css
.action-card {
  will-change: transform, opacity;
  backdrop-filter: blur(10px); /* Reduce from 20px if slow */
}
```

### Issue: Page loads slowly

**Solutions:**
1. Add lazy loading for components
2. Use Next.js Image component
3. Split code with dynamic imports

```tsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <SkeletonLoader type="card" />
})
```

---

## 🎨 Styling Issues

### Issue: Glass effect not visible

**Check:**
1. Background has content behind it
2. Backdrop-filter is supported (all modern browsers)
3. CSS is loaded properly

**Test:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px) !important;
}
```

### Issue: Colors look wrong

**Check:**
1. Dark mode is applied to root element
2. Color values are correct
3. No conflicting global styles

```css
/* Make sure these are defined */
:root {
  --color-mint: #99EDC3;
  --color-soft-white: #FCFBF9;
}
```

---

## 🚀 Development Tips

### Clear Next.js Cache
```bash
cd hcp-portal
rm -rf .next
npm run dev
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Verify All Dependencies
```bash
npm list framer-motion react-icons lucide-react
```

### Hot Reload Not Working
```bash
# Restart dev server
# Or clear browser cache
# Or try incognito mode
```

---

## 📱 Mobile Testing

### Issue: Cards not clickable on mobile

**Check:**
1. Touch events are enabled
2. No hover-only interactions
3. Cards have minimum touch target size (44x44px)

**Solution:**
```css
.action-card {
  min-height: 120px; /* Ensure touch target */
  -webkit-tap-highlight-color: transparent; /* Remove iOS tap highlight */
}
```

---

## ✅ Final Verification Steps

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check in incognito mode** (to rule out extensions)
4. **Test in different browsers** (Chrome, Firefox, Safari)
5. **Check mobile responsive design** (DevTools mobile view)
6. **Verify all routes exist** in Next.js app directory
7. **Check console for errors** (F12 → Console)
8. **Test hover animations work** (desktop only)
9. **Test tap animations work** (mobile)
10. **Verify navigation happens** on click

---

## 🆘 Still Not Working?

### Get Debug Info:

1. **Check Next.js version:**
   ```bash
   npm list next
   ```

2. **Check console output:**
   ```bash
   # Look in terminal where dev server is running
   # Check for any error messages
   ```

3. **Inspect element:**
   ```
   Right-click card → Inspect Element
   Check computed styles
   Check if pointer-events is 'auto'
   Check z-index stacking
   ```

4. **Network tab:**
   ```
   F12 → Network tab
   Click card
   See if any request is made
   ```

### Need More Help?

**Provide this info:**
- Next.js version
- Browser and version
- Console errors (screenshot)
- Expected vs actual behavior
- Steps to reproduce

---

## 🎯 Success Indicators

✅ **Working correctly when:**
- Cursor changes to pointer on hover
- Card scales up (1.05) on hover
- Icon scales up (1.1) on hover
- Border glows mint green on hover
- Card scales down (0.98) on click
- Navigation happens immediately
- New page loads after click
- No console errors

---

**Last Updated:** After fixing pointer-events issue
**Status:** ✅ All buttons should now be working

