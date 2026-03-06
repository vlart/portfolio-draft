# Profile Images

## Profile Image Setup

Place your profile image here as `profile.jpg` (or update the path in `app/page.tsx`).

### Recommended Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: 800x800px minimum (square aspect ratio)
- **File size**: Under 500KB for optimal performance
- **Quality**: High resolution, professional photo

### Supported Formats:
- `profile.jpg` (default)
- `profile.png`
- `profile.webp`

### How to Change the Profile Image:

#### Method 1: Replace the file
```bash
# Place your image in this folder
cp /path/to/your/photo.jpg public/images/profile.jpg
```

#### Method 2: Update the homepage
Edit `app/page.tsx` and change the `profileImage` prop:

```tsx
<HeroSection
  profileImage="/images/your-photo-name.jpg"
  // ... other props
/>
```

### Environment Variable (Optional):
You can also use an environment variable:

```env
# .env.local
NEXT_PUBLIC_PROFILE_IMAGE=/images/profile.jpg
```

Then in `app/page.tsx`:
```tsx
<HeroSection
  profileImage={process.env.NEXT_PUBLIC_PROFILE_IMAGE || '/images/profile.jpg'}
  // ... other props
/>
```

---

**Note**: If no image is found, Next.js will show an error. Add a placeholder image or use a fallback URL.
